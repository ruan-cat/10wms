# Router Management Specification

## 1. 概述

本规格文档定义了 Origin 项目迁移到 Pure-Admin 项目过程中的路由管理方案。为了清晰区分框架路由和业务路由，采用分层路由管理策略。

## 2. 路由分类

### 2.1 Pure-Admin 路由

**定义**：Pure-Admin 框架原生提供的示例和功能路由。

**存放位置**：`main/src/router/modules/pure-admin/`

**用途**：

- 框架功能演示
- 开发参考示例
- 通用功能组件展示

**特点**：

- 由 Pure-Admin 框架维护
- 可根据项目需要启用或禁用
- 不涉及具体业务逻辑
- 主要用于开发学习和参考

**包含的路由文件**：

- `home.ts` - 首页
- `components.ts` - 组件示例
- `table.ts` - 表格示例
- `form.ts` - 表单示例
- `editor.ts` - 编辑器示例
- `flowchart.ts` - 流程图示例
- `remaining.ts` - 特殊路由（不参与菜单）
- 其他框架示例路由

### 2.2 Business 路由

**定义**：从 Origin 项目迁移过来的业务路由。

**存放位置**：`main/src/router/modules/business/`

**用途**：

- 实际业务功能实现
- WMS 系统核心模块
- 生产环境使用

**特点**：

- 从 origin 项目迁移而来
- 包含完整的业务逻辑
- 需要持续维护和更新
- 直接服务于生产环境

**包含的路由文件**：

- `base-config.ts` - 基础配置模块
- `base-data.ts` - 基础数据模块
- `billing.ts` - 计费配置模块
- `daily-check.ts` - 日常检查模块
- `inventory.ts` - 库存管理模块
- `message.ts` - 消息中间件模块
- `personnel.ts` - 人员配置模块
- `purchase.ts` - 采购管理模块
- `region.ts` - 区域配置模块
- `system.ts` - 系统管理模块

## 3. 目录结构

```plain
main/src/router/
├── index.ts                 # 路由入口文件
├── utils.ts                 # 路由工具函数
└── modules/                 # 路由模块目录
    ├── pure-admin/          # Pure-Admin 框架路由
    │   ├── home.ts
    │   ├── components.ts
    │   ├── table.ts
    │   ├── form.ts
    │   ├── remaining.ts
    │   └── ...
    └── business/            # 业务路由
        ├── base-config.ts
        ├── base-data.ts
        ├── billing.ts
        ├── daily-check.ts
        ├── inventory.ts
        ├── message.ts
        ├── personnel.ts
        ├── purchase.ts
        ├── region.ts
        └── system.ts
```

## 4. 路由加载机制

### 4.1 自动加载实现

路由入口文件 `main/src/router/index.ts` 使用 Vite 的 `import.meta.glob` 功能自动加载两类路由：

```typescript
/**
 * 路由模块说明：
 * - pure-admin 路由：Pure-Admin 框架原生提供的示例和功能路由
 * - business 路由：从旧项目迁移过来的业务路由
 */

/** 导入 Pure-Admin 原生路由 */
const pureAdminModules: Record<string, any> = import.meta.glob(
	["./modules/pure-admin/**/*.ts", "!./modules/pure-admin/**/remaining.ts"],
	{ eager: true },
);

/** 导入业务路由（从旧项目迁移） */
const businessModules: Record<string, any> = import.meta.glob(["./modules/business/**/*.ts"], { eager: true });

/** 合并所有路由模块 */
const modules: Record<string, any> = {
	...pureAdminModules,
	...businessModules,
};
```

### 4.2 加载顺序

1. 首先加载 Pure-Admin 路由（排除 remaining.ts）
2. 然后加载 Business 路由
3. 最后合并所有路由模块

### 4.3 特殊处理

- `remaining.ts` 文件被排除在自动加载之外，需要单独引入
- 该文件包含不参与菜单的特殊路由（如 404、403 等错误页面）

## 5. 路由配置规范

### 5.1 Pure-Admin 路由配置

Pure-Admin 路由遵循框架原生配置规范，无需特殊修改。

### 5.2 Business 路由配置

Business 路由必须遵循以下规范：

```typescript
import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

/** 业务模块路由 */
const moduleRouter: RouteConfigsTable = {
	path: "/module",
	name: "Module",
	component: Layout,
	redirect: "/module/page1",
	meta: {
		title: $t("menus.module"),
		icon: "ep:menu",
		rank: 10,
	},
	children: [
		{
			path: "/module/page1",
			name: "ModulePage1",
			component: () => import("@/pages/module/page1/index.vue"),
			meta: {
				title: $t("menus.page1"),
				showLink: true,
			},
		},
	],
};

export default moduleRouter;
```

**配置要点**：

