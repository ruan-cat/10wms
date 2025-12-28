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
	goodsCode?: string;
	goodsName?: string;
	warehouseCode?: string;
	quantity?: number;
	availableQuantity?: number;
}

const tableColumns = ref<SimpleDataTableColumn<TableData>[]>([
	{ prop: "goodsCode", label: "商品代码", width: 150 },
	{ prop: "goodsName", label: "商品名称", width: 200 },
	{ prop: "warehouseCode", label: "仓库代码", width: 150 },
	{ prop: "quantity", label: "库存数量", width: 120 },
	{ prop: "availableQuantity", label: "可用数量", width: 120 },
]);

const tableData = ref<TableData[]>([]);
const selectedRows = ref<TableData[]>([]);
const loading = ref(false);
const currentPageData = ref({ pageIndex: 1, pageSize: 10, pages: 0, total: 0 });

async function loadData() {
	loading.value = true;
	try {
		const response = await http.request<any>({
			url: "/api/inventory/comprehensive/list",
			method: "post",
			data: { pageIndex: currentPageData.value.pageIndex, pageSize: currentPageData.value.pageSize },
		});
		if (response && response.rows) {
			tableData.value = response.rows;
			currentPageData.value.pages = response.pages || 0;
			currentPageData.value.total = response.total || 0;
		}
	} catch (error) {
		ElMessage.error("数据加载失败");
	} finally {
		loading.value = false;
	}
}

onMounted(() => loadData());

const emptyForm: TableData = { goodsCode: "", goodsName: "", warehouseCode: "", quantity: 0, availableQuantity: 0 };
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

function handleView() {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning("请选择一条记录进行查看");
		return;
	}
	form.value = cloneDeep(selectedRows.value[0]);
	isViewMode.value = true;
	dialogVisible.value = true;
}

function handleDialogClose() {
	dialogVisible.value = false;
	resetForm();
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
	<div class="comprehensive-inventory-page">
		<div class="button-group">
			<ElButton type="success" @click="handleView"
				><el-icon><View /></el-icon>查看</ElButton
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
		/>

		<el-dialog v-model="dialogVisible" title="查看库存详情" width="600px" :before-close="handleDialogClose">
			<ElForm :model="form" label-position="right" label-width="150px">
				<h2>库存信息</h2>
				<ElFormItem prop="goodsCode" label="商品代码："><ElInput v-model="form.goodsCode" readonly /></ElFormItem>
				<ElFormItem prop="goodsName" label="商品名称："><ElInput v-model="form.goodsName" readonly /></ElFormItem>
				<ElFormItem prop="warehouseCode" label="仓库代码："
					><ElInput v-model="form.warehouseCode" readonly
				/></ElFormItem>
				<ElFormItem prop="quantity" label="库存数量："><ElInput v-model="form.quantity" readonly /></ElFormItem>
				<ElFormItem prop="availableQuantity" label="可用数量："
					><ElInput v-model="form.availableQuantity" readonly
				/></ElFormItem>
			</ElForm>
			<template #footer>
				<ElButton type="info" @click="handleDialogClose">关闭</ElButton>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.comprehensive-inventory-page {
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
