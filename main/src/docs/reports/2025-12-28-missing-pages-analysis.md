# 2025-12-28 未迁移页面分析报告

## 1. 概述

通过对比 `origin/src/views` 和 `main/src/pages` 目录，发现大量页面尚未迁移到主项目。本报告详细列出所有缺失的页面，并制定迁移计划。

## 2. 缺失页面统计

### 2.1 按模块统计

|      模块名称      | 原项目页面数 | 已迁移页面数 | 缺失页面数 | 完成率  |
| :----------------: | :----------: | :----------: | :--------: | :-----: |
|    基础配置模块    |      11      |      1       |     10     |   9%    |
|    基础数据模块    |      7       |      3       |     4      |   43%   |
|    计费配置模块    |      11      |      2       |     9      |   18%   |
|    客户报表模块    |      2       |      2       |     0      |  100%   |
|    日常检查模块    |      4       |      2       |     2      |   50%   |
|    库存管理模块    |      9       |      2       |     7      |   22%   |
|   消息中间件模块   |      4       |      2       |     2      |   50%   |
|    出库管理模块    |      2       |      1       |     1      |   50%   |
|    人员配置模块    |      4       |      1       |     3      |   25%   |
|    采购管理模块    |      8       |      2       |     6      |   25%   |
|    区域配置模块    |      4       |      2       |     2      |   50%   |
|    系统管理模块    |      9       |      4       |     5      |   44%   |
|    仓库配置模块    |      1       |      1       |     0      |  100%   |
| 示例页面模块(可选) |      16      |      0       |     16     |   0%    |
|      **总计**      |    **92**    |    **25**    |   **67**   | **27%** |

## 3. 详细缺失页面清单

### 3.1 基础配置模块 (base-config) - 缺失 10 个页面

|      页面名称      |           原路径            |          目标路径           | 优先级 |
| :----------------: | :-------------------------: | :-------------------------: | :----: |
|      编码类型      |       `encoding-type`       |       `encoding-type`       |   P2   |
|      房型类型      |         `flat-type`         |         `flat-type`         |   P2   |
|      计量单位      |      `measuring-unit`       |      `measuring-unit`       |   P1   |
|      参数类型      |      `parameter-type`       |      `parameter-type`       |   P2   |
|      产品属性      |     `product-attribute`     |     `product-attribute`     |   P2   |
|      产品类别      |     `product-category`      |     `product-category`      |   P1   |
|      质量代码      |       `quality-code`        |       `quality-code`        |   P2   |
|    质检状态配置    | `quality-inspection-status` | `quality-inspection-status` |   P2   |
|      系统参数      |     `system-parameter`      |     `system-parameter`      |   P2   |
| 基础配置公共组件库 |        `components`         |        `components`         |   P2   |

### 3.2 基础数据模块 (base-data) - 缺失 4 个页面

|    页面名称    |       原路径       |     目标路径     | 优先级 |
| :------------: | :----------------: | :--------------: | :----: |
|  商品详情页面  | `commodity-detail` |  `goods-detail`  |   P1   |
|   RFID 管理    |       `RFID`       |      `rfid`      |   P2   |
|   第三方客户   |  `third-customer`  | `third-customer` |   P2   |
| 基础数据组件库 |    `components`    |   `components`   |   P2   |

### 3.3 计费配置模块 (billing) - 缺失 9 个页面

|     页面名称     |              原路径              |             目标路径             | 优先级 |
| :--------------: | :------------------------------: | :------------------------------: | :----: |
| 计费商品类别配置 |   `billing-commodity-category`   |   `billing-commodity-category`   |   P2   |
|   计费日期配置   |          `billing-date`          |          `billing-date`          |   P2   |
| 合同计费方式配置 |    `contract-billing-method`     |    `contract-billing-method`     |   P2   |
| 客户计费配置管理 | `customer-billing-configuration` | `customer-billing-configuration` |   P2   |
|   费用名称配置   |          `expense-name`          |          `expense-name`          |   P2   |
|   费用类型配置   |          `expense-type`          |          `expense-type`          |   P2   |
|   计量类型配置   |        `measurement-type`        |        `measurement-type`        |   P2   |
|   价格类型配置   |           `price-type`           |           `price-type`           |   P2   |
|   入库费率配置   |        `warehousing-rate`        |        `warehousing-rate`        |   P2   |

