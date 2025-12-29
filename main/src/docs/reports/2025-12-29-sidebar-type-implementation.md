# 2025-12-29 侧边栏类型区分功能实现报告

## 1. 概述

实现了侧边栏类型区分功能，支持主业务侧边栏和案例侧边栏的分离显示，解决了 Pure-Admin 示例路由和 WMS 业务路由混在一起的问题。

## 2. 功能设计

### 2.1 侧边栏类型定义

|     类型     |           值           |      说明       |   默认路由来源    |
| :----------: | :--------------------: | :-------------: | :---------------: |
| 主业务侧边栏 |   `wmsBusinessPage`    |  WMS 业务页面   |  `business` 目录  |
|  案例侧边栏  | `pureAdminExamplePage` | Pure-Admin 示例 | `pure-admin` 目录 |

### 2.2 路由归属规则

#### 约定式配置（默认）

根据路由文件存储位置自动判断：

```plain
main/src/router/modules/
├── business/          → wmsBusinessPage
│   ├── system.ts
│   ├── base-data.ts
│   └── ...
└── pure-admin/        → pureAdminExamplePage
    ├── components.ts
    ├── table.ts
    └── ...
```

#### 显式配置（优先级更高）

在路由 `meta` 中显式指定：

```typescript
{
  path: "/guide",
  meta: {
    title: "引导页",
    sidebarType: "wmsBusinessPage" // 显式指定
  }
}
```

**优先级**: 显式配置 > 约定式配置

## 3. 实现内容

### 3.1 类型定义

**文件**: `main/types/router.d.ts`

新增类型定义：

```typescript
/** 侧边栏类型 */
type SidebarType = "pureAdminExamplePage" | "wmsBusinessPage";

interface CustomizeRouteMeta {
	title: string;
	sidebarType?: SidebarType; // 新增字段
	// ... 其他字段
}
```

### 3.2 组合式 API

**目录**: `main/src/composables/use-sidebar-type/`

#### 文件结构

```plain
use-sidebar-type/
├── index.ts          # 核心实现
├── index.md          # 完整文档
└── example.vue       # 使用示例
```

#### 核心 API

```typescript
const {
	currentSidebarType, // 当前侧边栏类型
	switchSidebarType, // 切换侧边栏类型
	filterRoutesBySidebarType, // 过滤路由
	getSidebarTypeFromRoute, // 获取路由类型
	isCurrentSidebarType, // 判断是否匹配
	getSidebarTypeName, // 获取类型名称
	isBusinessSidebar, // 是否为业务侧边栏
	isExampleSidebar, // 是否为示例侧边栏
} = useSidebarType();
```

### 3.3 切换组件

**文件**: `main/src/components/SidebarTypeSwitcher/index.vue`

提供下拉菜单式的侧边栏类型切换器，可集成到顶部导航栏。

**功能**:

- 显示当前侧边栏类型
- 下拉菜单切换类型
- 切换后自动刷新页面

### 3.4 文档更新

#### CLAUDE.md

新增章节：

- **2. 术语说明**: 新增侧边栏相关术语
- **14. 路由与侧边栏管理**: 完整的使用说明

#### 组合式 API 文档

`main/src/composables/use-sidebar-type/index.md`:

- 概述和类型说明
- API 文档
- 使用示例
- 配置说明
- 注意事项

## 4. 使用方式

### 4.1 基础使用

```vue
<script setup lang="ts">
import { useSidebarType } from "@/composables/use-sidebar-type";

const { currentSidebarType, switchSidebarType } = useSidebarType();

// 切换到主业务侧边栏
function showBusiness() {
	switchSidebarType("wmsBusinessPage");
}

// 切换到案例侧边栏
function showExamples() {
	switchSidebarType("pureAdminExamplePage");
}
</script>
```

### 4.2 集成到导航栏

```vue
<template>
	<div class="navbar">
		<!-- 其他导航项 -->
		<SidebarTypeSwitcher />
	</div>
</template>

<script setup lang="ts">
import SidebarTypeSwitcher from "@/components/SidebarTypeSwitcher/index.vue";
</script>
```

