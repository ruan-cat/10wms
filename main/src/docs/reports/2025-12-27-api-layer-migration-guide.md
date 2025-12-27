# 2025-12-27 API 层迁移指南

## 1. 概述

本文档提供 Origin 项目 API 层迁移到 Main 项目的详细指南。Origin 项目使用自定义的 Request 类封装 axios，Main 项目使用 Pure-Admin 的 HTTP 工具类。

## 2. API 目录结构对比

### 2.1 Origin 项目结构

```plain
origin/src/apis/
├── request.js                    # 自定义 Request 类
├── login/                        # 登录相关 API
│   └── index.js
├── menu/                         # 菜单相关 API
│   └── index.js
├── sys-manager/                  # 系统管理 API
│   ├── user.ts
│   ├── user.test.ts
│   └── modify.ts
├── sysmanager/                   # 系统管理 API（另一版本）
│   ├── catagory.ts
│   ├── icons.ts
│   └── typegroup.ts
├── base-data/                    # 基础数据 API
│   └── index.js
├── dashboard/                    # 仪表盘 API
│   └── index.js
├── daycheck/                     # 日常检查 API
│   ├── temperature.ts
│   └── temperature.test.ts
├── message-middle/               # 消息中间件 API
│   └── index.js
├── notice-remind/                # 通知提醒 API
│   └── index.js
└── [其他业务模块...]
```

### 2.2 Main 项目结构

```plain
main/src/api/
├── list.ts                       # 列表相关 API
├── mock.ts                       # Mock 数据
├── routes.ts                     # 路由相关 API
├── system.ts                     # 系统相关 API
├── test.ts                       # 测试 API
└── user.ts                       # 用户相关 API
```

### 2.3 建议的目标结构

```plain
main/src/api/
├── system/                       # 系统管理模块
│   ├── user.ts                   # 用户管理
│   ├── role.ts                   # 角色管理
│   ├── menu.ts                   # 菜单管理
│   └── dept.ts                   # 部门管理
├── base-data/                    # 基础数据模块
│   ├── commodity.ts              # 商品管理
│   ├── customer.ts               # 客户管理
│   └── supplier.ts               # 供应商管理
├── purchase/                     # 采购管理模块
│   ├── appointment.ts            # 预约采购
│   ├── batch-receive.ts          # 批量收货
│   └── inventory-query.ts        # 库存查询
├── inventory/                    # 库存管理模块
│   ├── comprehensive-check.ts    # 综合盘点
│   ├── transfer-check.ts         # 移库盘点
│   └── shelf-adjust.ts           # 货架调整
├── outbound/                     # 出库管理模块
│   ├── picking.ts                # 拣货管理
│   └── type.ts                   # 出库类型
├── daily-check/                  # 日常检查模块
│   ├── abnormal-delivery.ts      # 异常发货
│   └── temperature.ts            # 温度维护
├── config/                       # 基础配置模块
│   ├── auto-code.ts              # 自动编码
│   ├── unit.ts                   # 计量单位
│   └── product-category.ts       # 产品类别
├── billing/                      # 计费配置模块
│   ├── mode.ts                   # 计费模式
│   └── template.ts               # 费用模板
├── message/                      # 消息中间件模块
│   ├── center.ts                 # 消息中心
│   └── template.ts               # 消息模板
├── region/                       # 区域配置模块
│   ├── info.ts                   # 区域信息
│   └── city-type.ts              # 城市类型
├── personnel/                    # 人员配置模块
│   ├── education.ts              # 学历代码
│   └── employment.ts             # 就业状态
├── warehouse/                    # 仓库配置模块
│   └── order-type.ts             # 订单类型
├── report/                       # 客户报表模块
│   ├── inventory.ts              # 库存报表
│   └── expiry-warning.ts         # 有效期预警
├── auth/                         # 认证模块
│   └── login.ts                  # 登录
└── common/                       # 公共模块
    ├── dashboard.ts              # 仪表盘
    └── upload.ts                 # 文件上传
```

