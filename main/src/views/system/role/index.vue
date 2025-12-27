<template>
	<div class="role-management">
		<!-- 搜索表单 -->
		<el-card shadow="never" class="mb-4">
			<el-form :model="searchForm" inline>
				<el-form-item label="角色名称">
					<el-input v-model="searchForm.roleName" placeholder="请输入角色名称" clearable style="width: 200px" />
				</el-form-item>
				<el-form-item label="角色编码">
					<el-input v-model="searchForm.roleCode" placeholder="请输入角色编码" clearable style="width: 200px" />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
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

		<!-- 操作按钮 -->
		<el-card shadow="never" class="mb-4">
			<el-button v-perms="['system:role:add']" type="primary" :icon="Plus" @click="handleAdd">新增角色</el-button>
			<el-button
				v-perms="['system:role:delete']"
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
				<el-table-column prop="roleName" label="角色名称" min-width="150" show-overflow-tooltip />
				<el-table-column prop="roleCode" label="角色编码" min-width="150" show-overflow-tooltip />
				<el-table-column prop="description" label="角色描述" min-width="200" show-overflow-tooltip />
				<el-table-column label="状态" width="80" align="center">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? "启用" : "禁用" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="160" show-overflow-tooltip />
				<el-table-column label="操作" width="280" align="center" fixed="right">
					<template #default="{ row }">
						<el-button v-perms="['system:role:edit']" type="primary" link :icon="Edit" @click="handleEdit(row)">
							编辑
						</el-button>
						<el-button
							v-perms="['system:role:permission']"
							type="warning"
							link
							:icon="Setting"
							@click="handlePermission(row)"
						>
							权限设置
						</el-button>
						<el-button
							v-perms="['system:role:status']"
							:type="row.status === 1 ? 'danger' : 'success'"
							link
							@click="handleToggleStatus(row)"
						>
							{{ row.status === 1 ? "禁用" : "启用" }}
						</el-button>
						<el-popconfirm title="确定删除该角色吗？" @confirm="handleDelete(row)">
							<template #reference>
								<el-button v-perms="['system:role:delete']" type="danger" link :icon="Delete">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-pagination
				v-model:current-page="pagination.pageIndex"
				v-model:page-size="pagination.pageSize"
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
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="formData.roleName" placeholder="请输入角色名称" />
				</el-form-item>
				<el-form-item label="角色编码" prop="roleCode">
					<el-input v-model="formData.roleCode" placeholder="请输入角色编码" :disabled="isEdit" />
				</el-form-item>
				<el-form-item label="角色描述">
					<el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入角色描述" />
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="formData.status">
						<el-radio :value="1">启用</el-radio>
						<el-radio :value="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>

		<!-- 权限设置对话框 -->
		<el-dialog v-model="permissionVisible" title="权限设置" width="600px" :close-on-click-modal="false">
			<el-tree
				ref="treeRef"
				:data="menuTree"
				:props="{ label: 'title', children: 'children' }"
				node-key="id"
				show-checkbox
				default-expand-all
				:default-checked-keys="checkedMenuIds"
			/>
			<template #footer>
				<el-button @click="permissionVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handlePermissionSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, Setting } from "@element-plus/icons-vue";
import {
	getRoleList,
	addRole,
	updateRole,
	deleteRole,
	batchDeleteRole,
	updateRoleStatus,
	assignPermission,
	getRolePermissions,
	type RoleInfo,
	type RoleQueryParams,
	type AddRoleParams,
} from "@/api/system/role";
import { getMenuList, type MenuDTO } from "@/api/system/menu";

defineOptions({
	name: "SystemRole",
});

/** 搜索表单 */
const searchForm = reactive<RoleQueryParams>({
	page: 1,
	size: 10,
	roleName: "",
	roleCode: "",
	status: undefined,
});

/** 表格数据 */
const tableData = ref<RoleInfo[]>([]);
const loading = ref(false);
const selectedRows = ref<RoleInfo[]>([]);

/** 分页 */
const pagination = reactive({
	pageIndex: 1,
	pageSize: 10,
	total: 0,
});

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const submitLoading = ref(false);

/** 表单 */
const formRef = ref<FormInstance>();
const formData = reactive<Partial<AddRoleParams>>({
	roleName: "",
	roleCode: "",
	description: "",
	status: 1,
});

