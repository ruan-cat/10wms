<script setup lang="ts">
import { ref } from "vue";

defineOptions({
	name: "ReportExpiryWarning",
});

/** 页面标题 */
const pageTitle = ref("有效期预警");

/** 搜索表单 */
const searchForm = ref({
	customerName: "",
	goodsName: "",
	warningDays: 30,
});

/** 表格数据 */
const tableData = ref([]);

/** 表格加载状态 */
const loading = ref(false);

/** 分页配置 */
const pagination = ref({
	currentPage: 1,
	pageSize: 10,
	total: 0,
});

/** 预警级别标签类型 */
function getWarningType(days: number) {
	if (days <= 7) return "danger";
	if (days <= 15) return "warning";
	return "info";
}

/** 搜索 */
function handleSearch() {
	pagination.value.currentPage = 1;
	loadData();
}

/** 重置 */
function handleReset() {
	searchForm.value = {
		customerName: "",
		goodsName: "",
		warningDays: 30,
	};
	handleSearch();
}

/** 加载数据 */
async function loadData() {
	loading.value = true;
	try {
		// TODO: 调用 API 获取数据
		// const res = await getExpiryWarningList({
		//   ...searchForm.value,
		//   pageIndex: pagination.value.currentPage,
		//   pageSize: pagination.value.pageSize
		// });
		// tableData.value = res.data.records;
		// pagination.value.total = res.data.total;
	} finally {
		loading.value = false;
	}
}

/** 导出 */
function handleExport() {
	// TODO: 实现导出功能
	ElMessage.info("导出功能开发中");
}

/** 页码改变 */
function handlePageChange(page: number) {
	pagination.value.currentPage = page;
	loadData();
}

/** 页大小改变 */
function handleSizeChange(size: number) {
	pagination.value.pageSize = size;
	pagination.value.currentPage = 1;
	loadData();
}

// 初始化加载数据
// loadData();
</script>

<template>
	<div class="expiry-warning-container">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<el-form :model="searchForm" inline>
				<el-form-item label="客户名称">
					<el-input v-model="searchForm.customerName" placeholder="请输入客户名称" clearable style="width: 200px" />
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="searchForm.goodsName" placeholder="请输入商品名称" clearable style="width: 200px" />
				</el-form-item>
				<el-form-item label="预警天数">
					<el-input-number v-model="searchForm.warningDays" :min="1" :max="365" style="width: 150px" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">
						<template #icon>
							<IconifyIconOffline icon="ep:search" />
						</template>
						查询
					</el-button>
					<el-button @click="handleReset">
						<template #icon>
							<IconifyIconOffline icon="ep:refresh" />
						</template>
						重置
					</el-button>
					<el-button type="success" @click="handleExport">
						<template #icon>
							<IconifyIconOffline icon="ep:download" />
						</template>
						导出
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 表格区域 -->
		<el-card shadow="never" class="table-card">
			<template #header>
				<div class="card-header">
					<span class="card-title">{{ pageTitle }}</span>
					<el-alert title="提示：显示有效期在指定天数内即将到期的商品" type="info" :closable="false" show-icon />
				</div>
			</template>

			<el-table :data="tableData" :loading="loading" border stripe style="width: 100%">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="customerName" label="客户名称" min-width="150" />
				<el-table-column prop="goodsName" label="商品名称" min-width="150" />
				<el-table-column prop="goodsCode" label="商品编码" min-width="120" />
				<el-table-column prop="specification" label="规格" min-width="100" />
				<el-table-column prop="unit" label="单位" width="80" align="center" />
				<el-table-column prop="quantity" label="库存数量" width="100" align="right" />
				<el-table-column prop="batchNo" label="批次号" min-width="120" />
				<el-table-column prop="productionDate" label="生产日期" width="110" align="center" />
				<el-table-column prop="expiryDate" label="有效期至" width="110" align="center" />
				<el-table-column label="剩余天数" width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="getWarningType(row.remainingDays)"> {{ row.remainingDays }} 天 </el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="warehouseName" label="仓库名称" min-width="120" />
				<el-table-column prop="locationName" label="库位" min-width="100" />
			</el-table>

			<!-- 分页 -->
			<el-pagination
				v-model:current-page="pagination.currentPage"
				v-model:page-size="pagination.pageSize"
				:total="pagination.total"
				:page-sizes="[10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				background
				class="pagination"
				@size-change="handleSizeChange"
				@current-change="handlePageChange"
			/>
		</el-card>
	</div>
</template>

<style lang="scss" scoped>
.expiry-warning-container {
	padding: 16px;

	.search-card {
		margin-bottom: 16px;
	}

	.table-card {
		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.card-title {
				font-size: 16px;
				font-weight: 500;
			}
		}

		.pagination {
			margin-top: 16px;
			justify-content: flex-end;
		}
	}
}
</style>