1. 使用 `Layout` 组件作为父路由组件
2. 配置 `meta.title` 使用国际化
3. 配置 `meta.icon` 使用图标（详见图标配置规范）
4. 配置 `meta.rank` 控制菜单排序
5. 子路由使用动态导入实现懒加载

### 5.3 图标配置规范

**图标风格偏好**：

1. **细线风格优先**：优先使用细线条图标（如 Remix Icon 的 `-line` 后缀）
2. **避免实心图标**：避免使用实心风格图标（如 `-fill` 后缀）
3. **图标集选择**：主要使用 Remix Icon (`ri:`) 图标集
4. **语义匹配**：图标应与功能语义匹配，易于识别

**图标配置示例**：

```typescript
// ✅ 正确：使用细线风格图标
meta: {
  title: "用户管理",
  icon: "ri:user-line",  // Remix Icon 细线风格
}

// ✅ 正确：父级和子级都配置图标
const moduleRouter: RouteConfigsTable = {
  path: "/system",
  meta: {
    title: "系统管理",
    icon: "ri:shield-user-line",  // 父级图标
  },
  children: [
    {
      path: "/system/user",
      meta: {
        title: "用户管理",
        icon: "ri:user-line",  // 子级图标
      },
    },
  ],
};

// ❌ 避免：使用实心图标
meta: {
  title: "用户管理",
  icon: "ri:user-fill",  // 实心风格，不推荐
}
```

**常用图标推荐**：

| 功能类型 |        推荐图标        |
| :------: | :--------------------: |
| 用户管理 |     `ri:user-line`     |
| 角色管理 |    `ri:admin-line`     |
| 菜单管理 |     `ri:menu-line`     |
| 数据管理 |  `ri:database-2-line`  |
| 文件管理 |  `ri:file-list-line`   |
| 设置配置 |  `ri:settings-3-line`  |
| 消息通知 | `ri:notification-line` |
| 搜索查询 |    `ri:search-line`    |

**图标资源**：

- Remix Icon 官网：https://remixicon.com/
- Iconify 图标搜索：https://icon-sets.iconify.design/
- Pure-Admin 图标文档：https://github.com/pure-admin/pure-admin-doc/blob/master/docs/01.指南/02.进阶/01.图标.md

## 6. 新增路由流程

### 6.1 新增 Pure-Admin 路由

如果需要添加 Pure-Admin 框架的示例或功能路由：

1. 在 `main/src/router/modules/pure-admin/` 目录下创建路由文件
2. 遵循 Pure-Admin 路由配置规范
3. 文件会被自动加载，无需手动引入

### 6.2 新增 Business 路由

如果需要添加新的业务模块路由：

1. 在 `main/src/router/modules/business/` 目录下创建路由文件
2. 使用 Pure-Admin 标准路由配置格式
3. 配置路由元信息（title、icon、rank 等）
4. 文件会被自动加载，无需手动引入

## 7. 维护规范

### 7.1 职责划分

- **Pure-Admin 路由**：由框架维护，项目组不应修改
- **Business 路由**：由项目组维护，需要持续更新

### 7.2 命名规范

- 路由文件名使用 kebab-case 格式（如 `base-config.ts`）
- 路由 name 使用 PascalCase 格式（如 `BaseConfig`）
- 路由 path 使用 kebab-case 格式（如 `/base-config`）

### 7.3 注意事项

1. **不要混淆两类路由**：Pure-Admin 路由和 Business 路由应严格分开存放
2. **保持目录整洁**：不要在 `modules` 根目录直接创建路由文件
3. **遵循命名规范**：确保路由文件名、路由名称和路径的一致性
4. **及时更新文档**：新增业务模块时，同步更新相关文档

## 8. 优势分析

### 8.1 清晰的职责划分

通过目录分层，可以清晰地区分框架路由和业务路由，避免混淆。

### 8.2 易于维护

- 框架升级时，只需关注 `pure-admin` 目录
- 业务开发时，只需关注 `business` 目录

### 8.3 灵活的配置

可以独立启用或禁用某一类路由，便于开发和生产环境的切换。

### 8.4 便于团队协作

不同团队成员可以专注于不同类型的路由开发，减少冲突。

## 9. 迁移检查清单

- [ ] 所有 Pure-Admin 路由文件已移动到 `pure-admin` 目录
- [ ] 所有 Business 路由文件已移动到 `business` 目录
- [ ] 路由入口文件已更新为分层加载逻辑
- [ ] 所有路由文件遵循命名规范
- [ ] 路由配置包含完整的元信息
- [ ] 路由懒加载正常工作
- [ ] 菜单显示正常
- [ ] 权限控制正常
- [ ] 文档已更新

## 10. 相关文档

- Pure-Admin 路由文档：https://pure-admin.cn/pages/routerMenu/
- Vue Router 文档：https://router.vuejs.org/
- Vite Glob Import 文档：https://cn.vitejs.dev/guide/features.html#glob-import
