<template>
	<div class="client-purchase-container">
		<ElCard shadow="never">
			<!-- 搜索表单 -->
			<ElForm :inline="true" :model="searchForm" class="search-form">
				<ElFormItem label="通知单号">
					<ElInput v-model="searchForm.noticeNumber" placeholder="请输入通知单号" clearable />
				</ElFormItem>
				<ElFormItem label="客户订单号">
					<ElInput v-model="searchForm.clientNumber" placeholder="请输入客户订单号" clearable />
				</ElFormItem>
				<ElFormItem label="单据状态">
					<ElSelect v-model="searchForm.status" placeholder="请选择状态" clearable>
						<ElOption label="计划中" value="planning" />
						<ElOption label="已完成" value="completed" />
						<ElOption label="已取消" value="cancelled" />
					</ElSelect>
				</ElFormItem>
				<ElFormItem>
					<ElButton type="primary" :icon="Search" @click="handleSearch"> 查询 </ElButton>
					<ElButton :icon="Refresh" @click="handleReset">重置</ElButton>
				</ElFormItem>
			</ElForm>

			<!-- 操作按钮 -->
			<div class="mb-4">
				<ElButton type="primary" :icon="Plus" @click="handleAdd"> 录入 </ElButton>
				<ElButton type="danger" :icon="Delete" :disabled="!selectedRows.length" @click="handleBatchDelete">
					批量删除
				</ElButton>
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
				@selection-change="handleSelectionChange"
				@page-change="handlePageChange"
			>
				<template #operation="{ row }">
					<ElButton link type="primary" size="small">验收单</ElButton>
					<ElButton link type="primary" size="small">入库单</ElButton>
					<ElButton link type="primary" size="small">货品ID</ElButton>
				</template>
			</SimpleDataTable>
		</ElCard>

		<!-- 新增/编辑对话框 -->
		<ElDialog v-model="dialogVisible" :title="dialogTitle" width="800px" @close="handleDialogClose">
			<ElForm ref="formRef" :model="form" :rules="formRules" label-width="120px">
				<ElRow :gutter="20">
					<ElCol :span="12">
						<ElFormItem label="通知单号" prop="noticeNumber">
							<ElInput v-model="form.noticeNumber" placeholder="请输入通知单号" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="供应商编码" prop="code">
							<ElInput v-model="form.code" placeholder="请输入供应商编码" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="预计到货时间" prop="arriveTime">
							<ElDatePicker
								v-model="form.arriveTime"
								type="datetime"
								placeholder="请选择预计到货时间"
								style="width: 100%"
							/>
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="客户订单号" prop="clientNumber">
							<ElInput v-model="form.clientNumber" placeholder="请输入客户订单号" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="车号" prop="car">
							<ElInput v-model="form.car" placeholder="请输入车号" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="司机" prop="driver">
							<ElInput v-model="form.driver" placeholder="请输入司机" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="司机电话" prop="driverNumber">
							<ElInput v-model="form.driverNumber" placeholder="请输入司机电话" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="单据状态" prop="status">
							<ElSelect v-model="form.status" placeholder="请选择状态">
								<ElOption label="计划中" value="planning" />
								<ElOption label="已完成" value="completed" />
								<ElOption label="已取消" value="cancelled" />
							</ElSelect>
						</ElFormItem>
					</ElCol>
					<ElCol :span="24">
						<ElFormItem label="备注" prop="remark">
							<ElInput v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
						</ElFormItem>
					</ElCol>
				</ElRow>
			</ElForm>
			<template #footer>
				<ElButton @click="dialogVisible = false">取消</ElButton>
				<ElButton type="primary" @click="handleSubmit">确定</ElButton>
			</template>
		</ElDialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import { Plus, Delete, Search, Refresh } from "@element-plus/icons-vue";
import { http } from "@/utils/http";
import SimpleDataTable from "@/components/SimpleDataTable/index.vue";

/** 搜索表单 */
const searchForm = reactive({
	noticeNumber: "",
	clientNumber: "",
	status: "",
});

/** 表格数据 */
const tableData = ref([]);
const loading = ref(false);
const selectedRows = ref([]);

/** 分页信息 */
const pagination = reactive({
	total: 0,
	currentPage: 1,
	pageSize: 10,
});

