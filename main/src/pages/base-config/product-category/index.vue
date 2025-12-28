<script setup lang="ts">
import {
	ArrowRight,
	Document,
	Folder,
	FolderOpened,
	Goods,
	Plus,
	Edit,
	Delete,
	View,
	Upload,
	Download,
} from "@element-plus/icons-vue";
import { ref, computed } from "vue";
import {
	ElButton,
	ElMessage,
	ElMessageBox,
	ElTable,
	ElTableColumn,
	ElDialog,
	ElForm,
	ElFormItem,
	ElInput,
	ElInputNumber,
} from "element-plus";
import { http } from "@/utils/http";

/** 表格数据类型 */
interface CategoryRow {
	id: number;
	parentId: number;
	categoryCode: string;
	categoryName: string;
	categoryLevel: number;
	createTime: string;
	hasChildren?: boolean;
	expanded?: boolean;
	_level?: number;
}

/** 模拟数据 - 一级类目 */
const mockData = ref<CategoryRow[]>([
	{
		id: 1,
		parentId: 0,
		categoryCode: "30001",
		categoryName: "日用",
		categoryLevel: 1,
		createTime: "2024-03-13",
		hasChildren: true,
		expanded: false,
		_level: 0,
	},
	{
		id: 2,
		parentId: 0,
		categoryCode: "30002",
		categoryName: "电缆",
		categoryLevel: 1,
		createTime: "2024-10-02",
		hasChildren: true,
		expanded: false,
		_level: 0,
	},
	{
		id: 6,
		parentId: 0,
		categoryCode: "30003",
		categoryName: "家电",
		categoryLevel: 1,
		createTime: "2024-11-15",
		hasChildren: true,
		expanded: false,
		_level: 0,
	},
]);

/** 模拟后端接口数据 - 按类目ID获取子级类目 */
const categoryAPIData: Record<number, CategoryRow[]> = {
	1: [
		{
			id: 3,
			parentId: 1,
			categoryCode: "001",
			categoryName: "洗浴用品",
			categoryLevel: 2,
			createTime: "2024-12-22",
			hasChildren: true,
			expanded: false,
			_level: 1,
		},
		{
			id: 7,
			parentId: 1,
			categoryCode: "002",
			categoryName: "厨房用品",
			categoryLevel: 2,
			createTime: "2024-11-05",
			hasChildren: true,
			expanded: false,
			_level: 1,
		},
	],
	2: [
		{
			id: 8,
			parentId: 2,
			categoryCode: "2001",
			categoryName: "电源线",
			categoryLevel: 2,
			createTime: "2024-10-12",
			hasChildren: false,
			expanded: false,
			_level: 1,
		},
		{
			id: 9,
			parentId: 2,
			categoryCode: "2002",
			categoryName: "网线",
			categoryLevel: 2,
			createTime: "2024-10-15",
			hasChildren: false,
			expanded: false,
			_level: 1,
		},
	],
	3: [
		{
			id: 4,
			parentId: 3,
			categoryCode: "00101",
			categoryName: "沐浴露",
			categoryLevel: 3,
			createTime: "2024-12-23",
			hasChildren: false,
			expanded: false,
			_level: 2,
		},
		{
			id: 5,
			parentId: 3,
			categoryCode: "00102",
			categoryName: "洗发露",
			categoryLevel: 3,
			createTime: "2024-12-23",
			hasChildren: false,
			expanded: false,
			_level: 2,
		},
	],
	6: [
		{
			id: 10,
			parentId: 6,
			categoryCode: "3001",
			categoryName: "冰箱",
			categoryLevel: 2,
			createTime: "2024-11-20",
			hasChildren: false,
			expanded: false,
			_level: 1,
		},
	],
	7: [
		{
			id: 11,
			parentId: 7,
			categoryCode: "00201",
			categoryName: "锅具",
			categoryLevel: 3,
			createTime: "2024-11-10",
			hasChildren: true,
			expanded: false,
			_level: 2,
		},
	],
	11: [
		{
			id: 12,
			parentId: 11,
			categoryCode: "0020101",
			categoryName: "炒锅",
			categoryLevel: 4,
			createTime: "2024-11-11",
			hasChildren: false,
			expanded: false,
			_level: 3,
		},
		{
			id: 13,
			parentId: 11,
			categoryCode: "0020102",
			categoryName: "汤锅",
			categoryLevel: 4,
			createTime: "2024-11-12",
			hasChildren: false,
			expanded: false,
			_level: 3,
		},
	],
};

