<template>
	<div class="user-management">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<el-form :model="searchForm" :inline="true">
				<el-form-item label="用户账号">
					<el-input v-model="searchForm.username" placeholder="请输入用户账号" clearable />
				</el-form-item>
				<el-form-item label="用户名称">
					<el-input v-model="searchForm.realName" placeholder="请输入用户名称" clearable />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
					<el-button :icon="Refresh" @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 操作按钮区域 -->
		<el-card shadow="never" class="toolbar-card">
			<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			<el-button type="success" :icon="Edit" @click="handleEdit" :disabled="!selectedRow">编辑</el-button>
			<el-button type="danger" :icon="Delete" @click="handleDelete" :disabled="!selectedRow">删除</el-button>
			<el-button type="warning" :icon="Key" @click="handleResetPassword" :disabled="!selectedRow">重置密码</el-button>
			<el-button type="info" :icon="Download" @click="handleExport">导出</el-button>
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
				<el-table-column prop="username" label="用户账号" min-width="120" />
				<el-table-column prop="realName" label="用户名称" min-width="100" />
				<el-table-column prop="phone" label="手机号码" min-width="120" />
				<el-table-column prop="email" label="邮箱" min-width="150" />
				<el-table-column prop="status" label="状态" width="80" align="center">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? "启用" : "禁用" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="160" />
				<el-table-column label="操作" width="200" align="center" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
						<el-button type="warning" size="small" link @click="handleResetPassword(row)">重置密码</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-pagination
				v-model:current-page="pagination.page"
				v-model:page-size="pagination.size"
				:total="pagination.total"
				:page-sizes="[10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handlePageSizeChange"
				@current-change="handlePageChange"
				style="margin-top: 20px; justify-content: flex-end"
			/>
		</el-card>

		<!-- 新增/编辑对话框 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="600px"
			:close-on-click-modal="false"
			@close="handleDialogClose"
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-form-item label="用户账号" prop="username">
					<el-input v-model="formData.username" placeholder="请输入用户账号" :disabled="isEdit" />
				</el-form-item>
				<el-form-item label="用户名称" prop="realName">
					<el-input v-model="formData.realName" placeholder="请输入用户名称" />
				</el-form-item>
				<el-form-item label="密码" prop="password" v-if="!isEdit">
					<el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
					<el-input v-model="formData.phone" placeholder="请输入手机号码" />
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="formData.email" placeholder="请输入邮箱" />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio-group v-model="formData.status">
						<el-radio :value="1">启用</el-radio>
						<el-radio :value="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
			</template>
		</el-dialog>

		<!-- 重置密码对话框 -->
		<el-dialog v-model="resetPasswordVisible" title="重置密码" width="400px" :close-on-click-modal="false">
			<el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
				<el-form-item label="新密码" prop="newPassword">
					<el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
				</el-form-item>
				<el-form-item label="确认密码" prop="confirmPassword">
					<el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="resetPasswordVisible = false">取消</el-button>
				<el-button type="primary" @click="handleResetPasswordSubmit" :loading="submitLoading">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, Key, Download } from "@element-plus/icons-vue";
import { getUserList, addUser, updateUser, deleteUser, resetPassword, type UserQueryParams } from "@/api/system/user";

defineOptions({
	name: "SystemUser",
});

/** 搜索表单 */
const searchForm = reactive<UserQueryParams>({
	username: "",
	realName: "",
	status: undefined,
	page: 1,
	size: 10,
});

/** 表格数据 */
const tableData = ref([]);
const loading = ref(false);
const selectedRow = ref(null);

/** 分页 */
const pagination = reactive({
	page: 1,
	size: 10,
	total: 0,
});

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const submitLoading = ref(false);

/** 表单 */
const formRef = ref<FormInstance>();
const formData = reactive({
	id: "",
	username: "",
	realName: "",
	password: "",
	phone: "",
	email: "",
	status: 1,
});

