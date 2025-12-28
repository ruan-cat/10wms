<script lang="ts" setup>
import SimpleDataTable from "@/components/Table/index.vue";
import type { SimpleDataTableColumn } from "@/components/Table/types";
import { ElButton, ElMessage, ElMessageBox, ElForm, ElFormItem, ElInput } from "element-plus";
import { onMounted, ref } from "vue";
import { cloneDeep, isEqual } from "lodash-es";
import { Delete, Download, Edit, Plus, Upload, View } from "@element-plus/icons-vue";
import { http } from "@/utils/http";

/** 表格数据类型 */
interface TableData {
	/** 品质代码唯一ID */
	id?: string;
	/** 品质代码 */
	codeValue?: string;
	/** 品质代码名称 */
	codeName?: string;
}

/** 表格列配置 */
const tableColumns = ref<SimpleDataTableColumn<TableData>[]>([
	{ prop: "codeValue", label: "品质代码", width: 200 },
	{ prop: "codeName", label: "品质代码名称", width: 200 },
]);

/** 表格数据 */
const tableData = ref<TableData[]>([]);

/** 选中的行 */
const selectedRows = ref<TableData[]>([]);

/** 加载状态 */
const loading = ref(false);

/** 分页参数 */
const currentPageData = ref({
	pageIndex: 1,
	pageSize: 10,
	pages: 0,
	total: 0,
});

/** 加载数据 */
async function loadData() {
	loading.value = true;
	try {
		const response = await http.request<any>({
			url: "/api/quality-code/list",
			method: "post",
			data: {
				pageIndex: currentPageData.value.pageIndex,
				pageSize: currentPageData.value.pageSize,
			},
		});

		if (response && response.rows) {
			tableData.value = response.rows;
			currentPageData.value.pages = response.pages || 0;
			currentPageData.value.total = response.total || 0;
		}
	} catch (error) {
		console.error("加载数据失败", error);
		ElMessage.error("品质代码数据加载失败");
	} finally {
		loading.value = false;
	}
}

/** 初始化加载数据 */
onMounted(() => {
	loadData();
});

/** 空表单 */
const emptyForm: TableData = {
	codeValue: "",
	codeName: "",
};

/** 弹窗类型 0 新增 1 编辑 2 查看 */
const dialogType = ref<number>(0);

/** 表单对象 */
const form = ref<TableData>(cloneDeep(emptyForm));

/** 弹窗显示状态 */
const dialogVisible = ref(false);

/** 是否查看模式 */
const isViewMode = ref(false);

/** 重设表单 */
function resetForm() {
	form.value = cloneDeep(emptyForm);
}

/** 表单是否有修改 */
function hasChange() {
	return !isEqual(form.value, emptyForm);
}

/** 新增 */
function handleAdd() {
	resetForm();
	isViewMode.value = false;
	dialogType.value = 0;
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit() {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning("请选择一条记录进行编辑");
		return;
	}
	form.value = cloneDeep(selectedRows.value[0]);
	isViewMode.value = false;
	dialogType.value = 1;
	dialogVisible.value = true;
}

/** 查看 */
function handleView() {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning("请选择一条记录进行查看");
		return;
	}
	form.value = cloneDeep(selectedRows.value[0]);
	isViewMode.value = true;
	dialogType.value = 2;
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
		.then(async () => {
			try {
				await http.request({
					url: "/api/quality-code/delete",
					method: "post",
					data: { ids: selectedRows.value.map((row) => row.id) },
				});
				ElMessage.success("批量删除成功");
				loadData();
			} catch (error) {
				console.error("批量删除失败", error);
				ElMessage.error("批量删除失败");
			}
		})
		.catch(() => {
			// 取消删除
		});
}

/** 单行删除 */
function handleDelete(row: TableData) {
	ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			try {
				await http.request({
					url: "/api/quality-code/delete",
					method: "post",
					data: { ids: [row.id] },
				});
				ElMessage.success("删除成功");
				loadData();
			} catch (error) {
				console.error("删除失败", error);
				ElMessage.error("删除失败");
			}
		})
		.catch(() => {
			// 取消删除
		});
}

/** 提交表单 */
async function submitForm() {
	if (isViewMode.value) {
		dialogVisible.value = false;
		return;
	}

	try {
		if (dialogType.value === 0) {
			// 新增
			await http.request({
				url: "/api/quality-code/add",
				method: "post",
				data: form.value,
			});
			ElMessage.success("新增成功");
		} else if (dialogType.value === 1) {
			// 编辑
			await http.request({
				url: "/api/quality-code/update",
				method: "post",
				data: form.value,
			});
			ElMessage.success("编辑成功");
		}

		dialogVisible.value = false;
		loadData();
	} catch (error) {
		console.error("操作失败", error);
		ElMessage.error("操作失败");
	}
}

/** 关闭弹窗 */
function handleDialogClose() {
	if (isViewMode.value) {
		dialogVisible.value = false;
		resetForm();
		return;
	}

	if (hasChange()) {
		ElMessageBox.confirm("确定要关闭弹框么？你填写的内容尚未保存。", "关闭弹框", {
			confirmButtonText: "关闭",
			cancelButtonText: "取消",
			type: "warning",
		})
			.then(() => {
				dialogVisible.value = false;
				resetForm();
			})
			.catch(() => {
				// 取消关闭
			});
	} else {
		dialogVisible.value = false;
		resetForm();
	}
}

/** 分页变化 */
function handlePageChange(page: { currentPage: number; pageSize: number }) {
	currentPageData.value.pageIndex = page.currentPage;
	currentPageData.value.pageSize = page.pageSize;
	loadData();
}

/** 选择变化 */
function handleSelectionChange(rows: TableData[]) {
	selectedRows.value = rows;
}
</script>

<template>
	<div class="quality-code-page">
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
		<SimpleDataTable
			:data="tableData"
			:columns="tableColumns"
			:loading="loading"
			:is-index="true"
			:is-multiple-select="true"
			:pagination="{
				total: currentPageData.total,
				currentPage: currentPageData.pageIndex,
				pageSize: currentPageData.pageSize,
				pageSizes: [10, 20, 50, 100],
				show: true,
			}"
			@selection-change="handleSelectionChange"
			@page-change="handlePageChange"
		>
			<template #operation="{ row }">
				<ElButton type="danger" size="small" @click="handleDelete(row)">删除</ElButton>
			</template>
		</SimpleDataTable>

		<!-- 弹窗 -->
		<el-dialog
			v-model="dialogVisible"
			:title="isViewMode ? '查看品质代码' : dialogType === 0 ? '新增品质代码' : '编辑品质代码'"
			width="600px"
			:before-close="handleDialogClose"
		>
			<ElForm :model="form" label-position="right" label-width="150px">
				<h2>表单信息管理</h2>
				<ElFormItem prop="codeValue" label="品质代码：">
					<ElInput v-model="form.codeValue" :readonly="isViewMode" />
				</ElFormItem>
				<ElFormItem prop="codeName" label="品质代码名称：">
					<ElInput v-model="form.codeName" :readonly="isViewMode" />
				</ElFormItem>
			</ElForm>

			<template #footer>
				<ElButton type="info" @click="handleDialogClose">关闭</ElButton>
				<ElButton v-if="!isViewMode" type="primary" @click="submitForm">确认</ElButton>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.quality-code-page {
	padding: 20px;
}

.button-group {
	margin-bottom: 20px;
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

h2 {
	color: brown;
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 10px;
}

.el-input {
	width: 100%;
}
</style>
