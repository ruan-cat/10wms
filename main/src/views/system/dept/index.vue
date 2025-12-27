<template>
	<div class="dept-management">
		<!-- 搜索表单 -->
		<el-card shadow="never" class="mb-4">
			<el-form :model="searchForm" inline>
				<el-form-item label="部门名称">
					<el-input v-model="searchForm.deptName" placeholder="请输入部门名称" clearable style="width: 200px" />
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
			<el-button type="primary" :icon="Plus" @click="handleAdd()">新增部门</el-button>
			<el-button :icon="Refresh" @click="fetchData">刷新</el-button>
		</el-card>

		<!-- 表格 -->
		<el-card shadow="never">
			<el-table
				v-loading="loading"
				:data="tableData"
				row-key="id"
				border
				stripe
				default-expand-all
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				style="width: 100%"
			>
				<el-table-column prop="deptName" label="部门名称" min-width="200" show-overflow-tooltip />
				<el-table-column prop="deptCode" label="部门编码" min-width="150" show-overflow-tooltip />
				<el-table-column prop="orgType" label="组织类型" width="120" show-overflow-tooltip />
				<el-table-column prop="leader" label="负责人" width="120" show-overflow-tooltip />
				<el-table-column prop="phone" label="联系电话" width="130" show-overflow-tooltip />
				<el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
				<el-table-column prop="sort" label="排序" width="80" align="center" />
				<el-table-column label="状态" width="80" align="center">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? "启用" : "禁用" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="160" show-overflow-tooltip />
				<el-table-column label="操作" width="220" align="center" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link :icon="Plus" @click="handleAdd(row)">新增</el-button>
						<el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
						<el-popconfirm title="确定删除该部门吗？" @confirm="handleDelete(row)">
							<template #reference>
								<el-button type="danger" link :icon="Delete">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 新增/编辑对话框 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="700px"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="上级部门" prop="parentId">
							<el-tree-select
								v-model="formData.parentId"
								:data="deptTreeOptions"
								:props="{ label: 'deptName', children: 'children' }"
								node-key="id"
								check-strictly
								placeholder="请选择上级部门"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="部门名称" prop="deptName">
							<el-input v-model="formData.deptName" placeholder="请输入部门名称" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="部门编码" prop="deptCode">
							<el-input v-model="formData.deptCode" placeholder="请输入部门编码" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="组织类型">
							<el-input v-model="formData.orgType" placeholder="请输入组织类型" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="负责人">
							<el-input v-model="formData.leader" placeholder="请输入负责人" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系电话" prop="phone">
							<el-input v-model="formData.phone" placeholder="请输入联系电话" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="formData.email" placeholder="请输入邮箱" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序" prop="sort">
							<el-input-number v-model="formData.sort" :min="0" :max="9999" style="width: 100%" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="状态">
							<el-radio-group v-model="formData.status">
								<el-radio :value="1">启用</el-radio>
								<el-radio :value="0">禁用</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete } from "@element-plus/icons-vue";
import {
	getDeptTree,
	addDept,
	updateDept,
	deleteDept,
	getDeptUserCount,
	type DeptInfo,
	type DeptQueryParams,
	type AddDeptParams,
} from "@/api/system/dept";

defineOptions({
	name: "SystemDept",
});

/** 搜索表单 */
const searchForm = reactive<DeptQueryParams>({
	deptName: "",
	status: undefined,
});

/** 表格数据 */
const tableData = ref<DeptInfo[]>([]);
const loading = ref(false);

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const submitLoading = ref(false);

/** 表单 */
const formRef = ref<FormInstance>();
const formData = reactive<Partial<AddDeptParams & { id?: string }>>({
	parentId: "0",
	deptName: "",
	deptCode: "",
	orgType: "",
	leader: "",
	phone: "",
	email: "",
	sort: 0,
	status: 1,
});

/** 表单验证规则 */
const formRules: FormRules = {
	parentId: [{ required: true, message: "请选择上级部门", trigger: "change" }],
	deptName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
	deptCode: [{ required: true, message: "请输入部门编码", trigger: "blur" }],
	phone: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }],
	email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
	sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
};

/** 部门树选项 */
const deptTreeOptions = ref<DeptInfo[]>([]);

/** 获取数据 */
async function fetchData() {
	loading.value = true;
	try {
		const res = await getDeptTree(searchForm);
		tableData.value = res || [];
	} catch (error) {
		ElMessage.error("获取部门列表失败");
	} finally {
		loading.value = false;
	}
}

/** 获取部门树（用于选择上级部门） */
async function fetchDeptTree() {
	try {
		const res = await getDeptTree();
		// 添加根节点
		deptTreeOptions.value = [
			{
				id: "0",
				deptName: "根部门",
				deptCode: "ROOT",
				parentId: "",
				status: 1,
				children: res || [],
			} as DeptInfo,
		];
	} catch (error) {
		console.error("获取部门树失败", error);
	}
}

/** 搜索 */
function handleSearch() {
	fetchData();
}

/** 重置搜索 */
function handleReset() {
	searchForm.deptName = "";
	searchForm.status = undefined;
	fetchData();
}

/** 新增 */
async function handleAdd(row?: DeptInfo) {
	isEdit.value = false;
	dialogTitle.value = "新增部门";

	// 如果传入了父节点，则设置父节点ID
	const parentId = row ? row.id : "0";

	Object.assign(formData, {
		parentId,
		deptName: "",
		deptCode: "",
		orgType: "",
		leader: "",
		phone: "",
		email: "",
		sort: 0,
		status: 1,
	});

	await fetchDeptTree();
	dialogVisible.value = true;
}

/** 编辑 */
async function handleEdit(row: DeptInfo) {
	isEdit.value = true;
	dialogTitle.value = "编辑部门";

	Object.assign(formData, {
		id: row.id,
		parentId: row.parentId,
		deptName: row.deptName,
		deptCode: row.deptCode,
		orgType: row.orgType,
		leader: row.leader,
		phone: row.phone,
		email: row.email,
		sort: row.sort,
		status: row.status,
	});

	await fetchDeptTree();
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
				await updateDept(formData as AddDeptParams & { id: string });
				ElMessage.success("编辑成功");
			} else {
				// 新增
				await addDept(formData as AddDeptParams);
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
async function handleDelete(row: DeptInfo) {
	// 检查是否有子部门
	if (row.children && row.children.length > 0) {
		ElMessage.warning("该部门下有子部门，无法删除");
		return;
	}

	try {
		// 检查部门下是否有用户
		const userCount = await getDeptUserCount(row.id);
		if (userCount > 0) {
			ElMessage.warning(`该部门下有 ${userCount} 个用户，无法删除`);
			return;
		}

		await deleteDept(row.id);
		ElMessage.success("删除成功");
		fetchData();
	} catch (error) {
		ElMessage.error("删除失败");
	}
}

onMounted(() => {
	fetchData();
});
</script>

<style scoped lang="scss">
.dept-management {
	padding: 16px;
}
</style>
