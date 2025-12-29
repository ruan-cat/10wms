<template>
	<div class="user-management">
		<!-- 搜索表单 -->
		<el-card shadow="never" class="mb-4">
			<el-form :model="searchForm" inline>
				<el-form-item label="用户账号">
					<el-input v-model="searchForm.username" placeholder="请输入用户账号" clearable style="width: 200px" />
				</el-form-item>
				<el-form-item label="用户姓名">
					<el-input v-model="searchForm.realname" placeholder="请输入用户姓名" clearable style="width: 200px" />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
						<el-option label="启用" value="1" />
						<el-option label="禁用" value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
					<el-button :icon="Refresh" @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 操作按钮 -->
		<el-card shadow="never" class="mb-4">
			<el-button v-perms="['system:user:add']" type="primary" :icon="Plus" @click="handleAdd">新增用户</el-button>
			<el-button
				v-perms="['system:user:delete']"
				type="danger"
				:icon="Delete"
				:disabled="!selectedRows.length"
				@click="handleBatchDelete"
			>
				批量删除
			</el-button>
		</el-card>

		<!-- 表格 -->
		<el-card shadow="never">
			<el-table
				v-loading="loading"
				:data="tableData"
				border
				stripe
				@selection-change="handleSelectionChange"
				style="width: 100%"
			>
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="username" label="用户账号" min-width="120" show-overflow-tooltip />
				<el-table-column prop="realname" label="用户姓名" min-width="100" show-overflow-tooltip />
				<el-table-column prop="mobilePhone" label="手机号码" min-width="120" show-overflow-tooltip />
				<el-table-column prop="email" label="邮箱" min-width="150" show-overflow-tooltip />
				<el-table-column label="部门" min-width="150" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.departments?.map((d) => d.name).join(", ") || "-" }}</span>
					</template>
				</el-table-column>
				<el-table-column label="角色" min-width="150" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.roles?.map((r) => r.name).join(", ") || "-" }}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" width="80" align="center">
					<template #default="{ row }">
						<el-tag :type="row.status === '1' ? 'success' : 'danger'">
							{{ row.status === "1" ? "启用" : "禁用" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="160" show-overflow-tooltip />
				<el-table-column label="操作" width="280" align="center" fixed="right">
					<template #default="{ row }">
						<el-button v-perms="['system:user:edit']" type="primary" link :icon="Edit" @click="handleEdit(row)">
							编辑
						</el-button>
						<el-button
							v-perms="['system:user:resetPwd']"
							type="warning"
							link
							:icon="Key"
							@click="handleResetPassword(row)"
						>
							重置密码
						</el-button>
						<el-button
							v-perms="['system:user:status']"
							:type="row.status === '1' ? 'danger' : 'success'"
							link
							:icon="row.status === '1' ? Lock : Unlock"
							@click="handleToggleStatus(row)"
						>
							{{ row.status === "1" ? "禁用" : "启用" }}
						</el-button>
						<el-popconfirm title="确定删除该用户吗？" @confirm="handleDelete(row)">
							<template #reference>
								<el-button v-perms="['system:user:delete']" type="danger" link :icon="Delete">删除</el-button>
							</template>
						</el-popconfirm>
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
				class="mt-4"
				@size-change="fetchData"
				@current-change="fetchData"
			/>
		</el-card>

		<!-- 新增/编辑对话框 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="600px"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-form-item label="用户账号" prop="username">
					<el-input v-model="formData.username" placeholder="请输入用户账号" :disabled="isEdit" />
				</el-form-item>
				<el-form-item label="用户姓名" prop="realname">
					<el-input v-model="formData.realname" placeholder="请输入用户姓名" />
				</el-form-item>
				<el-form-item v-if="!isEdit" label="密码" prop="password">
					<el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
				</el-form-item>
				<el-form-item label="手机号码" prop="mobilePhone">
					<el-input v-model="formData.mobilePhone" placeholder="请输入手机号码" />
				</el-form-item>
				<el-form-item label="办公电话">
					<el-input v-model="formData.officePhone" placeholder="请输入办公电话" />
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="formData.email" placeholder="请输入邮箱" />
				</el-form-item>
				<el-form-item label="部门" prop="departmentIds">
					<el-select v-model="formData.departmentIds" multiple placeholder="请选择部门" style="width: 100%">
						<el-option v-for="dept in deptList" :key="dept.id" :label="dept.deptName" :value="dept.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="角色" prop="roleIds">
					<el-select v-model="formData.roleIds" multiple placeholder="请选择角色" style="width: 100%">
						<el-option v-for="role in roleList" :key="role.id" :label="role.roleName" :value="role.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="用户类型">
					<el-radio-group v-model="formData.userType">
						<el-radio value="4">当前用户权限</el-radio>
						<el-radio value="3">公司权限</el-radio>
						<el-radio value="1">系统用户</el-radio>
						<el-radio value="2">接口用户</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>

		<!-- 重置密码对话框 -->
		<el-dialog v-model="resetPasswordVisible" title="重置密码" width="400px" :close-on-click-modal="false">
			<el-form ref="resetFormRef" :model="resetPasswordForm" :rules="resetPasswordRules" label-width="100px">
				<el-form-item label="新密码" prop="newPassword">
					<el-input v-model="resetPasswordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
				</el-form-item>
				<el-form-item label="确认密码" prop="confirmPassword">
					<el-input
						v-model="resetPasswordForm.confirmPassword"
						type="password"
						placeholder="请再次输入密码"
						show-password
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="resetPasswordVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleResetPasswordSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, Key, Lock, Unlock } from "@element-plus/icons-vue";
import {
	getUserList,
	addUser,
	updateUser,
	deleteUser,
	batchDeleteUsers,
	resetPassword,
	toggleUserStatus,
	type UserDTO,
	type GetUserListParams,
	type AddUserParams,
} from "@/api/system/user";
import { getDeptList, type DeptInfo } from "@/api/system/dept";
import { getAllRoles, type RoleInfo } from "@/api/system/role";

defineOptions({
	name: "SystemUser",
});

/** 搜索表单 */
const searchForm = reactive<GetUserListParams>({
	page: 1,
	size: 10,
	username: "",
	realname: "",
	status: undefined,
});

/** 表格数据 */
const tableData = ref<UserDTO[]>([]);
const loading = ref(false);
const selectedRows = ref<UserDTO[]>([]);

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
const formData = reactive<Partial<AddUserParams>>({
	username: "",
	password: "",
	realname: "",
	email: "",
	mobilePhone: "",
	officePhone: "",
	departmentIds: [],
	roleIds: [],
	userType: "4",
});

/** 表单验证规则 */
const formRules: FormRules = {
	username: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
	password: [
		{ required: true, message: "请输入密码", trigger: "blur" },
		{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
	],
	realname: [{ required: true, message: "请输入用户姓名", trigger: "blur" }],
	mobilePhone: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }],
	email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
	departmentIds: [{ required: true, message: "请选择部门", trigger: "change" }],
	roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
};

/** 重置密码 */
const resetPasswordVisible = ref(false);
const resetFormRef = ref<FormInstance>();
const resetPasswordForm = reactive({
	userId: "",
	newPassword: "",
	confirmPassword: "",
});

/** 重置密码验证规则 */
const resetPasswordRules: FormRules = {
	newPassword: [
		{ required: true, message: "请输入新密码", trigger: "blur" },
		{ min: 6, max: 18, message: "密码长度为6-18位", trigger: "blur" },
	],
	confirmPassword: [
		{ required: true, message: "请再次输入密码", trigger: "blur" },
		{
			validator: (rule, value, callback) => {
				if (value !== resetPasswordForm.newPassword) {
					callback(new Error("两次输入的密码不一致"));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
};

/** 部门列表 */
const deptList = ref<DeptInfo[]>([]);

/** 角色列表 */
const roleList = ref<RoleInfo[]>([]);

/** 获取数据 */
async function fetchData() {
	loading.value = true;
	try {
		const params: GetUserListParams = {
			page: pagination.page,
			size: pagination.size,
			...searchForm,
		};
		const res = await getUserList(params);
		tableData.value = (res as any).list || [];
		pagination.total = res.total || 0;
	} catch (error) {
		ElMessage.error("获取用户列表失败");
	} finally {
		loading.value = false;
	}
}

/** 获取部门列表 */
async function fetchDeptList() {
	try {
		const res = await getDeptList();
		deptList.value = res || [];
	} catch (error) {
		console.error("获取部门列表失败", error);
	}
}

/** 获取角色列表 */
async function fetchRoleList() {
	try {
		const res = await getAllRoles();
		roleList.value = res || [];
	} catch (error) {
		console.error("获取角色列表失败", error);
	}
}

/** 搜索 */
function handleSearch() {
	pagination.page = 1;
	fetchData();
}

/** 重置搜索 */
function handleReset() {
	searchForm.username = "";
	searchForm.realname = "";
	searchForm.status = undefined;
	pagination.page = 1;
	fetchData();
}

/** 表格选择 */
function handleSelectionChange(rows: UserDTO[]) {
	selectedRows.value = rows;
}

/** 新增 */
function handleAdd() {
	isEdit.value = false;
	dialogTitle.value = "新增用户";
	Object.assign(formData, {
		username: "",
		password: "",
		realname: "",
		email: "",
		mobilePhone: "",
		officePhone: "",
		departmentIds: [],
		roleIds: [],
		userType: "4",
	});
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: UserDTO) {
	isEdit.value = true;
	dialogTitle.value = "编辑用户";
	Object.assign(formData, {
		username: row.username,
		realname: row.realname,
		email: row.email,
		mobilePhone: row.mobilePhone,
		officePhone: row.officePhone,
		departmentIds: row.departments?.map((d) => d.id) || [],
		roleIds: row.roles?.map((r) => r.id) || [],
		userType: row.userType,
	});
	dialogVisible.value = true;
}

/** 提交表单 */
async function handleSubmit() {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (!valid) return;

		submitLoading.value = true;
		try {
			if (isEdit.value) {
				// 编辑
				await updateUser(formData.username!, formData as AddUserParams);
				ElMessage.success("编辑成功");
			} else {
				// 新增
				await addUser(formData as AddUserParams);
				ElMessage.success("新增成功");
			}
			dialogVisible.value = false;
			fetchData();
		} catch (error) {
			ElMessage.error(isEdit.value ? "编辑失败" : "新增失败");
		} finally {
			submitLoading.value = false;
		}
	});
}

/** 删除 */
async function handleDelete(row: UserDTO) {
	try {
		await deleteUser(row.id);
		ElMessage.success("删除成功");
		fetchData();
	} catch (error) {
		ElMessage.error("删除失败");
	}
}

/** 批量删除 */
async function handleBatchDelete() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning("请选择要删除的用户");
		return;
	}

	try {
		await ElMessageBox.confirm("确定删除选中的用户吗？", "提示", {
			type: "warning",
		});

		const userIds = selectedRows.value.map((row) => row.id);
		await batchDeleteUsers(userIds);
		ElMessage.success("删除成功");
		fetchData();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error("删除失败");
		}
	}
}

