<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Table from "@/components/Table/index.vue";
import type { SimpleDataTableColumn, PaginationConfig } from "@/components/Table/types";

/** 定义页面标题 */
defineOptions({
	name: "TableTest",
});

/** 用户数据类型 */
interface User {
	id: number;
	name: string;
	age: number;
	email: string;
	status: "active" | "inactive" | "pending";
	createTime: string;
}

/** 表格数据 */
const tableData = ref<User[]>([
	{
		id: 1,
		name: "张三",
		age: 25,
		email: "zhangsan@example.com",
		status: "active",
		createTime: "2024-01-01 10:00:00",
	},
	{
		id: 2,
		name: "李四",
		age: 30,
		email: "lisi@example.com",
		status: "inactive",
		createTime: "2024-01-02 11:00:00",
	},
	{
		id: 3,
		name: "王五",
		age: 28,
		email: "wangwu@example.com",
		status: "pending",
		createTime: "2024-01-03 12:00:00",
	},
	{
		id: 4,
		name: "赵六",
		age: 35,
		email: "zhaoliu@example.com",
		status: "active",
		createTime: "2024-01-04 13:00:00",
	},
	{
		id: 5,
		name: "孙七",
		age: 27,
		email: "sunqi@example.com",
		status: "inactive",
		createTime: "2024-01-05 14:00:00",
	},
]);

/** 表格列配置 */
const columns: SimpleDataTableColumn<User>[] = [
	{
		prop: "id",
		label: "ID",
		width: 80,
		sortable: true,
	},
	{
		prop: "name",
		label: "姓名",
		minWidth: 120,
	},
	{
		prop: "age",
		label: "年龄",
		width: 100,
		sortable: true,
	},
	{
		prop: "email",
		label: "邮箱",
		minWidth: 200,
	},
	{
		prop: "status",
		label: "状态",
		width: 100,
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 180,
	},
	{
		prop: "operation",
		label: "操作",
		width: 200,
		fixed: "right",
	},
];

/** 分页配置 */
const pagination = reactive<PaginationConfig>({
	total: 50,
	currentPage: 1,
	pageSize: 10,
	pageSizes: [10, 20, 50, 100],
	show: true,
});

/** 加载状态 */
const loading = ref(false);

/** 是否显示索引列 */
const showIndex = ref(true);

/** 是否支持多选 */
const showSelection = ref(true);

/** 是否显示斑马纹 */
const stripe = ref(true);

/** 是否显示边框 */
const border = ref(true);

/** 选中的行 */
const selectedRows = ref<User[]>([]);

/** 表格引用 */
const tableRef = ref();

/** 状态标签类型映射 */
const statusTypeMap = {
	active: "success",
	inactive: "danger",
	pending: "warning",
};

/** 状态文本映射 */
const statusTextMap = {
	active: "激活",
	inactive: "停用",
	pending: "待审核",
};

/** 处理分页变化 */
function handlePageChange(page: { currentPage: number; pageSize: number }) {
	console.log("分页变化:", page);
	pagination.currentPage = page.currentPage;
	pagination.pageSize = page.pageSize;
	loadData();
}

/** 处理选择变化 */
function handleSelectionChange(rows: User[]) {
	console.log("选择变化:", rows);
	selectedRows.value = rows;
}

/** 处理排序变化 */
function handleSortChange(sort: { prop: string; order: string | null }) {
	console.log("排序变化:", sort);
	loadData();
}

/** 加载数据 */
function loadData() {
	loading.value = true;
	// 模拟异步加载
	setTimeout(() => {
		loading.value = false;
		ElMessage.success("数据加载成功");
	}, 500);
}

/** 查看详情 */
function handleView(row: User) {
	ElMessage.info(`查看用户: ${row.name}`);
}

/** 编辑 */
function handleEdit(row: User) {
	ElMessage.info(`编辑用户: ${row.name}`);
}

