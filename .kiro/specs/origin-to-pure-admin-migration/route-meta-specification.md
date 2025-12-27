# 路由元信息规范文档

## 概述

本文档定义了迁移后统一的路由元信息（RouteMeta）规范，兼容 Pure-Admin 和 Origin 两个项目的字段。

## 字段定义

### Pure-Admin 标准字段

#### 必填字段

| 字段名  |   类型   |          说明          |              示例              |
| :-----: | :------: | :--------------------: | :----------------------------: |
| `title` | `string` | 菜单名称（兼容国际化） | `"用户管理"` 或 `"menus.user"` |

#### 可选字段

|     字段名     |              类型               |             说明              |  默认值   |
| :------------: | :-----------------------------: | :---------------------------: | :-------: |
|     `icon`     | `string \| FunctionalComponent` |           菜单图标            |     -     |
|  `extraIcon`   | `string \| FunctionalComponent` |    菜单名称右侧的额外图标     |     -     |
|   `showLink`   |            `boolean`            |       是否在菜单中显示        |  `true`   |
|  `showParent`  |            `boolean`            |       是否显示父级菜单        |     -     |
|    `roles`     |         `Array<string>`         |       页面级别权限设置        |   `[]`    |
|    `auths`     |         `Array<string>`         |       按钮级别权限设置        |   `[]`    |
|  `keepAlive`   |            `boolean`            |         路由组件缓存          |  `false`  |
|   `frameSrc`   |            `string`             |      内嵌的 iframe 链接       |     -     |
| `frameLoading` |            `boolean`            | iframe 页是否开启首次加载动画 |  `true`   |
|  `transition`  |            `object`             |       页面加载动画配置        |     -     |
|  `hiddenTag`   |            `boolean`            |       禁止添加到标签页        |  `false`  |
|   `fixedTag`   |            `boolean`            |  固定显示在标签页且不可关闭   |  `false`  |
| `dynamicLevel` |            `number`             |   动态路由可打开的最大数量    |     -     |
|  `activePath`  |            `string`             |      指定激活菜单的 path      |     -     |
|    `layout`    |          `LayoutEnums`          |           布局类型            | `"index"` |

### Origin 兼容字段

|   字段名   |               类型               |      说明      |    映射关系    |
| :--------: | :------------------------------: | :------------: | :------------: |
| `menuType` | `"page" \| "folder" \| "ignore"` |    菜单类型    |       -        |
|   `text`   |             `string`             |    菜单文本    | 等同于 `title` |
|  `order`   |             `number`             |    菜单排序    | 类似于 `rank`  |
| `isSample` |            `boolean`             | 是否为示例页面 |       -        |

## 字段映射规则

### Origin → Pure-Admin

|     Origin 字段      |  Pure-Admin 字段  |            转换规则            |
| :------------------: | :---------------: | :----------------------------: |
|        `text`        |      `title`      |            直接映射            |
|       `order`        |      `rank`       |     直接映射（仅顶级路由）     |
| `menuType: "ignore"` | `showLink: false` |         不显示在菜单中         |
| `menuType: "folder"` |         -         | 作为父级菜单，不设置 component |
|  `menuType: "page"`  |         -         |          正常页面路由          |

### Pure-Admin → Origin

|  Pure-Admin 字段  |     Origin 字段      |    转换规则    |
| :---------------: | :------------------: | :------------: |
|      `title`      |        `text`        |    直接映射    |
|      `rank`       |       `order`        |    直接映射    |
| `showLink: false` | `menuType: "ignore"` | 不显示在菜单中 |

## 使用示例

### 示例 1：基本页面路由

```typescript
{
  path: "/user",
  name: "User",
  component: () => import("@/views/user/index.vue"),
  meta: {
    title: "用户管理",
    icon: "user",
    showLink: true,
    roles: ["admin"],
    keepAlive: true,
    // Origin 兼容
    text: "用户管理",
    menuType: "page",
    order: 1
  }
}
```

### 示例 2：文件夹路由

```typescript
{
  path: "/system",
  name: "System",
  meta: {
    title: "系统管理",
    icon: "setting",
    showLink: true,
    rank: 10,
    // Origin 兼容
    text: "系统管理",
    menuType: "folder",
    order: 10
  },
  children: [
    {
      path: "user",
      name: "SystemUser",
      component: () => import("@/views/system/user/index.vue"),
      meta: {
        title: "用户管理",
        showLink: true,
        // Origin 兼容
        text: "用户管理",
        menuType: "page"
      }
    }
  ]
}
```

