# API 层迁移总结

## 1. 迁移概述

本次完成了 API 层迁移的基础工作，包括创建迁移指南、示例 API 文件和通用类型定义。

## 2. 已完成工作

### 2.1 迁移指南文档 ✅

创建了 `api-layer-migration-guide.md`，包含：

- Origin 和 Main 项目的 API 结构对比
- Request 类到 HTTP 工具类的转换方法
- 详细的迁移步骤和示例
- 常见转换模式
- 类型定义规范
- 错误处理方式
- 迁移检查清单
- 迁移优先级划分

### 2.2 目录结构规划 ✅

规划了清晰的 API 目录结构：

```plain
main/src/api/
├── auth/                  # 认证模块
├── system/                # 系统管理模块
├── base-data/             # 基础数据模块
├── purchase/              # 采购管理模块
├── inventory/             # 库存管理模块
├── outbound/              # 出库管理模块
├── daily-check/           # 日常检查模块
├── config/                # 基础配置模块
├── billing/               # 计费配置模块
├── message/               # 消息中间件模块
├── region/                # 区域配置模块
├── personnel/             # 人员配置模块
├── warehouse/             # 仓库配置模块
├── report/                # 客户报表模块
└── common/                # 公共模块
```

### 2.3 示例 API 文件 ✅

创建了三个示例 API 文件作为迁移参考：

#### 1. 认证模块（auth/login.ts）

```typescript
// 登录接口
export function login(data: LoginParams): Promise<LoginResult>;

// 登出接口
export function logout(): Promise<void>;

// 刷新令牌接口
export function refreshToken(refreshToken: string): Promise<{ token: string }>;
```

#### 2. 用户管理（system/user.ts）

```typescript
// 添加用户
export function addUser(data: AddUserParams): Promise<string>;

// 删除用户
export function deleteUser(userId: string): Promise<string>;

// 批量删除用户
export function batchDeleteUsers(userIds: string[]): Promise<string>;

// 重置密码
export function resetPassword(data: ResetPasswordParams): Promise<string>;

// 获取用户列表
export function getUserList(params: GetUserListParams): Promise<PageResult<UserDTO>>;

// 获取用户详情
export function getUserDetail(userId: string): Promise<UserDTO>;

// 更新用户信息
export function updateUser(userId: string, data: Partial<AddUserParams>): Promise<string>;

// 启用/禁用用户
export function toggleUserStatus(userId: string, status: "0" | "1"): Promise<string>;

// 获取用户角色
export function getUserRoles(userId: string): Promise<Array<{ id: string; name: string }>>;

// 分配用户角色
export function assignUserRoles(userId: string, roleIds: string[]): Promise<string>;
```

#### 3. 菜单管理（system/menu.ts）

```typescript
// 获取菜单列表
export function getMenuList(): Promise<MenuDTO[]>;

// 获取菜单详情
export function getMenuDetail(menuId: string): Promise<MenuDTO>;

// 获取菜单树
export function getMenuTree(menuId?: string): Promise<MenuDTO[]>;

// 添加菜单
export function addMenu(data: AddMenuParams): Promise<string>;

// 更新菜单
export function updateMenu(data: Partial<AddMenuParams> & { id: string }): Promise<string>;

// 删除菜单
export function deleteMenu(menuId: string): Promise<string>;

// 获取用户菜单
export function getUserMenus(): Promise<MenuDTO[]>;
```

### 2.4 通用类型定义 ✅

创建了 `main/src/types/common.ts`，包含：

```typescript
// 分页参数
export interface PageParams {
	page: number;
	size: number;
	sortField?: string;
	sortOrder?: "asc" | "desc";
}

// 分页结果
export interface PageResult<T> {
	list: T[];
	total: number;
	page: number;
	size: number;
}

// 通用响应
export interface ApiResponse<T = any> {
	code: number;
	message: string;
	data: T;
	timestamp: number;
}

// 树形节点
export interface TreeNode<T = any> {
	id: string;
	parentId: string;
	label: string;
	children?: TreeNode<T>[];
	data?: T;
}

// 选项
export interface Option<V = string> {
	label: string;
	value: V;
	disabled?: boolean;
	[key: string]: any;
}

// 键值对
export interface KeyValue<K = string, V = any> {
	key: K;
	value: V;
}
```

## 3. 关键改进

### 3.1 从回调函数到 Promise

**Origin 代码：**

```javascript
export async function login(data, success, fail) {
	try {
		const res = await Request.requestJson(Request.POST, url, data);
		if (res.data) {
			success(res.data);
		} else {
			fail();
		}
	} catch (err) {
		fail();
	}
}

// 使用
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

**Main 代码：**

```typescript
export function login(data: LoginParams) {
	return http.request<LoginResult>("post", "/login/auth-login", { data });
}

