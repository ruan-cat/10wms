# 2025-12-28 业务模块迁移指南

## 1. 概述

本文档提供业务模块从 Origin 项目迁移到 Main 项目的详细指南。业务模块迁移包括页面组件、路由配置、状态管理和 API 调用的迁移。

## 2. 迁移策略

### 2.1 分阶段迁移

根据业务优先级分阶段迁移：

| 阶段 |   模块   | 优先级 |            说明            |
| :--: | :------: | :----: | :------------------------: |
|  P0  | 系统管理 |  最高  | 用户、角色、菜单、部门管理 |
|  P1  | 基础数据 |   高   |   商品、客户、供应商管理   |
|  P2  | 业务功能 |   中   |    采购、库存、出库管理    |
|  P3  | 辅助功能 |   低   |        配置、报表等        |

### 2.2 迁移原则

1. **保持功能一致**：确保迁移后功能与原系统一致
2. **优化用户体验**：利用 Pure-Admin 的组件优化界面
3. **提升代码质量**：使用 TypeScript、组合式 API
4. **统一设计规范**：遵循 Pure-Admin 的设计规范

## 3. 页面迁移步骤

### 3.1 步骤 1：分析原页面

**需要分析的内容：**

- 页面功能（列表、新增、编辑、删除等）
- 使用的组件（表格、表单、对话框等）
- API 调用
- 状态管理
- 路由配置

### 3.2 步骤 2：创建目录结构

```bash
# 创建页面目录
mkdir -p main/src/views/system/user
mkdir -p main/src/views/system/role
mkdir -p main/src/views/system/menu
mkdir -p main/src/views/system/dept
```

### 3.3 步骤 3：迁移页面组件

**基本结构：**

```vue
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
// 导入 API
import { getUserList, addUser, updateUser, deleteUser } from "@/api/system/user";
// 导入类型
import type { UserDTO, AddUserParams } from "@/api/system/user";

// 状态定义
const loading = ref(false);
const tableData = ref<UserDTO[]>([]);
const total = ref(0);
const queryParams = reactive({
	page: 1,
	size: 10,
	username: "",
});

// 加载数据
const loadData = async () => {
	loading.value = true;
	try {
		const result = await getUserList(queryParams);
		tableData.value = result.list;
		total.value = result.total;
	} catch (error) {
		ElMessage.error("加载数据失败");
	} finally {
		loading.value = false;
	}
};

// 页面加载时获取数据
onMounted(() => {
	loadData();
});
</script>

<template>
	<div class="page-container">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<!-- 搜索表单 -->
		</el-card>

		<!-- 表格区域 -->
		<el-card shadow="never" class="table-card">
			<!-- 工具栏 -->
			<div class="toolbar">
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</div>

			<!-- 表格 -->
			<el-table :data="tableData" :loading="loading">
				<!-- 表格列 -->
			</el-table>

			<!-- 分页 -->
			<el-pagination
				v-model:current-page="queryParams.page"
				v-model:page-size="queryParams.size"
				:total="total"
				@current-change="loadData"
				@size-change="loadData"
			/>
		</el-card>

		<!-- 对话框 -->
		<el-dialog v-model="dialogVisible" :title="dialogTitle">
			<!-- 表单 -->
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.page-container {
	padding: 16px;
}

.search-card {
	margin-bottom: 16px;
}

.toolbar {
	margin-bottom: 16px;
}
</style>
```

### 3.4 步骤 4：配置路由

