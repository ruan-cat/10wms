# 2025-12-26 迁移快速开始指南

## 1. 前期准备

### 1.1 环境要求

- Node.js >= 22.14.0
- pnpm >= 10.16.1
- Git

### 1.2 创建迁移分支

```bash
# 在项目根目录
git checkout -b feature/migration-to-pure-admin
git push -u origin feature/migration-to-pure-admin
```

### 1.3 备份原项目

```bash
# 创建备份分支
git checkout -b backup/origin-before-migration
git push -u origin backup/origin-before-migration
git checkout feature/migration-to-pure-admin
```

## 2. 第一周：基础设施迁移

### 2.1 Day 1-2: HTTP 请求层适配

#### 步骤 1: 分析 Origin 的 HTTP 配置

```bash
# 查看 Origin 的 HTTP 配置
cat origin/src/plugins/http.js
cat origin/src/composables/use-request/createAxiosInstance.ts
```

#### 步骤 2: 适配到 Pure-Admin

```typescript
// main/src/utils/http/index.ts
// 1. 复制 Origin 的请求拦截器逻辑
// 2. 复制 Origin 的响应拦截器逻辑
// 3. 适配 Pure-Admin 的 HTTP 类

import { PureHttp } from "./types.d";

// 添加 Origin 的拦截器逻辑
class CustomHttp extends PureHttp {
	// 重写请求拦截器
	beforeRequestCallback(config) {
		// 从 Origin 复制逻辑
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	}

	// 重写响应拦截器
	beforeResponseCallback(response) {
		// 从 Origin 复制逻辑
		const { code, data, message } = response.data;
		if (code === 200) {
			return data;
		} else {
			ElMessage.error(message);
			return Promise.reject(new Error(message));
		}
	}
}

export const http = new CustomHttp();
```

#### 步骤 3: 测试 HTTP 请求

```typescript
// main/src/api/test.ts
import { http } from "@/utils/http";

// 测试 GET 请求
export const testGet = () => {
	return http.get("/api/test");
};

// 测试 POST 请求
export const testPost = (data: any) => {
	return http.post("/api/test", { data });
};
```

#### 验证清单

- [ ] 请求拦截器正常工作
- [ ] 响应拦截器正常工作
- [ ] Token 自动添加
- [ ] 错误统一处理
- [ ] 测试接口调用成功

### 2.2 Day 3-4: 状态管理适配

#### 步骤 1: 迁移用户状态

```typescript
// main/src/store/modules/user.ts
import { defineStore } from "pinia";
import { store } from "@/store";
import { storageLocal } from "@pureadmin/utils";

export const useUserStore = defineStore({
	id: "pure-user",
	state: () => ({
		// 从 Origin 复制状态结构
		token: storageLocal().getItem("token") ?? "",
		userInfo: storageLocal().getItem("userInfo") ?? null,
		menus: storageLocal().getItem("menus") ?? [],
		isLoaded: false,
	}),
	getters: {
		getToken(): string {
			return this.token;
		},
		getUserInfo() {
			return this.userInfo;
		},
		getMenus() {
			return this.menus;
		},
	},
	actions: {
		// 从 Origin 复制 actions
		async loadUser() {
			// 加载用户信息
		},
		async loadMenus() {
			// 加载菜单
		},
		setLoaded(loaded: boolean) {
			this.isLoaded = loaded;
		},
		// 登出
		logout() {
			this.token = "";
			this.userInfo = null;
			this.menus = [];
			this.isLoaded = false;
			storageLocal().removeItem("token");
			storageLocal().removeItem("userInfo");
			storageLocal().removeItem("menus");
		},
	},
});

export function useUserStoreHook() {
	return useUserStore(store);
}
```

#### 步骤 2: 测试状态管理

```vue
<!-- main/src/views/test/store-test.vue -->
<template>
	<div>
		<p>Token: {{ userStore.token }}</p>
		<p>UserInfo: {{ userStore.userInfo }}</p>
		<el-button @click="testLoad">加载用户信息</el-button>
		<el-button @click="testLogout">登出</el-button>
	</div>
</template>

<script setup lang="ts">
import { useUserStoreHook } from "@/store/modules/user";

const userStore = useUserStoreHook();

const testLoad = async () => {
	await userStore.loadUser();
	await userStore.loadMenus();
};

const testLogout = () => {
	userStore.logout();
};
</script>
```

#### 验证清单