// 使用
try {
	const result = await login(data);
	// 成功处理
} catch (error) {
	// 失败处理
}
```

### 3.2 完整的类型定义

**Origin 代码：**

```typescript
export interface AddUserDTO {
	departmentIds: string[];
	password: string;
	roleIds: string[];
	username: string;
}
```

**Main 代码：**

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
	/** 办公电话 */
	officePhone?: string;
	/** 部门ID数组 */
	departmentIds: string[];
	/** 角色ID数组 */
	roleIds: string[];
	/** 用户类型：1-系统用户, 2-接口用户, 3-公司权限, 4-当前用户接口 */
	userType?: "1" | "2" | "3" | "4";
}
```

### 3.3 统一的错误处理

Main 项目的 HTTP 工具类已经在拦截器中统一处理错误：

- 401：自动跳转登录页
- 403：显示权限不足提示
- 404：显示资源不存在提示
- 500：显示服务器错误提示

API 层只需要关注业务逻辑，不需要处理通用错误。

## 4. 迁移策略

### 4.1 分阶段迁移

根据业务优先级分阶段迁移：

|   阶段   |          模块          | 优先级 |         说明         |
| :------: | :--------------------: | :----: | :------------------: |
| 第一阶段 | 认证、用户、菜单、角色 |   P0   | 核心功能，必须先迁移 |
| 第二阶段 |     部门、基础数据     |   P1   |  重要功能，优先迁移  |
| 第三阶段 |    采购、库存、出库    |   P2   |  业务功能，按需迁移  |
| 第四阶段 |      配置、报表等      |   P3   |  辅助功能，最后迁移  |

### 4.2 渐进式迁移

不需要一次性迁移所有 API，可以：

1. 先迁移当前正在开发的模块
2. 保留 Origin 的 API 作为备份
3. 逐步替换旧的 API 调用
4. 最后删除 Origin 的 API 文件

### 4.3 并行开发

可以同时进行：

- 新功能使用 Main 的 API 结构
- 旧功能继续使用 Origin 的 API
- 逐步重构旧功能的 API 调用

## 5. Origin 项目 API 统计

### 5.1 API 模块分布

|        模块目录         |   文件数   |              说明              |
| :---------------------: | :--------: | :----------------------------: |
|          login          |     1      |            登录相关            |
|          menu           |     1      |            菜单管理            |
|       sys-manager       |     2      |     系统管理（用户、修改）     |
|       sysmanager        |     3      | 系统管理（分类、图标、类型组） |
|      sysmanager-ok      |     1      |      系统管理（另一版本）      |
|         sysmgr          |     1      |      系统管理（另一版本）      |
|    system-manage-ok     |     1      |      系统管理（另一版本）      |
|        base-data        |     1      |            基础数据            |
|        dashboard        |     1      |             仪表盘             |
|        daycheck         |     1      |        日常检查（温度）        |
|           j3            |     1      |      J3 模块（日常检查）       |
|     message-middle      |     1      |           消息中间件           |
|      notice-remind      |     1      |            通知提醒            |
|   auto-coding-gaogao    |     1      |            自动编码            |
|  encoding-type-gaogao   |     1      |            编码类型            |
|    flat-type-gaogao     |     1      |            平面类型            |
|  measuring-unit-gaogao  |     1      |            计量单位            |
|  parameter-type-gaogao  |     1      |            参数类型            |
| system-parameter-gaogao |     1      |            系统参数            |
|        **总计**         | **约 20+** |        **多个版本并存**        |

### 5.2 发现的问题

1. **多版本并存**：同一功能有多个版本（sysmanager、sysmanager-ok、sysmgr、system-manage-ok）
2. **命名不统一**：有些用 gaogao 后缀，有些用 ok 后缀
3. **结构混乱**：没有统一的目录组织方式
4. **类型缺失**：大部分是 .js 文件，缺少类型定义

## 6. 迁移建议

### 6.1 清理重复模块

在迁移时，需要：

1. 确认哪个版本是正在使用的
2. 合并重复的 API
3. 统一命名规范
4. 删除废弃的 API

### 6.2 统一目录结构

按业务模块组织，而不是按技术或版本：

```plain
✅ 好的结构：
api/system/user.ts
api/system/role.ts
api/system/menu.ts

❌ 不好的结构：
api/sys-manager/user.ts
api/sysmanager/user.ts
api/sysmanager-ok/user.ts
```

### 6.3 完善类型定义

为所有 API 添加：

- 请求参数类型
- 响应数据类型
- JSDoc 注释
- 示例代码

### 6.4 编写单元测试

为关键 API 编写单元测试：

- 测试请求参数验证
- 测试响应数据解析
- 测试错误处理

## 7. 使用示例

### 7.1 在组件中使用

