# API Layer Migration Specification

## ADDED Requirements

### Requirement: API 文件路径统一

系统 SHALL 将所有 API 文件从 `apis/` 迁移到 `api/` 目录，并按业务模块组织。

#### Scenario: API 文件路径转换

- **GIVEN** Origin 项目的 API 文件位于 `src/apis/` 目录
- **WHEN** 执行 API 迁移
- **THEN** 所有 API 文件 SHALL 迁移到 `main/src/api/` 目录并按业务模块组织

#### Scenario: API 导入路径更新

- **GIVEN** 某文件导入了 API 函数
- **WHEN** 执行导入路径转换
- **THEN** 所有 `@/apis/` 的导入 SHALL 更新为 `@/api/`

### Requirement: API 调用方式统一

系统 SHALL 使用 Pure-Admin 的 HTTP 工具统一所有 API 调用方式。

#### Scenario: axios 实例替换为 http 工具

- **GIVEN** API 文件中使用了 axios 或 axiosInstance
- **WHEN** 执行 API 适配
- **THEN** 所有 axios 调用 SHALL 替换为 `http.get/post/put/delete` 调用

#### Scenario: API 响应数据结构统一

- **GIVEN** API 返回的响应数据
- **WHEN** 在业务代码中使用 API 响应
- **THEN** 响应数据结构 SHALL 统一为 `{ code, data, message }` 格式

### Requirement: API 错误处理统一

系统 SHALL 统一所有 API 的错误处理机制。

#### Scenario: API 请求失败自动提示

- **GIVEN** API 请求失败（网络错误或业务错误）
- **WHEN** 错误发生
- **THEN** 系统 SHALL 自动显示错误消息提示

#### Scenario: API 请求超时处理

- **GIVEN** API 请求超过设定的超时时间
- **WHEN** 超时发生
- **THEN** 系统 SHALL 中断请求并显示超时提示

### Requirement: API 模块化组织

系统 SHALL 按业务模块组织 API 文件，保持清晰的代码结构。

#### Scenario: 系统管理 API 模块

- **GIVEN** 需要调用系统管理相关的 API
- **WHEN** 导入 API 函数
- **THEN** API 函数 SHALL 位于 `@/api/system/` 目录下（user.ts, role.ts, menu.ts 等）

#### Scenario: 基础数据 API 模块

- **GIVEN** 需要调用基础数据相关的 API
- **WHEN** 导入 API 函数
- **THEN** API 函数 SHALL 位于 `@/api/base-data/` 目录下（commodity.ts, customer.ts, supplier.ts 等）

#### Scenario: 业务模块 API 组织

- **GIVEN** 需要调用其他业务模块的 API
- **WHEN** 导入 API 函数
- **THEN** API 函数 SHALL 位于对应的业务模块目录下（purchase/, inventory/, outbound/ 等）
