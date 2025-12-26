# Infrastructure Migration Specification

## ADDED Requirements

### Requirement: HTTP 请求统一处理

系统 SHALL 使用 Pure-Admin 的 HTTP 工具类统一处理所有 HTTP 请求，并集成 Origin 项目的拦截器逻辑。

#### Scenario: 请求拦截器添加认证令牌

- **GIVEN** 用户已登录并且 Token 存在于本地存储
- **WHEN** 发起任何 HTTP 请求
- **THEN** 系统 SHALL 自动在请求头中添加 `Authorization: Bearer {token}`

#### Scenario: 响应拦截器统一处理成功响应

- **GIVEN** API 返回成功响应（code === 200）
- **WHEN** 响应拦截器处理响应
- **THEN** 系统 SHALL 返回响应数据中的 data 字段

#### Scenario: 响应拦截器统一处理错误响应

- **GIVEN** API 返回错误响应（code !== 200）
- **WHEN** 响应拦截器处理响应
- **THEN** 系统 SHALL 显示错误消息并拒绝 Promise

### Requirement: 状态管理持久化

系统 SHALL 使用 responsive-storage 替代 pinia-plugin-persistedstate 进行状态持久化。

#### Scenario: 用户信息持久化存储

- **GIVEN** 用户登录成功
- **WHEN** 用户信息保存到 store
- **THEN** 系统 SHALL 使用 storageLocal 将用户信息持久化到本地存储

#### Scenario: 页面刷新后状态恢复

- **GIVEN** 用户信息已持久化存储
- **WHEN** 用户刷新页面
- **THEN** 系统 SHALL 从本地存储恢复用户信息到 store

#### Scenario: 用户登出清除状态

- **GIVEN** 用户已登录
- **WHEN** 用户执行登出操作
- **THEN** 系统 SHALL 清除 store 中的用户信息并删除本地存储数据

### Requirement: 路由权限验证

系统 SHALL 集成 Pure-Admin 的权限系统，并保留 Origin 项目的登录验证逻辑。

#### Scenario: 未登录用户访问受保护页面

- **GIVEN** 用户未登录（无 Token）
- **WHEN** 用户尝试访问除登录页外的任何页面
- **THEN** 系统 SHALL 重定向到登录页并显示提示消息

#### Scenario: 已登录用户首次访问加载用户数据

- **GIVEN** 用户已登录但用户数据未加载
- **WHEN** 用户访问任何受保护页面
- **THEN** 系统 SHALL 加载用户信息和菜单数据后允许访问

#### Scenario: 已登录用户访问无权限页面

- **GIVEN** 用户已登录但没有访问某页面的权限
- **WHEN** 用户尝试访问该页面
- **THEN** 系统 SHALL 重定向到 403 页面或首页

### Requirement: 路由元信息统一

系统 SHALL 统一路由元信息定义，兼容 Origin 和 Pure-Admin 的路由配置。

#### Scenario: 路由元信息包含 Pure-Admin 字段

- **GIVEN** 定义新的路由配置
- **WHEN** 配置路由元信息
- **THEN** 路由元信息 MUST 包含 title, icon, showLink, keepAlive, roles 等 Pure-Admin 字段

#### Scenario: 路由元信息包含 Origin 字段

- **GIVEN** 需要兼容 Origin 的路由配置
- **WHEN** 配置路由元信息
- **THEN** 路由元信息 MAY 包含 menuType, text, isSample, order 等 Origin 字段

### Requirement: 工具函数路径统一

系统 SHALL 将所有工具函数从 `composables/` 迁移到 `utils/` 目录。

#### Scenario: 工具函数导入路径更新

- **GIVEN** 某文件导入了来自 composables 的工具函数
- **WHEN** 执行导入路径转换
- **THEN** 所有 `@/composables/` 的导入 SHALL 更新为 `@/utils/`

#### Scenario: 工具函数功能保持不变

- **GIVEN** 工具函数已迁移到 utils 目录
- **WHEN** 在代码中使用工具函数
- **THEN** 工具函数的功能和 API SHALL 保持与 Origin 项目一致
