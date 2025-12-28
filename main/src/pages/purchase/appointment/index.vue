<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import {
	getAppointmentPurchaseList,
	addAppointmentPurchase,
	updateAppointmentPurchase,
	deleteAppointmentPurchase,
	confirmAppointmentPurchase,
	cancelAppointmentPurchase,
	completeAppointmentPurchase,
	type AppointmentPurchaseInfo,
	type AddAppointmentPurchaseParams,
	type AppointmentPurchaseQueryParams,
	type AppointmentGoodsItem,
} from "@/api/purchase/appointment";

defineOptions({
	name: "PurchaseAppointment",
});

/** 加载状态 */
const loading = ref(false);
const tableData = ref<AppointmentPurchaseInfo[]>([]);
const total = ref(0);

/** 查询参数 */
const queryParams = reactive<AppointmentPurchaseQueryParams>({
	page: 1,
	size: 10,
	appointmentNo: "",
	customerName: "",
	status: undefined,
});

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref<FormInstance>();
const currentId = ref("");

/** 表单数据 */
const formData = ref<AddAppointmentPurchaseParams>({
	customerId: "",
	appointmentDate: "",
	appointmentTime: "",
	goods: [],
	remark: "",
});

/** 状态选项 */
const statusOptions = [
	{ label: "待确认", value: 0 },
	{ label: "已确认", value: 1 },
	{ label: "已完成", value: 2 },
	{ label: "已取消", value: 3 },
];

/** 表单验证规则 */
const formRules: FormRules = {
	customerId: [{ required: true, message: "请选择客户", trigger: "change" }],
	appointmentDate: [{ required: true, message: "请选择预约日期", trigger: "change" }],
};

/** 获取状态标签类型 */
const getStatusType = (status: number) => {
	const typeMap: Record<number, "info" | "success" | "primary" | "danger"> = {
		0: "info",
		1: "success",
		2: "primary",
		3: "danger",
	};
	return typeMap[status] || "info";
};

/** 获取状态文本 */
const getStatusText = (status: number) => {
	const textMap: Record<number, string> = {
		0: "待确认",
		1: "已确认",
		2: "已完成",
		3: "已取消",
	};
	return textMap[status] || "未知";
};

