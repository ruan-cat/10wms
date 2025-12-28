# 2025-12-28 P1 高优先级页面迁移协调文档

## 1. 任务分配

### 子代理 1：基础配置模块（计量单位、产品类别）

- **任务编号**：39.1
- **页面数量**：2 个
- **原路径**：
  - `origin/src/views/base-config/measuring-unit`
  - `origin/src/views/base-config/product-category`
- **目标路径**：
  - `main/src/pages/base-config/measuring-unit`
  - `main/src/pages/base-config/product-category`
- **状态**：🔄 进行中

### 子代理 2：基础数据模块（商品详情）

- **任务编号**：39.2
- **页面数量**：1 个
- **原路径**：
  - `origin/src/views/base-data/commodity-detail`
- **目标路径**：
  - `main/src/pages/base-data/goods-detail`
- **状态**：⏳ 待启动

### 子代理 3：库存管理模块（综合库存查询）

- **任务编号**：39.3
- **页面数量**：1 个
- **原路径**：
  - `origin/src/views/inventory-management/comprehensive-inventory`
- **目标路径**：
  - `main/src/pages/inventory/comprehensive-inventory`
- **状态**：⏳ 待启动

### 子代理 4：采购管理模块（批量收货、库存查询）

- **任务编号**：39.4
- **页面数量**：2 个
- **原路径**：
  - `origin/src/views/purchase-management/batch-receiving`
  - `origin/src/views/purchase-management/stock-inquiry`
- **目标路径**：
  - `main/src/pages/purchase/batch-receiving`
  - `main/src/pages/purchase/stock-inquiry`
- **状态**：⏳ 待启动

### 子代理 5：系统管理模块（字典管理）

- **任务编号**：39.5
- **页面数量**：1 个
- **原路径**：
  - `origin/src/views/system-manage/dictionary`
- **目标路径**：
  - `main/src/pages/system/dictionary`
- **状态**：⏳ 待启动

## 2. 迁移标准

每个子代理必须完成以下工作：

### 2.1 页面文件迁移

- [ ] 复制 Vue 组件文件到目标目录
- [ ] 转换所有导入路径（`@/` 前缀）
- [ ] 适配 Pure-Admin 组件（如果使用了 Origin 特有组件）
- [ ] 确保使用 `SimpleDataTable` 或 `@pureadmin/table`

### 2.2 API 接口适配

- [ ] 检查所有 API 调用
- [ ] 转换为新的 HTTP 工具类（`import { http } from "@/utils/http"`）
- [ ] 统一错误处理
- [ ] 确保响应数据结构正确

### 2.3 样式适配

- [ ] 检查样式是否正常
- [ ] 使用 Tailwind CSS 类（如果需要）
- [ ] 适配 Pure-Admin 主题变量
- [ ] 确保响应式布局

### 2.4 功能测试

- [ ] 页面能够正常渲染
- [ ] 列表查询功能正常
- [ ] 新增功能正常
- [ ] 编辑功能正常
- [ ] 删除功能正常
- [ ] 分页功能正常

### 2.5 报告要求

每个子代理完成后，必须在 `main/src/docs/reports/` 目录创建报告文件：

- 文件名格式：`2025-12-28-p1-{模块名}-migration.md`
- 内容包括：
  - 迁移的页面列表
  - 遇到的问题和解决方案
  - 测试结果
  - 截图（如果可能）

## 3. 进度跟踪

|  子代理  |     模块     | 页面数 |   状态    | 完成时间 |
| :------: | :----------: | :----: | :-------: | :------: |
| 子代理 1 | 基础配置模块 |   2    | 🔄 进行中 |    -     |
| 子代理 2 | 基础数据模块 |   1    | ⏳ 待启动 |    -     |
| 子代理 3 | 库存管理模块 |   1    | ⏳ 待启动 |    -     |
| 子代理 4 | 采购管理模块 |   2    | ⏳ 待启动 |    -     |
| 子代理 5 | 系统管理模块 |   1    | ⏳ 待启动 |    -     |

## 4. 问题记录

### 问题 1：[待记录]

- **描述**：
- **影响**：
- **解决方案**：
- **状态**：

## 5. 下一步

完成所有 P1 页面迁移后：

1. 更新路由配置（任务 39.6）
2. 全面测试所有 P1 页面
3. 生成 P1 迁移总结报告
4. 开始 P2 页面迁移

---

**协调者**：主代理  
**开始时间**：2025-12-28  
**预计完成时间**：2025-12-28（当天完成）
