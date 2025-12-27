<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	getAbnormalShipmentList,
	deleteAbnormalShipment,
	handleAbnormalShipment,
	completeAbnormalShipment,
	type AbnormalShipmentInfo,
	type AbnormalShipmentQueryParams,
} from "@/api/daily-check/abnormal";

defineOptions({
	name: "DailyCheckAbnormal",
});

const loading = ref(false);
const tableData = ref<AbnormalShipmentInfo[]>([]);
const total = ref(0);

const queryParams = reactive<AbnormalShipmentQueryParams>({
	page: 1,
	size: 10,
	abnormalNo: "",
	customerName: "",
	abnormalType: undefined,
	status: undefined,
});

const abnormalTypeOptions = [
	{ label: "数量异常", value: 1 },
	{ label: "质量异常", value: 2 },
	{ label: "包装异常", value: 3 },
	{ label: "其他", value: 4 },
];

const statusOptions = [
	{ label: "待处理", value: 0 },
	{ label: "处理中", value: 1 },
	{ label: "已处理", value: 2 },
];

const getStatusType = (status: number) => {
	const typeMap: Record<number, "info" | "warning" | "success"> = { 0: "info", 1: "warning", 2: "success" };
	return typeMap[status] || "info";
};

const getStatusText = (status: number) => {
	const textMap: Record<number, string> = { 0: "待处理", 1: "处理中", 2: "已处理" };
	return textMap[status] || "未知";
};

const getAbnormalTypeText = (type: number) => {
	const textMap: Record<number, string> = { 1: "数量异常", 2: "质量异常", 3: "包装异常", 4: "其他" };
	return textMap[type] || "未知";
};

const loadData = async () => {
	loading.value = true;
	try {
		const result = await getAbnormalShipmentList(queryParams);
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
	Object.assign(queryParams, {
		page: 1,
		size: 10,
		abnormalNo: "",
		customerName: "",
		abnormalType: undefined,
		status: undefined,
	});
	loadData();
};

const handleAdd = () => {
	ElMessage.info("新增功能开发中");
};

const handleDelete = (row: AbnormalShipmentInfo) => {
	ElMessageBox.confirm(`确定要删除异常单"${row.abnormalNo}"吗？`, "提示", { type: "warning" })
		.then(async () => {
			await deleteAbnormalShipment(row.id);
			ElMessage.success("删除成功");
			loadData();
		})
		.catch(() => {});
};

const handleProcess = (row: AbnormalShipmentInfo) => {
	ElMessageBox.prompt("请输入处理措施", "处理异常", { inputType: "textarea" })
		.then(async ({ value }) => {
			await handleAbnormalShipment(row.id, value);
			ElMessage.success("处理成功");
			loadData();
		})
		.catch(() => {});
};

const handleComplete = async (row: AbnormalShipmentInfo) => {
	try {
		await completeAbnormalShipment(row.id);
		ElMessage.success("完成处理");
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
};

onMounted(() => {
	loadData();
});
</script>

<template>
	<div class="abnormal-container">
		<el-card shadow="never" class="search-card">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="异常单号">
					<el-input v-model="queryParams.abnormalNo" placeholder="请输入异常单号" clearable />
				</el-form-item>
				<el-form-item label="客户名称">
					<el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable />
				</el-form-item>
				<el-form-item label="异常类型">
					<el-select v-model="queryParams.abnormalType" placeholder="请选择异常类型" clearable>
						<el-option v-for="item in abnormalTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
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
				<el-table-column prop="abnormalNo" label="异常单号" min-width="150" />
				<el-table-column prop="outboundNo" label="出库单号" min-width="150" />
				<el-table-column prop="customerName" label="客户名称" min-width="150" />
				<el-table-column prop="abnormalDate" label="异常日期" min-width="120" />
				<el-table-column prop="abnormalType" label="异常类型" min-width="100">
					<template #default="{ row }">
						{{ getAbnormalTypeText(row.abnormalType) }}
					</template>
				</el-table-column>
				<el-table-column prop="abnormalDesc" label="异常描述" min-width="200" show-overflow-tooltip />
				<el-table-column prop="status" label="状态" min-width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="160" />
				<el-table-column label="操作" width="240" fixed="right" align="center">
					<template #default="{ row }">
						<el-button v-if="row.status === 0" link type="primary" @click="handleProcess(row)">处理</el-button>
						<el-button v-if="row.status === 1" link type="success" @click="handleComplete(row)">完成</el-button>
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
.abnormal-container {
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
