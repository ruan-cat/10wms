<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, Check } from "@element-plus/icons-vue";
import {
	getAbnormalShipmentList,
	addAbnormalShipment,
	updateAbnormalShipment,
	deleteAbnormalShipment,
	handleAbnormalShipment,
	completeAbnormalShipment,
	type AbnormalShipmentInfo,
	type AddAbnormalShipmentParams,
	type AbnormalShipmentQueryParams,
	type AbnormalGoodsItem,
} from "@/api/daily-check/abnormal";

defineOptions({
	name: "DailyCheckAbnormal",
});

/** 加载状态 */
const loading = ref(false);

/** 表格数据 */
const tableData = ref<AbnormalShipmentInfo[]>([]);

/** 总数 */
const total = ref(0);

/** 查询参数 */
const queryParams = reactive<AbnormalShipmentQueryParams>({
	page: 1,
	size: 10,
	abnormalNo: "",
	outboundNo: "",
	customerName: "",
	abnormalType: undefined,
	status: undefined,
});

/** 对话框显示状态 */
const dialogVisible = ref(false);

/** 对话框标题 */
const dialogTitle = ref("");

/** 表单引用 */
const formRef = ref<FormInstance>();

/** 表单数据 */
const formData = ref<AddAbnormalShipmentParams>({
	customerId: "",
	abnormalDate: "",
	abnormalType: 1,
	abnormalDesc: "",
	goods: [],
	outboundNo: "",
	remark: "",
});

/** 当前编辑的记录ID */
const currentId = ref("");

/** 异常类型选项 */
const abnormalTypeOptions = [
	{ label: "数量异常", value: 1 },
	{ label: "质量异常", value: 2 },
	{ label: "包装异常", value: 3 },
	{ label: "其他", value: 4 },
];

/** 处理状态选项 */
const statusOptions = [
	{ label: "待处理", value: 0 },
	{ label: "处理中", value: 1 },
	{ label: "已处理", value: 2 },
];

/** 表单验证规则 */
const formRules: FormRules = {
	customerId: [{ required: true, message: "请选择客户", trigger: "change" }],
	abnormalDate: [{ required: true, message: "请选择异常日期", trigger: "change" }],
	abnormalType: [{ required: true, message: "请选择异常类型", trigger: "change" }],
	abnormalDesc: [{ required: true, message: "请输入异常描述", trigger: "blur" }],
};

/** 加载列表 */
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

/** 搜索 */
const handleSearch = () => {
	queryParams.page = 1;
	loadData();
};

/** 重置搜索 */
const handleReset = () => {
	Object.assign(queryParams, {
		page: 1,
		size: 10,
		abnormalNo: "",
		outboundNo: "",
		customerName: "",
		abnormalType: undefined,
		status: undefined,
	});
	loadData();
};

/** 新增记录 */
const handleAdd = () => {
	dialogTitle.value = "新增异常发货记录";
	dialogVisible.value = true;
	currentId.value = "";
	formData.value = {
		customerId: "",
		abnormalDate: "",
		abnormalType: 1,
		abnormalDesc: "",
		goods: [],
		outboundNo: "",
		remark: "",
	};
	formRef.value?.clearValidate();
};

/** 编辑记录 */
const handleEdit = (row: AbnormalShipmentInfo) => {
	dialogTitle.value = "编辑异常发货记录";
	dialogVisible.value = true;
	currentId.value = row.id;
	formData.value = {
		customerId: row.customerId,
		abnormalDate: row.abnormalDate,
		abnormalType: row.abnormalType,
		abnormalDesc: row.abnormalDesc,
		goods: row.goods || [],
		outboundNo: row.outboundNo || "",
		remark: row.remark || "",
	};
	formRef.value?.clearValidate();
};

/** 删除记录 */
const handleDelete = (row: AbnormalShipmentInfo) => {
	ElMessageBox.confirm(`确定要删除异常单号"${row.abnormalNo}"吗？`, "提示", {
		type: "warning",
	})
		.then(async () => {
			await deleteAbnormalShipment(row.id);
			ElMessage.success("删除成功");
			loadData();
		})
		.catch(() => {});
};

/** 处理异常 */
const handleProcess = (row: AbnormalShipmentInfo) => {
	ElMessageBox.prompt("请输入处理措施", "处理异常", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		inputPattern: /.+/,
		inputErrorMessage: "请输入处理措施",
	})
		.then(async ({ value }) => {
			await handleAbnormalShipment(row.id, value);
			ElMessage.success("处理成功");
			loadData();
		})
		.catch(() => {});
};

/** 完成处理 */
const handleComplete = (row: AbnormalShipmentInfo) => {
	ElMessageBox.confirm("确定完成该异常的处理吗？", "提示", {
		type: "warning",
	})
		.then(async () => {
			await completeAbnormalShipment(row.id);
			ElMessage.success("操作成功");
			loadData();
		})
		.catch(() => {});
};