- [ ] 状态持久化正常
- [ ] 用户信息加载正常
- [ ] 菜单加载正常
- [ ] 登出功能正常
- [ ] 状态在刷新后保持

### 2.3 Day 5: 路由系统适配

#### 步骤 1: 统一路由元信息

```typescript
// main/src/router/types.ts
declare module "vue-router" {
	interface RouteMeta {
		// Pure-Admin 原有的
		title?: string;
		icon?: string;
		showLink?: boolean;
		keepAlive?: boolean;
		roles?: Array<string>;

		// 从 Origin 添加的
		menuType?: "page" | "folder" | "ignore";
		text?: string;
		isSample?: boolean;
		order?: number;
	}
}
```

#### 步骤 2: 适配路由守卫

```typescript
// main/src/router/index.ts
router.beforeEach(async (to, from, next) => {
	// 1. 保留 Pure-Admin 的权限验证
	// 2. 添加 Origin 的登录验证逻辑

	// Origin 的登录验证
	if (to.name === "Login" || to.name === "NotFound") {
		next();
		return;
	}

	const userStore = useUserStoreHook();
	const token = userStore.getToken;

	if (token) {
		if (!userStore.isLoaded) {
			await userStore.loadUser();
			await userStore.loadMenus();
			userStore.setLoaded(true);
		}
		next();
	} else {
		next({ name: "Login" });
		ElMessage.warning("请先登录");
	}
});
```

#### 验证清单

- [ ] 路由跳转正常
- [ ] 登录验证正常
- [ ] 权限验证正常
- [ ] 菜单生成正常
- [ ] 标签页管理正常

## 3. 第二周：公共组件迁移

### 3.1 Day 1-2: 表格组件迁移

#### 步骤 1: 评估是否使用 @pureadmin/table

**建议**: 使用 `@pureadmin/table`，功能更强大

#### 步骤 2: 创建表格组件封装

```vue
<!-- main/src/components/Table/index.vue -->
<template>
	<pure-table
		ref="tableRef"
		:data="data"
		:columns="columns"
		:pagination="pagination"
		:loading="loading"
		@page-size-change="handleSizeChange"
		@page-current-change="handleCurrentChange"
	>
		<!-- 操作列插槽 -->
		<template #operation="{ row }">
			<slot name="operation" :row="row" />
		</template>
	</pure-table>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";

interface Props {
	data: any[];
	columns: any[];
	loading?: boolean;
	pagination?: PaginationProps;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
});

const emit = defineEmits(["page-change"]);

const handleSizeChange = (size: number) => {
	emit("page-change", { pageSize: size });
};

const handleCurrentChange = (page: number) => {
	emit("page-change", { currentPage: page });
};
</script>
```

#### 步骤 3: 创建使用示例

```vue
<!-- main/src/views/test/table-test.vue -->
<template>
	<div>
		<Table
			:data="tableData"
			:columns="columns"
			:loading="loading"
			:pagination="pagination"
			@page-change="handlePageChange"
		>
			<template #operation="{ row }">
				<el-button @click="handleEdit(row)">编辑</el-button>
				<el-button @click="handleDelete(row)">删除</el-button>
			</template>
		</Table>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Table from "@/components/Table/index.vue";

const tableData = ref([]);
const loading = ref(false);
const pagination = ref({
	total: 0,
	pageSize: 10,
	currentPage: 1,
});

const columns = [
	{ label: "ID", prop: "id" },
	{ label: "名称", prop: "name" },
	{ label: "操作", slot: "operation" },
];

const handlePageChange = ({ pageSize, currentPage }) => {
	if (pageSize) pagination.value.pageSize = pageSize;
	if (currentPage) pagination.value.currentPage = currentPage;
	loadData();
};

const loadData = async () => {
	loading.value = true;
	// 加载数据
	loading.value = false;
};
</script>
```

#### 验证清单

- [ ] 表格渲染正常
- [ ] 分页功能正常
- [ ] 加载状态正常
- [ ] 操作按钮正常
- [ ] 数据刷新正常

### 3.2 Day 3-4: 表单组件迁移

#### 步骤 1: 评估是否保留 Origin 的表单组件

**建议**: 保留 Origin 的 `base-form` 组件，功能已经很完善

#### 步骤 2: 迁移表单组件

```bash
# 复制组件文件
cp -r origin/src/components/base-form main/src/components/BaseForm

# 转换导入路径
tsx scripts/migration/transform-imports.ts main/src/components/BaseForm
```

