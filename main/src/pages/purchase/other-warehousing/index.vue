<template>
	<div class="other-warehousing-container">
		<ElCard shadow="never">
			<!-- 搜索表单 -->
			<ElForm :inline="true" :model="searchForm" class="search-form">
				<ElFormItem label="通知单号">
					<ElInput v-model="searchForm.noticeNumber" placeholder="请输入通知单号" clearable />
				</ElFormItem>
				<ElFormItem label="订单类型">
					<ElSelect v-model="searchForm.orderType" placeholder="请选择订单类型" clearable>
						<ElOption label="越库通知" value="cross_dock" />
						<ElOption label="其他入库" value="other_in" />
						<ElOption label="出库通知" value="out_notice" />
						<ElOption label="其他出库" value="other_out" />
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
				<ElButton type="success" :icon="Edit" @click="handleEdit"> 编辑 </ElButton>
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
		<ElDialog v-model="dialogVisible" :title="dialogTitle" width="900px" @close="handleDialogClose">
			<ElForm ref="formRef" :model="form" :rules="formRules" label-width="120px">
				<ElRow :gutter="20">
					<ElCol :span="12">
						<ElFormItem label="通知单号" prop="noticeNumber">
							<ElInput v-model="form.noticeNumber" placeholder="请输入通知单号" />
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="货主编码" prop="code">
							<ElInput v-model="form.code" placeholder="请输入货主编码" />
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
						<ElFormItem label="订单类型" prop="orderType">
							<ElSelect v-model="form.orderType" placeholder="请选择订单类型">
								<ElOption label="越库通知" value="cross_dock" />
								<ElOption label="其他入库" value="other_in" />
								<ElOption label="出库通知" value="out_notice" />
								<ElOption label="其他出库" value="other_out" />
							</ElSelect>
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="月台" prop="platform">
							<ElInput v-model="form.platform" placeholder="请输入月台" />
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
import { Plus, Delete, Search, Refresh, Edit } from "@element-plus/icons-vue";
import { http } from "@/utils/http";
import SimpleDataTable from "@/components/SimpleDataTable/index.vue";

/** 搜索表单 */
const searchForm = reactive({
	noticeNumber: "",
	orderType: "",
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
	{ slot: "operation", label: "操作", width: 240 },
	{ prop: "noticeNumber", label: "通知单号", minWidth: 150 },
	{ prop: "code", label: "货主编码", width: 120 },
	{ prop: "arriveTime", label: "预计到货时间", width: 180 },
	{ prop: "clientNumber", label: "客户订单号", width: 150 },
	{ prop: "car", label: "车号", width: 100 },
	{ prop: "driver", label: "司机", width: 100 },
	{ prop: "driverNumber", label: "司机电话", width: 130 },
	{
		prop: "orderType",
		label: "订单类型",
		width: 120,
		formatter: (row: any) => {
			const typeMap: Record<string, string> = {
				cross_dock: "越库通知",
				other_in: "其他入库",
				out_notice: "出库通知",
				other_out: "其他出库",
			};
			return typeMap[row.orderType] || row.orderType;
		},
	},
	{ prop: "platform", label: "月台", width: 100 },
	{ prop: "remark", label: "备注", minWidth: 150 },
];

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogMode = ref<"add" | "edit">("add");

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
	orderType: "",
	platform: "",
	remark: "",
});

/** 表单验证规则 */
const formRules = {
	noticeNumber: [{ required: true, message: "请输入通知单号", trigger: "blur" }],
	code: [{ required: true, message: "请输入货主编码", trigger: "blur" }],
	orderType: [{ required: true, message: "请选择订单类型", trigger: "change" }],
};

/** 加载表格数据 */
const loadTableData = async () => {
	loading.value = true;
	try {
		const response = await http.requestCompat({
			url: "/api/purchase/other-warehousing/list",
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
		orderType: "",
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
	dialogTitle.value = "新增其他入库";
	dialogVisible.value = true;
};

/** 编辑 */
const handleEdit = () => {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning("请选择一条记录进行编辑");
		return;
	}
	dialogMode.value = "edit";
	dialogTitle.value = "编辑其他入库";
	Object.assign(form, selectedRows.value[0]);
	dialogVisible.value = true;
};

/** 批量删除 */
const handleBatchDelete = async () => {
	try {
		await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, "提示", { type: "warning" });

		const ids = selectedRows.value.map((row: any) => row.id);
		await http.requestCompat({
			url: "/api/purchase/other-warehousing/batchDelete",
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
			dialogMode.value === "add" ? "/api/purchase/other-warehousing/add" : "/api/purchase/other-warehousing/update";

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
		orderType: "",
		platform: "",
		remark: "",
	});
};

onMounted(() => {
	loadTableData();
});
</script>

<style lang="scss" scoped>
.other-warehousing-container {
	padding: 16px;

	.search-form {
		margin-bottom: 16px;
	}
}
</style>