## 3. Request 类对比

### 3.1 Origin 的 Request 类

**特点：**

- 自定义封装 axios
- 使用静态方法
- 支持多种请求方式（GET、POST、PUT、DELETE）
- 支持多种数据格式（form、json、file、stream）

**示例：**

```javascript
import Request from "../request";

// GET 请求
Request.requestJson(Request.GET, "/api/users");

// POST 请求
Request.requestJson(Request.POST, "/api/users", { name: "张三" });

// 文件上传
Request.postFile("/api/upload", { file: fileObject });
```

### 3.2 Main 的 HTTP 工具类

**特点：**

- 基于 Pure-Admin 的 HTTP 工具类
- 使用实例方法
- 自动处理请求/响应拦截
- 统一错误处理

**示例：**

```typescript
import { http } from "@/utils/http";

// GET 请求
http.request("get", "/api/users");

// POST 请求
http.request("post", "/api/users", { data: { name: "张三" } });

// 文件上传
http.request("post", "/api/upload", {
	data: formData,
	headers: { "Content-Type": "multipart/form-data" },
});
```

## 4. API 迁移步骤

### 4.1 步骤 1：创建目录结构

```bash
# 在 main/src/api/ 下创建业务模块目录
mkdir -p main/src/api/system
mkdir -p main/src/api/base-data
mkdir -p main/src/api/purchase
# ... 其他模块
```

### 4.2 步骤 2：转换 API 调用

#### 原代码（Origin）

```javascript
// origin/src/apis/login/index.js
import Request from "../request";

export async function login(data, success, fail) {
	try {
		const res = await Request.requestJson(Request.POST, "/login/auth-login", data);
		if (res.data) {
			success(res.data);
		} else {
			fail();
		}
	} catch (err) {
		fail();
	}
}
```

#### 转换后（Main）

```typescript
// main/src/api/auth/login.ts
import { http } from "@/utils/http";

export interface LoginParams {
	username: string;
	password: string;
}

export interface LoginResult {
	token: string;
	userInfo: {
		id: string;
		username: string;
		realname: string;
	};
}

/** 登录接口 */
export function login(data: LoginParams) {
	return http.request<LoginResult>("post", "/login/auth-login", { data });
}
```

### 4.3 步骤 3：定义类型接口

**为每个 API 定义：**

1. 请求参数类型
2. 响应数据类型
3. JSDoc 注释

**示例：**

```typescript
/**
 * 添加用户接口参数
 */
export interface AddUserParams {
	/** 用户账号 */
	username: string;
	/** 密码 */
	password: string;
	/** 用户姓名 */
	realname?: string;
	/** 邮箱 */
	email?: string;
	/** 手机号码 */
	mobilePhone?: string;
	/** 部门ID数组 */
	departmentIds: string[];
	/** 角色ID数组 */
	roleIds: string[];
	/** 用户类型 */
	userType?: string;
}

/**
 * 添加用户接口
 * @description 添加新用户
 */
export function addUser(data: AddUserParams) {
	return http.request<string>("post", "/sys-manager/adduser", { data });
}
```

### 4.4 步骤 4：处理回调函数

**Origin 使用回调函数：**

```javascript
login(
	data,
	() => {
		/* 成功 */
	},
	() => {
		/* 失败 */
	},
);
```

**Main 使用 Promise：**

```typescript
try {
	const result = await login(data);
	// 成功处理
} catch (error) {
	// 失败处理
}
```

### 4.5 步骤 5：更新组件中的调用

**原代码：**

```javascript
import { login } from "@/apis/login";

login(
	{ username, password },
	() => {
		ElMessage.success("登录成功");
		router.push("/");
	},
	() => {
		ElMessage.error("登录失败");
	},
);
```

**转换后：**

```typescript
import { login } from "@/api/auth/login";

try {
	const result = await login({ username, password });
	useUserStoreHook().setToken(result.token);
	ElMessage.success("登录成功");
	router.push("/");
} catch (error) {
	ElMessage.error("登录失败");
}
```