### 4.3 过滤路由

```typescript
import { useSidebarType } from "@/composables/use-sidebar-type";

const { filterRoutesBySidebarType } = useSidebarType();

// 只获取业务路由
const businessRoutes = filterRoutesBySidebarType(allRoutes, "wmsBusinessPage");

// 只获取示例路由
const exampleRoutes = filterRoutesBySidebarType(allRoutes, "pureAdminExamplePage");
```

## 5. 技术特点

### 5.1 约定优于配置

- 默认根据文件位置自动判断类型
- 减少手动配置工作量
- 保持代码简洁

### 5.2 灵活的显式配置

- 支持通过 `meta.sidebarType` 显式指定
- 可将 pure-admin 路由归入业务侧边栏
- 满足特殊需求

### 5.3 状态持久化

- 使用 localStorage 保存当前类型
- 刷新页面后保持选择
- 提升用户体验

### 5.4 高内聚设计

- 所有逻辑集中在组合式 API
- 易于维护和扩展
- 符合 Vue 3 最佳实践

## 6. 集成步骤

### 6.1 修改侧边栏组件

需要在侧边栏组件中集成路由过滤逻辑：

```typescript
import { useSidebarType } from "@/composables/use-sidebar-type";

const { filterRoutesBySidebarType } = useSidebarType();

// 过滤菜单路由
const filteredMenus = computed(() => {
	return filterRoutesBySidebarType(permissionStore.wholeMenus);
});
```

### 6.2 添加切换入口

在顶部导航栏或其他合适位置添加切换器：

```vue
<template>
	<div class="navbar-right">
		<SidebarTypeSwitcher />
		<!-- 其他组件 -->
	</div>
</template>
```

### 6.3 路由配置（可选）

如需将某个 pure-admin 路由归入业务侧边栏：

```typescript
export default {
	path: "/guide",
	meta: {
		title: "引导页",
		sidebarType: "wmsBusinessPage", // 显式指定
	},
} satisfies RouteConfigsTable;
```

## 7. 优势分析

### 7.1 清晰的菜单结构

- 业务菜单和示例菜单分离
- 避免混淆，提升可读性
- 便于快速定位功能

### 7.2 灵活的切换机制

- 一键切换侧边栏类型
- 支持多种集成方式
- 状态持久化

### 7.3 易于维护

- 约定式配置减少手动工作
- 集中管理，逻辑清晰
- 完善的文档和示例

### 7.4 可扩展性

- 易于添加新的侧边栏类型
- 支持自定义过滤规则
- 组合式 API 设计便于复用

## 8. 后续工作

### 8.1 集成到侧边栏

- [ ] 修改侧边栏组件，集成路由过滤
- [ ] 测试菜单显示效果
- [ ] 验证切换功能

### 8.2 添加切换入口

- [ ] 在导航栏添加切换器
- [ ] 设计切换按钮样式
- [ ] 优化用户体验

### 8.3 完善功能

- [ ] 添加切换动画效果
- [ ] 支持快捷键切换
- [ ] 添加切换提示

### 8.4 文档完善

- [ ] 更新用户使用手册
- [ ] 录制功能演示视频
- [ ] 编写最佳实践指南

## 9. 总结

✅ **侧边栏类型区分功能已完成核心实现**

**已完成**:

- ✅ 类型定义和接口设计
- ✅ 组合式 API 实现
- ✅ 切换组件开发
- ✅ 完整文档编写
- ✅ 使用示例创建
- ✅ CLAUDE.md 更新

**待集成**:

- ⏳ 侧边栏组件集成
- ⏳ 导航栏添加切换入口
- ⏳ 功能测试和优化

**核心特性**:

- 约定式配置 + 显式配置
- 状态持久化
- 高内聚设计
- 完善的文档

下一步需要将此功能集成到实际的侧边栏组件中，并添加用户可见的切换入口。
