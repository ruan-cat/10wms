# 其他基础组件迁移评估

## 1. 组件概述

本次需要迁移三个基础组件：

|    组件名称    |                 源路径                  |          功能描述           |              依赖              |
| :------------: | :-------------------------------------: | :-------------------------: | :----------------------------: |
| dialog-promise | `origin/src/components/dialog-promise/` | 基于 Promise 的命令式对话框 | `@vueuse/core`, `element-plus` |
|  table-search  |  `origin/src/components/table-search/`  |  表格搜索栏组件（未实现）   |               -                |
|     Excel      |     `origin/src/components/Excel/`      |    Excel 文件导入和预览     |     `xlsx`, `element-plus`     |

## 2. 组件分析

### 2.1 dialog-promise 组件

**核心功能：**

- 使用 `createTemplatePromise` 实现命令式对话框
- 支持 Promise 风格的异步操作（resolve/reject）
- 支持拖拽、销毁时关闭等特性
- 提供 header、default、footer 三个插槽
- 通过 `onDialogClose` 回调控制关闭逻辑

**技术特点：**

- 使用 Vue 3 泛型组件 `<script setup generic="T extends Object">`
- 使用 `@vueuse/core` 的 `createTemplatePromise` 和 `useToggle`
- 封装 `ElDialog` 组件
- 类型安全的 Props 定义

**迁移策略：** ✅ 保留并适配

- 这是一个设计良好的命令式对话框组件
- Pure-Admin 没有类似的命令式对话框实现
- 只需适配样式变量即可

### 2.2 table-search 组件

**当前状态：** 未实现（空组件）

**设计初衷（根据文档）：**

1. 有简单的折叠栏
2. 预设 3 种简单的搜索表单
3. 预设查询、重置按钮
4. 重置按钮默认清空表单内容
5. 查询按钮执行异步接口请求

**迁移策略：** ⏭️ 跳过实现

- 组件尚未实现，只有设计文档
- 可以在后续需要时再实现
- 当前先创建占位组件

### 2.3 Excel 组件

**核心功能：**

- Excel 文件上传（支持 .xlsx 和 .xls 格式）
- 文件解析和预览（显示前 50 条数据）
- 多文件管理（选择、删除、切换预览）
- 文件上传到服务器

**技术特点：**

- 使用 `xlsx` 库解析 Excel 文件
- 使用 `ElUpload` 和 `ElTable` 组件
- 支持拖拽上传
- 文件验证和错误处理

**迁移策略：** ✅ 保留并适配

- 功能完整且实用
- Pure-Admin 没有类似的 Excel 组件
- 需要适配样式变量以支持主题切换

## 3. 迁移计划

### 3.1 dialog-promise 组件迁移

**步骤：**

1. 复制组件文件到 `main/src/components/DialogPromise/`
2. 调整导入路径（如果需要）
3. 适配样式变量（使用 Pure-Admin 的 CSS 变量）
4. 编写单元测试

**预期工作量：** 低

### 3.2 table-search 组件迁移

**步骤：**

1. 创建占位组件 `main/src/components/TableSearch/`
2. 保留设计文档
3. 后续根据需要实现

**预期工作量：** 极低

### 3.3 Excel 组件迁移

**步骤：**

1. 复制组件文件到 `main/src/components/Excel/`
2. 调整导入路径
3. 适配样式变量（颜色、边框、背景等）
4. 修复硬编码的上传地址
5. 编写单元测试

**预期工作量：** 中

## 4. 样式适配要点

### 4.1 需要适配的样式变量

|       原始样式       |          Pure-Admin 变量          |    说明    |
| :------------------: | :-------------------------------: | :--------: |
| `rgb(223, 223, 223)` |   `var(--el-fill-color-light)`    |  浅色填充  |
| `rgb(211, 207, 207)` |      `var(--el-fill-color)`       |   填充色   |
| `rgb(121, 155, 194)` |     `var(--el-color-primary)`     |   主题色   |
| `rgb(192, 214, 240)` | `var(--el-color-primary-light-7)` |  主题浅色  |
|        `#000`        |  `var(--el-text-color-primary)`   | 主要文本色 |
| `rgb(153, 142, 142)` | `var(--el-text-color-secondary)`  | 次要文本色 |

### 4.2 响应式设计

- Excel 组件已有基础的响应式设计（`@media (max-width: 768px)`）
- 需要确保在 Pure-Admin 的布局系统中正常工作

## 5. 测试策略

### 5.1 dialog-promise 组件测试

- 测试 `open()` 方法返回 Promise
- 测试 resolve 和 reject 行为
- 测试插槽渲染
- 测试对话框属性传递

### 5.2 Excel 组件测试

- 测试文件上传验证
- 测试文件解析
- 测试数据预览
- 测试文件删除
- 测试错误处理

## 6. 风险评估

|             风险项             | 风险等级 |          缓解措施           |
| :----------------------------: | :------: | :-------------------------: |
| dialog-promise 的 Promise 行为 |    低    |       完整的单元测试        |
|      Excel 组件样式兼容性      |    中    | 使用 CSS 变量，测试主题切换 |
|      Excel 上传地址硬编码      |    低    |       改为 props 传入       |
|      table-search 未实现       |    低    |   创建占位组件，后续实现    |

## 7. 总结

三个组件的迁移难度都不高：

- **dialog-promise**: 设计良好，直接迁移
- **table-search**: 未实现，创建占位
- **Excel**: 功能完整，主要是样式适配

预计总工作量：2-3 小时
