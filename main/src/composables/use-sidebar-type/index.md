# 侧边栏类型管理

## 概述

`use-sidebar-type` 组合式 API 用于管理和区分不同类型的侧边栏菜单，实现主业务侧边栏和案例侧边栏的分离显示。

## 侧边栏类型

项目中定义了两种侧边栏类型：

|     类型     |           值           |          说明          |
| :----------: | :--------------------: | :--------------------: |
| 主业务侧边栏 |   `wmsBusinessPage`    | WMS 业务页面，默认显示 |
|  案例侧边栏  | `pureAdminExamplePage` |  Pure-Admin 示例页面   |

## 路由归属规则

### 1. 约定式配置（默认规则）

根据路由文件的存储位置自动判断：

- `main/src/router/modules/business/**/*.ts` → `wmsBusinessPage`
- `main/src/router/modules/pure-admin/**/*.ts` → `pureAdminExamplePage`

### 2. 显式配置（优先级更高）

在路由的 `meta` 中显式指定 `sidebarType`：

```typescript
{
  path: "/example",
  meta: {
    title: "示例页面",
    sidebarType: "pureAdminExamplePage" // 显式指定
  }
}
```

**优先级**: 显式配置 > 约定式配置

## API

### useSidebarType()

返回侧边栏类型管理的相关方法和状态。

```typescript
const { currentSidebarType, switchSidebarType, filterRoutesBySidebarType, getSidebarTypeFromRoute } = useSidebarType();
```

#### 返回值

|           属性            |                 类型                  |         说明         |
| :-----------------------: | :-----------------------------------: | :------------------: |
|    currentSidebarType     |          `Ref<SidebarType>`           | 当前激活的侧边栏类型 |
|     switchSidebarType     |     `(type: SidebarType) => void`     |    切换侧边栏类型    |
| filterRoutesBySidebarType | `(routes, type?) => RouteRecordRaw[]` |   根据类型过滤路由   |
|  getSidebarTypeFromRoute  |       `(route) => SidebarType`        | 获取路由的侧边栏类型 |

## 使用示例

### 示例 1: 切换侧边栏类型

```vue
<script setup lang="ts">
import { useSidebarType } from "@/composables/use-sidebar-type";

const { currentSidebarType, switchSidebarType } = useSidebarType();

/** 切换到案例侧边栏 */
function showExamples() {
	switchSidebarType("pureAdminExamplePage");
}

/** 切换到主业务侧边栏 */
function showBusiness() {
	switchSidebarType("wmsBusinessPage");
}
</script>

<template>
	<div>
		<el-button @click="showBusiness">主业务</el-button>
		<el-button @click="showExamples">案例示例</el-button>
		<p>当前侧边栏: {{ currentSidebarType }}</p>
	</div>
</template>
```

### 示例 2: 过滤路由

```typescript
import { useSidebarType } from "@/composables/use-sidebar-type";
import { usePermissionStoreHook } from "@/store/modules/permission";

const { filterRoutesBySidebarType } = useSidebarType();
const permissionStore = usePermissionStoreHook();

// 获取所有路由
const allRoutes = permissionStore.wholeMenus;

// 只获取业务路由
const businessRoutes = filterRoutesBySidebarType(allRoutes, "wmsBusinessPage");

// 只获取示例路由
const exampleRoutes = filterRoutesBySidebarType(allRoutes, "pureAdminExamplePage");
```

### 示例 3: 判断路由类型

```typescript
import { useSidebarType } from "@/composables/use-sidebar-type";
import { useRoute } from "vue-router";

const route = useRoute();
const { getSidebarTypeFromRoute } = useSidebarType();

// 获取当前路由的侧边栏类型
const routeType = getSidebarTypeFromRoute(route);

if (routeType === "pureAdminExamplePage") {
	console.log("这是一个示例页面");
} else {
	console.log("这是一个业务页面");
}
```

## 在路由中配置

### 业务路由（默认）

```typescript
// main/src/router/modules/business/system.ts
export default {
  path: "/system",
  meta: {
    title: "系统管理",
    // 无需配置 sidebarType，默认为 wmsBusinessPage
  },
  children: [...]
} satisfies RouteConfigsTable;
```

### 示例路由（默认）

```typescript
// main/src/router/modules/pure-admin/components.ts
export default {
  path: "/components",
  meta: {
    title: "组件示例",
    // 无需配置 sidebarType，默认为 pureAdminExamplePage
  },
  children: [...]
} satisfies RouteConfigsTable;
```

### 显式指定类型

```typescript
// 将某个 pure-admin 路由归入主业务侧边栏
export default {
	path: "/guide",
	meta: {
		title: "引导页",
		sidebarType: "wmsBusinessPage", // 显式指定为业务页面
	},
} satisfies RouteConfigsTable;
```

## 注意事项

1. **默认行为**: 如果不配置 `sidebarType`，会根据路由文件位置自动判断
2. **优先级**: 显式配置的 `sidebarType` 优先级高于约定式判断
3. **持久化**: 当前侧边栏类型会保存到 localStorage，刷新页面后保持
4. **切换效果**: 切换侧边栏类型时，菜单会自动更新显示对应类型的路由

## 相关文档

- [路由管理规范](../../../openspec/changes/origin-to-pure-admin/specs/router.md)
- [CLAUDE.md - 路由术语说明](../../../CLAUDE.md)
