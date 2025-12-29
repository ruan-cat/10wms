# Design Document

## Overview

本设计文档描述了将 Origin 项目（原始 10WMS 仓库管理系统）迁移到基于 vue-pure-admin 框架的 Main 项目的完整技术方案。迁移采用渐进式策略，分为基础设施、公共组件、API 层、业务模块和测试优化五个阶段，确保在保留所有业务功能的前提下，充分利用 Pure-Admin 的架构优势。

### Design Goals

1. **功能完整性**: 保留 Origin 项目的所有业务功能，不丢失任何特性
2. **架构现代化**: 利用 Pure-Admin 的权限系统、布局系统和主题系统
3. **代码质量**: 统一代码规范，提高可维护性和可扩展性
4. **性能优化**: 实现路由懒加载、虚拟滚动和打包优化
5. **开发效率**: 使用 Pure-Admin 的丰富组件库和工具函数

### Key Constraints

1. **技术栈约束**: 必须保持 Vue 3.5.26、Vue Router 4.6.4、Pinia 3.0.4、Element Plus 2.13.0 的版本一致性
2. **业务逻辑约束**: 不允许重写业务逻辑，只能进行适配和转换
3. **时间约束**: 预计 12-16 周完成全部迁移
4. **兼容性约束**: 必须支持 Chrome、Firefox、Safari、Edge 最新版本
5. **性能约束**: 首屏加载时间必须小于 3 秒

## Architecture

### System Architecture

迁移系统采用分层架构，从底层基础设施到上层业务模块逐步迁移：

```plain
┌─────────────────────────────────────────────────────────┐
│                    业务模块层                            │
│  (系统管理、基础数据、采购管理、库存管理等 13 个模块)    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    公共组件层                            │
│  (表格、表单、分页、对话框、特殊功能组件)                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     API 层                               │
│  (HTTP 请求、响应处理、错误处理)                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  基础设施层                              │
│  (路由系统、状态管理、权限系统、主题系统)                │
└─────────────────────────────────────────────────────────┘
```

### Migration Strategy

采用渐进式迁移策略，分为五个阶段：

1. **阶段一：基础设施迁移** (1-2 周)
   - HTTP 请求层适配
   - 状态管理适配
   - 路由系统适配（包括路由分层管理）
   - 工具函数迁移

2. **阶段二：公共组件迁移** (2-3 周)
   - 基础组件（表格、表单、分页）
   - 业务组件（搜索、工具栏）
   - 特殊功能组件（表单设计器、流程图、打印）

3. **阶段三：API 层迁移** (1-2 周)
   - API 结构调整
   - API 调用转换
   - 响应处理统一

4. **阶段四：业务模块迁移** (6-8 周)
   - P0: 系统管理、登录认证
   - P1: 基础数据、采购管理、库存管理
   - P2: 出库管理、日常检查、基础配置
   - P3: 其他辅助模块

5. **阶段五：测试与优化** (2-3 周)
   - 功能测试
   - 性能优化
   - 用户体验优化

### Router Management Strategy

为了清晰区分 Pure-Admin 框架路由和业务路由，采用分层路由管理方案：

#### 路由目录结构

```plain
main/src/router/modules/
├── pure-admin/          # Pure-Admin 框架原生路由
│   ├── home.ts         # 首页
│   ├── components.ts   # 组件示例
│   ├── table.ts        # 表格示例
│   ├── form.ts         # 表单示例
│   ├── remaining.ts    # 特殊路由（不参与菜单）
│   └── ...             # 其他框架路由
└── business/            # 业务路由（从旧项目迁移）
    ├── base-config.ts   # 基础配置模块
    ├── base-data.ts     # 基础数据模块
    ├── billing.ts       # 计费配置模块
    ├── daily-check.ts   # 日常检查模块
    ├── inventory.ts     # 库存管理模块
    ├── message.ts       # 消息中间件模块
    ├── personnel.ts     # 人员配置模块
    ├── purchase.ts      # 采购管理模块
    ├── region.ts        # 区域配置模块
    └── system.ts        # 系统管理模块
```

#### 路由分类说明

**Pure-Admin 路由**：

- 定义：Pure-Admin 框架原生提供的示例和功能路由
- 用途：框架功能演示、开发参考示例、通用功能组件
- 特点：由框架维护，可根据需要启用或禁用

**Business 路由**：

- 定义：从旧项目迁移过来的业务路由
- 用途：实际业务功能、WMS 系统核心模块、生产环境使用
- 特点：从 origin 项目迁移而来，包含完整的业务逻辑

#### 路由加载机制

路由入口文件自动加载两类路由：