## 5. 常见转换模式

### 5.1 GET 请求转换

**Origin：**

```javascript
Request.requestJson(Request.GET, "/api/users", { page: 1, size: 10 });
```

**Main：**

```typescript
http.request("get", "/api/users", { params: { page: 1, size: 10 } });
```

### 5.2 POST 请求转换

**Origin：**

```javascript
Request.requestJson(Request.POST, "/api/users", { name: "张三" });
```

**Main：**

```typescript
http.request("post", "/api/users", { data: { name: "张三" } });
```

### 5.3 PUT 请求转换

**Origin：**

```javascript
Request.requestJson(Request.PUT, "/api/users/1", { name: "李四" });
```

**Main：**

```typescript
http.request("put", "/api/users/1", { data: { name: "李四" } });
```

### 5.4 DELETE 请求转换

**Origin：**

```javascript
Request.requestJson(Request.DELETE, "/api/users/1");
```

**Main：**

```typescript
http.request("delete", "/api/users/1");
```

### 5.5 文件上传转换

**Origin：**

```javascript
Request.postFile("/api/upload", { file: fileObject });
```

**Main：**

```typescript
const formData = new FormData();
formData.append("file", fileObject);

http.request("post", "/api/upload", {
	data: formData,
	headers: { "Content-Type": "multipart/form-data" },
});
```

### 5.6 路径参数转换

**Origin：**

```javascript
Request.requestJson(Request.GET, `/api/users/${userId}`);
```

**Main：**

```typescript
http.request("get", `/api/users/${userId}`);
```

## 6. 类型定义规范

### 6.1 命名规范

|   类型   |    命名规范    |              示例               |
| :------: | :------------: | :-----------------------------: |
| 请求参数 | `{功能}Params` | `LoginParams`, `AddUserParams`  |
| 响应数据 | `{功能}Result` | `LoginResult`, `UserListResult` |
| 数据模型 |  `{实体}DTO`   |      `UserDTO`, `MenuDTO`       |
| 分页数据 |   `Page<T>`    |         `Page<UserDTO>`         |

### 6.2 通用类型定义

```typescript
/** 分页参数 */
export interface PageParams {
	/** 当前页码 */
	page: number;
	/** 每页数量 */
	size: number;
	/** 排序字段 */
	sortField?: string;
	/** 排序方向 */
	sortOrder?: "asc" | "desc";
}

/** 分页结果 */
export interface PageResult<T> {
	/** 数据列表 */
	list: T[];
	/** 总数 */
	total: number;
	/** 当前页码 */
	page: number;
	/** 每页数量 */
	size: number;
}

/** 通用响应 */
export interface ApiResponse<T = any> {
	/** 状态码 */
	code: number;
	/** 消息 */
	message: string;
	/** 数据 */
	data: T;
	/** 时间戳 */
	timestamp: number;
}
```

## 7. 错误处理

### 7.1 Origin 的错误处理

```javascript
try {
	const res = await Request.requestJson(Request.POST, url, data);
	if (res.data) {
		success(res.data);
	} else {
		fail();
	}
} catch (err) {
	console.warn(err);
	fail();
}
```

### 7.2 Main 的错误处理

```typescript
try {
	const result = await http.request("post", url, { data });
	// 成功处理
	return result;
} catch (error) {
	// 错误已在拦截器中统一处理
	// 这里只需要处理特定的业务逻辑
	throw error;
}
```

### 7.3 统一错误处理（在拦截器中）

Main 项目的 HTTP 工具类已经在响应拦截器中统一处理错误：

- 401：跳转登录页
- 403：权限不足提示
- 404：资源不存在提示
- 500：服务器错误提示

## 8. 迁移检查清单

### 8.1 API 文件迁移

- [ ] 创建对应的目录结构
- [ ] 转换 Request 调用为 http 调用
- [ ] 定义请求参数类型
- [ ] 定义响应数据类型
- [ ] 添加 JSDoc 注释
- [ ] 移除回调函数，使用 Promise
- [ ] 处理路径参数
- [ ] 处理查询参数
- [ ] 处理请求体数据

