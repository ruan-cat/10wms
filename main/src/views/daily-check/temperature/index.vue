<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	getTemperatureRecordList,
	deleteTemperatureRecord,
	exportTemperatureRecord,
	type TemperatureRecordInfo,
	type TemperatureRecordQueryParams,
} from "@/api/daily-check/temperature";

defineOptions({
	name: "DailyCheckTemperature",
});

const loading = ref(false);
const tableData = ref<TemperatureRecordInfo[]>([]);
const total = ref(0);

const queryParams = reactive<TemperatureRecordQueryParams>({
	page: 1,
	size: 10,
	area: "",
	isAbnormal: undefined,
	recorder: "",
});

/** 判断温度是否异常 */
const checkTemperatureAbnormal = (temp: number, range?: string) => {
	if (!range) return false;
	const [min, max] = range.split("-").map(Number);
	return temp < min || temp > max;
};

const loadData = async () => {
	loading.value = true;
	try {
		const result = await getTemperatureRecordList(queryParams);
		// 自动判断是否异常
		tableData.value = result.list.map((item) => ({
			...item,
			isAbnormal: checkTemperatureAbnormal(item.temperature, item.standardTempRange),
		}));
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
		area: "",
		isAbnormal: undefined,
		recorder: "",
	});
	loadData();
};

const handleAdd = () => {
	ElMessage.info("新增功能开发中");
};

const handleDelete = (row: TemperatureRecordInfo) => {
	ElMessageBox.confirm(`确定要删除该温度记录吗？`, "提示", { type: "warning" })
		.then(async () => {
			await deleteTemperatureRecord(row.id);
			ElMessage.success("删除成功");
			loadData();
		})
		.catch(() => {});
};

const handleExport = async () => {
	try {
		const blob = await exportTemperatureRecord(queryParams);
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `温度记录_${new Date().getTime()}.xlsx`;
		link.click();
		window.URL.revokeObjectURL(url);
		ElMessage.success("导出成功");
	} catch (error) {
		ElMessage.error("导出失败");
	}
};

onMounted(() => {
	loadData();
});
</script>

<template>
	<div class="temperature-container">
		<el-card shadow="never" class="search-card">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="区域/设备">
					<el-input v-model="queryParams.area" placeholder="请输入区域/设备" clearable />
				</el-form-item>
				<el-form-item label="是否异常">
					<el-select v-model="queryParams.isAbnormal" placeholder="请选择" clearable>
						<el-option label="正常" :value="false" />
						<el-option label="异常" :value="true" />
					</el-select>
				</el-form-item>
				<el-form-item label="记录人">
					<el-input v-model="queryParams.recorder" placeholder="请输入记录人" clearable />
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
				<el-button @click="handleExport">导出</el-button>
			</div>

			<el-table :data="tableData" :loading="loading" border stripe>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="recordDate" label="记录日期" min-width="120" />
				<el-table-column prop="recordTime" label="记录时间" min-width="100" />
				<el-table-column prop="area" label="区域/设备" min-width="150" />
				<el-table-column prop="temperature" label="温度(℃)" min-width="100" align="center">
					<template #default="{ row }">
						<span :style="{ color: row.isAbnormal ? 'red' : '' }">{{ row.temperature }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="humidity" label="湿度(%)" min-width="100" align="center" />
				<el-table-column prop="standardTempRange" label="标准范围" min-width="120" align="center" />
				<el-table-column prop="isAbnormal" label="状态" min-width="80" align="center">
					<template #default="{ row }">
						<el-tag :type="row.isAbnormal ? 'danger' : 'success'">
							{{ row.isAbnormal ? "异常" : "正常" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="abnormalReason" label="异常原因" min-width="150" show-overflow-tooltip />
				<el-table-column prop="handleMeasure" label="处理措施" min-width="150" show-overflow-tooltip />
				<el-table-column prop="recorder" label="记录人" min-width="100" />
				<el-table-column label="操作" width="120" fixed="right" align="center">
					<template #default="{ row }">
						<el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
.temperature-container {
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
