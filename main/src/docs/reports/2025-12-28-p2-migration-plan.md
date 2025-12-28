# 2025-12-28 P2 中优先级页面迁移计划

## 1. 概述

P1 高优先级页面已全部完成（7/7），现在开始 P2 中优先级页面的迁移工作。P2 共有 38 个页面需要迁移。

## 2. 子代理任务分配

### 2.1 子代理 1：基础配置模块 (8 个页面)

**负责页面**：

1. encoding-type (编码类型)
2. flat-type (房型类型)
3. parameter-type (参数类型)
4. product-attribute (产品属性)
5. quality-code (质量代码)
6. quality-inspection-status (质检状态配置)
7. system-parameter (系统参数)
8. components (基础配置公共组件库)

**原路径**: `origin/src/views/base-config/`
**目标路径**: `main/src/pages/base-config/`

### 2.2 子代理 2：计费配置模块 (9 个页面)

**负责页面**：

1. billing-commodity-category (计费商品类别配置)
2. billing-date (计费日期配置)
3. contract-billing-method (合同计费方式配置)
4. customer-billing-configuration (客户计费配置管理)
5. expense-name (费用名称配置)
6. expense-type (费用类型配置)
7. measurement-type (计量类型配置)
8. price-type (价格类型配置)
9. warehousing-rate (入库费率配置)

**原路径**: `origin/src/views/billing-configuration/`
**目标路径**: `main/src/pages/billing/`

### 2.3 子代理 3：库存管理模块 (7 个页面)

**负责页面**：

1. differentialposting (差异过账管理)
2. double-quotation (双重报价管理)
3. inventory-difference (库存差异管理)
4. moveInventory (移库管理)
5. moving-count (移库盘点)
6. shelf-adjustment (上架调整)
7. takedown-adjustment (下架调整)

**原路径**: `origin/src/views/inventory-management/`
**目标路径**: `main/src/pages/inventory/`

### 2.4 子代理 4：采购管理模块 + 出库管理模块 (6 个页面)

**采购管理模块 (5 个页面)**：

1. client-purchase (客户采购管理)
2. other-warehousing (其他入库管理)
3. purchase-notification-details (采购通知单详情)
4. receied-unlisted-stock (收货未上架库存)
5. receiving-register (收货登记管理)

**出库管理模块 (1 个页面)**：

1. types (出库类型)

**原路径**:

- `origin/src/views/purchase-management/`
- `origin/src/views/outbound/`

**目标路径**:

- `main/src/pages/purchase/`
- `main/src/pages/outbound/`

### 2.5 子代理 5：系统管理模块 + 日常检查模块 (6 个页面)

**系统管理模块 (4 个页面)**：

1. catagory (分类管理)
2. icon (图标管理)
3. language (语言管理)
4. system-notice (系统通知)

**日常检查模块 (2 个页面)**：

1. received-unsold (收货未上架)
2. shipment-delay-warn (发货延迟预警)

**原路径**:

- `origin/src/views/system-manage/`
- `origin/src/views/daily-check/`

**目标路径**:

- `main/src/pages/system/`
- `main/src/pages/daily-check/`

### 2.6 子代理 6：基础数据模块 (3 个页面)

**负责页面**：

1. RFID (RFID 管理)
2. third-customer (第三方客户)
3. components (基础数据公共组件库)

**原路径**: `origin/src/views/base-data/`
**目标路径**: `main/src/pages/base-data/`

## 3. 迁移标准

每个子代理需要完成：

1. **页面文件迁移**
   - 复制 Vue 组件文件到目标目录
   - 转换导入路径
   - 使用 `SimpleDataTable` 替代 `ComponentsTable`
   - 使用 `el-dialog` 替代 `ComponentsDialogPromise`

2. **API 调用转换**
   - 将回调式 API 转换为 Promise 式
   - 使用 `http.request()` 方法
   - 统一错误处理

3. **路由配置**
   - 在对应的路由配置文件中添加路由
   - 配置路由元信息（title、icon、showLink、rank）
   - 使用动态导入实现懒加载
   - 父路由必须配置 `component: Layout`

4. **样式适配**
   - 确保响应式布局
   - 适配 Pure-Admin 主题

5. **功能测试**
   - 测试页面渲染
   - 测试 CRUD 功能
   - 测试分页和搜索

## 4. 报告要求

每个子代理完成后，在 `main/src/docs/reports/` 目录下创建报告文件：

- `2025-12-28-p2-agent-{编号}-{模块名}.md`

报告内容包括：

1. 完成的页面列表
2. 遇到的问题和解决方案
3. 测试结果
4. 需要注意的事项

## 5. 进度跟踪

- [ ] 子代理 1：基础配置模块 (8 个页面)
- [ ] 子代理 2：计费配置模块 (9 个页面)
- [ ] 子代理 3：库存管理模块 (7 个页面)
- [ ] 子代理 4：采购管理 + 出库管理 (6 个页面)
- [ ] 子代理 5：系统管理 + 日常检查 (6 个页面)
- [ ] 子代理 6：基础数据模块 (3 个页面)

**总计**: 38 个页面

## 6. 预计完成时间

- 每个子代理预计耗时：2-3 小时
- 总体预计完成时间：3-4 小时（并行执行）

## 7. 下一步行动

主代理将立即启动 6 个子代理，并行完成 P2 页面的迁移工作。