```typescript
// main/src/router/modules/system.ts
export default {
	path: "/system",
	redirect: "/system/user",
	meta: {
		icon: "ep:setting",
		title: "系统管理",
		rank: 10,
	},
	children: [
		{
			path: "/system/user",
			name: "SystemUser",
			component: () => import("@/views/system/user/index.vue"),
			meta: {
				title: "用户管理",
				roles: ["admin"],
			},
		},
		{
			path: "/system/role",
			name: "SystemRole",
			component: () => import("@/views/system/role/index.vue"),
			meta: {
				title: "角色管理",
				roles: ["admin"],
			},
		},
		{
			path: "/system/menu",
			name: "SystemMenu",
			component: () => import("@/views/system/menu/index.vue"),
			meta: {
				title: "菜单管理",
				roles: ["admin"],
			},
		},
		{
			path: "/system/dept",
			name: "SystemDept",
			component: () => import("@/views/system/dept/index.vue"),
			meta: {
				title: "部门管理",
				roles: ["admin"],
			},
		},
	],
} as RouteConfigsTable;
```

### 3.5 步骤 5：测试功能

- [ ] 页面正常加载
- [ ] 数据正常显示
- [ ] 搜索功能正常
- [ ] 新增功能正常
- [ ] 编辑功能正常
- [ ] 删除功能正常
- [ ] 分页功能正常
- [ ] 权限控制正常

## 4. 用户管理模块迁移示例

### 4.1 页面功能分析

**功能列表：**

- 用户列表展示（分页、搜索）
- 新增用户
- 编辑用户
- 删除用户
- 批量删除
- 重置密码
- 启用/禁用用户
- 分配角色

**使用的组件：**

- 表格组件（@pureadmin/table）
- 表单组件（BaseForm）
- 对话框组件（DialogPromise）
- 分页组件（Pagination）

### 4.2 完整示例代码

由于代码较长，这里提供关键部分的示例。完整代码请参考后续创建的示例文件。

**关键功能实现：**

```typescript
// 搜索功能
const handleSearch = () => {
	queryParams.page = 1;
	loadData();
};

// 重置搜索
const handleReset = () => {
	Object.assign(queryParams, {
		page: 1,
		size: 10,
		username: "",
		realname: "",
		status: "",
	});
	loadData();
};

// 新增用户
const handleAdd = () => {
	dialogTitle.value = "新增用户";
	dialogVisible.value = true;
	formData.value = {
		username: "",
		password: "",
		realname: "",
		email: "",
		mobilePhone: "",
		departmentIds: [],
		roleIds: [],
	};
};

// 编辑用户
const handleEdit = async (row: UserDTO) => {
	dialogTitle.value = "编辑用户";
	dialogVisible.value = true;

	// 获取用户详情
	const detail = await getUserDetail(row.id);
	formData.value = {
		...detail,
		password: "", // 编辑时不显示密码
	};
};

// 删除用户
const handleDelete = (row: UserDTO) => {
	ElMessageBox.confirm(`确定要删除用户"${row.realname}"吗？`, "提示", {
		type: "warning",
	})
		.then(async () => {
			await deleteUser(row.id);
			ElMessage.success("删除成功");
			loadData();
		})
		.catch(() => {});
};

// 批量删除
const handleBatchDelete = () => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning("请选择要删除的用户");
		return;
	}

	ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个用户吗？`, "提示", {
		type: "warning",
	})
		.then(async () => {
			const userIds = selectedRows.value.map((row) => row.id);
			await batchDeleteUsers(userIds);
			ElMessage.success("删除成功");
			loadData();
		})
		.catch(() => {});
};

// 重置密码
const handleResetPassword = (row: UserDTO) => {
	ElMessageBox.prompt("请输入新密码", "重置密码", {
		inputType: "password",
		inputValidator: (value) => {
			if (!value) return "密码不能为空";
			if (value.length < 6) return "密码长度不能少于6位";
			return true;
		},
	})
		.then(async ({ value }) => {
			await resetPassword({
				userId: row.id,
				newPassword: value,
			});
			ElMessage.success("密码重置成功");
		})
		.catch(() => {});
};

// 启用/禁用用户
const handleToggleStatus = async (row: UserDTO) => {
	const newStatus = row.status === "1" ? "0" : "1";
	const action = newStatus === "1" ? "启用" : "禁用";

	try {
		await toggleUserStatus(row.id, newStatus);
		ElMessage.success(`${action}成功`);
		row.status = newStatus;
	} catch (error) {
		ElMessage.error(`${action}失败`);
	}
};