/** 删除 */
function handleDelete(row: User) {
	ElMessageBox.confirm(`确定要删除用户 ${row.name} 吗？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(() => {
			const index = tableData.value.findIndex((item) => item.id === row.id);
			if (index > -1) {
				tableData.value.splice(index, 1);
				ElMessage.success("删除成功");
			}
		})
		.catch(() => {
			ElMessage.info("已取消删除");
		});
}

/** 批量删除 */
function handleBatchDelete() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning("请先选择要删除的数据");
		return;
	}

	ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条数据吗？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(() => {
			const ids = selectedRows.value.map((item) => item.id);
			tableData.value = tableData.value.filter((item) => !ids.includes(item.id));
			ElMessage.success("批量删除成功");
			tableRef.value?.clearSelection();
		})
		.catch(() => {
			ElMessage.info("已取消删除");
		});
}

/** 刷新数据 */
function handleRefresh() {
	loadData();
}

/** 清空选择 */
function handleClearSelection() {
	tableRef.value?.clearSelection();
	ElMessage.success("已清空选择");
}
</script>

<template>
	<div class="table-test-page">
		<el-card class="mb-4">
			<template #header>
				<div class="card-header">
					<span class="text-lg font-bold">表格组件测试页面</span>
				</div>
			</template>

			<!-- 配置选项 -->
			<div class="config-section mb-4">
				<el-space wrap>
					<el-checkbox v-model="showIndex" label="显示索引列" />
					<el-checkbox v-model="showSelection" label="支持多选" />
					<el-checkbox v-model="stripe" label="斑马纹" />
					<el-checkbox v-model="border" label="边框" />
				</el-space>
			</div>

			<!-- 操作按钮 -->
			<div class="action-section mb-4">
				<el-space>
					<el-button type="primary" @click="handleRefresh">刷新数据</el-button>
					<el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
					<el-button @click="handleClearSelection">清空选择</el-button>
				</el-space>
			</div>

			<!-- 选中信息 -->
			<div v-if="selectedRows.length > 0" class="selection-info mb-4">
				<el-alert :title="`已选中 ${selectedRows.length} 条数据`" type="info" :closable="false" />
			</div>

			<!-- 表格 -->
			<Table
				ref="tableRef"
				:data="tableData"
				:columns="columns"
				:is-index="showIndex"
				:is-multiple-select="showSelection"
				:stripe="stripe"
				:border="border"
				:loading="loading"
				:pagination="pagination"
				@selection-change="handleSelectionChange"
				@page-change="handlePageChange"
				@sort-change="handleSortChange"
			>
				<!-- 状态列自定义渲染 -->
				<template #bodyCell="{ row, prop }">
					<template v-if="prop === 'status'">
						<el-tag :type="statusTypeMap[row.status] as any">
							{{ statusTextMap[row.status] }}
						</el-tag>
					</template>
				</template>

				<!-- 操作列 -->
				<template #operation="{ row }">
					<el-space>
						<el-button type="primary" size="small" link @click="handleView(row)">查看</el-button>
						<el-button type="warning" size="small" link @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
					</el-space>
				</template>
			</Table>
		</el-card>

		<!-- 功能说明 -->
		<el-card>
			<template #header>
				<span class="text-lg font-bold">功能说明</span>
			</template>

			<el-descriptions :column="1" border>
				<el-descriptions-item label="基础功能"> 支持数据展示、分页、排序、加载状态 </el-descriptions-item>
				<el-descriptions-item label="选择功能"> 支持单选、多选、全选、清空选择 </el-descriptions-item>
				<el-descriptions-item label="索引列"> 可选的索引列，显示行号 </el-descriptions-item>
				<el-descriptions-item label="自定义列"> 支持自定义单元格内容和操作列 </el-descriptions-item>
				<el-descriptions-item label="样式配置"> 支持斑马纹、边框、固定列等样式配置 </el-descriptions-item>
				<el-descriptions-item label="事件处理"> 支持分页变化、选择变化、排序变化等事件 </el-descriptions-item>
			</el-descriptions>
		</el-card>
	</div>
</template>

<style lang="scss" scoped>
.table-test-page {
	padding: 20px;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.config-section {
		padding: 16px;
		background-color: var(--el-fill-color-light);
		border-radius: 4px;
	}

	.action-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.selection-info {
		padding: 8px 0;
	}

	.mb-4 {
		margin-bottom: 16px;
	}
}
</style>