```typescript
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

这种分层管理方案的优势：

1. **清晰的职责划分**：框架路由和业务路由分开管理
2. **易于维护**：可以快速识别和定位路由文件
3. **灵活的配置**：可以独立启用或禁用某一类路由
4. **便于升级**：框架升级时不会影响业务路由

## Components and Interfaces

### Core Components

#### 1. HTTP Request Layer

**Origin Implementation:**

```typescript
// origin/src/plugins/http.js
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
	// Add token
	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response.data,
	(error) => Promise.reject(error),
);
```

**Pure-Admin Implementation:**

```typescript
// main/src/utils/http/index.ts
import { PureHttp } from "./types.d";

class CustomHttp extends PureHttp {
	beforeRequestCallback(config) {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	}

	beforeResponseCallback(response) {
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

**Interface:**

```typescript
interface HttpClient {
	get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
	post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
```

#### 2. State Management Layer

**Origin Implementation:**

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
	persist: true,
});
```

**Pure-Admin Implementation:**

```typescript
// main/src/store/modules/user.ts
import { defineStore } from "pinia";
import { storageLocal } from "@pureadmin/utils";

export const useUserStore = defineStore({
	id: "pure-user",
	state: () => ({
		token: storageLocal().getItem("token") ?? "",
		userInfo: storageLocal().getItem("userInfo") ?? null,
		menus: storageLocal().getItem("menus") ?? [],
	}),
	actions: {
		setToken(token: string) {
			this.token = token;
			storageLocal().setItem("token", token);
		},
	},
});
```

**Interface:**

```typescript
interface UserStore {
	token: string;
	userInfo: UserInfo | null;
	menus: MenuItem[];
	loadUser(): Promise<void>;
	loadMenus(): Promise<void>;
	logout(): void;
}
```

#### 3. Router System

**Interface:**

```typescript
interface RouteConfig {
	path: string;
	name: string;
	component: Component;
	meta: {
		title: string;
		icon?: string;
		roles?: string[];
		keepAlive?: boolean;
		showLink?: boolean;
	};
	children?: RouteConfig[];
}
```

#### 4. Component System

**Table Component Interface:**

```typescript
interface TableProps {
	data: any[];
	columns: ColumnConfig[];
	loading?: boolean;
	pagination?: PaginationConfig;
}

interface ColumnConfig {
	label: string;
	prop: string;
	width?: number;
	slot?: string;
}
```

**Form Component Interface:**

```typescript
interface FormProps {
	formItems: FormItemConfig[];
	formData: Record<string, any>;
	rules?: Record<string, any>;
}

interface FormItemConfig {
	label: string;
	prop: string;
	type: "input" | "select" | "date" | "textarea";
	required?: boolean;
	options?: any[];
}
```

### Migration Tools

#### 1. Dependency Checker

```typescript
interface DependencyConflict {
	name: string;
	originVersion: string;
	mainVersion: string;
}

function checkDependencyConflicts(): DependencyConflict[];
function generateOverrides(conflicts: DependencyConflict[]): Record<string, string>;
```

#### 2. Code Transformer

```typescript
interface TransformOptions {
	transformImports?: boolean;
	transformStyles?: boolean;
	transformApi?: boolean;
}

function transformFile(filePath: string, options: TransformOptions): boolean;
function transformDirectory(dir: string, options: TransformOptions): number;
```

#### 3. Migration Tracker

```typescript
interface MigrationTask {
	id: string;
	name: string;
	type: "component" | "page" | "api" | "util" | "other";
	status: "pending" | "in-progress" | "completed" | "blocked";
	priority: "high" | "medium" | "low";
}

interface MigrationProgress {
	tasks: MigrationTask[];
	updatedAt: string;
}

function addTask(task: Omit<MigrationTask, "id">): void;
function updateTaskStatus(taskId: string, status: MigrationTask["status"]): void;
function showProgress(): void;
```

## Data Models

### User Data Model

```typescript
interface UserInfo {
	id: string;
	username: string;
	name: string;
	email: string;
	phone?: string;
	avatar?: string;
	roles: string[];
	permissions: string[];
	deptId?: string;
	deptName?: string;
}
```

### Menu Data Model

```typescript
interface MenuItem {
	id: string;
	parentId: string | null;
	name: string;
	path: string;
	component?: string;
	icon?: string;
	order: number;
	type: "menu" | "button";
	permission?: string;
	children?: MenuItem[];
}
```

### API Response Model

```typescript
interface ApiResponse<T = any> {
	code: number;
	message: string;
	data: T;
	timestamp?: number;
}

interface PageResponse<T = any> {
	list: T[];
	total: number;
	pageSize: number;
	currentPage: number;
}
```

### Migration Task Model

```typescript
interface MigrationTask {
	id: string;
	name: string;
	type: "component" | "page" | "api" | "util" | "other";
	status: "pending" | "in-progress" | "completed" | "blocked";
	priority: "high" | "medium" | "low";
	assignee?: string;
	notes?: string;
	startTime?: string;
	endTime?: string;
	dependencies?: string[];
}
```

### Component Configuration Model

```typescript
interface TableConfig {
	columns: ColumnConfig[];
	pagination: PaginationConfig;
	selection?: boolean;
	stripe?: boolean;
	border?: boolean;
}

