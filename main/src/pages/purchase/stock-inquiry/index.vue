<script lang="ts" setup>
import SimpleDataTable from "@/components/Table/index.vue";
import type { SimpleDataTableColumn } from "@/components/Table/types";
import { ElButton, ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { Download, View } from "@element-plus/icons-vue";
import { http } from "@/utils/http";

interface TableData {
	id?: string;
	goodsCode?: string;
	goodsName?: string;
	warehouseCode?: string;
	quantity?: number;
	updateTime?: string;
}

const tableColumns = ref<SimpleDataTableColumn<TableData>[]>([
	{ prop: "goodsCode", label: "商品代码", width: 150 },
	{ prop: "goodsName", label: "商品名称", width: 200 },
	{ prop: "warehouseCode", label: "仓库代码", width: 150 },
	{ prop: "quantity", label: "库存数量", width: 120 },
	{ prop: "updateTime", label: "更新时间", width: 180 },
]);

const tableData = ref<TableData[]>([]);
const selectedRows = ref<TableData[]>([]);
const loading = ref(false);
const currentPageData = ref({ pageIndex: 1, pageSize: 10, pages: 0, total: 0 });

async function loadData() {
	loading.value = true;
	try {
		const response = await http.request<any>({
			url: "/api/purchase/stock-inquiry/list",
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
	<div class="stock-inquiry-page">
		<div class="button-group">
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
	</div>
</template>

<style lang="scss" scoped>
.stock-inquiry-page {
	padding: 20px;
}
.button-group {
	margin-bottom: 20px;
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}
</style>
