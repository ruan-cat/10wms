<script lang="ts" setup>
import { ref } from "vue";
import { Delete } from "@element-plus/icons-vue";
import SimpleDataTable from "@/components/Table/index.vue";
import type { SimpleDataTableColumn } from "@/components/Table/types";

definePage({
	meta: {
		menuType: "page",
		title: "计费方式",
		icon: "ep:setting",
	},
});

/** 表格数据类型 */
interface BillingModeRow {
	code: string;
	name: string;
}

/** 表格数据 */
const tableData = ref<BillingModeRow[]>([
	{
		code: "001",
		name: "按重量计费",
	},
	{
		code: "002",
		name: "按体积计费",
	},
]);

/** 表格列配置 */
const tableColumns = ref<SimpleDataTableColumn<BillingModeRow>[]>([
	{ prop: "code", label: "计费方式代码" },
	{ prop: "name", label: "计费方式名称" },
	{ prop: "operation", label: "操作", width: 150 },
]);

/** 分页配置 */
const pagination = ref({
	total: 2,
	currentPage: 1,
	pageSize: 10,
});

/** 处理删除 */
function handleDelete(row: BillingModeRow) {
	console.log("删除", row);
}

/** 处理分页变化 */
function handlePageChange(page: { currentPage: number; pageSize: number }) {
	pagination.value.currentPage = page.currentPage;
	pagination.value.pageSize = page.pageSize;
	console.log("分页变化", page);
}
</script>

<template>
	<div class="billing-mode-container">
		<el-card shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-bold">计费模式</span>
				</div>
			</template>

			<!-- 搜索区域 -->
			<el-form :inline="true" class="search-form">
				<el-form-item label="计费方式代码">
					<el-input placeholder="请输入计费方式代码" clearable />
				</el-form-item>
				<el-form-item label="计费方式名称">
					<el-input placeholder="请输入计费方式名称" clearable />
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
					<el-button>重置</el-button>
				</el-form-item>
			</el-form>

			<!-- 操作按钮 -->
			<div class="toolbar">
				<el-button type="primary">录入</el-button>
				<el-button>编辑</el-button>
				<el-button type="danger">批量删除</el-button>
				<el-button>批量核算</el-button>
				<el-button>Excel数据导入</el-button>
				<el-button>Excel数据导出</el-button>
			</div>

			<!-- 表格 -->
			<SimpleDataTable
				:data="tableData"
				:columns="tableColumns"
				:pagination="pagination"
				is-index
				is-multiple-select
				@page-change="handlePageChange"
			>
				<template #bodyCell="{ row, prop }">
					<div v-if="prop === 'operation'" class="operation-buttons">
						<el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
					</div>
				</template>
			</SimpleDataTable>
		</el-card>
	</div>
</template>

<style lang="scss" scoped>
.billing-mode-container {
	padding: 16px;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.search-form {
		margin-bottom: 16px;
	}

	.toolbar {
		margin-bottom: 16px;
	}

	.operation-buttons {
		display: flex;
		gap: 8px;
	}
}
</style>
