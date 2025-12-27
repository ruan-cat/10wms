# 权限系统使用指南

本文档介绍如何在项目中使用权限系统，包括按钮级权限控制和动态路由加载。

## 1. 权限系统概述

项目采用基于 RBAC（Role-Based Access Control）的权限管理模型，支持：

- **路由级权限**：控制用户可以访问哪些页面
- **按钮级权限**：控制用户可以看到和操作哪些按钮
- **动态路由**：根据用户权限动态加载路由

## 2. 权限数据结构

### 2.1 菜单权限

菜单权限通过后端接口 `/sysmanager/menu/user-menus` 返回，数据结构如下：

```typescript
interface MenuDTO {
	id: string; // 菜单ID
	parentId: string; // 父菜单ID
	name: string; // 路由名称
	title: string; // 菜单标题
	path: string; // 路由路径
	component?: string; // 组件路径
	icon?: string; // 菜单图标
	type: "0" | "1" | "2"; // 类型：0-目录, 1-菜单, 2-按钮
	sort: number; // 排序
	hidden: boolean; // 是否隐藏
	permission?: string; // 权限标识（按钮类型使用）
	children?: MenuDTO[]; // 子菜单
}
```

### 2.2 权限标识规范

权限标识采用 `模块:功能:操作` 的格式，例如：

- `system:user:list` - 用户列表查询
- `system:user:add` - 新增用户
- `system:user:edit` - 编辑用户
- `system:user:delete` - 删除用户
- `system:user:resetPwd` - 重置密码
- `system:user:status` - 修改状态

## 3. 按钮权限控制

### 3.1 使用 v-perms 指令

`v-perms` 指令基于用户的 `permissions` 字段进行权限判断：

```vue
<template>
	<!-- 单个权限 -->
	<el-button v-perms="'system:user:add'" type="primary">新增</el-button>

	<!-- 多个权限（满足任意一个即可） -->
	<el-button v-perms="['system:user:edit', 'system:user:delete']" type="primary"> 编辑或删除 </el-button>
</template>
```

### 3.2 使用 v-auth 指令

`v-auth` 指令基于路由 `meta.auths` 字段进行权限判断：

```vue
<template>
	<el-button v-auth="'btn:add'" type="primary">新增</el-button>
</template>
```

### 3.3 使用 usePermission Composable

在 `<script setup>` 中进行权限判断：

```vue
<script setup lang="ts">
import { usePermission } from "@/composables/usePermission";

const { hasPermission, hasRole, isSuperAdmin } = usePermission();

// 检查单个权限
const canAdd = hasPermission("system:user:add");

// 检查多个权限
const canEdit = hasPermission(["system:user:edit", "system:user:update"]);

// 检查角色
const isAdmin = hasRole("admin");

// 检查是否是超级管理员
const isSuper = isSuperAdmin();
</script>

<template>
	<el-button v-if="canAdd" type="primary">新增</el-button>
</template>
```

## 4. 路由权限控制

### 4.1 路由元信息配置

在路由配置中添加权限信息：

```typescript
{
  path: '/system/user',
  name: 'SystemUser',
  component: () => import('@/views/system/user/index.vue'),
  meta: {
    title: '用户管理',
    icon: 'User',
    roles: ['admin', 'user'],  // 页面级权限（角色）
    auths: [                     // 按钮级权限
      'system:user:add',
      'system:user:edit',
      'system:user:delete'
    ]
  }
}
```

### 4.2 动态路由加载

系统会在用户登录后自动加载动态路由：

1. 调用 `/sysmanager/menu/user-menus` 获取用户菜单
2. 将菜单数据转换为路由配置
3. 提取按钮权限并存储到用户 store
4. 动态添加路由到路由表

## 5. 权限工具函数

### 5.1 checkPermission

检查用户是否有指定权限：

```typescript
import { checkPermission } from "@/utils/permission";

const userPermissions = ["system:user:add", "system:user:edit"];
const hasPermission = checkPermission(userPermissions, "system:user:add"); // true
```

### 5.2 transformMenusToRoutes

将菜单数据转换为路由配置：

```typescript
import { transformMenusToRoutes } from "@/utils/permission";

const menus = [
	/* 菜单数据 */
];
const routes = transformMenusToRoutes(menus);
```