### 8.2 组件调用迁移

- [ ] 更新 import 路径
- [ ] 移除回调函数
- [ ] 使用 async/await
- [ ] 添加 try-catch 错误处理
- [ ] 更新状态管理调用
- [ ] 测试 API 调用

### 8.3 类型定义

- [ ] 定义所有请求参数类型
- [ ] 定义所有响应数据类型
- [ ] 使用通用类型（PageParams、PageResult）
- [ ] 添加 JSDoc 注释
- [ ] 导出所有类型

## 9. 迁移优先级

### 9.1 P0 - 核心功能（必须迁移）

|   模块   |    API 文件    | 优先级 |
| :------: | :------------: | :----: |
|   认证   |    login.ts    |   P0   |
| 用户管理 | system/user.ts |   P0   |
| 菜单管理 | system/menu.ts |   P0   |
| 角色管理 | system/role.ts |   P0   |

### 9.2 P1 - 重要功能（优先迁移）

|    模块    |        API 文件        | 优先级 |
| :--------: | :--------------------: | :----: |
|  部门管理  |     system/dept.ts     |   P1   |
|  商品管理  | base-data/commodity.ts |   P1   |
|  客户管理  | base-data/customer.ts  |   P1   |
| 供应商管理 | base-data/supplier.ts  |   P1   |

### 9.3 P2 - 一般功能（按需迁移）

|   模块   |     API 文件      | 优先级 |
| :------: | :---------------: | :----: |
| 采购管理 |  purchase/\*.ts   |   P2   |
| 库存管理 |  inventory/\*.ts  |   P2   |
| 出库管理 |  outbound/\*.ts   |   P2   |
| 日常检查 | daily-check/\*.ts |   P2   |

### 9.4 P3 - 辅助功能（最后迁移）

|    模块    |    API 文件     | 优先级 |
| :--------: | :-------------: | :----: |
|  基础配置  |  config/\*.ts   |   P3   |
|  计费配置  |  billing/\*.ts  |   P3   |
| 消息中间件 |  message/\*.ts  |   P3   |
|  区域配置  |  region/\*.ts   |   P3   |
|  人员配置  | personnel/\*.ts |   P3   |
|  仓库配置  | warehouse/\*.ts |   P3   |
|  客户报表  |  report/\*.ts   |   P3   |

## 10. 迁移示例

### 10.1 完整示例：用户管理 API

**Origin 代码：**

```typescript
// origin/src/apis/sys-manager/user.ts
export interface AddUserDTO {
	departmentIds: string[];
	email?: string;
	mobilePhone?: string;
	password: string;
	realname?: string;
	roleIds: string[];
	userType?: string;
	username: string;
}

export function sysManagerAddUser<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddUserDTO>({
		url: "/sys-manager/adduser",
		options,
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				departmentIds: [],
				password: "",
				roleIds: [],
				username: "",
			},
		},
	});
}
```

**Main 代码：**