/** 表单验证规则 */
const formRules: FormRules = {
	roleName: [
		{ required: true, message: "请输入角色名称", trigger: "blur" },
		{ min: 2, max: 50, message: "角色名称长度为2-50位", trigger: "blur" },
	],
	roleCode: [
		{ required: true, message: "请输入角色编码", trigger: "blur" },
		{ min: 2, max: 50, message: "角色编码长度为2-50位", trigger: "blur" },
		{
			pattern: /^[A-Z_]+$/,
			message: "角色编码只能包含大写字母和下划线",
			trigger: "blur",
		},
	],
};

/** 权限设置 */
const permissionVisible = ref(false);
const treeRef = ref();
const menuTree = ref<MenuDTO[]>([]);
const checkedMenuIds = ref<string[]>([]);
const currentRoleId = ref("");

/** 获取数据 */
async function fetchData() {
	loading.value = true;
	try {
		const params: RoleQueryParams = {
			page: pagination.pageIndex,
			size: pagination.pageSize,
			...searchForm,
		};
		const res = await getRoleList(params);
		tableData.value = res.list || [];
		pagination.total = res.total || 0;
	} catch (error) {
		ElMessage.error("获取角色列表失败");
	} finally {
		loading.value = false;
	}
}

/** 获取菜单树 */
async function fetchMenuTree() {
	try {
		const res = await getMenuList();
		menuTree.value = res || [];
	} catch (error) {
		console.error("获取菜单树失败", error);
	}
}

/** 搜索 */
function handleSearch() {
	pagination.pageIndex = 1;
	fetchData();
}

/** 重置搜索 */
function handleReset() {
	searchForm.roleName = "";
	searchForm.roleCode = "";
	searchForm.status = undefined;
	pagination.pageIndex = 1;
	fetchData();
}

/** 表格选择 */
function handleSelectionChange(rows: RoleInfo[]) {
	selectedRows.value = rows;
}

/** 新增 */
function handleAdd() {
	isEdit.value = false;
	dialogTitle.value = "新增角色";
	Object.assign(formData, {
		roleName: "",
		roleCode: "",
		description: "",
		status: 1,
	});
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: RoleInfo) {
	isEdit.value = true;
	dialogTitle.value = "编辑角色";
	Object.assign(formData, {
		id: row.id,
		roleName: row.roleName,
		roleCode: row.roleCode,
		description: row.description,
		status: row.status,
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
				await updateRole(formData as AddRoleParams & { id: string });
				ElMessage.success("编辑成功");
			} else {
				// 新增
				await addRole(formData as AddRoleParams);
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
async function handleDelete(row: RoleInfo) {
	try {
		await deleteRole(row.id);
		ElMessage.success("删除成功");
		fetchData();
	} catch (error) {
		ElMessage.error("删除失败");
	}
}

/** 批量删除 */
async function handleBatchDelete() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning("请选择要删除的角色");
		return;
	}

	try {
		await ElMessageBox.confirm("确定删除选中的角色吗？", "提示", {
			type: "warning",
		});

		const ids = selectedRows.value.map((row) => row.id);
		await batchDeleteRole(ids);
		ElMessage.success("删除成功");
		fetchData();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error("删除失败");
		}
	}
}

/** 切换状态 */
async function handleToggleStatus(row: RoleInfo) {
	const newStatus = row.status === 1 ? 0 : 1;
	const action = newStatus === 1 ? "启用" : "禁用";

	try {
		await ElMessageBox.confirm(`确定${action}该角色吗？`, "提示", {
			type: "warning",
		});

		await updateRoleStatus(row.id, newStatus);
		ElMessage.success(`${action}成功`);
		fetchData();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error(`${action}失败`);
		}
	}
}

/** 权限设置 */
async function handlePermission(row: RoleInfo) {
	currentRoleId.value = row.id;

	try {
		// 获取角色已有权限
		const permissions = await getRolePermissions(row.id);
		checkedMenuIds.value = permissions || [];
		permissionVisible.value = true;
	} catch (error) {
		ElMessage.error("获取角色权限失败");
	}
}

/** 提交权限设置 */
async function handlePermissionSubmit() {
	if (!treeRef.value) return;

	submitLoading.value = true;
	try {
		// 获取选中的节点（包括半选中的父节点）
		const checkedKeys = treeRef.value.getCheckedKeys();
		const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
		const menuIds = [...checkedKeys, ...halfCheckedKeys];

		await assignPermission({
			roleId: currentRoleId.value,
			menuIds,
		});
		ElMessage.success("权限设置成功");
		permissionVisible.value = false;
	} catch (error) {
		ElMessage.error("权限设置失败");
	} finally {
		submitLoading.value = false;
	}
}

onMounted(() => {
	fetchData();
	fetchMenuTree();
});
</script>

<style scoped lang="scss">
.role-management {
	padding: 16px;
}
</style>