```vue
<script setup lang="ts">
import { ref } from "vue";
import { login } from "@/api/auth/login";
import { getUserList, addUser, deleteUser } from "@/api/system/user";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";

// 登录
const handleLogin = async () => {
	try {
		const result = await login({
			username: "admin",
			password: "123456",
		});

		// 保存 token
		useUserStoreHook().setToken(result.token);

		ElMessage.success("登录成功");
		router.push("/");
	} catch (error) {
		ElMessage.error("登录失败");
	}
};

// 获取用户列表
const userList = ref([]);
const loadUserList = async () => {
	try {
		const result = await getUserList({
			page: 1,
			size: 10,
			username: "admin",
		});

		userList.value = result.list;
	} catch (error) {
		ElMessage.error("获取用户列表失败");
	}
};

// 添加用户
const handleAddUser = async (formData) => {
	try {
		await addUser(formData);
		ElMessage.success("添加成功");
		await loadUserList();
	} catch (error) {
		ElMessage.error("添加失败");
	}
};

// 删除用户
const handleDeleteUser = async (userId: string) => {
	try {
		await deleteUser(userId);
		ElMessage.success("删除成功");
		await loadUserList();
	} catch (error) {
		ElMessage.error("删除失败");
	}
};
</script>
```

### 7.2 在 Store 中使用

```typescript
// store/modules/user.ts
import { defineStore } from "pinia";
import { login, logout } from "@/api/auth/login";
import { getUserDetail } from "@/api/system/user";
import { getMenuList } from "@/api/system/menu";

export const useUserStore = defineStore("user", {
	state: () => ({
		token: "",
		userInfo: null,
		menus: [],
	}),

	actions: {
		async login(username: string, password: string) {
			const result = await login({ username, password });
			this.token = result.token;
			this.userInfo = result.userInfo;
			return result;
		},

		async logout() {
			await logout();
			this.token = "";
			this.userInfo = null;
			this.menus = [];
		},

		async loadUserInfo() {
			if (!this.userInfo) {
				const userId = this.userInfo?.id;
				this.userInfo = await getUserDetail(userId);
			}
			return this.userInfo;
		},

		async loadMenus() {
			if (this.menus.length === 0) {
				this.menus = await getMenuList();
			}
			return this.menus;
		},
	},
});
```

## 8. 后续工作

### 8.1 待迁移的 API 模块

根据优先级，后续需要迁移：

**P0 - 核心功能（必须）：**

- [x] 认证模块（login.ts）
- [x] 用户管理（system/user.ts）
- [x] 菜单管理（system/menu.ts）
- [ ] 角色管理（system/role.ts）

**P1 - 重要功能（优先）：**

- [ ] 部门管理（system/dept.ts）
- [ ] 商品管理（base-data/commodity.ts）
- [ ] 客户管理（base-data/customer.ts）
- [ ] 供应商管理（base-data/supplier.ts）

**P2 - 业务功能（按需）：**

- [ ] 采购管理（purchase/\*.ts）
- [ ] 库存管理（inventory/\*.ts）
- [ ] 出库管理（outbound/\*.ts）
- [ ] 日常检查（daily-check/\*.ts）

**P3 - 辅助功能（最后）：**

- [ ] 基础配置（config/\*.ts）
- [ ] 计费配置（billing/\*.ts）
- [ ] 消息中间件（message/\*.ts）
- [ ] 区域配置（region/\*.ts）
- [ ] 人员配置（personnel/\*.ts）
- [ ] 仓库配置（warehouse/\*.ts）
- [ ] 客户报表（report/\*.ts）

### 8.2 待完成的工作

- [ ] 迁移剩余的 API 模块
- [ ] 为所有 API 编写单元测试
- [ ] 更新组件中的 API 调用
- [ ] 删除 Origin 的 API 文件
- [ ] 更新 API 文档

## 9. 总结

### 9.1 已完成

- ✅ 创建详细的迁移指南
- ✅ 规划清晰的目录结构
- ✅ 创建示例 API 文件（认证、用户、菜单）
- ✅ 定义通用类型
- ✅ 统一 API 响应处理

### 9.2 关键改进

1. **从回调到 Promise**：使用现代的 async/await 语法
2. **完整的类型定义**：所有 API 都有类型安全
3. **统一的错误处理**：在拦截器中统一处理
4. **清晰的目录结构**：按业务模块组织
5. **详细的文档注释**：使用 JSDoc 格式

### 9.3 下一步

API 层迁移是一个持续的过程，建议：

1. 按优先级逐步迁移
2. 新功能使用新的 API 结构
3. 旧功能逐步重构
4. 保持文档更新

迁移指南和示例文件已经提供了完整的参考，后续可以按照相同的模式迁移其他 API 模块。
