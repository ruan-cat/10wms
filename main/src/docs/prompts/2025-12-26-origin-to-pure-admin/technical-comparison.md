# 2025-12-26 Origin 与 Pure-Admin 技术对比详解

## 1. 项目结构对比

### 1.1 目录结构对比

|   目录   |       Origin       |    Pure-Admin     |          说明           |
| :------: | :----------------: | :---------------: | :---------------------: |
|  API 层  |    `src/apis/`     |    `src/api/`     | Pure-Admin 使用单数形式 |
|   组件   | `src/components/`  | `src/components/` |         ✅ 相同         |
| 工具函数 | `src/composables/` |   `src/utils/`    |  Pure-Admin 使用 utils  |
|   布局   |   `src/layouts/`   |   `src/layout/`   | Pure-Admin 使用单数形式 |
|   路由   |   `src/routers/`   |   `src/router/`   | Pure-Admin 使用单数形式 |
| 状态管理 |   `src/stores/`    |   `src/store/`    | Pure-Admin 使用单数形式 |
|   视图   |    `src/views/`    |   `src/views/`    |         ✅ 相同         |
|   类型   |      `types/`      |     `types/`      |         ✅ 相同         |
|   插件   |   `src/plugins/`   |  `src/plugins/`   |         ✅ 相同         |
|   样式   |   `src/assets/`    |   `src/style/`    | Pure-Admin 独立样式目录 |
|   配置   |         -          |   `src/config/`   |     Pure-Admin 独有     |
|   指令   |         -          | `src/directives/` |     Pure-Admin 独有     |

### 1.2 文件命名规范对比

**Origin 项目**:

- 组件文件: PascalCase (如 `BaseForm.vue`)
- 工具文件: camelCase (如 `useRequest.ts`)
- 路由文件: kebab-case (如 `user-management/`)

**Pure-Admin 项目**:

- 组件文件: PascalCase (如 `ReDialog.vue`)
- 工具文件: camelCase (如 `auth.ts`)
- 路由文件: kebab-case (如 `user/`)

**建议**: 统一使用 Pure-Admin 的命名规范

## 2. 核心功能对比

### 2.1 路由系统对比

#### Origin 路由配置

```typescript
// origin/src/routers/index.ts
import { createRouter, createWebHistory } from "vue-router/auto";
import { handleHotUpdate, routes } from "vue-router/auto-routes";
import { setupLayouts } from "virtual:meta-layouts";

// 使用自动路由
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: setupLayouts(routes),
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
	// 登录验证
	// Token 验证
	// 菜单加载
});
```

**特点**:

- 使用 `unplugin-vue-router` 自动路由
- 使用 `vite-plugin-vue-meta-layouts` 布局系统
- 自定义路由元信息（menuType, text, icon, order）
- 简单的路由守卫逻辑

#### Pure-Admin 路由配置

```typescript
// main/src/router/index.ts
import { createRouter } from "vue-router/auto";
import { setupLayouts } from "virtual:meta-layouts";
import remainingRouter from "./modules/remaining";

// 混合使用自动路由和手动路由
const router = createRouter({
	history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
	routes: setupLayouts(constantRoutes.concat(...remainingRouter)),
});

// 复杂的路由守卫
router.beforeEach((to, _from, next) => {
	// 权限验证
	// 角色验证
	// 动态路由加载
	// 标签页管理
	// 缓存管理
});
```

**特点**:

- 同样使用自动路由
- 支持动态路由
- 完善的权限系统
- 标签页管理
- 路由缓存管理

**迁移建议**:

1. 保留 Origin 的自动路由配置
2. 集成 Pure-Admin 的权限系统
3. 适配 Pure-Admin 的路由元信息
4. 使用 Pure-Admin 的标签页管理

### 2.2 状态管理对比

#### Origin 状态管理

```typescript
// origin/src/stores/user.ts
import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export const useUserStore = defineStore("user", {
	state: () => ({
		token: "",
		userInfo: null,
		menus: [],
	}),
	persist: true, // 使用持久化插件
});
```

**特点**:

- 使用 `pinia-plugin-persistedstate` 持久化
- 简单的状态结构
- 基本的用户信息管理

#### Pure-Admin 状态管理

```typescript
// main/src/store/modules/user.ts
import { defineStore } from "pinia";
import { store } from "@/store";
import { storageLocal } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "./multiTags";

export const useUserStore = defineStore({
	id: "pure-user",
	state: () => ({
		// 用户名
		username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
		// 页面级别权限
		roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
	}),
	actions: {
		// 登录
		async loginByUsername(data) {},
		// 登出
		logOut() {},
	},
});
```