/** 提交表单 */
const handleSubmit = async () => {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (!valid) return;

		try {
			if (dialogTitle.value === "新增异常发货记录") {
				await addAbnormalShipment(formData.value);
				ElMessage.success("新增成功");
			} else {
				await updateAbnormalShipment({
					...formData.value,
					id: currentId.value,
				});
				ElMessage.success("更新成功");
			}

			dialogVisible.value = false;
			loadData();
		} catch (error) {
			ElMessage.error("操作失败");
		}
	});
};

/** 获取异常类型文本 */
const getAbnormalTypeText = (type: number) => {
	const option = abnormalTypeOptions.find((item) => item.value === type);
	return option?.label || "-";
};

/** 获取状态文本 */
const getStatusText = (status: number) => {
	const option = statusOptions.find((item) => item.value === status);
	return option?.label || "-";
};

/** 获取状态标签类型 */
const getStatusTagType = (status: number) => {
	const typeMap: Record<number, "info" | "warning" | "success"> = {
		0: "info",
		1: "warning",
		2: "success",
	};
	return typeMap[status] || "info";
};

/** 页面加载时获取数据 */
onMounted(() => {
	loadData();
});
</script>

<template>
	<div class="abnormal-container">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="异常单号">
					<el-input v-model="queryParams.abnormalNo" placeholder="请输入异常单号" clearable />
				</el-form-item>
				<el-form-item label="出库单号">
					<el-input v-model="queryParams.outboundNo" placeholder="请输入出库单号" clearable />
				</el-form-item>
				<el-form-item label="客户名称">
					<el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable />
				</el-form-item>
				<el-form-item label="异常类型">
					<el-select v-model="queryParams.abnormalType" placeholder="请选择异常类型" clearable>
						<el-option v-for="item in abnormalTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="处理状态">
					<el-select v-model="queryParams.status" placeholder="请选择处理状态" clearable>
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
					<el-button :icon="Refresh" @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 表格区域 -->
		<el-card shadow="never" class="table-card">
			<!-- 工具栏 -->
			<div class="toolbar">
				<el-button v-perms="['daily:abnormal:add']" type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			</div>

			<!-- 表格 -->
			<el-table :data="tableData" :loading="loading" border stripe>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="abnormalNo" label="异常单号" min-width="150" />
				<el-table-column prop="outboundNo" label="出库单号" min-width="150" />
				<el-table-column prop="customerName" label="客户名称" min-width="150" />
				<el-table-column prop="abnormalDate" label="异常日期" width="120" />
				<el-table-column prop="abnormalType" label="异常类型" width="100" align="center">
					<template #default="{ row }">
						<span>{{ getAbnormalTypeText(row.abnormalType) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="abnormalDesc" label="异常描述" min-width="200" show-overflow-tooltip />
				<el-table-column prop="status" label="处理状态" width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="getStatusTagType(row.status)">
							{{ getStatusText(row.status) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="handler" label="处理人" width="100" />
				<el-table-column prop="handleTime" label="处理时间" width="160" />
				<el-table-column label="操作" width="280" fixed="right" align="center">
					<template #default="{ row }">
						<el-button
							v-perms="['daily:abnormal:edit']"
							v-if="row.status === 0"
							link
							type="primary"
							:icon="Edit"
							@click="handleEdit(row)"
						>
							编辑
						</el-button>
						<el-button
							v-perms="['daily:abnormal:handle']"
							v-if="row.status === 0"
							link
							type="warning"
							@click="handleProcess(row)"
						>
							处理
						</el-button>
						<el-button
							v-perms="['daily:abnormal:complete']"
							v-if="row.status === 1"
							link
							type="success"
							:icon="Check"
							@click="handleComplete(row)"
						>
							完成
						</el-button>
						<el-button v-perms="['daily:abnormal:delete']" link type="danger" :icon="Delete" @click="handleDelete(row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
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

		<!-- 新增/编辑对话框 -->
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" :close-on-click-modal="false">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="出库单号" prop="outboundNo">
							<el-input v-model="formData.outboundNo" placeholder="请输入出库单号" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="客户" prop="customerId">
							<el-input v-model="formData.customerId" placeholder="请选择客户" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="异常日期" prop="abnormalDate">
							<el-date-picker
								v-model="formData.abnormalDate"
								type="date"
								placeholder="请选择异常日期"
								style="width: 100%"
								value-format="YYYY-MM-DD"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="异常类型" prop="abnormalType">
							<el-select v-model="formData.abnormalType" placeholder="请选择异常类型" style="width: 100%">
								<el-option
									v-for="item in abnormalTypeOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="异常描述" prop="abnormalDesc">
					<el-input v-model="formData.abnormalDesc" type="textarea" :rows="3" placeholder="请输入异常描述" />
				</el-form-item>

				<el-form-item label="备注" prop="remark">
					<el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注" />
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>
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