### 3.4 日常检查模块 (daily-check) - 缺失 2 个页面

|   页面名称   |        原路径         |       目标路径        | 优先级 |
| :----------: | :-------------------: | :-------------------: | :----: |
|  收货未上架  |   `received-unsold`   |   `received-unsold`   |   P2   |
| 发货延迟预警 | `shipment-delay-warn` | `shipment-delay-warn` |   P2   |

### 3.5 库存管理模块 (inventory) - 缺失 7 个页面

|   页面名称   |          原路径           |         目标路径          | 优先级 |
| :----------: | :-----------------------: | :-----------------------: | :----: |
| 综合库存查询 | `comprehensive-inventory` | `comprehensive-inventory` |   P1   |
| 差异过账管理 |   `differentialposting`   |   `differentialposting`   |   P2   |
| 双重报价管理 |    `double-quotation`     |    `double-quotation`     |   P2   |
| 库存差异管理 |  `inventory-difference`   |  `inventory-difference`   |   P2   |
|   移库管理   |      `moveInventory`      |     `move-inventory`      |   P2   |
|   移库盘点   |      `moving-count`       |      `moving-count`       |   P2   |
|   上架调整   |    `shelf-adjustment`     |    `shelf-adjustment`     |   P2   |
|   下架调整   |   `takedown-adjustment`   |   `takedown-adjustment`   |   P2   |

### 3.6 消息中间件模块 (message) - 缺失 2 个页面

|  页面名称  |     原路径     |    目标路径    | 优先级 |
| :--------: | :------------: | :------------: | :----: |
| 工作流设置 | `work-setting` | `work-setting` |   P3   |
| 工作流 SQL |   `work-sql`   |   `work-sql`   |   P3   |

### 3.7 出库管理模块 (outbound) - 缺失 1 个页面

| 页面名称 | 原路径  | 目标路径 | 优先级 |
| :------: | :-----: | :------: | :----: |
| 出库类型 | `types` | `types`  |   P2   |

### 3.8 人员配置模块 (personnel-config) - 缺失 3 个页面

|   页面名称   |       原路径        |      目标路径       | 优先级 |
| :----------: | :-----------------: | :-----------------: | :----: |
| 就业状态配置 | `employment-status` | `employment-status` |   P3   |
| 性别代码配置 |    `gender-code`    |    `gender-code`    |   P3   |
| 工作状态配置 |    `work-status`    |    `work-status`    |   P3   |

### 3.9 采购管理模块 (purchase) - 缺失 6 个页面

|    页面名称    |             原路径              |            目标路径             | 优先级 |
| :------------: | :-----------------------------: | :-----------------------------: | :----: |
|  批量收货管理  |        `batch-receiving`        |        `batch-receiving`        |   P1   |
|  客户采购管理  |        `client-purchase`        |        `client-purchase`        |   P2   |
|  其他入库管理  |       `other-warehousing`       |       `other-warehousing`       |   P2   |
| 采购通知单详情 | `purchase-notification-details` | `purchase-notification-details` |   P2   |
| 收货未上架库存 |    `receied-unlisted-stock`     |    `received-unlisted-stock`    |   P2   |
|  收货登记管理  |      `receiving-register`       |      `receiving-register`       |   P2   |
|    库存查询    |         `stock-inquiry`         |         `stock-inquiry`         |   P1   |

### 3.10 区域配置模块 (region) - 缺失 2 个页面

|   页面名称   |         原路径         |        目标路径        | 优先级 |
| :----------: | :--------------------: | :--------------------: | :----: |
| 区县信息配置 | `district-information` | `district-information` |   P3   |
| 区域信息配置 | `regional-information` | `regional-information` |   P3   |

### 3.11 系统管理模块 (system) - 缺失 5 个页面