**特点**:

- 使用 `responsive-storage` 持久化
- 完善的权限管理
- 与标签页、权限系统集成
- 提供便捷的 Hook 函数

**迁移建议**:

1. 将 `pinia-plugin-persistedstate` 替换为 `responsive-storage`
2. 适配 Pure-Admin 的用户状态结构
3. 集成权限管理功能
4. 使用 Pure-Admin 的 Store Hook

### 2.3 HTTP 请求对比

#### Origin HTTP 配置

```typescript
// origin/src/plugins/http.js
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 10000,
});

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
	// 添加 token
	return config;
});

// 响应拦截器
axiosInstance.interceptors.response.use(
	(response) => response.data,
	(error) => {
		// 错误处理
		return Promise.reject(error);
	},
);
```

**特点**:

- 简单的 axios 配置
- 基本的拦截器
- 简单的错误处理

#### Pure-Admin HTTP 配置

```typescript
// main/src/utils/http/index.ts
import Axios from "axios";
import { PureHttpError, RequestMethods, PureHttpResponse, PureHttpRequestConfig } from "./types.d";

class PureHttp {
	request<T>(
		method: RequestMethods,
		url: string,
		param?: AxiosRequestConfig,
		axiosConfig?: PureHttpRequestConfig,
	): Promise<T> {
		// 完善的请求处理
		// 支持请求取消
		// 支持重试机制
		// 统一错误处理
	}
}

export const http = new PureHttp();
```

**特点**:

- 封装完善的 HTTP 类
- 支持请求取消
- 支持重试机制
- 统一的错误处理
- TypeScript 类型支持

**迁移建议**:

1. 使用 Pure-Admin 的 HTTP 工具类
2. 迁移 Origin 的拦截器逻辑
3. 适配 API 接口调用方式
4. 统一错误处理机制

### 2.4 组件系统对比

#### Origin 组件

**表格组件**:

```vue
<!-- origin/src/components/table/index.vue -->
<template>
	<el-table :data="tableData">
		<el-table-column v-for="col in columns" :key="col.prop" />
	</el-table>
</template>
```

**特点**:

- 基于 Element Plus 封装
- 简单的配置
- 基本的功能

#### Pure-Admin 组件

**表格组件**:

```vue
<!-- 使用 @pureadmin/table -->
<template>
	<pure-table
		:data="dataList"
		:columns="columns"
		:pagination="pagination"
		@page-size-change="handleSizeChange"
		@page-current-change="handleCurrentChange"
	>
		<template #operation="{ row }">
			<!-- 操作按钮 -->
		</template>
	</pure-table>
</template>
```

**特点**:

- 功能更强大
- 支持虚拟滚动
- 支持自适应高度
- 支持列拖拽
- 支持列设置
- 完善的 TypeScript 支持

**迁移建议**:

1. 评估是否使用 `@pureadmin/table`
2. 如果使用，需要重写所有表格页面
3. 如果不使用，保留 Origin 的表格组件
4. 建议使用 Pure-Admin 的表格组件，功能更强大

## 3. 样式系统对比

### 3.1 样式方案对比

#### Origin 样式

```css
/* origin/src/assets/main.css */
/* 使用传统 CSS + SCSS */
.container {
	padding: 20px;
	background: #fff;
}
```

**特点**:

- 传统 CSS/SCSS
- 手动编写样式
- 样式文件较多

#### Pure-Admin 样式

```vue
<template>
	<!-- 使用 Tailwind CSS -->
	<div class="p-5 bg-white rounded-lg shadow-md">
		<!-- 内容 -->
	</div>
</template>

<style lang="scss" scoped>
/* 必要时使用 SCSS */
</style>
```

**特点**:

- 主要使用 Tailwind CSS
- 原子化 CSS
- 样式文件较少
- 支持主题切换

**迁移建议**:

1. 逐步使用 Tailwind CSS 重写样式
2. 保留必要的 SCSS 样式
3. 统一使用 Pure-Admin 的主题系统
4. 适配暗色模式

### 3.2 主题系统对比

#### Origin 主题

- 无独立主题系统
- 使用 Element Plus 默认主题
- 手动修改 CSS 变量

#### Pure-Admin 主题