### 5.3 extractButtonPermissions

从菜单中提取按钮权限：

```typescript
import { extractButtonPermissions } from "@/utils/permission";

const menus = [
	/* 菜单数据 */
];
const permissions = extractButtonPermissions(menus);
// ['system:user:add', 'system:user:edit', ...]
```

## 6. 完整示例

### 6.1 用户管理页面

```vue
<template>
	<div class="user-management">
		<!-- 操作按钮 -->
		<el-card shadow="never" class="mb-4">
			<el-button v-perms="'system:user:add'" type="primary" :icon="Plus" @click="handleAdd"> 新增用户 </el-button>
			<el-button
				v-perms="'system:user:delete'"
				type="danger"
				:icon="Delete"
				:disabled="!selectedRows.length"
				@click="handleBatchDelete"
			>
				批量删除
			</el-button>
		</el-card>

		<!-- 表格 -->
		<el-table :data="tableData">
			<el-table-column label="操作" width="280" align="center" fixed="right">
				<template #default="{ row }">
					<el-button v-perms="'system:user:edit'" type="primary" link @click="handleEdit(row)"> 编辑 </el-button>
					<el-button v-perms="'system:user:resetPwd'" type="warning" link @click="handleResetPassword(row)">
						重置密码
					</el-button>
					<el-popconfirm title="确定删除该用户吗？" @confirm="handleDelete(row)">
						<template #reference>
							<el-button v-perms="'system:user:delete'" type="danger" link>删除</el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import { Plus, Delete } from "@element-plus/icons-vue";
import { usePermission } from "@/composables/usePermission";

const { hasPermission } = usePermission();

// 在逻辑中使用权限判断
function handleOperation() {
	if (hasPermission("system:user:add")) {
		// 执行操作
	}
}
</script>
```

## 7. 权限配置建议

### 7.1 权限标识命名规范

- 使用小写字母和冒号
- 格式：`模块:功能:操作`
- 示例：
  - `system:user:list`
  - `system:role:add`
  - `base:goods:export`

### 7.2 超级管理员权限

超级管理员使用特殊权限标识 `*:*:*`，拥有所有权限。

### 7.3 权限分组

建议按模块对权限进行分组：

- **system** - 系统管理（用户、角色、菜单、部门）
- **base** - 基础数据（商品、客户、供应商）
- **inventory** - 库存管理
- **purchase** - 采购管理
- **outbound** - 出库管理

## 8. 注意事项

1. **权限指令的性能**：权限指令会在组件挂载时执行，如果没有权限会直接移除 DOM 元素
2. **动态权限更新**：如果需要动态更新权限，需要重新加载用户信息和菜单
3. **权限缓存**：权限信息会缓存在 localStorage 中，刷新页面后仍然有效
4. **权限失效**：退出登录时会清除所有权限信息

## 9. 调试技巧

### 9.1 查看当前用户权限

```typescript
import { useUserStoreHook } from "@/store/modules/user";

const userStore = useUserStoreHook();
console.log("用户权限:", userStore.permissions);
console.log("用户角色:", userStore.roles);
```

### 9.2 测试权限

在开发环境中，可以临时修改用户权限进行测试：

```typescript
const userStore = useUserStoreHook();
userStore.SET_PERMS(["system:user:add", "system:user:edit"]);
```

## 10. 常见问题

### Q1: 按钮权限不生效？

检查：

1. 用户是否已登录
2. 权限标识是否正确
3. 用户是否有对应权限
4. 指令是否正确注册

### Q2: 动态路由没有加载？

检查：

1. 菜单接口是否正常返回
2. 菜单数据结构是否正确
3. 路由守卫是否正确配置
4. 组件路径是否正确

### Q3: 刷新页面后权限丢失？

检查：

1. localStorage 中是否有权限数据
2. 路由守卫中是否正确恢复权限
3. token 是否过期

---

更多信息请参考：

- [Vue Router 官方文档](https://router.vuejs.org/)
- [Element Plus 官方文档](https://element-plus.org/)
- [Pure-Admin 官方文档](https://yiming_chang.gitee.io/pure-admin-doc/)