/** 选中的行 */
const selectedRows = ref<CategoryRow[]>([]);

/** 弹窗显示状态 */
const dialogVisible = ref(false);

/** 弹窗类型 */
const dialogType = ref<"add" | "edit" | "view">("add");

/** 表单数据 */
const formData = ref<Partial<CategoryRow>>({});

/** 处理行点击事件 */
function handleRowClick(row: CategoryRow) {
	if (row.hasChildren) {
		toggleExpand(row);
	}
}

/** 切换展开/折叠状态 */
function toggleExpand(row: CategoryRow) {
	if (!row.hasChildren) return;

	row.expanded = !row.expanded;

	if (row.expanded) {
		expandCategory(row);
	} else {
		collapseCategory(row);
	}

	mockData.value = [...mockData.value];
}

/** 展开类目 */
function expandCategory(row: CategoryRow) {
	const childrenData = categoryAPIData[row.id] || [];

	childrenData.forEach((child) => {
		child._level = (row._level || 0) + 1;
	});

	const index = mockData.value.findIndex((item) => item.id === row.id);
	if (index > -1) {
		mockData.value.splice(index + 1, 0, ...childrenData);
		mockData.value = [...mockData.value];
	}
}

/** 折叠类目 */
function collapseCategory(row: CategoryRow) {
	const startIndex = mockData.value.findIndex((item) => item.id === row.id);
	if (startIndex === -1) return;

	const toRemove: number[] = [];

	for (let i = startIndex + 1; i < mockData.value.length; i++) {
		const current = mockData.value[i];
		let isChild = false;
		let parent = current;

		while (parent.parentId !== 0) {
			if (parent.parentId === row.id) {
				isChild = true;
				break;
			}

			const parentItem = mockData.value.find((item) => item.id === parent.parentId);
			if (!parentItem) break;
			parent = parentItem;
		}

		if (isChild) {
			toRemove.push(i);
		} else if (current.parentId === 0 || current.parentId < row.id) {
			break;
		}
	}

	for (let i = toRemove.length - 1; i >= 0; i--) {
		mockData.value.splice(toRemove[i], 1);
	}
}

/** 新增 */
function handleAdd() {
	dialogType.value = "add";
	formData.value = {};
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit() {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning("请选择一条记录进行编辑");
		return;
	}
	dialogType.value = "edit";
	formData.value = { ...selectedRows.value[0] };
	dialogVisible.value = true;
}

/** 查看 */
function handleView() {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning("请选择一条记录进行查看");
		return;
	}
	dialogType.value = "view";
	formData.value = { ...selectedRows.value[0] };
	dialogVisible.value = true;
}

/** 批量删除 */
function handleBatchDelete() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning("请至少选择一条记录进行删除");
		return;
	}

	ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(() => {
			ElMessage.success("批量删除成功");
		})
		.catch(() => {
			// 取消删除
		});
}

/** 选择变化 */
function handleSelectionChange(rows: CategoryRow[]) {
	selectedRows.value = rows;
}

/** 提交表单 */
function submitForm() {
	if (dialogType.value === "add") {
		ElMessage.success("新增成功");
	} else if (dialogType.value === "edit") {
		ElMessage.success("编辑成功");
	}
	dialogVisible.value = false;
}
</script>