#### 步骤 3: 适配样式

```vue
<!-- main/src/components/BaseForm/index.vue -->
<template>
	<el-form ref="formRef" :model="formData" :rules="rules" class="p-4">
		<!-- 使用 Tailwind CSS 类 -->
		<el-form-item v-for="item in formItems" :key="item.prop" :label="item.label" :prop="item.prop">
			<!-- 表单项内容 -->
		</el-form-item>
	</el-form>
</template>
```

#### 验证清单

- [ ] 表单渲染正常
- [ ] 表单验证正常
- [ ] 表单提交正常
- [ ] 样式显示正常

### 3.3 Day 5: 其他公共组件迁移

按照相同的方式迁移其他公共组件：

- [ ] 分页组件
- [ ] 对话框组件
- [ ] 搜索组件
- [ ] Excel 组件

## 4. 第三周：业务模块迁移（示例）

### 4.1 迁移用户管理模块

#### 步骤 1: 创建目录结构

```bash
mkdir -p main/src/views/system/user
mkdir -p main/src/api/system
```

#### 步骤 2: 迁移 API

```bash
# 复制 API 文件
cp origin/src/apis/sys-manager/user.ts main/src/api/system/user.ts

# 转换 API 调用
tsx scripts/migration/transform-api.ts main/src/api/system/user.ts
```

#### 步骤 3: 迁移页面

```bash
# 复制页面文件
cp -r origin/src/views/system-manage/user-management/* main/src/views/system/user/

# 转换导入路径
tsx scripts/migration/transform-imports.ts main/src/views/system/user
```

#### 步骤 4: 适配页面

```vue
<!-- main/src/views/system/user/index.vue -->
<template>
	<div class="p-4">
		<!-- 搜索区域 -->
		<div class="mb-4">
			<el-form :inline="true">
				<el-form-item label="用户名">
					<el-input v-model="searchForm.username" placeholder="请输入用户名" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!-- 操作按钮 -->
		<div class="mb-4">
			<el-button type="primary" @click="handleAdd">新增</el-button>
		</div>

		<!-- 表格 -->
		<Table
			:data="tableData"
			:columns="columns"
			:loading="loading"
			:pagination="pagination"
			@page-change="handlePageChange"
		>
			<template #operation="{ row }">
				<el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
				<el-button link type="danger" @click="handleDelete(row)">删除</el-button>
			</template>
		</Table>

		<!-- 新增/编辑对话框 -->
		<el-dialog v-model="dialogVisible" :title="dialogTitle">
			<BaseForm ref="formRef" :form-items="formItems" :form-data="formData" />
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Table from "@/components/Table/index.vue";
import BaseForm from "@/components/BaseForm/index.vue";
import { getUserList, addUser, updateUser, deleteUser } from "@/api/system/user";
import { ElMessage, ElMessageBox } from "element-plus";

// 搜索表单
const searchForm = ref({
	username: "",
});

// 表格数据
const tableData = ref([]);
const loading = ref(false);
const pagination = ref({
	total: 0,
	pageSize: 10,
	currentPage: 1,
});

// 表格列配置
const columns = [
	{ label: "ID", prop: "id" },
	{ label: "用户名", prop: "username" },
	{ label: "姓名", prop: "name" },
	{ label: "邮箱", prop: "email" },
	{ label: "操作", slot: "operation", width: 200 },
];

// 对话框
const dialogVisible = ref(false);
const dialogTitle = ref("新增用户");
const formData = ref({});

// 表单项配置
const formItems = [
	{ label: "用户名", prop: "username", type: "input", required: true },
	{ label: "姓名", prop: "name", type: "input", required: true },
	{ label: "邮箱", prop: "email", type: "input", required: true },
	{ label: "密码", prop: "password", type: "password", required: true },
];

// 加载数据
const loadData = async () => {
	loading.value = true;
	try {
		const { data, total } = await getUserList({
			...searchForm.value,
			pageSize: pagination.value.pageSize,
			currentPage: pagination.value.currentPage,
		});
		tableData.value = data;
		pagination.value.total = total;
	} catch (error) {
		ElMessage.error("加载数据失败");
	} finally {
		loading.value = false;
	}
};

// 搜索
const handleSearch = () => {
	pagination.value.currentPage = 1;
	loadData();
};

// 重置
const handleReset = () => {
	searchForm.value = { username: "" };
	handleSearch();
};

// 分页
const handlePageChange = ({ pageSize, currentPage }) => {
	if (pageSize) pagination.value.pageSize = pageSize;
	if (currentPage) pagination.value.currentPage = currentPage;
	loadData();
};

// 新增
const handleAdd = () => {
	dialogTitle.value = "新增用户";
	formData.value = {};
	dialogVisible.value = true;
};

// 编辑
const handleEdit = (row) => {
	dialogTitle.value = "编辑用户";
	formData.value = { ...row };
	dialogVisible.value = true;
};

// 删除
const handleDelete = async (row) => {
	try {
		await ElMessageBox.confirm("确定要删除该用户吗？", "提示", {
			type: "warning",
		});

		await deleteUser(row.id);
		ElMessage.success("删除成功");
		loadData();
	} catch (error) {
		// 用户取消
	}
};

// 提交
const handleSubmit = async () => {
	try {
		if (formData.value.id) {
			await updateUser(formData.value);
			ElMessage.success("更新成功");
		} else {
			await addUser(formData.value);
			ElMessage.success("新增成功");
		}
		dialogVisible.value = false;
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
};

onMounted(() => {
	loadData();
});
</script>
```

