# 2025-12-29 添加业务路由英文 i18n 翻译

## 1. 概述

为 business 命名空间下的所有业务路由添加英文翻译，确保系统支持中英文双语切换。

## 2. 添加内容

### 2.1 文件位置

**配置文件**：`main/locales/en.yaml`

### 2.2 翻译内容

在 `business` 命名空间下添加了 67 个业务模块的英文翻译，涵盖 10 个主要业务模块：

#### 2.2.1 系统管理（System Management）

|   中文键名   |       英文翻译        |
| :----------: | :-------------------: |
|    system    |   System Management   |
|     user     |    User Management    |
|     role     |    Role Management    |
|     menu     |    Menu Management    |
|     dept     | Department Management |
|  dictionary  | Dictionary Management |
|   category   |  Category Management  |
|     icon     |    Icon Management    |
|   language   |  Language Management  |
| systemNotice |     System Notice     |

#### 2.2.2 基础数据（Base Data）

|   中文键名    |       英文翻译       |
| :-----------: | :------------------: |
|   baseData    |      Base Data       |
|     goods     |   Goods Management   |
|  goodsDetail  |     Goods Detail     |
|   customer    | Customer Management  |
|   supplier    | Supplier Management  |
|     rfid      |   RFID Management    |
| thirdCustomer | Third Party Customer |

#### 2.2.3 采购管理（Purchase Management）

|          中文键名           |           英文翻译            |
| :-------------------------: | :---------------------------: |
|          purchase           |      Purchase Management      |
|         appointment         |     Appointment Purchase      |
|       batchReceiving        |        Batch Receiving        |
|          receiving          |     Receiving Management      |
|        stockInquiry         |         Stock Inquiry         |
|       clientPurchase        |        Client Purchase        |
|      otherWarehousing       |       Other Warehousing       |
| purchaseNotificationDetails | Purchase Notification Details |
|      receivingRegister      |      Receiving Register       |
|    receivedUnlistedStock    |    Received Unlisted Stock    |

#### 2.2.4 库存管理（Inventory Management）

|        中文键名        |        英文翻译         |
| :--------------------: | :---------------------: |
|       inventory        |  Inventory Management   |
|     inventoryCheck     |     Inventory Check     |
| comprehensiveInventory | Comprehensive Inventory |
|         stock          |       Stock Query       |
|  differentialPosting   |  Differential Posting   |
|    doubleQuotation     |    Double Quotation     |
|  inventoryDifference   |  Inventory Difference   |
|     moveInventory      |     Move Inventory      |
|      movingCount       |      Moving Count       |
|    shelfAdjustment     |    Shelf Adjustment     |
|   takedownAdjustment   |   Takedown Adjustment   |

#### 2.2.5 计费配置（Billing Configuration）

|           中文键名           |            英文翻译            |
| :--------------------------: | :----------------------------: |
|           billing            |     Billing Configuration      |
|         billingMode          |          Billing Mode          |
|       expenseTemplate        |        Expense Template        |
|   billingCommodityCategory   |   Billing Commodity Category   |
|         billingDate          |          Billing Date          |
|    contractBillingMethod     |    Contract Billing Method     |
| customerBillingConfiguration | Customer Billing Configuration |
|         expenseName          |          Expense Name          |
|         expenseType          |          Expense Type          |
|       measurementType        |        Measurement Type        |
|          priceType           |           Price Type           |
|       warehousingRate        |        Warehousing Rate        |

#### 2.2.6 消息中间件（Message Middleware）

|    中文键名     |      英文翻译      |
| :-------------: | :----------------: |
|     message     | Message Middleware |
|  messageCenter  |   Message Center   |
| messageTemplate |  Message Template  |
|   workSetting   |    Work Setting    |
|     workSql     |      Work SQL      |

#### 2.2.7 人员配置（Personnel Configuration）

|     中文键名     |        英文翻译         |
| :--------------: | :---------------------: |
|    personnel     | Personnel Configuration |
|   academicCode   |      Academic Code      |
| employmentStatus |    Employment Status    |
|    genderCode    |       Gender Code       |
|    workStatus    |       Work Status       |

#### 2.2.8 区域配置（Region Configuration）

|      中文键名       |       英文翻译       |
| :-----------------: | :------------------: |
|       region        | Region Configuration |
|   areaInformation   |   Area Information   |
|      cityType       |      City Type       |
| districtInformation | District Information |
| regionalInformation | Regional Information |

#### 2.2.9 日常检查（Daily Check）

|     中文键名      |        英文翻译         |
| :---------------: | :---------------------: |
|    dailyCheck     |       Daily Check       |
| abnormalDelivery  |    Abnormal Delivery    |
|    temperature    | Temperature Maintenance |
|  receivedUnsold   |     Received Unsold     |
| shipmentDelayWarn | Shipment Delay Warning  |

#### 2.2.10 基础配置（Base Configuration）

|        中文键名         |         英文翻译          |
| :---------------------: | :-----------------------: |
|       baseConfig        |    Base Configuration     |
|      measuringUnit      |      Measuring Unit       |
|     productCategory     |     Product Category      |
|      encodingType       |       Encoding Type       |
|        flatType         |         Flat Type         |
|      parameterType      |      Parameter Type       |
|    productAttribute     |     Product Attribute     |
|       qualityCode       |       Quality Code        |
| qualityInspectionStatus | Quality Inspection Status |
|     systemParameter     |     System Parameter      |

## 3. 翻译规范

### 3.1 命名规范

1. **键名保持一致**：英文配置文件的键名与中文配置文件完全一致
2. **使用 camelCase**：所有键名使用驼峰命名法
3. **语义清晰**：英文翻译准确表达功能含义

### 3.2 翻译风格

1. **专业术语**：使用行业标准的英文术语
2. **简洁明了**：翻译简洁，避免冗长
3. **一致性**：相同概念使用相同的英文翻译

## 4. 使用方式

系统会根据用户选择的语言自动切换：

```typescript
// 路由配置中使用 $t 函数
import { $t } from "@/plugins/i18n";

meta: {
  title: $t("business.system"), // 中文：系统管理，英文：System Management
}
```

## 5. 验证方法

1. 在系统设置中切换语言为英文
2. 查看菜单是否正确显示英文文本
3. 验证所有业务模块的菜单项都有对应的英文翻译

## 6. 完成状态

- ✅ 添加 67 个业务模块英文翻译
- ✅ 覆盖 10 个主要业务模块
- ✅ 键名与中文配置文件完全一致
- ✅ 翻译准确、专业、简洁

## 7. 总结

本次更新为所有业务路由添加了完整的英文翻译，确保系统能够支持中英文双语切换。所有翻译都遵循专业术语和简洁明了的原则，为国际化用户提供良好的使用体验。