interface ColumnConfig {
	label: string;
	prop: string;
	width?: number;
	minWidth?: number;
	fixed?: "left" | "right";
	sortable?: boolean;
	slot?: string;
}

interface PaginationConfig {
	total: number;
	pageSize: number;
	currentPage: number;
	pageSizes?: number[];
	layout?: string;
}
```

### Route Configuration Model

```typescript
interface RouteMetaConfig {
	// Pure-Admin 标准字段
	title: string;
	icon?: string;
	showLink?: boolean;
	keepAlive?: boolean;
	roles?: string[];
	auths?: string[];

	// Origin 兼容字段
	menuType?: "page" | "folder" | "ignore";
	text?: string;
	order?: number;
	isSample?: boolean;
}
```

### Style Configuration Model

```typescript
interface ThemeConfig {
	primary: string;
	success: string;
	warning: string;
	danger: string;
	info: string;
	darkMode: boolean;
	layout: "vertical" | "horizontal" | "mix";
}

interface LayoutConfig {
	showLogo: boolean;
	showTabs: boolean;
	showFooter: boolean;
	showBreadcrumb: boolean;
	fixedHeader: boolean;
	sidebarLogo: boolean;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: HTTP Interceptor Logic Preservation

_For any_ HTTP request configuration from Origin, when adapted to Pure-Admin's HTTP tool class, the request and response interceptor logic should produce equivalent results for the same inputs.

**Validates: Requirements 1.2**

### Property 2: State Persistence Equivalence

_For any_ state data, when persisted using pinia-plugin-persistedstate in Origin and responsive-storage in Pure-Admin, retrieving the data should return equivalent values.

**Validates: Requirements 1.3**

### Property 3: Route Configuration Preservation

_For any_ route configuration from Origin, when migrated to Pure-Admin, the automatic routing functionality and permission verification should both work correctly.

**Validates: Requirements 1.4**

### Property 4: Table Component Feature Parity

_For any_ table configuration from Origin, when adapted to @pureadmin/table, all original features (sorting, filtering, pagination, selection) should remain functional.

**Validates: Requirements 2.1**

### Property 5: Form Component Theme Compatibility

_For any_ form component from Origin, when adapted to Pure-Admin's style system, the component should render correctly in both light and dark themes.

**Validates: Requirements 2.2**

### Property 6: Pagination Component Functional Equivalence

_For any_ pagination configuration from Origin, when replaced with Pure-Admin's pagination component, the page change events and data loading should work identically.

**Validates: Requirements 2.4**

### Property 7: API Directory Structure Transformation

_For any_ API file in Origin's src/apis directory, when transformed to Main's src/api directory, the file path should follow Pure-Admin's naming conventions (singular form, kebab-case).

**Validates: Requirements 3.1**

### Property 8: API Call Transformation Correctness

_For any_ axios instance call in Origin, when transformed to Pure-Admin's http tool class call, the HTTP method, URL, parameters, and headers should be preserved.

**Validates: Requirements 3.2**

### Property 9: API Response Handling Consistency

_For any_ API response, the response data structure and error handling logic should be consistent across all API calls after migration.

**Validates: Requirements 3.3**

### Property 10: Style Transformation Equivalence

_For any_ CSS/SCSS style from Origin, when transformed to Tailwind CSS or preserved as SCSS, the visual rendering should be equivalent.

**Validates: Requirements 5.1**

### Property 11: Theme Compatibility

_For any_ component, when rendered in Pure-Admin's light theme and dark theme, the component should display correctly without visual artifacts.

**Validates: Requirements 5.2**

### Property 12: Layout Mode Compatibility

_For any_ page, when displayed in Pure-Admin's vertical, horizontal, and mix layout modes, the page should render correctly and maintain functionality.

**Validates: Requirements 5.3**

### Property 13: Permission Data Structure Transformation

_For any_ menu permission data from Origin, when transformed to Pure-Admin's permission data structure, all permission relationships and hierarchies should be preserved.

**Validates: Requirements 6.1**

### Property 14: Button Permission Directive Completeness

_For any_ operation button in the system, the button should have Pure-Admin's permission directive correctly applied.

**Validates: Requirements 6.2**

### Property 15: Dynamic Route Loading Correctness

_For any_ user role and permission configuration, the dynamically loaded routes should match the user's access rights.

**Validates: Requirements 6.3**

### Property 16: Access Control Correctness

_For any_ user with specific roles and permissions, when accessing a resource, the system should correctly allow or deny access based on the permission rules.

**Validates: Requirements 6.4**

### Property 17: Test Coverage Requirement

_For any_ public component after migration, the unit test coverage should be greater than 80%.

**Validates: Requirements 8.1**

### Property 18: Route Lazy Loading Completeness

_For any_ business module route, the route should be configured with lazy loading (dynamic import).

**Validates: Requirements 9.1**

### Property 19: Virtual Scrolling Performance

_For any_ large list with more than 1000 items, when rendered with virtual scrolling, the rendering performance should be significantly better than without virtual scrolling.

**Validates: Requirements 9.2**

### Property 20: Progress Statistics Accuracy

_For any_ set of migration tasks, the statistics (completed count, in-progress count, pending count, blocked count) should accurately reflect the current task statuses.

**Validates: Requirements 10.4**

### Property 21: Code Formatting Compliance

_For any_ code file after migration, the code should comply with Pure-Admin's ESLint configuration without errors or warnings.

**Validates: Requirements 11.1**

### Property 22: Style Formatting Compliance

_For any_ style file after migration, the styles should comply with Pure-Admin's Stylelint configuration without errors or warnings.

**Validates: Requirements 11.2**

### Property 23: TypeScript Type Completeness

_For any_ TypeScript file after migration, all variables, functions, and parameters should have explicit type definitions, and the usage of 'any' type should be minimized.

**Validates: Requirements 11.3**

## Error Handling

### Error Categories

#### 1. Migration Errors

**Dependency Conflicts:**

- **Detection**: Run dependency checker before migration
- **Handling**: Use pnpm overrides to resolve version conflicts
- **Recovery**: Document conflicts and apply overrides in package.json

**File Transformation Errors:**

- **Detection**: Validate transformed files with linters and type checkers
- **Handling**: Log transformation errors with file path and line number
- **Recovery**: Manual review and correction of failed transformations

**API Compatibility Errors:**

- **Detection**: Test API calls after transformation
- **Handling**: Log API call failures with request/response details
- **Recovery**: Adjust API transformation logic or manually fix API calls

#### 2. Runtime Errors

**HTTP Request Errors:**

- **Detection**: Catch errors in HTTP interceptors
- **Handling**: Display user-friendly error messages, log detailed error info
- **Recovery**: Retry mechanism for transient errors, redirect to error page for critical errors

**State Management Errors:**

- **Detection**: Catch errors in Pinia actions
- **Handling**: Log state errors, reset to safe state if possible
- **Recovery**: Clear corrupted state from storage, reload user data

**Route Navigation Errors:**

- **Detection**: Catch errors in route guards
- **Handling**: Log navigation errors, redirect to safe route
- **Recovery**: Redirect to login page or home page based on error type

#### 3. Component Errors

**Rendering Errors:**

- **Detection**: Use Vue error handlers
- **Handling**: Display error boundary component, log error details
- **Recovery**: Provide fallback UI, allow user to retry or navigate away

**Data Validation Errors:**

- **Detection**: Validate data in form components
- **Handling**: Display validation messages to user
- **Recovery**: Allow user to correct input and resubmit

### Error Handling Strategy

```typescript
// Global error handler
app.config.errorHandler = (err, instance, info) => {
	console.error("Global error:", err);
	console.error("Component:", instance);
	console.error("Error info:", info);

	// Log to error tracking service
	logError({
		error: err,
		component: instance?.$options.name,
		info: info,
	});

	// Show user-friendly message
	ElMessage.error("系统错误，请稍后重试");
};

// HTTP error handler
class CustomHttp extends PureHttp {
	beforeResponseCallback(response) {
		const { code, data, message } = response.data;
		if (code === 200) {
			return data;
		} else {
			ElMessage.error(message);
			throw new HttpError(code, message);
		}
	}

	onError(error) {
		if (error.response) {
			// Server responded with error status
			const { status, data } = error.response;
			if (status === 401) {
				// Unauthorized - redirect to login
				router.push("/login");
			} else if (status === 403) {
				// Forbidden - show permission error
				ElMessage.error("没有权限访问该资源");
			} else if (status === 500) {
				// Server error
				ElMessage.error("服务器错误，请稍后重试");
			}
		} else if (error.request) {
			// Request made but no response
			ElMessage.error("网络错误，请检查网络连接");
		} else {
			// Error in request setup
			ElMessage.error("请求错误");
		}

		return Promise.reject(error);
	}
}
```

### Rollback Mechanism

```typescript
interface BackupPoint {
	id: string;
	timestamp: string;
	branch: string;
	commit: string;
	description: string;
}

class RollbackManager {
	// Create backup before migration
	createBackup(description: string): BackupPoint {
		const timestamp = new Date().toISOString();
		const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
		const commit = execSync("git rev-parse HEAD").toString().trim();

		const backup: BackupPoint = {
			id: `backup-${Date.now()}`,
			timestamp,
			branch,
			commit,
			description,
		};

		// Create backup branch
		execSync(`git branch ${backup.id}`);

		// Save backup info
		this.saveBackupInfo(backup);

		return backup;
	}

	// Rollback to backup point
	rollback(backupId: string): void {
		const backup = this.loadBackupInfo(backupId);
		if (!backup) {
			throw new Error(`Backup not found: ${backupId}`);
		}

		// Confirm with user
		const confirmed = confirm(`确定要回滚到 ${backup.timestamp} 的备份吗？`);
		if (!confirmed) {
			return;
		}

		// Checkout backup branch
		execSync(`git checkout ${backup.id}`);

		// Log rollback
		this.logRollback(backup, "迁移失败，执行回滚");

		console.log(`已回滚到备份: ${backup.description}`);
	}
}
```

## Testing Strategy

### Dual Testing Approach

The migration project requires both unit testing and property-based testing:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties that should hold across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

**Library Selection**: Use `fast-check` for TypeScript/JavaScript property-based testing

**Configuration**: Each property-based test should run a minimum of 100 iterations

**Test Tagging**: Each property-based test must be tagged with a comment explicitly referencing the correctness property in the design document using this format: `**Feature: origin-to-pure-admin-migration, Property {number}: {property_text}**`

**Property Test Examples:**

```typescript
import fc from "fast-check";
import { describe, it, expect } from "vitest";

describe("HTTP Interceptor Logic Preservation", () => {
	/**
	 * Feature: origin-to-pure-admin-migration, Property 1: HTTP Interceptor Logic Preservation
	 *
	 * For any HTTP request configuration from Origin, when adapted to Pure-Admin's HTTP tool class,
	 * the request and response interceptor logic should produce equivalent results for the same inputs.
	 */
	it("should preserve interceptor logic for all request configurations", () => {
		fc.assert(
			fc.property(
				fc.record({
					url: fc.webUrl(),
					method: fc.constantFrom("GET", "POST", "PUT", "DELETE"),
					headers: fc.dictionary(fc.string(), fc.string()),
					data: fc.anything(),
				}),
				async (requestConfig) => {
					// Test with Origin's axios instance
					const originResult = await originAxios.request(requestConfig);

					// Test with Pure-Admin's http tool
					const pureAdminResult = await http.request(requestConfig.method, requestConfig.url, requestConfig.data, {
						headers: requestConfig.headers,
					});

					// Results should be equivalent
					expect(pureAdminResult).toEqual(originResult);
				},
			),
			{ numRuns: 100 },
		);
	});
});

describe("State Persistence Equivalence", () => {
	/**
	 * Feature: origin-to-pure-admin-migration, Property 2: State Persistence Equivalence
	 *
	 * For any state data, when persisted using pinia-plugin-persistedstate in Origin
	 * and responsive-storage in Pure-Admin, retrieving the data should return equivalent values.
	 */
	it("should persist and retrieve state equivalently", () => {
		fc.assert(
			fc.property(
				fc.record({
					token: fc.string(),
					userInfo: fc.record({
						id: fc.string(),
						username: fc.string(),
						name: fc.string(),
					}),
					menus: fc.array(
						fc.record({
							id: fc.string(),
							name: fc.string(),
							path: fc.string(),
						}),
					),
				}),
				(stateData) => {
					// Persist with Origin's method
					originStore.$patch(stateData);
					const originRetrieved = {
						token: originStore.token,
						userInfo: originStore.userInfo,
						menus: originStore.menus,
					};

					// Persist with Pure-Admin's method
					pureAdminStore.setToken(stateData.token);
					pureAdminStore.setUserInfo(stateData.userInfo);
					pureAdminStore.setMenus(stateData.menus);
					const pureAdminRetrieved = {
						token: pureAdminStore.token,
						userInfo: pureAdminStore.userInfo,
						menus: pureAdminStore.menus,
					};

					// Retrieved data should be equivalent
					expect(pureAdminRetrieved).toEqual(originRetrieved);
				},
			),
			{ numRuns: 100 },
		);
	});
});

describe("API Call Transformation Correctness", () => {
	/**
	 * Feature: origin-to-pure-admin-migration, Property 8: API Call Transformation Correctness
	 *
	 * For any axios instance call in Origin, when transformed to Pure-Admin's http tool class call,
	 * the HTTP method, URL, parameters, and headers should be preserved.
	 */
	it("should preserve all API call parameters during transformation", () => {
		fc.assert(
			fc.property(
				fc.record({
					method: fc.constantFrom("get", "post", "put", "delete"),
					url: fc.string(),
					params: fc.dictionary(fc.string(), fc.anything()),
					data: fc.anything(),
					headers: fc.dictionary(fc.string(), fc.string()),
				}),
				(apiCall) => {
					// Transform axios call to http tool call
					const transformedCall = transformApiCall(apiCall);

					// Verify all parameters are preserved
					expect(transformedCall.method).toBe(apiCall.method);
					expect(transformedCall.url).toBe(apiCall.url);
					expect(transformedCall.params).toEqual(apiCall.params);
					expect(transformedCall.data).toEqual(apiCall.data);
					expect(transformedCall.headers).toEqual(apiCall.headers);
				},
			),
			{ numRuns: 100 },
		);
	});
});
```

### Unit Testing

**Test Coverage Target**: > 80% for all public components

**Unit Test Examples:**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Table from "@/components/Table/index.vue";

describe("Table Component", () => {
	let wrapper;

	beforeEach(() => {
		wrapper = mount(Table, {
			props: {
				data: [
					{ id: 1, name: "Test 1" },
					{ id: 2, name: "Test 2" },
				],
				columns: [
					{ label: "ID", prop: "id" },
					{ label: "Name", prop: "name" },
				],
			},
		});
	});

	it("should render table with correct data", () => {
		expect(wrapper.find("table").exists()).toBe(true);
		expect(wrapper.findAll("tbody tr")).toHaveLength(2);
	});

	it("should emit page-change event when page changes", async () => {
		await wrapper.find(".el-pagination").trigger("click");
		expect(wrapper.emitted("page-change")).toBeTruthy();
	});

	it("should display loading state", async () => {
		await wrapper.setProps({ loading: true });
		expect(wrapper.find(".el-loading-mask").exists()).toBe(true);
	});
});
```

### Integration Testing

**Scope**: Test interactions between components, API calls, and state management

**Integration Test Examples:**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useUserStore } from "@/store/modules/user";
import { getUserList } from "@/api/system/user";

describe("User Management Integration", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("should load user list and update store", async () => {
		const userStore = useUserStore();

		// Load users
		const { data, total } = await getUserList({ pageSize: 10, currentPage: 1 });

		// Verify API response
		expect(data).toBeInstanceOf(Array);
		expect(total).toBeGreaterThan(0);

		// Update store
		userStore.setUsers(data);

		// Verify store state
		expect(userStore.users).toEqual(data);
	});

	it("should handle authentication flow", async () => {
		const userStore = useUserStore();

		// Login
		await userStore.login({ username: "test", password: "test123" });

		// Verify token is set
		expect(userStore.token).toBeTruthy();

		// Load user info
		await userStore.loadUser();

		// Verify user info is loaded
		expect(userStore.userInfo).toBeTruthy();
		expect(userStore.userInfo.username).toBe("test");

		// Logout
		userStore.logout();

		// Verify state is cleared
		expect(userStore.token).toBe("");
		expect(userStore.userInfo).toBeNull();
	});
});
```

### End-to-End Testing

**Tool**: Playwright or Cypress

**E2E Test Examples:**

```typescript
import { test, expect } from "@playwright/test";

test.describe("User Management E2E", () => {
	test.beforeEach(async ({ page }) => {
		// Login
		await page.goto("/login");
		await page.fill('input[name="username"]', "admin");
		await page.fill('input[name="password"]', "admin123");
		await page.click('button[type="submit"]');
		await page.waitForURL("/");
	});

	test("should create, edit, and delete user", async ({ page }) => {
		// Navigate to user management
		await page.click("text=系统管理");
		await page.click("text=用户管理");
		await page.waitForURL("/system/user");

		// Create user
		await page.click("text=新增");
		await page.fill('input[name="username"]', "testuser");
		await page.fill('input[name="name"]', "Test User");
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="password"]', "test123");
		await page.click('button:has-text("确定")');

		// Verify user is created
		await expect(page.locator("text=testuser")).toBeVisible();

		// Edit user
		await page.click('tr:has-text("testuser") button:has-text("编辑")');
		await page.fill('input[name="name"]', "Updated User");
		await page.click('button:has-text("确定")');

		// Verify user is updated
		await expect(page.locator("text=Updated User")).toBeVisible();

		// Delete user
		await page.click('tr:has-text("testuser") button:has-text("删除")');
		await page.click('button:has-text("确定")');

		// Verify user is deleted
		await expect(page.locator("text=testuser")).not.toBeVisible();
	});
});
```

### Performance Testing

**Metrics to Track:**

- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3s
- Total Bundle Size < 2MB
- Route Lazy Loading: All routes should be lazy loaded

**Performance Test Examples:**

```typescript
import { describe, it, expect } from "vitest";
import { performance } from "perf_hooks";

describe("Performance Tests", () => {
	it("should load large list with virtual scrolling efficiently", () => {
		const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

		const startTime = performance.now();

		// Render with virtual scrolling
		const wrapper = mount(VirtualList, {
			props: { items, itemHeight: 40 },
		});

		const endTime = performance.now();
		const renderTime = endTime - startTime;

		// Should render in less than 100ms
		expect(renderTime).toBeLessThan(100);
	});

	it("should have reasonable bundle size", async () => {
		const stats = await getBuildStats();

		// Total bundle size should be less than 2MB
		expect(stats.totalSize).toBeLessThan(2 * 1024 * 1024);

		// Individual chunks should be less than 500KB
		stats.chunks.forEach((chunk) => {
			expect(chunk.size).toBeLessThan(500 * 1024);
		});
	});
});
```

### Test Execution Strategy

1. **During Development**: Run unit tests on file save
2. **Before Commit**: Run unit tests and linters via Husky
3. **On Pull Request**: Run all tests (unit, integration, property-based)
4. **Before Deployment**: Run full test suite including E2E tests
5. **After Deployment**: Run smoke tests to verify critical paths

### Test Documentation

Each test should include:

- Clear description of what is being tested
- Reference to requirements being validated
- Setup and teardown procedures
- Expected outcomes
- Edge cases covered

## Router Configuration Cleanup

### Current State Analysis

当前 main/src/router/index.ts 使用了多个自动化路由相关的依赖：

1. **vue-router/auto**: 自动化路由插件，基于文件系统自动生成路由
2. **virtual:meta-layouts**: 虚拟模块，用于自动布局组件注入
3. **@ruan-cat/utils/unplugin-vue-router**: 自定义的路由处理工具
4. **vite-plugin-vue-meta-layouts**: Vite 插件，用于元数据布局管理

这些自动化工具虽然提供了便利，但也带来了以下问题：

- 增加了项目复杂度和学习成本
- 与 Pure-Admin 的标准路由方式不一致
- 调试困难，路由生成过程不透明
- 可能导致路由冲突和死循环问题

### Target State

采用 Pure-Admin 标准的路由配置方式：

1. **手动路由配置**: 在 main/src/router/modules 目录下手动定义路由
2. **原生 createRouter**: 使用 vue-router 原生的 createRouter 函数
3. **清晰的路由结构**: 路由配置文件清晰可读，易于维护
4. **标准的懒加载**: 使用动态 import 实现路由懒加载

### Migration Steps

#### 1. Remove Auto-Router Dependencies

从 main/src/router/index.ts 中移除以下导入：

```typescript
// 移除这些导入
import { createRouter } from "vue-router/auto";
import { handleHotUpdate, routes as autoRoutes } from "vue-router/auto-routes";
import { createGetRoutes, setupLayouts } from "virtual:meta-layouts";
import { disposalAutoRouter } from "@ruan-cat/utils/unplugin-vue-router";
```

恢复使用 vue-router 原生导入：

```typescript
// 使用原生导入
import { createRouter } from "vue-router";
```

#### 2. Simplify Router Creation

简化路由实例创建逻辑：

```typescript
// 移除前
export const router: Router = createRouter({
	history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
	routes: setupLayouts(constantRoutes.concat(...(remainingRouter as any))),
	strict: true,
	scrollBehavior(to, from, savedPosition) {
		// ...
	},
});

// 移除后
export const router: Router = createRouter({
	history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
	routes: constantRoutes.concat(...(remainingRouter as any)),
	strict: true,
	scrollBehavior(to, from, savedPosition) {
		// ...
	},
});
```

#### 3. Remove Auto-Route Processing Logic

移除自动路由相关的处理逻辑：

```typescript
// 移除这些变量和逻辑
const isAutoRoutes = false;
const flattenAutoRoutes = formatFlatteningRoutes(buildHierarchyTree(ascending(autoRoutes.flat(Infinity))));
const cleanedAutoRoutes = disposalAutoRouter(autoRoutes);
```

#### 4. Simplify Route Constants

简化路由常量定义：

```typescript
// 移除前
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
	formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity)))),
);

const initConstantRoutes: Array<RouteRecordRaw> = cloneDeep(setupLayouts(constantRoutes));

// 移除后
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
	formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity)))),
);

const initConstantRoutes: Array<RouteRecordRaw> = cloneDeep(constantRoutes);
```

### Page Structure Reorganization

#### Current Structure Issues

当前 main/src/views 和 main/src/pages 目录混合使用：

- **main/src/views**: 包含 Pure-Admin 示例页面和部分业务页面
- **main/src/pages**: 包含测试页面（a、b 目录）和部分业务页面

这种混合结构导致：

- 难以区分框架示例代码和业务代码
- 测试页面污染业务代码目录
- 不符合项目规范

#### Target Structure

明确的目录职责划分：

- **main/src/views**: 仅保留 Pure-Admin 框架自带的示例页面
- **main/src/pages**: 存放所有从 Origin 项目迁移的业务页面

#### Business Pages Organization

业务页面按照业务模块分类存储：

```plain
main/src/pages/
├── system/              # 系统管理模块
│   ├── user/           # 用户管理
│   ├── role/           # 角色管理
│   ├── menu/           # 菜单管理
│   └── dept/           # 部门管理
├── base-data/          # 基础数据模块
│   ├── goods/          # 商品管理
│   ├── customer/       # 客户管理
│   └── supplier/       # 供应商管理
├── purchase/           # 采购管理模块
│   ├── appointment/    # 预约采购
│   └── receiving/      # 收货管理
├── inventory/          # 库存管理模块
│   ├── check/          # 库存盘点
│   └── stock/          # 库存查询
├── outbound/           # 出库管理模块
│   └── picking/        # 拣货管理
├── daily-check/        # 日常检查模块
│   ├── abnormal/       # 异常发货
│   └── temperature/    # 温度维护
├── base-config/        # 基础配置模块
│   ├── auto-code/      # 自动编码
│   ├── unit/           # 计量单位
│   └── product-category/ # 产品类别
├── warehouse-config/   # 仓库配置模块
│   └── order-type/     # 订单类型
├── report/             # 客户报表模块
│   ├── stock/          # 库存报表
│   └── expiry-warning/ # 有效期预警
└── personnel-config/   # 人员配置模块
    └── academic-code/  # 学历代码
```

#### Pages to Remove

从 main/src/pages 目录删除以下测试页面：

- main/src/pages/a/
- main/src/pages/b/

### Route Registration Standards

#### Route Configuration File Structure

按照 Pure-Admin 文档规范，在 main/src/router/modules 目录下创建路由配置文件：

```typescript
// main/src/router/modules/system.ts
const systemRouter: RouteConfigsTable = {
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
			component: () => import("@/pages/system/user/index.vue"),
			meta: {
				title: "用户管理",
				showLink: true,
			},
		},
		{
			path: "/system/role",
			name: "SystemRole",
			component: () => import("@/pages/system/role/index.vue"),
			meta: {
				title: "角色管理",
				showLink: true,
			},
		},
		{
			path: "/system/menu",
			name: "SystemMenu",
			component: () => import("@/pages/system/menu/index.vue"),
			meta: {
				title: "菜单管理",
				showLink: true,
			},
		},
		{
			path: "/system/dept",
			name: "SystemDept",
			component: () => import("@/pages/system/dept/index.vue"),
			meta: {
				title: "部门管理",
				showLink: true,
			},
		},
	],
};

export default systemRouter;
```

#### Route Meta Configuration

路由元信息必须包含以下字段：

```typescript
interface RouteMeta {
	// 必填字段
	title: string; // 路由标题，用于菜单显示和页面标题

	// 可选字段
	icon?: string; // 菜单图标
	showLink?: boolean; // 是否在菜单中显示，默认 true
	rank?: number; // 菜单排序，数字越小越靠前
	keepAlive?: boolean; // 是否缓存页面
	roles?: string[]; // 允许访问的角色列表
	auths?: string[]; // 允许访问的权限列表
}
```

#### Component Lazy Loading

所有路由组件必须使用动态导入实现懒加载：

```typescript
// 正确的懒加载方式
component: () => import("@/pages/system/user/index.vue");

// 错误的直接导入方式（不要使用）
import UserPage from "@/pages/system/user/index.vue";
component: UserPage;
```

#### Route Naming Conventions

路由命名遵循以下规范：

1. **路由路径**: 使用 kebab-case，如 `/system/user`
2. **路由名称**: 使用 PascalCase，如 `SystemUser`
3. **组件路径**: 相对于 src 目录，使用 `@/` 别名

### Correctness Properties for Router Cleanup

#### Property 24: Auto-Router Dependencies Removal

_For any_ import statement in main/src/router/index.ts, the file should not import from vue-router/auto, virtual:meta-layouts, @ruan-cat/utils/unplugin-vue-router, or vite-plugin-vue-meta-layouts.

**Validates: Requirements 13.1, 13.2, 13.3, 13.4**

#### Property 25: Native Router Usage

_For any_ router instance creation, the createRouter function should be imported from vue-router (not vue-router/auto).

**Validates: Requirements 13.5**

#### Property 26: Business Pages Location

_For any_ business page migrated from Origin project, the page file should be located in main/src/pages directory (not main/src/views).

**Validates: Requirements 14.1**

#### Property 27: Test Pages Removal

_For any_ directory in main/src/pages, the directory should not be a test directory (such as 'a' or 'b').

**Validates: Requirements 14.3**

#### Property 28: Route Configuration Completeness

_For any_ business page in main/src/pages, there should be a corresponding route configuration in main/src/router/modules.

**Validates: Requirements 15.1**

#### Property 29: Route Meta Completeness

_For any_ route configuration, the meta field should include at least the title field.

**Validates: Requirements 15.3**

#### Property 30: Route Lazy Loading

_For any_ route component configuration, the component should be loaded using dynamic import (() => import()).

**Validates: Requirements 15.4**
