# 2025-12-28 修复首页布局问题

## 1. 问题描述

首页 `http://localhost:8080/#/welcome` 因为失去布局组件，导致页面没有侧边栏和导航栏，页面效果不好。

## 2. 问题原因

在 `main/src/router/modules/home.ts` 文件中，`newHomeRoute2` 路由配置的父路由缺少 `component: Layout` 配置，导致页面无法渲染布局组件。

### 2.1 错误的配置

```typescript
const newHomeRoute2 = {
	path: "/",
	name: "Home",
	// 业务变更 按照布局组件要求 路由不应该配置任何布局组件
	// component: Layout,  // ❌ 被注释掉了
	redirect: "/welcome",
	meta: {
		icon: "ep/home-filled",
		title: $t("menus.pureHome"),
		rank: RouterOrderEnums.home,
		layout: "index", // ❌ 这个属性不起作用
	},
	children: [
		{
			path: "/welcome",
			name: "Welcome",
			component: () => import("@/views/welcome/index.vue"),
			meta: {
				title: $t("menus.pureHome"),
				showLink: VITE_HIDE_HOME === "true" ? false : true,
			},
		},
	],
} satisfies RouteConfigsTable;
```

## 3. 解决方案

### 3.1 恢复布局组件配置

在父路由中恢复 `component: Layout` 配置，确保子路由能够正确渲染在布局组件中。

### 3.2 正确的配置

```typescript
const newHomeRoute2 = {
	path: "/",
	name: "Home",
	component: Layout, // ✅ 恢复布局组件
	redirect: "/welcome",
	meta: {
		icon: "ep/home-filled",
		title: $t("menus.pureHome"),
		rank: RouterOrderEnums.home,
	},
	children: [
		{
			path: "/welcome",
			name: "Welcome",
			component: () => import("@/views/welcome/index.vue"),
			meta: {
				title: $t("menus.pureHome"),
				showLink: VITE_HIDE_HOME === "true" ? false : true,
			},
		},
	],
} satisfies RouteConfigsTable;
```

## 4. Pure-Admin 路由布局规范

### 4.1 布局组件的作用

在 Pure-Admin 框架中，布局组件（`Layout`）负责渲染：

|    组件    |              说明               |
| :--------: | :-----------------------------: |
|   侧边栏   |            导航菜单             |
| 顶部导航栏 |       面包屑、用户信息等        |
|   标签页   |          多标签页管理           |
| 主体内容区 | 通过 `<router-view>` 渲染子路由 |

### 4.2 路由配置规范

#### 需要布局的路由

对于需要显示侧边栏和导航栏的页面，必须配置布局组件：

```typescript
{
	path: "/",
	name: "Parent",
	component: Layout,  // ✅ 必须配置
	redirect: "/child",
	children: [
		{
			path: "/child",
			name: "Child",
			component: () => import("@/views/child/index.vue"),
		},
	],
}
```

#### 不需要布局的路由

对于登录页、404 页等不需要布局的页面，不配置布局组件：

```typescript
{
	path: "/login",
	name: "Login",
	component: () => import("@/views/login/index.vue"),  // ✅ 直接配置页面组件
}
```

## 5. 修改文件清单

|             文件路径              |           修改内容            |  状态   |
| :-------------------------------: | :---------------------------: | :-----: |
| `main/src/router/modules/home.ts` | 恢复 `component: Layout` 配置 | ✅ 完成 |

## 6. 验证步骤

1. 启动开发服务器：`cd main && pnpm serve`
2. 访问首页：`http://localhost:8080/#/welcome`
3. 验证页面显示：
   - ✅ 侧边栏正常显示
   - ✅ 顶部导航栏正常显示
   - ✅ 标签页正常显示
   - ✅ 主体内容正常显示

## 7. 注意事项

### 7.1 布局组件的必要性

在 Pure-Admin 框架中，几乎所有的业务页面都需要布局组件。只有以下几种情况不需要：

- 登录页
- 404/403 等错误页
- 独立的全屏页面（如大屏展示）

### 7.2 路由层级结构

Pure-Admin 推荐的路由结构：

```plain
父路由（配置 Layout）
  └── 子路由（配置页面组件）
```

不要将布局组件和页面组件配置在同一级路由上。

## 8. 相关文档

- Pure-Admin 路由文档：https://pure-admin.cn/pages/routerMenu/
- Vue Router 嵌套路由：https://router.vuejs.org/zh/guide/essentials/nested-routes.html

## 9. 总结

通过恢复 `component: Layout` 配置，成功修复了首页布局问题。这个问题提醒我们，在 Pure-Admin 框架中，布局组件是必不可少的，不能随意注释或删除。