#### 步骤 5: 配置路由

```typescript
// main/src/router/modules/system.ts
export default {
	path: "/system",
	redirect: "/system/user",
	meta: {
		icon: "ri:settings-3-line",
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
			},
		},
	],
} satisfies RouteConfigsTable;
```

#### 验证清单

- [ ] 页面渲染正常
- [ ] 数据加载正常
- [ ] 搜索功能正常
- [ ] 新增功能正常
- [ ] 编辑功能正常
- [ ] 删除功能正常
- [ ] 分页功能正常

## 5. 测试和验证

### 5.1 功能测试清单

创建测试清单文件：

```markdown
# 功能测试清单

## 基础功能

- [ ] 登录功能
- [ ] 登出功能
- [ ] 菜单显示
- [ ] 路由跳转
- [ ] 权限控制

## 用户管理

- [ ] 用户列表
- [ ] 用户搜索
- [ ] 用户新增
- [ ] 用户编辑
- [ ] 用户删除
- [ ] 用户分页

## 角色管理

- [ ] 角色列表
- [ ] 角色搜索
- [ ] 角色新增
- [ ] 角色编辑
- [ ] 角色删除
- [ ] 权限分配

## 菜单管理

- [ ] 菜单列表
- [ ] 菜单树形结构
- [ ] 菜单新增
- [ ] 菜单编辑
- [ ] 菜单删除
```

### 5.2 性能测试

```bash
# 构建项目
pnpm build

# 分析打包体积
pnpm report

# 检查打包结果
ls -lh main/dist
```

### 5.3 兼容性测试

在以下浏览器中测试：

- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] Edge 最新版

## 6. 常见问题和解决方案

### 6.1 依赖冲突

**问题**: pnpm 安装依赖时报错

**解决方案**:

```bash
# 清理缓存
pnpm store prune

# 删除 node_modules
rm -rf node_modules

# 重新安装
pnpm install
```

### 6.2 路由不生效

**问题**: 页面无法访问

**解决方案**:

1. 检查路由配置是否正确
2. 检查路由元信息是否完整
3. 检查权限配置是否正确
4. 查看控制台错误信息

### 6.3 样式显示异常

**问题**: 页面样式错乱

**解决方案**:

1. 检查 Tailwind CSS 是否正确引入
2. 检查样式文件是否正确导入
3. 检查 CSS 类名是否正确
4. 使用浏览器开发工具检查样式

### 6.4 API 请求失败

**问题**: 接口调用失败

**解决方案**:

1. 检查 HTTP 配置是否正确
2. 检查 API 地址是否正确
3. 检查请求参数是否正确
4. 查看网络请求详情

## 7. 下一步计划

完成快速开始后，继续按照迁移方案进行：

1. **第 4-5 周**: 继续迁移其他业务模块
2. **第 6 周**: 迁移特殊功能（表单设计器、打印等）
3. **第 7-8 周**: 全面测试和优化
4. **第 9 周**: 准备上线

## 8. 总结

通过这个快速开始指南，你应该能够：

1. ✅ 完成基础设施迁移
2. ✅ 完成公共组件迁移
3. ✅ 完成第一个业务模块迁移
4. ✅ 掌握迁移的基本流程
5. ✅ 了解常见问题的解决方案

继续按照完整的迁移方案推进，逐步完成所有模块的迁移。