- 完善的主题系统
- 支持多种主题切换
- 支持暗色模式
- 支持自定义主题色
- 支持布局配置

**迁移建议**:

1. 使用 Pure-Admin 的主题系统
2. 配置项目主题色
3. 适配暗色模式
4. 提供主题切换功能

## 4. 构建配置对比

### 4.1 Vite 配置对比

#### Origin Vite 配置

```typescript
// origin/vite.config.ts
export default defineConfig(({ mode }) => {
	return {
		server: {
			port: Number(VITE_APP_PORT),
			proxy: {
				"/captcha": {
					/* ... */
				},
				[VITE_PROXY_PREFIX]: {
					/* ... */
				},
			},
		},
		plugins: [VueRouter(), vue(), MetaLayouts(), AutoImport, Components, Icons(), vueDevTools(), createHtmlPlugin()],
	};
});
```

**特点**:

- 基本的 Vite 配置
- 自动导入插件
- 开发工具插件

#### Pure-Admin Vite 配置

```typescript
// main/vite.config.ts
export default ({ mode }: ConfigEnv): UserConfigExport => {
	return {
		plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION, mode),
		optimizeDeps: { include, exclude },
		build: {
			target: "es2015",
			chunkSizeWarningLimit: 4000,
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
				},
			},
		},
	};
};
```

**特点**:

- 完善的构建配置
- CDN 支持
- 压缩优化
- 代码分割
- 预优化配置

**迁移建议**:

1. 合并两个项目的 Vite 配置
2. 使用 Pure-Admin 的构建优化
3. 保留 Origin 的必要配置
4. 统一环境变量配置

## 5. 依赖对比

### 5.1 核心依赖对比

|     依赖     | Origin | Pure-Admin |  说明   |
| :----------: | :----: | :--------: | :-----: |
|     vue      | 3.5.26 |   3.5.26   | ✅ 相同 |
|  vue-router  | 4.6.4  |   4.6.4    | ✅ 相同 |
|    pinia     | 3.0.4  |   3.0.4    | ✅ 相同 |
| element-plus | 2.13.0 |   2.13.0   | ✅ 相同 |
|    axios     | 1.13.2 |   1.13.2   | ✅ 相同 |
|     vite     | 6.3.5  |   6.3.5    | ✅ 相同 |
|  typescript  | 5.9.3  |   5.9.3    | ✅ 相同 |

### 5.2 特殊依赖对比

|          依赖           |   Origin    | Pure-Admin  |      迁移策略      |
| :---------------------: | :---------: | :---------: | :----------------: |
|  @form-create/designer  |     ✅      |     ❌      |   保留 Origin 的   |
|     @logicflow/core     | 1.2.28 (旧) | 1.2.28 (旧) |      统一版本      |
|   @wangeditor/editor    |   5.1.23    |   5.1.23    |      ✅ 相同       |
|   vue-plugin-hiprint    |     ✅      |     ❌      |   保留 Origin 的   |
|    @pureadmin/table     |     ❌      |     ✅      | 使用 Pure-Admin 的 |
| @pureadmin/descriptions |     ❌      |     ✅      | 使用 Pure-Admin 的 |
|    @pureadmin/utils     |     ❌      |     ✅      | 使用 Pure-Admin 的 |
|   responsive-storage    |     ❌      |     ✅      | 使用 Pure-Admin 的 |
|       tailwindcss       |     ❌      |     ✅      | 使用 Pure-Admin 的 |

### 5.3 依赖冲突解决

**可能的冲突**:

1. vue-i18n 版本差异（rc.1 vs 11.2.7）
2. @logicflow 版本差异（2.2.0 vs 1.2.28）

**解决方案**:

```json
// package.json
{
	"pnpm": {
		"overrides": {
			"vue-i18n": "11.2.7",
			"@logicflow/core": "2.2.0",
			"@logicflow/extension": "2.2.0"
		}
	}
}
```

## 6. 功能特性对比

### 6.1 Origin 独有功能

1. **表单设计器**: `@form-create/designer`
2. **打印功能**: `vue-plugin-hiprint`
3. **PDF 预览**: `pdfobject`
4. **自定义组件**:
   - `dinamic-table-form`: 动态表格表单
   - `dialog-promise`: Promise 化对话框
   - `verifition`: 验证码组件

### 6.2 Pure-Admin 独有功能

1. **权限系统**:
   - 按钮级权限控制
   - 角色权限管理
   - 动态路由

