# 2025-12-28 添加业务页面路由配置

## 1. 概述

为 `main/src/pages` 目录下的业务页面创建路由配置，使这些页面能够通过侧边栏菜单正常访问。

## 2. 创建的路由文件

|     文件名     |  模块名称  |     图标      | 排序 |  状态   |
| :------------: | :--------: | :-----------: | :--: | :-----: |
|  `billing.ts`  |  计费配置  |  `ep:money`   |  50  | ✅ 完成 |
|  `message.ts`  | 消息中间件 | `ep:message`  |  51  | ✅ 完成 |
|  `region.ts`   |  区域配置  | `ep:location` |  52  | ✅ 完成 |
| `personnel.ts` |  人员配置  |   `ep:user`   |  53  | ✅ 完成 |

## 3. 路由配置详情

### 3.1 计费配置模块 (billing.ts)

```typescript
{
	path: "/billing",
	name: "Billing",
	component: Layout,
	redirect: "/billing/billing-mode",
	meta: {
		icon: "ep:money",
		title: "计费配置",
		rank: 50,
	},
	children: [
		{
			path: "/billing/billing-mode",
			name: "BillingMode",
			component: () => import("@/pages/billing/billing-mode/index.vue"),
			meta: {
				title: "计费模式",
			},
		},
		{
			path: "/billing/expense-template",
			name: "ExpenseTemplate",
			component: () => import("@/pages/billing/expense-template/index.vue"),
			meta: {
				title: "费用模板",
			},
		},
	],
}
```

**包含页面：**

- 计费模式 (`/billing/billing-mode`)
- 费用模板 (`/billing/expense-template`)

### 3.2 消息中间件模块 (message.ts)

```typescript
{
	path: "/message",
	name: "Message",
	component: Layout,
	redirect: "/message/message-center",
	meta: {
		icon: "ep:message",
		title: "消息中间件",
		rank: 51,
	},
	children: [
		{
			path: "/message/message-center",
			name: "MessageCenter",
			component: () => import("@/pages/message/message-center/index.vue"),
			meta: {
				title: "消息中心",
			},
		},
		{
			path: "/message/message-template",
			name: "MessageTemplate",
			component: () => import("@/pages/message/message-template/index.vue"),
			meta: {
				title: "消息模板",
			},
		},
	],
}
```

**包含页面：**

- 消息中心 (`/message/message-center`)
- 消息模板 (`/message/message-template`)

### 3.3 区域配置模块 (region.ts)

```typescript
{
	path: "/region",
	name: "Region",
	component: Layout,
	redirect: "/region/area-information",
	meta: {
		icon: "ep:location",
		title: "区域配置",
		rank: 52,
	},
	children: [
		{
			path: "/region/area-information",
			name: "AreaInformation",
			component: () => import("@/pages/region/area-information/index.vue"),
			meta: {
				title: "大区信息",
			},
		},
		{
			path: "/region/city-type",
			name: "CityType",
			component: () => import("@/pages/region/city-type/index.vue"),
			meta: {
				title: "城市分类",
			},
		},
	],
}
```

**包含页面：**

- 大区信息 (`/region/area-information`)
- 城市分类 (`/region/city-type`)

### 3.4 人员配置模块 (personnel.ts)

```typescript
{
	path: "/personnel",
	name: "Personnel",
	component: Layout,
	redirect: "/personnel/academic-code",
	meta: {
		icon: "ep:user",
		title: "人员配置",
		rank: 53,
	},
	children: [
		{
			path: "/personnel/academic-code",
			name: "AcademicCode",
			component: () => import("@/pages/personnel/academic-code/index.vue"),
			meta: {
				title: "学历代码",
			},
		},
	],
}
```

**包含页面：**

- 学历代码 (`/personnel/academic-code`)

## 4. Pure-Admin 路由配置规范

### 4.1 路由文件结构

```typescript
import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/module", // 模块路径
	name: "ModuleName", // 路由名称（大驼峰）
	component: Layout, // 布局组件
	redirect: "/module/page", // 重定向到第一个子页面
	meta: {
		icon: "ep:icon-name", // 菜单图标
		title: "模块标题", // 菜单标题
		rank: 50, // 排序（数字越小越靠前）
	},
	children: [
		{
			path: "/module/page",
			name: "PageName",
			component: () => import("@/pages/module/page/index.vue"),
			meta: {
				title: "页面标题",
			},
		},
	],
} satisfies RouteConfigsTable;
```

### 4.2 关键配置说明