// 提交表单
const handleSubmit = async () => {
	// 表单验证
	if (!formData.value.username) {
		ElMessage.warning("请输入用户名");
		return;
	}

	try {
		if (dialogTitle.value === "新增用户") {
			await addUser(formData.value);
			ElMessage.success("新增成功");
		} else {
			await updateUser(formData.value.id, formData.value);
			ElMessage.success("更新成功");
		}

		dialogVisible.value = false;
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
};
```

## 5. 组件使用指南

### 5.1 表格组件

**使用 @pureadmin/table：**

```vue
<template>
	<pure-table
		:data="tableData"
		:columns="columns"
		:loading="loading"
		:pagination="pagination"
		@page-size-change="handleSizeChange"
		@page-current-change="handleCurrentChange"
	>
		<template #operation="{ row }">
			<el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
			<el-button link type="danger" @click="handleDelete(row)">删除</el-button>
		</template>
	</pure-table>
</template>

<script setup lang="ts">
const columns: TableColumnList = [
	{
		label: "用户名",
		prop: "username",
		minWidth: 120,
	},
	{
		label: "姓名",
		prop: "realname",
		minWidth: 120,
	},
	{
		label: "邮箱",
		prop: "email",
		minWidth: 180,
	},
	{
		label: "手机号",
		prop: "mobilePhone",
		minWidth: 120,
	},
	{
		label: "状态",
		prop: "status",
		minWidth: 80,
		cellRenderer: ({ row }) => (
			<el-tag type={row.status === "1" ? "success" : "danger"}>{row.status === "1" ? "启用" : "禁用"}</el-tag>
		),
	},
	{
		label: "操作",
		fixed: "right",
		width: 200,
		slot: "operation",
	},
];

const pagination = reactive({
	total: 0,
	pageSize: 10,
	currentPage: 1,
});
</script>
```

### 5.2 表单组件

**使用 BaseForm：**

```vue
<template>
	<BaseForm
		:form-items="formItems"
		:form-data="formData"
		:label-width="100"
		@submit="handleSubmit"
		@reset="handleReset"
	/>
</template>

<script setup lang="ts">
const formItems = [
	{
		type: "input",
		prop: "username",
		label: "用户名",
		required: true,
		placeholder: "请输入用户名",
	},
	{
		type: "input",
		prop: "password",
		label: "密码",
		required: true,
		inputType: "password",
		placeholder: "请输入密码",
	},
	{
		type: "input",
		prop: "realname",
		label: "姓名",
		placeholder: "请输入姓名",
	},
	{
		type: "input",
		prop: "email",
		label: "邮箱",
		placeholder: "请输入邮箱",
	},
	{
		type: "input",
		prop: "mobilePhone",
		label: "手机号",
		placeholder: "请输入手机号",
	},
	{
		type: "select",
		prop: "departmentIds",
		label: "部门",
		multiple: true,
		options: departmentOptions,
		placeholder: "请选择部门",
	},
	{
		type: "select",
		prop: "roleIds",
		label: "角色",
		multiple: true,
		options: roleOptions,
		placeholder: "请选择角色",
	},
];
</script>
```

### 5.3 对话框组件

**使用 DialogPromise：**

```vue
<template>
	<DialogPromise
		ref="dialogRef"
		:on-dialog-close="handleDialogClose"
		:dialog-props="{ title: dialogTitle, width: '600px' }"
	>
		<template #default>
			<BaseForm ref="formRef" :form-items="formItems" :form-data="formData" />
		</template>

		<template #footer="{ resolve, reject }">
			<el-button @click="reject()">取消</el-button>
			<el-button type="primary" @click="handleSubmit(resolve)">确定</el-button>
		</template>
	</DialogPromise>
</template>

<script setup lang="ts">
const dialogRef = ref();

// 打开对话框
const openDialog = async () => {
	try {
		const result = await dialogRef.value.open();
		console.log("用户确认:", result);
	} catch {
		console.log("用户取消");
	}
};

// 处理对话框关闭
const handleDialogClose = async ({ resolve, reject }) => {
	// 返回 true 允许关闭，false 阻止关闭
	return true;
};
</script>
```

## 6. 常见问题和解决方案

### 6.1 表格数据不显示

**问题：** 表格组件渲染但没有数据

**解决方案：**

1. 检查 API 调用是否成功
2. 检查数据格式是否正确
3. 检查列配置的 prop 是否与数据字段匹配

### 6.2 表单验证不生效

**问题：** 表单提交时验证规则不生效

**解决方案：**

1. 确保表单项配置了 required 属性
2. 使用 el-form 的 validate 方法
3. 检查表单数据绑定是否正确

### 6.3 路由跳转失败

**问题：** 点击菜单后页面不跳转

**解决方案：**

1. 检查路由配置是否正确
2. 检查路由权限配置
3. 检查路由守卫逻辑

### 6.4 权限控制不生效

**问题：** 按钮权限控制不生效

**解决方案：**

1. 使用 v-auth 或 v-perms 指令
2. 检查用户权限数据是否正确
3. 检查权限指令是否正确注册

## 7. 性能优化建议

### 7.1 列表页面优化

1. **虚拟滚动**：大数据量时使用虚拟滚动
2. **懒加载**：图片等资源使用懒加载
3. **防抖节流**：搜索输入使用防抖
4. **缓存数据**：合理使用缓存减少请求

### 7.2 表单优化

1. **异步验证**：使用异步验证规则
2. **动态表单**：根据条件动态显示表单项
3. **表单缓存**：编辑时缓存原始数据

### 7.3 路由优化

1. **懒加载**：所有路由使用懒加载
2. **预加载**：关键路由使用预加载
3. **缓存页面**：使用 keep-alive 缓存页面

## 8. 测试建议

### 8.1 功能测试

- [ ] 列表加载
- [ ] 搜索功能
- [ ] 分页功能
- [ ] 新增功能
- [ ] 编辑功能
- [ ] 删除功能
- [ ] 批量操作
- [ ] 权限控制

### 8.2 兼容性测试

- [ ] Chrome 浏览器
- [ ] Firefox 浏览器
- [ ] Safari 浏览器
- [ ] Edge 浏览器

### 8.3 性能测试

- [ ] 首屏加载时间
- [ ] 列表渲染性能
- [ ] 表单提交响应时间

## 9. 迁移检查清单

### 9.1 页面迁移

- [ ] 创建页面目录
- [ ] 创建页面组件
- [ ] 实现列表功能
- [ ] 实现搜索功能
- [ ] 实现新增功能
- [ ] 实现编辑功能
- [ ] 实现删除功能
- [ ] 实现其他功能
- [ ] 适配样式
- [ ] 测试功能

### 9.2 路由配置

- [ ] 添加路由配置
- [ ] 配置路由元信息
- [ ] 配置权限控制
- [ ] 测试路由跳转

### 9.3 API 调用

- [ ] 创建 API 文件
- [ ] 定义类型接口
- [ ] 实现 API 调用
- [ ] 测试 API 功能

### 9.4 状态管理

- [ ] 创建 Store 模块（如需要）
- [ ] 定义状态
- [ ] 实现 Actions
- [ ] 测试状态管理

## 10. 总结

业务模块迁移是一个系统性工程，需要：

1. **充分分析**：分析原页面功能和实现
2. **合理规划**：按优先级分阶段迁移
3. **统一规范**：遵循 Pure-Admin 的设计规范
4. **充分测试**：确保迁移后功能正常
5. **持续优化**：迁移后持续优化性能和体验

建议采用渐进式迁移策略，先迁移核心功能，再逐步迁移其他模块。每个模块迁移完成后都要进行充分测试，确保功能正常。

