<template>
	<div class="menu-management">
		<!-- 操作按钮 -->
		<el-card shadow="never" class="mb-4">
			<el-button type="primary" :icon="Plus" @click="handleAdd()">新增菜单</el-button>
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
				<el-table-column prop="title" label="菜单名称" min-width="200" show-overflow-tooltip />
				<el-table-column prop="name" label="路由名称" min-width="150" show-overflow-tooltip />
				<el-table-column prop="path" label="路由路径" min-width="150" show-overflow-tooltip />
				<el-table-column prop="component" label="组件路径" min-width="200" show-overflow-tooltip />
				<el-table-column label="菜单图标" width="100" align="center">
					<template #default="{ row }">
						<el-icon v-if="row.icon" :size="18">
							<component :is="row.icon" />
						</el-icon>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column label="菜单类型" width="100" align="center">
					<template #default="{ row }">
						<el-tag v-if="row.type === '0'" type="info">目录</el-tag>
						<el-tag v-else-if="row.type === '1'" type="success">菜单</el-tag>
						<el-tag v-else-if="row.type === '2'" type="warning">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="sort" label="排序" width="80" align="center" />
				<el-table-column label="是否隐藏" width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="row.hidden ? 'danger' : 'success'">
							{{ row.hidden ? "是" : "否" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="permission" label="权限标识" min-width="150" show-overflow-tooltip />
				<el-table-column label="操作" width="220" align="center" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link :icon="Plus" @click="handleAdd(row)">新增</el-button>
						<el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
						<el-popconfirm title="确定删除该菜单吗？" @confirm="handleDelete(row)">
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
						<el-form-item label="上级菜单" prop="parentId">
							<el-tree-select
								v-model="formData.parentId"
								:data="menuTreeOptions"
								:props="{ label: 'title', children: 'children' }"
								node-key="id"
								check-strictly
								placeholder="请选择上级菜单"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="菜单类型" prop="type">
							<el-radio-group v-model="formData.type">
								<el-radio value="0">目录</el-radio>
								<el-radio value="1">菜单</el-radio>
								<el-radio value="2">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="菜单名称" prop="title">
							<el-input v-model="formData.title" placeholder="请输入菜单名称" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="路由名称" prop="name">
							<el-input v-model="formData.name" placeholder="请输入路由名称" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="路由路径" prop="path">
							<el-input v-model="formData.path" placeholder="请输入路由路径" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="组件路径" prop="component" v-if="formData.type === '1'">
							<el-input v-model="formData.component" placeholder="请输入组件路径" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="菜单图标" v-if="formData.type !== '2'">
							<el-input v-model="formData.icon" placeholder="请输入图标名称">
								<template #prefix>
									<el-icon v-if="formData.icon">
										<component :is="formData.icon" />
									</el-icon>
								</template>
							</el-input>
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
						<el-form-item label="权限标识" v-if="formData.type === '2'">
							<el-input v-model="formData.permission" placeholder="请输入权限标识" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否隐藏">
							<el-switch v-model="formData.hidden" />
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
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Plus, Edit, Delete, Refresh } from "@element-plus/icons-vue";
import {
	getMenuList,
	getMenuTree,
	addMenu,
	updateMenu,
	deleteMenu,
	type MenuDTO,
	type AddMenuParams,
} from "@/api/system/menu";

defineOptions({
	name: "SystemMenu",
});

/** 表格数据 */
const tableData = ref<MenuDTO[]>([]);
const loading = ref(false);

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const submitLoading = ref(false);

/** 表单 */
const formRef = ref<FormInstance>();
const formData = reactive<Partial<AddMenuParams & { id?: string }>>({
	parentId: "0",
	name: "",
	title: "",
	path: "",
	component: "",
	icon: "",
	type: "1",
	sort: 0,
	hidden: false,
	permission: "",
});

/** 表单验证规则 */
const formRules: FormRules = {
	parentId: [{ required: true, message: "请选择上级菜单", trigger: "change" }],
	title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
	name: [{ required: true, message: "请输入路由名称", trigger: "blur" }],
	path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
	type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
	sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
};

/** 菜单树选项 */
const menuTreeOptions = ref<MenuDTO[]>([]);

/** 获取数据 */
async function fetchData() {
	loading.value = true;
	try {
		const res = await getMenuList();
		tableData.value = res || [];
	} catch (error) {
		ElMessage.error("获取菜单列表失败");
	} finally {
		loading.value = false;
	}
}

/** 获取菜单树（用于选择上级菜单） */
async function fetchMenuTree(excludeId?: string) {
	try {
		const res = await getMenuTree(excludeId);
		// 添加根节点
		menuTreeOptions.value = [
			{
				id: "0",
				title: "根目录",
				name: "root",
				path: "/",
				type: "0",
				sort: 0,
				hidden: false,
				parentId: "",
				createTime: "",
				updateTime: "",
				children: res || [],
			},
		];
	} catch (error) {
		console.error("获取菜单树失败", error);
	}
}

/** 新增 */
async function handleAdd(row?: MenuDTO) {
	isEdit.value = false;
	dialogTitle.value = "新增菜单";

	// 如果传入了父节点，则设置父节点ID
	const parentId = row ? row.id : "0";

	Object.assign(formData, {
		parentId,
		name: "",
		title: "",
		path: "",
		component: "",
		icon: "",
		type: "1",
		sort: 0,
		hidden: false,
		permission: "",
	});

	await fetchMenuTree();
	dialogVisible.value = true;
}

/** 编辑 */
async function handleEdit(row: MenuDTO) {
	isEdit.value = true;
	dialogTitle.value = "编辑菜单";

	Object.assign(formData, {
		id: row.id,
		parentId: row.parentId,
		name: row.name,
		title: row.title,
		path: row.path,
		component: row.component,
		icon: row.icon,
		type: row.type,
		sort: row.sort,
		hidden: row.hidden,
		permission: row.permission,
	});

	// 获取菜单树时排除当前节点及其子节点
	await fetchMenuTree(row.id);
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
				await updateMenu(formData as AddMenuParams & { id: string });
				ElMessage.success("编辑成功");
			} else {
				// 新增
				await addMenu(formData as AddMenuParams);
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
async function handleDelete(row: MenuDTO) {
	// 检查是否有子菜单
	if (row.children && row.children.length > 0) {
		ElMessage.warning("该菜单下有子菜单，无法删除");
		return;
	}

	try {
		await deleteMenu(row.id);
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
.menu-management {
	padding: 16px;
}
</style>
