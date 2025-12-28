<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	getPickingList,
	deletePicking,
	startPicking,
	completePicking,
	printPicking,
	type PickingInfo,
	type PickingQueryParams,
} from "@/api/outbound/picking";

defineOptions({
	name: "OutboundPicking",
});

const loading = ref(false);
const tableData = ref<PickingInfo[]>([]);
const total = ref(0);

const queryParams = reactive<PickingQueryParams>({
	page: 1,
	size: 10,
	pickingNo: "",
	customerName: "",
	status: undefined,
});

const statusOptions = [
	{ label: "待拣货", value: 0 },
	{ label: "拣货中", value: 1 },
	{ label: "已完成", value: 2 },
];

const getStatusType = (status: number) => {
	const typeMap: Record<number, "info" | "warning" | "success"> = { 0: "info", 1: "warning", 2: "success" };
	return typeMap[status] || "info";
};

const getStatusText = (status: number) => {
	const textMap: Record<number, string> = { 0: "待拣货", 1: "拣货中", 2: "已完成" };
	return textMap[status] || "未知";
};

const loadData = async () => {
	loading.value = true;
	try {
		const result = await getPickingList(queryParams);
		tableData.value = result.list;
		total.value = result.total;
	} catch (error) {
		ElMessage.error("加载数据失败");
	} finally {
		loading.value = false;
	}
};

const handleSearch = () => {
	queryParams.page = 1;
	loadData();
};

const handleReset = () => {
	Object.assign(queryParams, { page: 1, size: 10, pickingNo: "", customerName: "", status: undefined });
	loadData();
};

const handleAdd = () => {
	ElMessage.info("新增功能开发中");
};

const handleDelete = (row: PickingInfo) => {
	ElMessageBox.confirm(`确定要删除拣货单"${row.pickingNo}"吗？`, "提示", { type: "warning" })
		.then(async () => {
			await deletePicking(row.id);
			ElMessage.success("删除成功");
			loadData();
		})
		.catch(() => {});
};

const handleStart = async (row: PickingInfo) => {
	try {
		await startPicking(row.id);
		ElMessage.success("开始拣货成功");
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
};

const handleComplete = async (row: PickingInfo) => {
	try {
		await completePicking(row.id);
		ElMessage.success("完成拣货成功");
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
};

const handlePrint = async (row: PickingInfo) => {
	try {
		const blob = await printPicking(row.id);
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `拣货单_${row.pickingNo}.pdf`;
		link.click();
		window.URL.revokeObjectURL(url);
		ElMessage.success("打印成功");
	} catch (error) {
		ElMessage.error("打印失败");
	}
};

onMounted(() => {
	loadData();
});
</script>

<template>
	<div class="picking-container">
		<el-card shadow="never" class="search-card">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="拣货单号">
					<el-input v-model="queryParams.pickingNo" placeholder="请输入拣货单号" clearable />
				</el-form-item>
				<el-form-item label="客户名称">
					<el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card shadow="never" class="table-card">
			<div class="toolbar">
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</div>

			<el-table :data="tableData" :loading="loading" border stripe>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="pickingNo" label="拣货单号" min-width="150" />
				<el-table-column prop="outboundNo" label="出库单号" min-width="150" />
				<el-table-column prop="customerName" label="客户名称" min-width="150" />
				<el-table-column prop="pickingDate" label="拣货日期" min-width="120" />
				<el-table-column prop="picker" label="拣货人" min-width="100" />
				<el-table-column prop="totalQuantity" label="总数量" min-width="100" align="center" />
				<el-table-column prop="status" label="状态" min-width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="160" />
				<el-table-column label="操作" width="280" fixed="right" align="center">
					<template #default="{ row }">
						<el-button v-if="row.status === 0" link type="primary" @click="handleStart(row)">开始拣货</el-button>
						<el-button v-if="row.status === 1" link type="success" @click="handleComplete(row)">完成拣货</el-button>
						<el-button link type="primary" @click="handlePrint(row)">打印</el-button>
						<el-button v-if="row.status === 0" link type="danger" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				v-model:current-page="queryParams.page"
				v-model:page-size="queryParams.size"
				:total="total"
				:page-sizes="[10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				@current-change="loadData"
				@size-change="loadData"
			/>
		</el-card>
	</div>
</template>

<style scoped lang="scss">
.picking-container {
	padding: 16px;

	.search-card {
		margin-bottom: 16px;
	}

	.toolbar {
		margin-bottom: 16px;
	}

	.el-pagination {
		margin-top: 16px;
		justify-content: flex-end;
	}
}
</style>