### 示例 3：隐藏路由

```typescript
{
  path: "/user/detail/:id",
  name: "UserDetail",
  component: () => import("@/views/user/detail.vue"),
  meta: {
    title: "用户详情",
    showLink: false,
    activePath: "/user",
    // Origin 兼容
    text: "用户详情",
    menuType: "ignore"
  }
}
```

### 示例 4：权限路由

```typescript
{
  path: "/admin",
  name: "Admin",
  component: () => import("@/views/admin/index.vue"),
  meta: {
    title: "管理员专区",
    icon: "lock",
    showLink: true,
    roles: ["admin", "super-admin"],
    auths: ["admin:view"],
    // Origin 兼容
    text: "管理员专区",
    menuType: "page"
  }
}
```

### 示例 5：缓存路由

```typescript
{
  path: "/list",
  name: "List",
  component: () => import("@/views/list/index.vue"),
  meta: {
    title: "列表页面",
    icon: "list",
    showLink: true,
    keepAlive: true,
    // Origin 兼容
    text: "列表页面",
    menuType: "page"
  }
}
```

## 迁移注意事项

### 1. 字段优先级

当同时存在 `title` 和 `text` 时，优先使用 `title`。

### 2. 菜单类型转换

- `menuType: "page"` → 正常页面路由
- `menuType: "folder"` → 父级菜单，不设置 component
- `menuType: "ignore"` → 设置 `showLink: false`

### 3. 排序字段

- 顶级路由使用 `rank` 字段
- 子路由使用 `order` 字段（Origin 兼容）

### 4. 权限字段

- 页面级权限使用 `roles`
- 按钮级权限使用 `auths`

### 5. 国际化支持

Pure-Admin 支持国际化，`title` 可以是国际化 key：

- 非国际化：`title: "用户管理"`
- 国际化：`title: "menus.user"`

## 验证规则

### 必填字段验证

```typescript
function validateRouteMeta(meta: CustomizeRouteMeta): boolean {
	// title 是必填字段
	if (!meta.title) {
		console.error("Route meta must have a title");
		return false;
	}
	return true;
}
```

### 字段类型验证

```typescript
function validateFieldTypes(meta: CustomizeRouteMeta): boolean {
	// showLink 必须是 boolean
	if (meta.showLink !== undefined && typeof meta.showLink !== "boolean") {
		console.error("showLink must be a boolean");
		return false;
	}

	// roles 必须是数组
	if (meta.roles !== undefined && !Array.isArray(meta.roles)) {
		console.error("roles must be an array");
		return false;
	}

	return true;
}
```

## 最佳实践

### 1. 使用 TypeScript

始终使用 TypeScript 定义路由，确保类型安全：

```typescript
import type { RouteConfigsTable } from "@/types/router";

const routes: RouteConfigsTable[] = [
	// 路由配置
];
```

### 2. 统一命名规范

- 路由 `name` 使用 PascalCase
- 路由 `path` 使用 kebab-case
- 菜单 `title` 使用中文或国际化 key

### 3. 合理使用缓存

只对需要保持状态的页面启用 `keepAlive`，避免过度使用导致内存占用过高。

### 4. 权限粒度

- 使用 `roles` 控制页面访问权限
- 使用 `auths` 控制按钮操作权限

### 5. 菜单层级

建议菜单层级不超过 3 层，保持简洁清晰。

## 工具函数

### 转换 Origin 路由到 Pure-Admin

```typescript
function convertOriginRouteToPureAdmin(originRoute: any): RouteConfigsTable {
	return {
		...originRoute,
		meta: {
			...originRoute.meta,
			title: originRoute.meta.text || originRoute.meta.title,
			showLink: originRoute.meta.menuType !== "ignore",
			rank: originRoute.meta.order,
		},
	};
}
```

### 转换 Pure-Admin 路由到 Origin

```typescript
function convertPureAdminRouteToOrigin(pureAdminRoute: RouteConfigsTable): any {
	return {
		...pureAdminRoute,
		meta: {
			...pureAdminRoute.meta,
			text: pureAdminRoute.meta.title,
			menuType: pureAdminRoute.meta.showLink === false ? "ignore" : "page",
			order: pureAdminRoute.meta.rank,
		},
	};
}
```

## 参考资料

- [Vue Router 官方文档](https://router.vuejs.org/)
- [Pure-Admin 路由配置](https://yiming_chang.gitee.io/pure-admin-doc/pages/routerMenu/)
- [TypeScript 类型声明](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
