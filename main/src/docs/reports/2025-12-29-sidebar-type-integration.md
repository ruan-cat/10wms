# 2025-12-29 侧边栏类型区分功能集成完成报告

## 1. 任务概述

将已实现的侧边栏类型区分功能集成到实际的侧边栏组件中，实现主业务页面和框架示例页面的菜单分离显示。

## 2. 集成内容

### 2.1 修改的组件

|                          组件路径                          |              修改内容               |                    说明                     |
| :--------------------------------------------------------: | :---------------------------------: | :-----------------------------------------: |
|     `main/src/layout/components/lay-navbar/index.vue`      | 添加 `<SidebarTypeSwitcher />` 组件 |      在垂直布局的导航栏中添加切换入口       |
|  `main/src/layout/components/lay-sidebar/NavVertical.vue`  |          集成路由过滤逻辑           |  使用 `filterRoutesBySidebarType` 过滤菜单  |
| `main/src/layout/components/lay-sidebar/NavHorizontal.vue` |          集成路由过滤逻辑           |  使用 `filterRoutesBySidebarType` 过滤菜单  |
|      `main/src/composables/use-sidebar-type/index.ts`      |            优化类型定义             | 使用泛型支持 `menuType` 和 `RouteRecordRaw` |

### 2.2 类型优化

**问题**：原实现使用 `RouteRecordRaw` 类型，但 `wholeMenus` 实际存储的是 `menuType` 类型。

**解决方案**：

1. 定义通用的 `RouteMenuItem` 类型，兼容两种类型结构
2. 使用泛型 `<T extends RouteMenuItem>` 使 `filterRoutesBySidebarType` 支持任意兼容类型
3. 保持类型推断，输入什么类型返回什么类型

```typescript
/** 路由/菜单项类型（兼容 RouteRecordRaw 和 menuType） */
type RouteMenuItem = {
	path?: string;
	children?: RouteMenuItem[];
	meta?: {
		sidebarType?: SidebarType;
		[key: string]: any;
	};
	[key: string]: any;
};

function filterRoutesBySidebarType<T extends RouteMenuItem>(routes: T[], type?: SidebarType): T[];
```

### 2.3 集成逻辑

#### 2.3.1 NavVertical.vue（垂直侧边栏）

```typescript
import { useSidebarType } from "@/composables/use-sidebar-type";

const { filterRoutesBySidebarType, currentSidebarType } = useSidebarType();

const menuData = computed(() => {
	const baseMenus =
		pureApp.layout === "mix" && device.value !== "mobile" ? subMenuData.value : usePermissionStoreHook().wholeMenus;
	return filterRoutesBySidebarType(baseMenus, currentSidebarType.value);
});
```

#### 2.3.2 NavHorizontal.vue（水平侧边栏）

```typescript
import { useSidebarType } from "@/composables/use-sidebar-type";

const { filterRoutesBySidebarType, currentSidebarType } = useSidebarType();

const filteredMenus = computed(() => {
	return filterRoutesBySidebarType(usePermissionStoreHook().wholeMenus, currentSidebarType.value);
});
```

#### 2.3.3 lay-navbar/index.vue（导航栏）

```vue
<template>
	<div v-if="layout === 'vertical'" class="vertical-header-right">
		<!-- 侧边栏类型切换 -->
		<SidebarTypeSwitcher />
		<!-- 其他组件... -->
	</div>
</template>
```

## 3. 功能特性

### 3.1 自动过滤

- 侧边栏组件自动根据当前侧边栏类型过滤菜单
- 支持递归过滤子路由
- 保留包含匹配子路由的父路由

### 3.2 状态持久化

- 切换状态保存到 `localStorage`
- 刷新页面后保持上次选择的侧边栏类型
- 默认显示主业务侧边栏

### 3.3 响应式更新

- 切换侧边栏类型时，菜单立即更新
- 使用 Vue 的响应式系统，无需手动刷新

## 4. 路由归属规则

### 4.1 约定式配置（默认）

根据路由文件存储位置自动判断：

|         路由文件位置         |       侧边栏类型       |     说明     |
| :--------------------------: | :--------------------: | :----------: |
|  `router/modules/business/`  |   `wmsBusinessPage`    |  主业务页面  |
| `router/modules/pure-admin/` | `pureAdminExamplePage` | 框架示例页面 |

### 4.2 显式配置（优先级更高）

在路由的 `meta` 中指定 `sidebarType`：

```typescript
{
	path: "/custom-page",
	meta: {
		title: "自定义页面",
		sidebarType: "wmsBusinessPage" // 显式指定
	}
}
```

### 4.3 路径特征判断（兜底）

对于没有文件路径信息的路由，根据路径特征判断：

- `/components`, `/able`, `/form` 等 → `pureAdminExamplePage`
- 其他路径 → `wmsBusinessPage`（默认）

## 5. 使用说明

### 5.1 用户操作

1. 在导航栏找到侧边栏类型切换器（垂直布局）
2. 点击切换按钮，在"主业务"和"案例示例"之间切换
3. 侧边栏菜单自动更新，只显示对应类型的页面

### 5.2 开发者配置

**为新路由指定侧边栏类型**：

```typescript
// 方式1：约定式（推荐）
// 将路由文件放在对应目录
// business/ → 主业务
// pure-admin/ → 案例示例

// 方式2：显式配置
{
	path: "/my-page",
	meta: {
		sidebarType: "wmsBusinessPage" // 或 "pureAdminExamplePage"
	}
}
```

## 6. 测试验证

### 6.1 类型检查

```log
✓ main/src/composables/use-sidebar-type/index.ts: No diagnostics found
✓ main/src/layout/components/lay-navbar/index.vue: No diagnostics found
✓ main/src/layout/components/lay-sidebar/NavHorizontal.vue: No diagnostics found
✓ main/src/layout/components/lay-sidebar/NavVertical.vue: No diagnostics found
```

### 6.2 功能测试建议

1. **切换测试**：点击切换器，验证菜单是否正确切换
2. **持久化测试**：切换后刷新页面，验证状态是否保持
3. **路由测试**：验证不同目录的路由是否归属到正确的侧边栏类型
4. **布局测试**：在不同布局模式（垂直、水平、混合）下测试

## 7. 文档更新

### 7.1 CLAUDE.md

- 在"术语说明"中添加侧边栏类型的定义
- 在"框架文档"中添加侧边栏类型切换功能的说明和使用指南

### 7.2 组合式函数文档

完整的 API 文档位于：`main/src/composables/use-sidebar-type/index.md`

## 8. 后续优化建议

### 8.1 性能优化

- 考虑缓存过滤结果，避免每次都重新计算
- 如果菜单数量很大，可以使用 `shallowRef` 优化性能

### 8.2 用户体验

- 可以添加切换动画效果
- 考虑在水平布局中也添加切换入口
- 可以添加快捷键支持（如 `Ctrl+Shift+S`）

### 8.3 功能扩展

- 支持更多侧边栏类型（如果未来有需求）
- 支持按用户角色自动切换默认侧边栏类型
- 添加侧边栏类型的权限控制

## 9. 总结

侧边栏类型区分功能已成功集成到主项目的侧边栏组件中。通过约定式配置和显式配置相结合的方式，实现了主业务页面和框架示例页面的清晰分离，提升了用户体验和系统的可维护性。
