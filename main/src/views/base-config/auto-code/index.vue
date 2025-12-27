<template>
	<div class="auto-code-management">
		<!-- 操作按钮区域 -->
		<el-card shadow="never" class="toolbar-card">
			<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			<el-button type="success" :icon="Edit" @click="handleEdit" :disabled="!selectedRow">编辑</el-button>
			<el-button type="danger" :icon="Delete" @click="handleDelete" :disabled="!selectedRow">删除</el-button>
			<el-button type="info" :icon="View" @click="handleView" :disabled="!selectedRow">查看</el-button>
			<el-button type="warning" :icon="Download" @click="handleExport">导出</el-button>
		</el-card>

		<!-- 表格区域 -->
		<el-card shadow="never">
			<el-table
				v-loading="loading"
				:data="tableData"
				border
				stripe
				highlight-current-row
				@current-change="handleCurrentChange"
				style="width: 100%"
			>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="snroTypeCode" label="编号类型" min-width="120" />
				<el-table-column prop="snroOrg" label="组织机构" min-width="120" />
				<el-table-column prop="snroFindex" label="前缀" width="100" />
				<el-table-column prop="snroSplit" label="分隔符" width="80" align="center" />
				<el-table-column prop="snroYear" label="年位数" width="80" align="center" />
				<el-table-column prop="snroMonth" label="月位数" width="80" align="center" />
				<el-table-column prop="snroDay" label="日位数" width="80" align="center" />
				<el-table-column prop="snroSeri" label="序号位数" width="100" align="center" />
				<el-table-column prop="snroExp" label="示例号码" min-width="150" />
			</el-table>

			<!-- 分页 -->
			<el-pagination
				v-model:current-page="pagination.page"
				v-model:page-size="pagination.size"
				:total="pagination.total"
				:page-sizes="[10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="loadData"
				@current-change="loadData"
				style="margin-top: 20px; justify-content: flex-end"
			/>
		</el-card>

		<!-- 新增/编辑/查看对话框 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="600px"
			:close-on-click-modal="false"
			@close="handleDialogClose"
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" :disabled="isViewMode">
				<el-form-item label="编号类型" prop="snroTypeCode">
					<el-input v-model="formData.snroTypeCode" placeholder="请输入编号类型" />
				</el-form-item>
				<el-form-item label="组织机构" prop="snroOrg">
					<el-input v-model="formData.snroOrg" placeholder="请输入组织机构" />
				</el-form-item>
				<el-form-item label="前缀" prop="snroFindex">
					<el-input v-model="formData.snroFindex" placeholder="请输入前缀" />
				</el-form-item>
				<el-form-item label="分隔符" prop="snroSplit">
					<el-input v-model="formData.snroSplit" placeholder="请输入分隔符" />
				</el-form-item>
				<el-form-item label="年位数" prop="snroYear">
					<el-input v-model="formData.snroYear" placeholder="请输入年位数" />
				</el-form-item>
				<el-form-item label="月位数" prop="snroMonth">
					<el-input v-model="formData.snroMonth" placeholder="请输入月位数" />
				</el-form-item>
				<el-form-item label="日位数" prop="snroDay">
					<el-input v-model="formData.snroDay" placeholder="请输入日位数" />
				</el-form-item>
				<el-form-item label="序号位数" prop="snroSeri">
					<el-input v-model="formData.snroSeri" placeholder="请输入序号位数" />
				</el-form-item>
				<el-form-item label="示例号码" prop="snroExp">
					<el-input v-model="formData.snroExp" placeholder="请输入示例号码" />
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button v-if="!isViewMode" type="primary" @click="handleSubmit" :loading="submitLoading"> 确定 </el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { Plus, Edit, Delete, View, Download } from "@element-plus/icons-vue";
import {
	listAutoCode,
	addAutoCode,
	updateAutoCode,
	deleteAutoCode,
	exportAutoCode,
	type AutoCodeData,
} from "@/api/base-config/auto-code";

/** 加载状态 */
const loading = ref(false);
/** 提交加载状态 */
const submitLoading = ref(false);
/** 表格数据 */
const tableData = ref<AutoCodeData[]>([]);
/** 选中的行 */
const selectedRow = ref<AutoCodeData>();
/** 分页参数 */
const pagination = reactive({
	page: 1,
	size: 10,
	total: 0,
});

/** 对话框相关 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isViewMode = ref(false);
const formRef = ref<FormInstance>();
const formData = ref<AutoCodeData>({});

/** 表单验证规则 */
const formRules: FormRules = {
	snroTypeCode: [{ required: true, message: "请输入编号类型", trigger: "blur" }],
	snroOrg: [{ required: true, message: "请输入组织机构", trigger: "blur" }],
};

/** 加载数据 */
async function loadData() {
	loading.value = true;
	try {
		const res = await listAutoCode({
			pageIndex: pagination.page,
			pageSize: pagination.size,
		});
		tableData.value = res.rows || [];
		pagination.total = res.total || 0;
	} catch (error) {
		ElMessage.error("加载数据失败");
	} finally {
		loading.value = false;
	}
}

/** 当前行改变 */
function handleCurrentChange(row: AutoCodeData) {
	selectedRow.value = row;
}

/** 新增 */
function handleAdd() {
	dialogTitle.value = "新增自动编码";
	isViewMode.value = false;
	formData.value = {};
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit() {
	if (!selectedRow.value) {
		ElMessage.warning("请选择一条记录");
		return;
	}
	dialogTitle.value = "编辑自动编码";
	isViewMode.value = false;
	formData.value = { ...selectedRow.value };
	dialogVisible.value = true;
}

/** 查看 */
function handleView() {
	if (!selectedRow.value) {
		ElMessage.warning("请选择一条记录");
		return;
	}
	dialogTitle.value = "查看自动编码";
	isViewMode.value = true;
	formData.value = { ...selectedRow.value };
	dialogVisible.value = true;
}

/** 删除 */
async function handleDelete() {
	if (!selectedRow.value) {
		ElMessage.warning("请选择一条记录");
		return;
	}

	try {
		await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		});

		await deleteAutoCode([selectedRow.value.id!]);
		ElMessage.success("删除成功");
		loadData();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error("删除失败");
		}
	}
}

/** 导出 */
async function handleExport() {
	try {
		const blob = await exportAutoCode();
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `自动编码_${new Date().getTime()}.xlsx`;
		link.click();
		window.URL.revokeObjectURL(url);
		ElMessage.success("导出成功");
	} catch (error) {
		ElMessage.error("导出失败");
	}
}

/** 提交表单 */
async function handleSubmit() {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (!valid) return;

		submitLoading.value = true;
		try {
			if (formData.value.id) {
				await updateAutoCode(formData.value);
				ElMessage.success("更新成功");
			} else {
				await addAutoCode(formData.value);
				ElMessage.success("新增成功");
			}
			dialogVisible.value = false;
			loadData();
		} catch (error) {
			ElMessage.error(formData.value.id ? "更新失败" : "新增失败");
		} finally {
			submitLoading.value = false;
		}
	});
}

/** 对话框关闭 */
function handleDialogClose() {
	formRef.value?.resetFields();
	formData.value = {};
}

onMounted(() => {
	loadData();
});
</script>

<style lang="scss" scoped>
.auto-code-management {
	.toolbar-card {
		margin-bottom: 16px;
	}
}
</style>