|    配置项    |           说明           |          示例           |
| :----------: | :----------------------: | :---------------------: |
|    `path`    |  路由路径，以 `/` 开头   |       `/billing`        |
|    `name`    | 路由名称，使用大驼峰命名 |      `BillingMode`      |
| `component`  | 父路由必须配置 `Layout`  |        `Layout`         |
|  `redirect`  |   重定向到第一个子路由   | `/billing/billing-mode` |
| `meta.icon`  |  使用 Element Plus 图标  |       `ep:money`        |
| `meta.title` |      菜单显示的标题      |       `计费配置`        |
| `meta.rank`  | 菜单排序，数字越小越靠前 |          `50`           |

### 4.3 图标使用

Pure-Admin 支持以下图标：

|   图标类型   |  前缀  |           示例           |
| :----------: | :----: | :----------------------: |
| Element Plus | `ep:`  | `ep:money`, `ep:message` |
|   Iconify    | 无前缀 |      `mdi:account`       |
|   本地 SVG   | `svg:` |    `svg:custom-icon`     |

## 5. 路由自动加载机制

Pure-Admin 使用 Vite 的 `import.meta.glob` 自动加载 `src/router/modules` 目录下的所有路由文件（除了 `remaining.ts`）。

### 5.1 自动加载配置

在 `main/src/router/index.ts` 中：

```typescript
const modules: Record<string, any> = import.meta.glob(["./modules/**/*.ts", "!./modules/**/remaining.ts"], {
	eager: true,
});
```

### 5.2 无需手动注册

创建的路由文件会自动被加载和注册，无需手动导入或注册。

## 6. 访问路径

创建路由配置后，可以通过以下路径访问页面：

|    模块    |   页面   |                      访问路径                      |
| :--------: | :------: | :------------------------------------------------: |
|  计费配置  | 计费模式 |   `http://localhost:8080/#/billing/billing-mode`   |
|  计费配置  | 费用模板 | `http://localhost:8080/#/billing/expense-template` |
| 消息中间件 | 消息中心 |  `http://localhost:8080/#/message/message-center`  |
| 消息中间件 | 消息模板 | `http://localhost:8080/#/message/message-template` |
|  区域配置  | 大区信息 | `http://localhost:8080/#/region/area-information`  |
|  区域配置  | 城市分类 |     `http://localhost:8080/#/region/city-type`     |
|  人员配置  | 学历代码 | `http://localhost:8080/#/personnel/academic-code`  |

## 7. 菜单显示

路由配置完成后，侧边栏菜单会自动显示：

```plain
├── 首页
├── 计费配置
│   ├── 计费模式
│   └── 费用模板
├── 消息中间件
│   ├── 消息中心
│   └── 消息模板
├── 区域配置
│   ├── 大区信息
│   └── 城市分类
└── 人员配置
    └── 学历代码
```

## 8. 验证步骤

1. 启动开发服务器：`cd main && pnpm serve`
2. 访问首页：`http://localhost:8080`
3. 检查侧边栏菜单是否显示新增的模块
4. 点击菜单项，验证页面是否正常加载
5. 检查页面布局是否正确（侧边栏、导航栏、内容区）

## 9. 待完成的路由配置

以下模块的页面已经迁移，但还需要创建路由配置：

|   模块   |               目录                | 优先级 |
| :------: | :-------------------------------: | :----: |
| 系统管理 |      `main/src/pages/system`      |   P0   |
| 基础数据 |    `main/src/pages/base-data`     |   P1   |
| 采购管理 |     `main/src/pages/purchase`     |   P1   |
| 库存管理 |    `main/src/pages/inventory`     |   P1   |
| 出库管理 |     `main/src/pages/outbound`     |   P2   |
| 日常检查 |   `main/src/pages/daily-check`    |   P2   |
| 基础配置 |   `main/src/pages/base-config`    |   P2   |
| 仓库配置 | `main/src/pages/warehouse-config` |   P3   |
| 客户报表 |      `main/src/pages/report`      |   P3   |

## 10. 注意事项

### 10.1 路由命名规范

- 路由名称使用大驼峰命名（PascalCase）
- 路由路径使用小写加短横线（kebab-case）
- 保持路由名称的唯一性

### 10.2 懒加载

所有页面组件都使用动态导入实现懒加载：

```typescript
component: () => import("@/pages/module/page/index.vue");
```

### 10.3 布局组件

父路由必须配置 `component: Layout`，否则页面将无法显示侧边栏和导航栏。

## 11. 相关文档

- Pure-Admin 路由文档：https://pure-admin.cn/pages/routerMenu/
- Pure-Admin 菜单文档：https://pure-admin.cn/pages/routerMenu/#菜单
- Element Plus 图标：https://element-plus.org/zh-CN/component/icon.html

## 12. 总结

成功为 4 个业务模块创建了路由配置，包含 7 个业务页面。这些页面现在可以通过侧边栏菜单正常访问。后续需要继续为其他业务模块创建路由配置。