<template>
	<div class="product-category-page">
		<div class="header">
			<h2>商品类目配置</h2>
		</div>

		<!-- 操作按钮 -->
		<div class="button-group">
			<ElButton type="primary" @click="handleAdd">
				<el-icon><Plus /></el-icon>
				录入
			</ElButton>
			<ElButton type="primary" @click="handleEdit">
				<el-icon><Edit /></el-icon>
				编辑
			</ElButton>
			<ElButton type="danger" @click="handleBatchDelete">
				<el-icon><Delete /></el-icon>
				批量删除
			</ElButton>
			<ElButton type="success" @click="handleView">
				<el-icon><View /></el-icon>
				查看
			</ElButton>
			<ElButton>
				<el-icon><Upload /></el-icon>
				Excel模板导入
			</ElButton>
			<ElButton>
				<el-icon><Download /></el-icon>
				Excel导出
			</ElButton>
		</div>

		<!-- 表格 -->
		<ElTable
			:data="mockData"
			:row-key="(row: CategoryRow) => row.id"
			border
			stripe
			style="width: 100%"
			@selection-change="handleSelectionChange"
			@row-click="handleRowClick"
		>
			<el-table-column type="selection" width="55" />
			<el-table-column type="index" label="序号" width="60" />
			<el-table-column prop="createTime" label="创建日期" width="120" />
			<el-table-column prop="categoryCode" label="类目编码" width="120" />
			<el-table-column prop="categoryName" label="类目名称" width="200">
				<template #default="{ row }">
					<div class="category-name-cell" :style="{ paddingLeft: `${(row._level || 0) * 20}px` }">
						<el-icon v-if="row.hasChildren" @click.stop="toggleExpand(row)">
							<ArrowRight class="expand-icon" :class="{ 'is-expanded': row.expanded }" />
						</el-icon>
						<el-icon v-else class="category-icon-placeholder"></el-icon>
						<el-icon class="category-icon">
							<FolderOpened v-if="row.hasChildren && row.expanded" />
							<Folder v-else-if="row.hasChildren" />
							<Document v-else />
						</el-icon>
						<span class="category-name">{{ row.categoryName }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="categoryLevel" label="类目级别" width="100" />
		</ElTable>

		<!-- 弹窗 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogType === 'view' ? '查看' : dialogType === 'edit' ? '编辑' : '新增'"
			width="600px"
		>
			<ElForm :model="formData" label-width="120px" :disabled="dialogType === 'view'">
				<ElFormItem label="类目编码" prop="categoryCode">
					<ElInput v-model="formData.categoryCode" placeholder="请输入类目编码" />
				</ElFormItem>
				<ElFormItem label="类目名称" prop="categoryName">
					<ElInput v-model="formData.categoryName" placeholder="请输入类目名称" />
				</ElFormItem>
				<ElFormItem label="类目级别" prop="categoryLevel">
					<ElInputNumber v-model="formData.categoryLevel" placeholder="请输入类目级别" style="width: 100%" />
				</ElFormItem>
			</ElForm>

			<template #footer>
				<span class="dialog-footer">
					<ElButton @click="dialogVisible = false">取消</ElButton>
					<ElButton v-if="dialogType !== 'view'" type="primary" @click="submitForm">确定</ElButton>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped lang="scss">
.product-category-page {
	padding: 20px;
}

.header {
	margin-bottom: 20px;

	h2 {
		font-size: 20px;
		font-weight: 600;
		color: #303133;
		margin: 0;
	}
}

.button-group {
	margin-bottom: 20px;
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.category-name-cell {
	display: flex;
	align-items: center;
	cursor: pointer;

	.expand-icon {
		transition: transform 0.3s;
		margin-right: 4px;

		&.is-expanded {
			transform: rotate(90deg);
		}
	}

	.category-icon-placeholder {
		width: 16px;
		margin-right: 4px;
		visibility: hidden;
	}

	.category-icon {
		margin-right: 8px;
		font-size: 16px;
		color: #409eff;
	}

	.category-name {
		font-size: 14px;
	}
}
</style>
