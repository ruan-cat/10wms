<template>
	<div class="takedown-adjustment-container">
		<ElCard shadow="never">
			<!-- 搜索表单 -->
			<ElForm :inline="true" :model="searchForm" class="search-form">
				<ElFormItem label="调整单号">
					<ElInput v-model="searchForm.adjustNo" placeholder="请输入调整单号" clearable />
				</ElFormItem>
				<ElFormItem label="状态">
					<ElSelect v-model="searchForm.status" placeholder="请选择状态" clearable>
						<ElOption label="待调整" value="pending" />
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
				<ElButton type="primary" :icon="Plus" @click="handleAdd"> 新增 </ElButton>
				<ElButton type="danger" :icon="Delete" :disabled="!selectedRows.length" @click="handleBatchDelete">
					批量删除
				</ElButton>
			</div>

			<!-- 数据表格 -->
			<SimpleDataTable
				:data="tableData"
				:columns="tableColumns"
				:loading="loading"
				is-index
				is-multiple-select
				:pagination="{
					total: pagination.total,
					currentPage: pagination.currentPage,
					pageSize: pagination.pageSize,
				}"
				@selection-change="handleSelectionChange"
				@page-change="handlePageChange"
			>
				<template #operation="{ row }">
					<ElButton link type="primary" @click="handleView(row)"> 查看 </ElButton>
					<ElButton link type="primary" @click="handleEdit(row)"> 编辑 </ElButton>
					<ElButton link type="danger" @click="handleDelete(row)"> 删除 </ElButton>
				</template>
			</SimpleDataTable>
		</ElCard>

		<!-- 新增/编辑对话框 -->
		<ElDialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="handleDialogClose">
			<ElForm ref="formRef" :model="form" :rules="formRules" label-width="120px">
				<ElFormItem label="调整单号" prop="adjustNo">
					<ElInput v-model="form.adjustNo" placeholder="请输入调整单号" />
				</ElFormItem>
				<ElFormItem label="库位编码" prop="locationCode">
					<ElInput v-model="form.locationCode" placeholder="请输入库位编码" />
				</ElFormItem>
				<ElFormItem label="商品编码" prop="goodsCode">
					<ElInput v-model="form.goodsCode" placeholder="请输入商品编码" />
				</ElFormItem>
				<ElFormItem label="调整数量" prop="adjustQty">
					<ElInputNumber v-model="form.adjustQty" placeholder="请输入调整数量" />
				</ElFormItem>
				<ElFormItem label="状态" prop="status">
					<ElSelect v-model="form.status" placeholder="请选择状态">
						<ElOption label="待调整" value="pending" />
						<ElOption label="已完成" value="completed" />
						<ElOption label="已取消" value="cancelled" />
					</ElSelect>
				</ElFormItem>
				<ElFormItem label="备注" prop="remark">
					<ElInput v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
				</ElFormItem>
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
import SimpleDataTable from "@/components/Table/index.vue";

/** 搜索表单 */
const searchForm = reactive({
	adjustNo: "",
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
	{ prop: "adjustNo", label: "调整单号", minWidth: 150 },
	{ prop: "locationCode", label: "库位编码", width: 150 },
	{ prop: "goodsCode", label: "商品编码", width: 150 },
	{ prop: "adjustQty", label: "调整数量", width: 120 },
	{
		prop: "status",
		label: "状态",
		width: 100,
		formatter: (row: any) => {
			const statusMap: Record<string, string> = {
				pending: "待调整",
				completed: "已完成",
				cancelled: "已取消",
			};
			return statusMap[row.status] || row.status;
		},
	},
	{ prop: "remark", label: "备注", minWidth: 200 },
	{ prop: "createTime", label: "创建时间", width: 180 },
	{ slot: "operation", label: "操作", width: 200, fixed: "right" as const },
];

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogMode = ref<"add" | "edit" | "view">("add");

/** 表单 */
const formRef = ref<FormInstance>();
const form = reactive({
	id: "",
	adjustNo: "",
	locationCode: "",
	goodsCode: "",
	adjustQty: 0,
	status: "pending",
	remark: "",
});

/** 表单验证规则 */
const formRules = {
	adjustNo: [{ required: true, message: "请输入调整单号", trigger: "blur" }],
	locationCode: [{ required: true, message: "请输入库位编码", trigger: "blur" }],
	goodsCode: [{ required: true, message: "请输入商品编码", trigger: "blur" }],
	adjustQty: [{ required: true, message: "请输入调整数量", trigger: "blur" }],
	status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

/** 加载表格数据 */
const loadTableData = async () => {
	loading.value = true;
	try {
		const response = await http.requestCompat({
			url: "/api/inventory/takedown-adjustment/list",
			method: "post",
			data: {
				...searchForm,
				pageNum: pagination.currentPage,
				pageSize: pagination.pageSize,
			},
		});
		if ((response as any).data) {
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
		adjustNo: "",
		status: "",
	});
	handleSearch();
};

/** 分页变化 */
const handlePageChange = ({ currentPage, pageSize }: { currentPage: number; pageSize: number }) => {
	pagination.currentPage = currentPage;
	pagination.pageSize = pageSize;
	loadTableData();
};

/** 选择变化 */
const handleSelectionChange = (rows: any[]) => {
	selectedRows.value = rows;
};

/** 新增 */
const handleAdd = () => {
	dialogMode.value = "add";
	dialogTitle.value = "新增下架调整";
	dialogVisible.value = true;
};

/** 编辑 */
const handleEdit = (row: any) => {
	dialogMode.value = "edit";
	dialogTitle.value = "编辑下架调整";
	Object.assign(form, row);
	dialogVisible.value = true;
};

/** 查看 */
const handleView = (row: any) => {
	dialogMode.value = "view";
	dialogTitle.value = "查看下架调整";
	Object.assign(form, row);
	dialogVisible.value = true;
};

/** 删除 */
const handleDelete = async (row: any) => {
	try {
		await ElMessageBox.confirm("确定要删除该记录吗？", "提示", {
			type: "warning",
		});

		await http.requestCompat({
			url: "/api/inventory/takedown-adjustment/delete",
			method: "post",
			data: { id: row.id },
		});

		ElMessage.success("删除成功");
		loadTableData();
	} catch (error) {
		if (error !== "cancel") {
			console.error("删除失败:", error);
			ElMessage.error("删除失败");
		}
	}
};

/** 批量删除 */
const handleBatchDelete = async () => {
	try {
		await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, "提示", { type: "warning" });

		const ids = selectedRows.value.map((row: any) => row.id);
		await http.requestCompat({
			url: "/api/inventory/takedown-adjustment/batchDelete",
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
			dialogMode.value === "add"
				? "/api/inventory/takedown-adjustment/add"
				: "/api/inventory/takedown-adjustment/update";

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
		adjustNo: "",
		locationCode: "",
		goodsCode: "",
		adjustQty: 0,
		status: "pending",
		remark: "",
	});
};

onMounted(() => {
	loadTableData();
});
</script>

<style lang="scss" scoped>
.takedown-adjustment-container {
	padding: 16px;

	.search-form {
		margin-bottom: 16px;
	}
}
</style>
