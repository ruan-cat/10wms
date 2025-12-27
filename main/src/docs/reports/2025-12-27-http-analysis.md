# 2025-12-27 Origin HTTP 配置分析文档

## 1. 基础配置

### 1.1 baseURL 配置

- 支持反向代理配置
- 根据环境变量 `VITE_IS_REVERSE_PROXY` 决定使用 `VITE_PROXY_PREFIX` 或 `VITE_BASE_URL`
- 超时时间：10000ms (10 秒)

### 1.2 数据上传类型 (upType)

```javascript
http.upType = {
	form: 0, // 表单类型
	json: 1, // json类型
	file: 3, // 文件类型
	stream: 4, // 文件流类型
};
```

### 1.3 HTTP 状态码定义

```javascript
http.httpcode = {
	UNAUTHORIZED: 401, // 暂未登录或TOKEN已经过期
	FORBIDDEN: 403, // 没有相关权限
	NOT_FOUND: 404, // 访问页面未找到
	SERVER_ERROR: 9994, // 服务器错误
	PARAMS_INVALID: 9995, // 上传参数异常
	CONTENT_TYPE_ERR: 9996, // ContentType错误
	API_UN_IMPL: 9997, // 功能尚未实现
	SERVER_BUSY: 9998, // 服务器繁忙
	FAIL: 9999, // 操作失败
	SUCCESS: 10000, // 操作成功
};
```

## 2. 请求拦截器逻辑

### 2.1 Token 添加

- 从 `useUserStore` 获取 token
- 如果存在 token，添加到请求头：`Authorization: Bearer ${token}`

### 2.2 Content-Type 处理

根据 `config.upType` 设置不同的 Content-Type：

- **json (1)**: `application/json;charset=UTF-8`
- **file (3)**: `multipart/form-data`
- **stream (4)**: `application/octet-stream`
- **form (0) 或默认**: `application/x-www-form-urlencoded;charset=UTF-8`
  - 使用 qs.stringify 序列化 data，arrayFormat 为 'repeat'

### 2.3 参数序列化

- 使用 qs.stringify 序列化 params 参数

## 3. 响应拦截器逻辑

### 3.1 成功响应处理 (status === 200)

根据 `response.data.code` 进行不同处理：

#### SUCCESS (10000)

- 返回 Promise.resolve(data)

#### FORBIDDEN (403)

- 显示错误消息："权限不够，请联系管理员"
- 返回 Promise.reject(data)

#### UNAUTHORIZED (401)

- **Token 过期情况**：
  - 检测到 "Jwt expired at" 字符串
  - 调用 `store.reloadToken()` 刷新凭证
  - 设置 `store.setLoaded(false)`
  - 跳转到 `/home`
- **未登录情况**：
  - 跳转到 `/` (登录页)
  - 调用 `store.resetSaveData()` 重置数据
- 返回 Promise.reject(data)

#### NOT_FOUND (404)

- 显示警告消息："404 访问页面不存在"
- 返回 Promise.reject(data)

#### CONTENT_TYPE_ERR (9996) / PARAMS_INVALID (9995)

- 显示警告消息："请求参数或请求头错误"
- 返回 Promise.reject(response)

#### 其他错误码

- 返回 Promise.reject(response)

### 3.2 404 响应处理 (status === 404)

- 显示警告消息："404 访问页面不存在"
- 返回 Promise.resolve(response)

### 3.3 其他状态码

- 返回 Promise.reject(response)

### 3.4 网络错误处理

- 检测 `ECONNABORTED` 或 `ERR_NETWORK` 错误码
- 显示错误消息："连接服务器失败!!!"
- 返回 Promise.reject(error)

## 4. createAxiosInstance 特殊配置

### 4.1 额外配置

- `withCredentials: true` - 允许跨域
- `proxy: false` - 在 vitest 环境中不使用代理

### 4.2 临时 Token 支持

- 支持从环境变量 `VITE_temp_token` 读取临时 token
- 临时 token 优先级高于 store 中的 token

### 4.3 反向代理虚拟地址处理

- 针对特定 URL 前缀配置不同的 baseURL
- 配置规则：
  - `/app`, `/columnattribute` → `/j3-cms-base`
  - `/sortallocation`, `/dataconfig`, `/form`, `/resourcefile` → `/j3-cms-setting`

## 5. 迁移到 Pure-Admin 的适配要点

### 5.1 需要保留的功能

1. Token 自动添加到请求头
2. 根据 upType 设置不同的 Content-Type
3. 参数序列化 (qs.stringify)
4. 完整的响应状态码处理逻辑
5. Token 过期自动刷新机制
6. 网络错误提示

### 5.2 需要适配的部分

1. 将 axios 实例改为 Pure-Admin 的 http 工具类
2. 将 `useUserStore` 的方法调用适配到 Pure-Admin 的 store
3. 将路由跳转适配到 Pure-Admin 的路由系统
4. 将 ElMessage 消息提示保持一致

### 5.3 可以简化的部分

1. 反向代理虚拟地址处理（如果不需要）
2. 临时 token 支持（如果不需要）
3. upType 的复杂处理（可以简化为标准的 Content-Type 设置）

## 6. 迁移建议

### 6.1 优先级 P0（必须实现）

- Token 添加
- 基本的响应状态码处理
- 错误消息提示
- Token 过期处理

### 6.2 优先级 P1（重要但可延后）

- upType 的完整支持
- 反向代理配置
- 参数序列化

### 6.3 优先级 P2（可选）

- 临时 token 支持
- 虚拟地址处理