| 页面名称 |     原路径      |    目标路径     | 优先级 |
| :------: | :-------------: | :-------------: | :----: |
| 分类管理 |   `catagory`    |   `category`    |   P2   |
| 字典管理 |  `dictionary`   |  `dictionary`   |   P1   |
| 图标管理 |     `icon`      |     `icon`      |   P2   |
| 语言管理 |   `language`    |   `language`    |   P2   |
| 系统通知 | `system-notice` | `system-notice` |   P2   |

### 3.12 示例页面模块 (sample) - 可选，不迁移

示例页面主要用于开发参考，不需要迁移到生产环境。

## 4. 迁移优先级说明

### 4.1 P0 优先级（已完成）

- 系统管理核心模块（用户、角色、菜单、部门）

### 4.2 P1 优先级（高优先级）

|     模块     |        页面        |
| :----------: | :----------------: |
| 基础配置模块 | 计量单位、产品类别 |
| 基础数据模块 |    商品详情页面    |
| 库存管理模块 |    综合库存查询    |
| 采购管理模块 | 批量收货、库存查询 |
| 系统管理模块 |      字典管理      |

### 4.3 P2 优先级（中优先级）

大部分业务功能页面，包括：

- 基础配置模块的其他配置页面
- 计费配置模块的全部页面
- 库存管理模块的其他功能
- 采购管理模块的其他功能
- 系统管理模块的其他功能

### 4.4 P3 优先级（低优先级）

辅助功能页面，包括：

- 消息中间件的工作流相关页面
- 人员配置的部分页面
- 区域配置的部分页面

## 5. 迁移计划

### 5.1 第一阶段：P1 高优先级页面（预计 2-3 天）

1. 基础配置模块：计量单位、产品类别
2. 基础数据模块：商品详情页面
3. 库存管理模块：综合库存查询
4. 采购管理模块：批量收货、库存查询
5. 系统管理模块：字典管理

**预计页面数：8 个**

### 5.2 第二阶段：P2 中优先级页面（预计 5-7 天）

1. 基础配置模块：剩余 8 个页面
2. 基础数据模块：剩余 3 个页面
3. 计费配置模块：全部 9 个页面
4. 日常检查模块：剩余 2 个页面
5. 库存管理模块：剩余 6 个页面
6. 出库管理模块：剩余 1 个页面
7. 采购管理模块：剩余 4 个页面
8. 系统管理模块：剩余 4 个页面

**预计页面数：37 个**

### 5.3 第三阶段：P3 低优先级页面（预计 2-3 天）

1. 消息中间件模块：剩余 2 个页面
2. 人员配置模块：剩余 3 个页面
3. 区域配置模块：剩余 2 个页面

**预计页面数：7 个**

## 6. 迁移工作内容

每个页面的迁移工作包括：

1. **页面文件迁移**
   - 复制 Vue 组件文件
   - 转换导入路径
   - 适配 Pure-Admin 组件

2. **API 接口适配**
   - 检查 API 调用
   - 转换为新的 HTTP 工具类
   - 统一错误处理

3. **样式适配**
   - 转换为 Tailwind CSS
   - 适配 Pure-Admin 主题
   - 确保响应式布局

4. **路由配置**
   - 创建路由配置文件
   - 配置路由元信息
   - 实现懒加载

5. **功能测试**
   - 测试页面渲染
   - 测试 CRUD 功能
   - 测试交互逻辑

## 7. 风险评估

### 7.1 高风险项

1. **API 接口不兼容**：部分页面可能依赖特定的 API 响应格式
2. **组件依赖缺失**：某些页面可能使用了未迁移的公共组件
3. **业务逻辑复杂**：部分页面的业务逻辑较为复杂，需要仔细测试

### 7.2 缓解措施

1. 优先迁移公共组件库
2. 建立 API 适配层
3. 制定详细的测试计划
4. 分阶段迁移，逐步验证

## 8. 下一步行动

1. **立即开始**：P1 高优先级页面迁移
2. **更新任务清单**：在 tasks.md 中添加详细的迁移任务
3. **创建子代理**：为每个模块创建专门的迁移子代理
4. **持续跟踪**：定期更新迁移进度报告

## 9. 总结

当前迁移进度仅为 27%，还有 67 个页面需要迁移。建议按照优先级分三个阶段完成迁移工作，预计总耗时 9-13 天。
