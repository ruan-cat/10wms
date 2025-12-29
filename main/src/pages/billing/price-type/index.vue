<script lang="ts" setup>
import SimpleDataTable from "@/components/Table/index.vue";
import type { SimpleDataTableColumn } from "@/components/Table/types";
import { ElButton, ElMessage, ElMessageBox, ElForm, ElFormItem, ElInput } from "element-plus";
import { onMounted, ref } from "vue";
import { cloneDeep, isEqual } from "lodash-es";
import { Delete, Download, Edit, Plus, Upload, View } from "@element-plus/icons-vue";
import { http } from "@/utils/http";

interface TableData {
	id?: string;
	code?: string;
	name?: string;
}

const tableColumns = ref<SimpleDataTableColumn<TableData>[]>([
	{ prop: "code", label: "代码", width: 200 },
	{ prop: "name", label: "名称", width: 200 },
]);

const tableData = ref<TableData[]>([]);
const selectedRows = ref<TableData[]>([]);
const loading = ref(false);
const currentPageData = ref({ pageIndex: 1, pageSize: 10, pages: 0, total: 0 });

async function loadData() {
	loading.value = true;
	try {
		const response = await http.requestCompat<any>({
			url: "/api/price-type/list",
			method: "post",
			data: { pageIndex: currentPageData.value.pageIndex, pageSize: currentPageData.value.pageSize },
		});
		if (response && response.rows) {
			tableData.value = response.rows;
			currentPageData.value.pages = response.pages || 0;
			currentPageData.value.total = response.total || 0;
		}
	} catch (error) {
		ElMessage.error("价格类型数据加载失败");
	} finally {
		loading.value = false;
	}
}

onMounted(() => loadData());

const emptyForm: TableData = { code: "", name: "" };
const dialogType = ref<number>(0);
const form = ref<TableData>(cloneDeep(emptyForm));
const dialogVisible = ref(false);
const isViewMode = ref(false);

function resetForm() {
	form.value = cloneDeep(emptyForm);
}
function hasChange() {
	return !isEqual(form.value, emptyForm);
}
function handleAdd() {
	resetForm();
	isViewMode.value = false;
	dialogType.value = 0;
	dialogVisible.value = true;
}
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
				await http.requestCompat({
					url: "/api/price-type/delete",
					method: "post",
					data: { ids: selectedRows.value.map((row) => row.id) },
				});
				ElMessage.success("批量删除成功");
				loadData();
			} catch (error) {
				ElMessage.error("批量删除失败");
			}
		})
		.catch(() => {});
}

function handleDelete(row: TableData) {
	ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			try {
				await http.requestCompat({ url: "/api/price-type/delete", method: "post", data: { ids: [row.id] } });
				ElMessage.success("删除成功");
				loadData();
			} catch (error) {
				ElMessage.error("删除失败");
			}
		})
		.catch(() => {});
}

async function submitForm() {
	if (isViewMode.value) {
		dialogVisible.value = false;
		return;
	}
	try {
		if (dialogType.value === 0) {
			await http.requestCompat({ url: "/api/price-type/add", method: "post", data: form.value });
			ElMessage.success("新增成功");
		} else if (dialogType.value === 1) {
			await http.requestCompat({ url: "/api/price-type/update", method: "post", data: form.value });
			ElMessage.success("编辑成功");
		}
		dialogVisible.value = false;
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
}

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
			.catch(() => {});
	} else {
		dialogVisible.value = false;
		resetForm();
	}
}

function handlePageChange(page: { currentPage: number; pageSize: number }) {
	currentPageData.value.pageIndex = page.currentPage;
	currentPageData.value.pageSize = page.pageSize;
	loadData();
}
function handleSelectionChange(rows: TableData[]) {
	selectedRows.value = rows;
}
</script>

<template>
	<div class="price-type-page">
		<div class="button-group">
			<ElButton type="primary" @click="handleAdd"
				><el-icon><Plus /></el-icon>录入</ElButton
			>
			<ElButton type="primary" @click="handleEdit"
				><el-icon><Edit /></el-icon>编辑</ElButton
			>
			<ElButton type="danger" @click="handleBatchDelete"
				><el-icon><Delete /></el-icon>批量删除</ElButton
			>
			<ElButton type="success" @click="handleView"
				><el-icon><View /></el-icon>查看</ElButton
			>
			<ElButton
				><el-icon><Upload /></el-icon>Excel模板导入</ElButton
			>
			<ElButton
				><el-icon><Download /></el-icon>Excel导出</ElButton
			>
		</div>
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
		<el-dialog
			v-model="dialogVisible"
			:title="isViewMode ? '查看价格类型' : dialogType === 0 ? '新增价格类型' : '编辑价格类型'"
			width="600px"
			:before-close="handleDialogClose"
		>
			<ElForm :model="form" label-position="right" label-width="150px">
				<h2>表单信息管理</h2>
				<ElFormItem prop="code" label="代码："><ElInput v-model="form.code" :readonly="isViewMode" /></ElFormItem>
				<ElFormItem prop="name" label="名称："><ElInput v-model="form.name" :readonly="isViewMode" /></ElFormItem>
			</ElForm>
			<template #footer>
				<ElButton type="info" @click="handleDialogClose">关闭</ElButton>
				<ElButton v-if="!isViewMode" type="primary" @click="submitForm">确认</ElButton>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.price-type-page {
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