2. **布局系统**:
   - 多种布局模式
   - 标签页管理
   - 面包屑导航
   - 全屏功能

3. **主题系统**:
   - 多主题切换
   - 暗色模式
   - 自定义主题色
   - 布局配置

4. **增强组件**:
   - `@pureadmin/table`: 增强表格
   - `@pureadmin/descriptions`: 描述列表
   - `RePureTableBar`: 表格工具栏
   - `ReDialog`: 增强对话框
   - `ReDrawer`: 抽屉组件

5. **工具函数**:
   - `@pureadmin/utils`: 工具函数库
   - `responsive-storage`: 响应式存储

### 6.3 功能整合建议

**保留 Origin 的功能**:

- 表单设计器
- 打印功能
- 自定义业务组件

**使用 Pure-Admin 的功能**:

- 权限系统
- 布局系统
- 主题系统
- 增强组件
- 工具函数

**整合方式**:

1. 将 Origin 的特殊功能组件迁移到 Pure-Admin
2. 使用 Pure-Admin 的基础设施
3. 保持业务逻辑不变
4. 统一代码风格

## 7. 性能对比

### 7.1 打包体积对比

**Origin 项目**:

- 未优化的打包体积较大
- 未使用 CDN
- 未使用代码分割

**Pure-Admin 项目**:

- 完善的打包优化
- 支持 CDN
- 代码分割
- Tree Shaking
- 压缩优化

**优化建议**:

1. 使用 Pure-Admin 的打包配置
2. 启用 CDN 加速
3. 优化代码分割
4. 使用懒加载

### 7.2 运行时性能对比

**Origin 项目**:

- 基本的性能优化
- 未使用虚拟滚动
- 未使用路由缓存

**Pure-Admin 项目**:

- 完善的性能优化
- 支持虚拟滚动
- 路由缓存
- 组件缓存
- 防抖节流

**优化建议**:

1. 使用 Pure-Admin 的性能优化方案
2. 启用虚拟滚动
3. 启用路由缓存
4. 优化大列表渲染

## 8. 开发体验对比

### 8.1 开发工具对比

**Origin 项目**:

- Vue DevTools
- Vite DevTools
- 基本的开发体验

**Pure-Admin 项目**:

- Vue DevTools
- Vite DevTools
- Code Inspector（代码定位）
- 完善的 TypeScript 支持
- 更好的开发体验

### 8.2 代码规范对比

**Origin 项目**:

- ESLint (@antfu/eslint-config)
- Prettier
- 基本的代码规范

**Pure-Admin 项目**:

- ESLint (typescript-eslint)
- Prettier
- Stylelint
- Commitlint
- Husky
- Lint-staged
- 完善的代码规范

**建议**:

1. 使用 Pure-Admin 的代码规范
2. 统一代码风格
3. 建立代码审查机制

## 9. 迁移优先级建议

### 9.1 高优先级（必须迁移）

1. **HTTP 请求层**: 统一请求处理
2. **状态管理**: 统一状态管理
3. **路由系统**: 集成权限系统
4. **用户认证**: 统一认证机制

### 9.2 中优先级（建议迁移）

1. **表格组件**: 使用 `@pureadmin/table`
2. **样式系统**: 使用 Tailwind CSS
3. **主题系统**: 支持主题切换
4. **布局系统**: 使用 Pure-Admin 布局

### 9.3 低优先级（可选迁移）

1. **工具函数**: 逐步使用 `@pureadmin/utils`
2. **增强组件**: 逐步使用 Pure-Admin 组件
3. **代码规范**: 统一代码风格

## 10. 总结

### 10.1 主要差异

1. **架构层面**: Pure-Admin 更完善，有更好的权限系统和布局系统
2. **组件层面**: Pure-Admin 提供更多增强组件
3. **样式层面**: Pure-Admin 使用 Tailwind CSS，更现代化
4. **工具层面**: Pure-Admin 提供更多工具函数

### 10.2 迁移建议

1. **保留 Origin 的业务逻辑**: 不要重写业务代码
2. **使用 Pure-Admin 的基础设施**: 权限、布局、主题等
3. **渐进式迁移**: 按模块逐步迁移
4. **充分测试**: 确保功能正常

### 10.3 预期收益

1. **更好的用户体验**: 完善的布局和主题系统
2. **更高的开发效率**: 丰富的组件和工具函数
3. **更好的可维护性**: 统一的代码规范和架构
4. **更好的性能**: 完善的性能优化方案