/** 加载数据 */
const loadData = async () => {
	loading.value = true;
	try {
		const result = await getAppointmentPurchaseList(queryParams);
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

/** 重置 */
const handleReset = () => {
	Object.assign(queryParams, {
		page: 1,
		size: 10,
		appointmentNo: "",
		customerName: "",
		status: undefined,
	});
	loadData();
};

/** 新增 */
const handleAdd = () => {
	dialogTitle.value = "新增预约采购单";
	dialogVisible.value = true;
	currentId.value = "";
	formData.value = {
		customerId: "",
		appointmentDate: "",
		appointmentTime: "",
		goods: [],
		remark: "",
	};
	formRef.value?.clearValidate();
};

/** 编辑 */
const handleEdit = (row: AppointmentPurchaseInfo) => {
	dialogTitle.value = "编辑预约采购单";
	dialogVisible.value = true;
	currentId.value = row.id;
	formData.value = {
		customerId: row.customerId,
		appointmentDate: row.appointmentDate,
		appointmentTime: row.appointmentTime || "",
		goods: row.goods || [],
		remark: row.remark || "",
	};
	formRef.value?.clearValidate();
};

/** 删除 */
const handleDelete = (row: AppointmentPurchaseInfo) => {
	ElMessageBox.confirm(`确定要删除预约单"${row.appointmentNo}"吗？`, "提示", {
		type: "warning",
	})
		.then(async () => {
			await deleteAppointmentPurchase(row.id);
			ElMessage.success("删除成功");
			loadData();
		})
		.catch(() => {});
};

/** 确认预约 */
const handleConfirm = async (row: AppointmentPurchaseInfo) => {
	try {
		await confirmAppointmentPurchase(row.id);
		ElMessage.success("确认成功");
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
};

/** 取消预约 */
const handleCancel = (row: AppointmentPurchaseInfo) => {
	ElMessageBox.prompt("请输入取消原因", "取消预约", {
		inputType: "textarea",
	})
		.then(async ({ value }) => {
			await cancelAppointmentPurchase(row.id, value);
			ElMessage.success("取消成功");
			loadData();
		})
		.catch(() => {});
};

/** 完成预约 */
const handleComplete = async (row: AppointmentPurchaseInfo) => {
	try {
		await completeAppointmentPurchase(row.id);
		ElMessage.success("完成成功");
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
};

/** 添加商品 */
const handleAddGoods = () => {
	formData.value.goods.push({
		goodsId: "",
		goodsCode: "",
		goodsName: "",
		specification: "",
		unit: "",
		quantity: 0,
		remark: "",
	});
};

/** 删除商品 */
const handleDeleteGoods = (index: number) => {
	formData.value.goods.splice(index, 1);
};

/** 提交表单 */
const handleSubmit = async () => {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (!valid) return;

		if (formData.value.goods.length === 0) {
			ElMessage.warning("请至少添加一条商品明细");
			return;
		}

		try {
			if (dialogTitle.value === "新增预约采购单") {
				await addAppointmentPurchase(formData.value);
				ElMessage.success("新增成功");
			} else {
				await updateAppointmentPurchase({
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

onMounted(() => {
	loadData();
});
</script>

<template>
	<div class="appointment-container">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="预约单号">
					<el-input v-model="queryParams.appointmentNo" placeholder="请输入预约单号" clearable />
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

		<!-- 表格区域 -->
		<el-card shadow="never" class="table-card">
			<div class="toolbar">
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</div>

			<el-table :data="tableData" :loading="loading" border stripe>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="appointmentNo" label="预约单号" min-width="150" />
				<el-table-column prop="customerName" label="客户名称" min-width="150" />
				<el-table-column prop="appointmentDate" label="预约日期" min-width="120" />
				<el-table-column prop="appointmentTime" label="预约时间段" min-width="120" />
				<el-table-column prop="totalQuantity" label="总数量" min-width="100" align="center" />
				<el-table-column prop="status" label="状态" min-width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="getStatusType(row.status)">
							{{ getStatusText(row.status) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="160" />
				<el-table-column label="操作" width="280" fixed="right" align="center">
					<template #default="{ row }">
						<el-button v-if="row.status === 0" link type="primary" @click="handleEdit(row)">编辑</el-button>
						<el-button v-if="row.status === 0" link type="success" @click="handleConfirm(row)">确认</el-button>
						<el-button v-if="row.status === 1" link type="primary" @click="handleComplete(row)">完成</el-button>
						<el-button v-if="row.status <= 1" link type="warning" @click="handleCancel(row)">取消</el-button>
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

		<!-- 新增/编辑对话框 -->
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="1000px" :close-on-click-modal="false">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="客户" prop="customerId">
							<el-input v-model="formData.customerId" placeholder="请输入客户ID" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预约日期" prop="appointmentDate">
							<el-date-picker
								v-model="formData.appointmentDate"
								type="date"
								placeholder="请选择预约日期"
								style="width: 100%"
								value-format="YYYY-MM-DD"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预约时间段" prop="appointmentTime">
							<el-input v-model="formData.appointmentTime" placeholder="如：09:00-12:00" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="备注" prop="remark">
					<el-input v-model="formData.remark" placeholder="请输入备注" />
				</el-form-item>

				<!-- 商品明细 -->
				<el-form-item label="商品明细">
					<div style="width: 100%">
						<el-button type="primary" size="small" @click="handleAddGoods">添加商品</el-button>
						<el-table :data="formData.goods" border stripe style="margin-top: 10px">
							<el-table-column type="index" label="序号" width="60" align="center" />
							<el-table-column prop="goodsCode" label="商品编码" min-width="120">
								<template #default="{ row }">
									<el-input v-model="row.goodsCode" placeholder="商品编码" size="small" />
								</template>
							</el-table-column>
							<el-table-column prop="goodsName" label="商品名称" min-width="150">
								<template #default="{ row }">
									<el-input v-model="row.goodsName" placeholder="商品名称" size="small" />
								</template>
							</el-table-column>
							<el-table-column prop="specification" label="规格型号" min-width="120">
								<template #default="{ row }">
									<el-input v-model="row.specification" placeholder="规格型号" size="small" />
								</template>
							</el-table-column>
							<el-table-column prop="unit" label="单位" min-width="80">
								<template #default="{ row }">
									<el-input v-model="row.unit" placeholder="单位" size="small" />
								</template>
							</el-table-column>
							<el-table-column prop="quantity" label="预约数量" min-width="100">
								<template #default="{ row }">
									<el-input-number v-model="row.quantity" :min="0" size="small" style="width: 100%" />
								</template>
							</el-table-column>
							<el-table-column label="操作" width="80" align="center">
								<template #default="{ $index }">
									<el-button link type="danger" size="small" @click="handleDeleteGoods($index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
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
.appointment-container {
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
