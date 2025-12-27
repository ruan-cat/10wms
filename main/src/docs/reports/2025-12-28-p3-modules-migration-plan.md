# 2025-12-28 P3 辅助模块迁移计划

## 1. 概述

本文档记录 P3 辅助模块的迁移计划和执行策略。

## 2. 模块分析结果

### 2.1 模块状态评估

| 序号 | 模块名称   | 子模块数 | 实现状态 | 迁移优先级 | 预计工作量 |
| :--: | :--------- | :------: | :------: | :--------: | :--------: |
|  1   | 客户报表   |    2     |  空框架  |     低     |   0.5 天   |
|  2   | 仓库配置   |    1     |  空框架  |     低     |   0.5 天   |
|  3   | 人员配置   |    4     | 模拟数据 |    中等    |    1 天    |
|  4   | 区域配置   |    4     |  待检查  |    中等    |    1 天    |
|  5   | 消息中间件 |    4     | 完整实现 |     高     |   2-3 天   |
|  6   | 计费配置   |    11    |  待检查  |     高     |   3-5 天   |

### 2.2 详细分析

#### 2.2.1 客户报表模块

**Origin 路径**: `origin/src/views/customer-report`

**子模块**:

- 客户库存 (`repertory`) - 只有标题，无业务逻辑
- 效期预警 (`validity-warn`) - 只有标题，无业务逻辑

**迁移策略**: 创建基础页面框架，预留后续开发接口

#### 2.2.2 仓库配置模块

**Origin 路径**: `origin/src/views/ware-config`

**子模块**:

- 订单类型 (`order-type`) - 只有空模板

**迁移策略**: 创建基础页面框架

#### 2.2.3 人员配置模块

**Origin 路径**: `origin/src/views/personnel-config`

**子模块**:

- 学历代码 (`academic-code`)
- 就业状态 (`employment-status`)
- 性别代码 (`gender-code`)
- 工作状态 (`work-status`)

**特点**: 使用 `BaseConfigTable` 组件，有模拟数据，但 API 被注释

**迁移策略**:

1. 创建通用的配置表格组件
2. 迁移各子模块页面
3. 创建 API 接口（初期使用模拟数据）

#### 2.2.4 区域配置模块

**Origin 路径**: `origin/src/views/regional-allocation`

**子模块**:

- 区域信息 (`regional-information`)
- 城市类型 (`city-type`)
- 地区信息 (`district-information`)
- 区域信息 (`area-information`)

**迁移策略**: 待检查后确定

#### 2.2.5 消息中间件模块 ⭐

**Origin 路径**: `origin/src/views/message-middle`

**子模块**:

- 消息中心 (`message-center`) - 有完整业务逻辑
- 消息模板 (`message-template`) - 有完整业务逻辑
- 工作设置 (`work-setting`)
- 工作 SQL (`work-sql`)

**API 文件**: `origin/src/apis/message-middle/index.js`

**特点**:

- 有完整的 CRUD 功能
- 有完整的 API 接口
- 使用 Origin 的自定义组件

**迁移策略**:

1. 创建 API 接口文件
2. 迁移消息中心页面
3. 迁移消息模板页面
4. 迁移工作设置和工作 SQL 页面
5. 适配 Pure-Admin 组件

#### 2.2.6 计费配置模块

**Origin 路径**: `origin/src/views/billing-configuration`

**子模块** (11 个):

- 计费模式 (`billing-mode`)
- 费用模板 (`expense-template`)
- 计费商品类别 (`billing-commodity-category`)
- 计费日期 (`billing-date`)
- 合同计费方式 (`contract-billing-method`)
- 客户计费配置 (`customer-billing-configuration`)
- 费用名称 (`expense-name`)
- 费用类型 (`expense-type`)
- 计量类型 (`measurement-type`)
- 价格类型 (`price-type`)
- 入库费率 (`warehousing-rate`)

**迁移策略**: 待检查后确定

## 3. 迁移策略

### 3.1 分阶段迁移

**第一阶段**: 简单模块（1-2 天）

- 客户报表模块
- 仓库配置模块
- 人员配置模块

**第二阶段**: 中等复杂度模块（2-3 天）

- 区域配置模块
- 消息中间件模块

**第三阶段**: 复杂模块（3-5 天）

- 计费配置模块

### 3.2 技术方案

#### 3.2.1 组件复用

- 使用 Pure-Admin 的 `@pureadmin/table` 组件
- 使用 Element Plus 的表单组件
- 创建通用的配置表格组件（类似 Origin 的 BaseConfigTable）

#### 3.2.2 API 迁移

- 转换 Request 类调用为 http 工具类调用
- 统一响应处理
- 统一错误处理

#### 3.2.3 权限控制

- 为每个页面添加按钮权限
- 配置路由权限

## 4. 执行计划

### 4.1 任务分配

根据 AGENTS.md 规范，将启动多个子代理并行完成任务：

**子代理 1**: 客户报表 + 仓库配置模块
**子代理 2**: 人员配置模块
**子代理 3**: 区域配置模块（检查后执行）
**子代理 4**: 消息中间件模块
**子代理 5**: 计费配置模块（检查后执行）

### 4.2 验收标准

- [ ] 所有页面可正常访问
- [ ] 基础 CRUD 功能正常
- [ ] API 接口调用正常
- [ ] 权限控制正常
- [ ] 无 TypeScript 编译错误
- [ ] 代码符合规范

## 5. 风险评估

### 5.1 技术风险

- **低**: 客户报表、仓库配置（只有框架）
- **中**: 人员配置、区域配置（需要适配组件）
- **高**: 消息中间件、计费配置（业务逻辑复杂）

### 5.2 应对措施

1. 优先迁移简单模块，积累经验
2. 创建通用组件，提高复用性
3. 充分测试，确保功能正常

## 6. 后续工作

### 6.1 功能完善

- 补充空框架页面的业务逻辑
- 完善 API 接口
- 添加数据验证

### 6.2 优化改进

- 性能优化
- 用户体验优化
- 代码质量优化

---

**创建日期**: 2025-12-28  
**负责人**: Kiro AI Assistant  
**状态**: 📋 计划中