```typescript
// main/src/api/system/user.ts
import { http } from "@/utils/http";

/**
 * 添加用户接口参数
 */
export interface AddUserParams {
	/** 用户账号 */
	username: string;
	/** 密码 */
	password: string;
	/** 用户姓名 */
	realname?: string;
	/** 邮箱 */
	email?: string;
	/** 手机号码 */
	mobilePhone?: string;
	/** 办公电话 */
	officePhone?: string;
	/** 部门ID数组 */
	departmentIds: string[];
	/** 角色ID数组 */
	roleIds: string[];
	/** 用户类型：1-系统用户, 2-接口用户, 3-公司权限, 4-当前用户接口 */
	userType?: "1" | "2" | "3" | "4";
}

/**
 * 用户信息
 */
export interface UserDTO {
	/** 用户ID */
	id: string;
	/** 用户账号 */
	username: string;
	/** 用户姓名 */
	realname: string;
	/** 邮箱 */
	email?: string;
	/** 手机号码 */
	mobilePhone?: string;
	/** 办公电话 */
	officePhone?: string;
	/** 用户类型 */
	userType: string;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
}

/**
 * 添加用户
 * @description 添加新用户到系统
 */
export function addUser(data: AddUserParams) {
	return http.request<string>("post", "/sys-manager/adduser", { data });
}

/**
 * 删除用户
 * @description 删除指定用户
 * @param userId 用户ID
 */
export function deleteUser(userId: string) {
	return http.request<string>("delete", `/sys-manager/${userId}`);
}

/**
 * 重置密码参数
 */
export interface ResetPasswordParams {
	/** 用户ID */
	userId: string;
	/** 新密码 */
	newPassword: string;
}

/**
 * 重置用户密码
 * @description 重置指定用户的密码
 */
export function resetPassword(data: ResetPasswordParams) {
	return http.request<string>("post", "/sys-manager/reset-password", { data });
}

/**
 * 获取用户列表参数
 */
export interface GetUserListParams extends PageParams {
	/** 用户名（模糊查询） */
	username?: string;
	/** 真实姓名（模糊查询） */
	realname?: string;
	/** 用户类型 */
	userType?: string;
}

/**
 * 获取用户列表
 * @description 分页查询用户列表
 */
export function getUserList(params: GetUserListParams) {
	return http.request<PageResult<UserDTO>>("get", "/sys-manager/users", { params });
}

/**
 * 获取用户详情
 * @description 获取指定用户的详细信息
 * @param userId 用户ID
 */
export function getUserDetail(userId: string) {
	return http.request<UserDTO>("get", `/sys-manager/users/${userId}`);
}

/**
 * 更新用户信息
 * @description 更新指定用户的信息
 */
export function updateUser(userId: string, data: Partial<AddUserParams>) {
	return http.request<string>("put", `/sys-manager/users/${userId}`, { data });
}
```

## 11. 测试建议

### 11.1 单元测试

为每个 API 文件创建对应的测试文件：

```typescript
// main/src/api/system/user.test.ts
import { describe, it, expect, vi } from "vitest";
import { addUser, deleteUser, getUserList } from "./user";

describe("用户管理 API", () => {
	it("应该能够添加用户", async () => {
		const params = {
			username: "test",
			password: "123456",
			departmentIds: ["1"],
			roleIds: ["1"],
		};

		// Mock http.request
		// 测试逻辑
	});

	it("应该能够删除用户", async () => {
		// 测试逻辑
	});

	it("应该能够获取用户列表", async () => {
		// 测试逻辑
	});
});
```

### 11.2 集成测试

在实际页面中测试 API 调用：

```typescript
// 在用户管理页面中测试
const handleAdd = async () => {
	try {
		await addUser(formData);
		ElMessage.success("添加成功");
		await loadUserList();
	} catch (error) {
		ElMessage.error("添加失败");
	}
};
```

## 12. 注意事项

### 12.1 URL 路径

- 确保 API 路径与后端接口一致
- 注意路径参数的格式
- 注意查询参数的传递方式

### 12.2 数据格式

- 确认请求数据格式（JSON、FormData）
- 确认响应数据结构
- 处理日期格式转换

### 12.3 错误处理

- 统一使用 try-catch
- 不要在 API 层处理 UI 提示
- 让调用方决定如何处理错误

### 12.4 类型安全

- 所有 API 都要有类型定义
- 避免使用 any 类型
- 使用泛型提高复用性

## 13. 总结

API 层迁移是一个系统性工程，需要：

1. **统一目录结构**：按业务模块组织 API 文件
2. **转换调用方式**：从 Request 类转换为 http 工具类
3. **完善类型定义**：为所有 API 定义类型
4. **优化错误处理**：使用 Promise 和 async/await
5. **分阶段迁移**：按优先级逐步迁移
6. **充分测试**：确保迁移后功能正常

建议采用渐进式迁移策略，先迁移核心功能，再逐步迁移其他模块。