/** 重置密码 */
function handleResetPassword(row: UserDTO) {
	resetPasswordForm.userId = row.id;
	resetPasswordForm.newPassword = "";
	resetPasswordForm.confirmPassword = "";
	resetPasswordVisible.value = true;
}

/** 提交重置密码 */
async function handleResetPasswordSubmit() {
	if (!resetFormRef.value) return;

	await resetFormRef.value.validate(async (valid) => {
		if (!valid) return;

		submitLoading.value = true;
		try {
			await resetPassword({
				userId: resetPasswordForm.userId,
				newPassword: resetPasswordForm.newPassword,
			});
			ElMessage.success("密码重置成功");
			resetPasswordVisible.value = false;
		} catch (error) {
			ElMessage.error("密码重置失败");
		} finally {
			submitLoading.value = false;
		}
	});
}

/** 切换状态 */
async function handleToggleStatus(row: UserDTO) {
	const newStatus = row.status === "1" ? "0" : "1";
	const action = newStatus === "1" ? "启用" : "禁用";

	try {
		await ElMessageBox.confirm(`确定${action}该用户吗？`, "提示", {
			type: "warning",
		});

		await toggleUserStatus(row.id, newStatus);
		ElMessage.success(`${action}成功`);
		fetchData();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error(`${action}失败`);
		}
	}
}

onMounted(() => {
	fetchData();
	fetchDeptList();
	fetchRoleList();
});
</script>

<style scoped lang="scss">
.user-management {
	padding: 16px;
}
</style>