/** 表格列配置 */
const tableColumns = [
	{ type: "selection", width: 55 },
	{ type: "index", label: "序号", width: 60 },
	{ prop: "name", label: "创建人名称", width: 120 },
	{ prop: "creatTime", label: "创建日期", width: 120 },
	{ prop: "noticeNumber", label: "进货通知单号", minWidth: 150 },
	{ prop: "code", label: "供应商编码", width: 120 },
	{ prop: "arriveTime", label: "预计到货时间", width: 180 },
	{ prop: "clientNumber", label: "客户订单号", width: 150 },
	{ prop: "car", label: "车号", width: 100 },
	{ prop: "driver", label: "司机", width: 100 },
	{ prop: "driverNumber", label: "司机电话", width: 130 },
	{ prop: "remark", label: "备注", minWidth: 150 },
	{
		prop: "status",
		label: "单据状态",
		width: 100,
		formatter: (row: any) => {
			const statusMap: Record<string, string> = {
				planning: "计划中",
				completed: "已完成",
				cancelled: "已取消",
			};
			return statusMap[row.status] || row.status;
		},
	},
	{ slot: "operation", label: "操作", width: 240, fixed: "right" },
];

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogMode = ref<"add" | "edit" | "view">("add");

/** 表单 */
const formRef = ref<FormInstance>();
const form = reactive({
	id: "",
	noticeNumber: "",
	code: "",
	arriveTime: "",
	clientNumber: "",
	car: "",
	driver: "",
	driverNumber: "",
	status: "planning",
	remark: "",
});

/** 表单验证规则 */
const formRules = {
	noticeNumber: [{ required: true, message: "请输入通知单号", trigger: "blur" }],
	code: [{ required: true, message: "请输入供应商编码", trigger: "blur" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

/** 加载表格数据 */
const loadTableData = async () => {
	loading.value = true;
	try {
		const response = await http.requestCompat({
			url: "/api/purchase/client-purchase/list",
			method: "post",
			data: {
				...searchForm,
				pageNum: pagination.currentPage,
				pageSize: pagination.pageSize,
			},
		}); if ((response as any).data) {
			tableData.value = (response as any).data.records || [];
			pagination.total = (response as any).data.total || 0;
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
		clientNumber: "",
		status: "",
	});
	handleSearch();
};

/** 分页变化 */
const handlePageChange = ({ page, limit }: { page: number; limit: number }) => {
	pagination.currentPage = page;
	pagination.pageSize = limit;
	loadTableData();
};

/** 选择变化 */
const handleSelectionChange = (rows: any[]) => {
	selectedRows.value = rows;
};

/** 新增 */
const handleAdd = () => {
	dialogMode.value = "add";
	dialogTitle.value = "新增客户进货";
	dialogVisible.value = true;
};

/** 批量删除 */
const handleBatchDelete = async () => {
	try {
		await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, "提示", { type: "warning" });

		const ids = selectedRows.value.map((row: any) => row.id);
		await http.requestCompat({
			url: "/api/purchase/client-purchase/batchDelete",
			method: "post",
			data: { ids },
		});

		ElMessage.success("删除成功");
		loadTableData();
	} catch (error) {
		if (error !== "cancel") {
			console.error("批量删除失败:", error);
			ElMessage.error("批量删除失败");
		}
	}
};

/** 提交表单 */
const handleSubmit = async () => {
	if (!formRef.value) return;

	try {
		await formRef.value.validate();

		const url =
			dialogMode.value === "add" ? "/api/purchase/client-purchase/add" : "/api/purchase/client-purchase/update";

		await http.requestCompat({
			url,
			method: "post",
			data: form,
		});

		ElMessage.success(dialogMode.value === "add" ? "新增成功" : "更新成功");
		dialogVisible.value = false;
		loadTableData();
	} catch (error) {
		console.error("提交失败:", error);
	}
};

/** 对话框关闭 */
const handleDialogClose = () => {
	formRef.value?.resetFields();
	Object.assign(form, {
		id: "",
		noticeNumber: "",
		code: "",
		arriveTime: "",
		clientNumber: "",
		car: "",
		driver: "",
		driverNumber: "",
		status: "planning",
		remark: "",
	});
};

onMounted(() => {
	loadTableData();
});
</script>

<style lang="scss" scoped>
.client-purchase-container {
	padding: 16px;

	.search-form {
		margin-bottom: 16px;
	}
}
</style>