/** 表单验证规则 */
const formRules: FormRules = {
	username: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
	realName: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
	password: [
		{ required: true, message: "请输入密码", trigger: "blur" },
		{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
	],
	phone: [
		{ required: true, message: "请输入手机号码", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
	],
	email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
};

/** 重置密码对话框 */
const resetPasswordVisible = ref(false);
const passwordFormRef = ref<FormInstance>();
const passwordForm = reactive({
	userId: "",
	newPassword: "",
	confirmPassword: "",
});

/** 密码验证规则 */
const passwordRules: FormRules = {
	newPassword: [
		{ required: true, message: "请输入新密码", trigger: "blur" },
		{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
	],
	confirmPassword: [
		{ required: true, message: "请再次输入密码", trigger: "blur" },
		{
			validator: (rule, value, callback) => {
				if (value !== passwordForm.newPassword) {
					callback(new Error("两次输入的密码不一致"));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
};

/** 获取用户列表 */
const fetchUserList = async () => {
	loading.value = true;
	try {
		const params = {
			...searchForm,
			page: pagination.page,
			size: pagination.size,
		};
		const result = await getUserList(params);
		tableData.value = result.list;
		pagination.total = result.total;
	} catch (error) {
		ElMessage.error("获取用户列表失败");
	} finally {
		loading.value = false;
	}
};

/** 搜索 */
const handleSearch = () => {
	pagination.page = 1;
	fetchUserList();
};

/** 重置搜索 */
const handleReset = () => {
	searchForm.username = "";
	searchForm.realName = "";
	searchForm.status = undefined;
	pagination.page = 1;
	fetchUserList();
};

/** 表格行选中 */
const handleCurrentChange = (row: any) => {
	selectedRow.value = row;
};

/** 分页大小改变 */
const handlePageSizeChange = (size: number) => {
	pagination.size = size;
	fetchUserList();
};

/** 分页页码改变 */
const handlePageChange = (page: number) => {
	pagination.page = page;
	fetchUserList();
};

/** 新增 */
const handleAdd = () => {
	isEdit.value = false;
	dialogTitle.value = "新增用户";
	resetFormData();
	dialogVisible.value = true;
};

/** 编辑 */
const handleEdit = (row?: any) => {
	const editRow = row || selectedRow.value;
	if (!editRow) {
		ElMessage.warning("请选择要编辑的用户");
		return;
	}
	isEdit.value = true;
	dialogTitle.value = "编辑用户";
	Object.assign(formData, editRow);
	dialogVisible.value = true;
};

/** 删除 */
const handleDelete = async (row?: any) => {
	const deleteRow = row || selectedRow.value;
	if (!deleteRow) {
		ElMessage.warning("请选择要删除的用户");
		return;
	}

	try {
		await ElMessageBox.confirm("确定要删除该用户吗？", "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		});

		await deleteUser(deleteRow.id);
		ElMessage.success("删除成功");
		fetchUserList();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error("删除失败");
		}
	}
};

/** 重置密码 */
const handleResetPassword = (row?: any) => {
	const resetRow = row || selectedRow.value;
	if (!resetRow) {
		ElMessage.warning("请选择要重置密码的用户");
		return;
	}
	passwordForm.userId = resetRow.id;
	passwordForm.newPassword = "";
	passwordForm.confirmPassword = "";
	resetPasswordVisible.value = true;
};

/** 提交表单 */
const handleSubmit = async () => {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (!valid) return;

		submitLoading.value = true;
		try {
			if (isEdit.value) {
				await updateUser(formData);
				ElMessage.success("编辑成功");
			} else {
				await addUser(formData);
				ElMessage.success("新增成功");
			}
			dialogVisible.value = false;
			fetchUserList();
		} catch (error) {
			ElMessage.error(isEdit.value ? "编辑失败" : "新增失败");
		} finally {
			submitLoading.value = false;
		}
	});
};

/** 提交重置密码 */
const handleResetPasswordSubmit = async () => {
	if (!passwordFormRef.value) return;

	await passwordFormRef.value.validate(async (valid) => {
		if (!valid) return;

		submitLoading.value = true;
		try {
			await resetPassword(passwordForm.userId, passwordForm.newPassword);
			ElMessage.success("密码重置成功");
			resetPasswordVisible.value = false;
		} catch (error) {
			ElMessage.error("密码重置失败");
		} finally {
			submitLoading.value = false;
		}
	});
};

/** 导出 */
const handleExport = () => {
	ElMessage.info("导出功能开发中");
};

/** 重置表单数据 */
const resetFormData = () => {
	formData.id = "";
	formData.username = "";
	formData.realName = "";
	formData.password = "";
	formData.phone = "";
	formData.email = "";
	formData.status = 1;
};

/** 对话框关闭 */
const handleDialogClose = () => {
	formRef.value?.resetFields();
	resetFormData();
};

onMounted(() => {
	fetchUserList();
});
</script>

<style scoped lang="scss">
.user-management {
	padding: 20px;

	.search-card,
	.toolbar-card {
		margin-bottom: 20px;
	}
}
</style>
