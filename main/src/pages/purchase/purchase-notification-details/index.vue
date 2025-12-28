<template>
	<div class="purchase-notification-details-container">
		<ElCard shadow="never">
			<!-- 搜索表单 -->
			<ElForm :inline="true" :model="searchForm" class="search-form">
				<ElFormItem label="通知单号">
					<ElInput v-model="searchForm.noticeNumber" placeholder="请输入通知单号" clearable />
				</ElFormItem>
				<ElFormItem label="客户编码">
					<ElInput v-model="searchForm.customerCode" placeholder="请输入客户编码" clearable />
				</ElFormItem>
				<ElFormItem label="商品编码">
					<ElInput v-model="searchForm.productCode" placeholder="请输入商品编码" clearable />
				</ElFormItem>
				<ElFormItem>
					<ElButton type="primary" :icon="Search" @click="handleSearch"> 查询 </ElButton>
					<ElButton :icon="Refresh" @click="handleReset">重置</ElButton>
				</ElFormItem>
			</ElForm>

			<!-- 操作按钮 -->
			<div class="mb-4">
				<ElButton type="success" :icon="Download">导出Excel</ElButton>
			</div>

			<!-- 数据表格 -->
			<SimpleDataTable
				:data="tableData"
				:columns="tableColumns"
				:loading="loading"
				:pagination="{
					total: pagination.total,
					currentPage: pagination.currentPage,
					pageSize: pagination.pageSize,
				}"
				@page-change="handlePageChange"
			/>
		</ElCard>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Search, Refresh, Download } from "@element-plus/icons-vue";
import { http } from "@/utils/http";
import SimpleDataTable from "@/components/SimpleDataTable/index.vue";

/** 搜索表单 */
const searchForm = reactive({
	noticeNumber: "",
	customerCode: "",
	productCode: "",
});

/** 表格数据 */
const tableData = ref([]);
const loading = ref(false);

/** 分页信息 */
const pagination = reactive({
	total: 0,
	currentPage: 1,
	pageSize: 10,
});

/** 表格列配置 */
const tableColumns = [
	{ type: "index", label: "序号", width: 60 },
	{ prop: "noticeNumber", label: "通知单号", width: 150 },
	{ prop: "customerCode", label: "客户编码", width: 120 },
	{ prop: "customerName", label: "客户名称", width: 150 },
	{ prop: "noticeStatus", label: "通知单状态", width: 120 },
	{ prop: "productCode", label: "商品编码", width: 120 },
	{ prop: "productName", label: "商品名称", minWidth: 150 },
	{ prop: "noticeQuantity", label: "通知单数量", width: 120 },
	{ prop: "acceptanceQuantity", label: "验收数量", width: 120 },
	{ prop: "unit", label: "单位", width: 80 },
	{ prop: "volumeCm3", label: "体积CM3", width: 100 },
	{ prop: "weightKg", label: "重量KG", width: 100 },
	{ prop: "customerOrderNumber", label: "客户订单号", width: 150 },
	{ prop: "baseUnitQuantity", label: "基本单位数量", width: 130 },
	{ prop: "baseUnit", label: "基本单位", width: 100 },
	{ prop: "productionDate", label: "生产日期", width: 120 },
];

/** 加载表格数据 */
const loadTableData = async () => {
	loading.value = true;
	try {
		const response = await http.request({
			url: "/api/purchase/purchase-notification-details/list",
			method: "post",
			data: {
				...searchForm,
				pageNum: pagination.currentPage,
				pageSize: pagination.pageSize,
			},
		});

		if (response.data) {
			tableData.value = response.data.records || [];
			pagination.total = response.data.total || 0;
		}
	} catch (error) {
		console.error("加载数据失败:", error);
		ElMessage.error("加载数据失败");
	} finally {
		loading.value = false;
	}
};

/** 搜索 */
const handleSearch = () => {
	pagination.currentPage = 1;
	loadTableData();
};

/** 重置 */
const handleReset = () => {
	Object.assign(searchForm, {
		noticeNumber: "",
		customerCode: "",
		productCode: "",
	});
	handleSearch();
};

/** 分页变化 */
const handlePageChange = ({ page, limit }: { page: number; limit: number }) => {
	pagination.currentPage = page;
	pagination.pageSize = limit;
	loadTableData();
};

onMounted(() => {
	loadTableData();
});
</script>

<style lang="scss" scoped>
.purchase-notification-details-container {
	padding: 16px;

	.search-form {
		margin-bottom: 16px;
	}
}
</style>
