# 2025-12-26 Origin 项目迁移到 Pure-Admin 方案

## 1. 项目概况分析

### 1.1 技术栈对比

|  技术项   |              Origin 项目               |         Main 项目 (Pure-Admin)         |  迁移难度   |
| :-------: | :------------------------------------: | :------------------------------------: | :---------: |
| 核心框架  |               Vue 3.5.26               |               Vue 3.5.26               |  ✅ 无差异  |
|   路由    | vue-router 4.6.4 + unplugin-vue-router | vue-router 4.6.4 + unplugin-vue-router |   ✅ 相同   |
| 状态管理  |        Pinia 3.0.4 + 持久化插件        |    Pinia 3.0.4 + responsive-storage    |  ⚠️ 需适配  |
| UI 组件库 |          Element Plus 2.13.0           |          Element Plus 2.13.0           |  ✅ 无差异  |
| 样式方案  |               CSS + SCSS               |          Tailwind CSS + SCSS           |  ⚠️ 需适配  |
|  国际化   |          vue-i18n 11.0.0-rc.1          |            vue-i18n 11.2.7             | ⚠️ 版本差异 |
| HTTP 请求 |              axios 1.13.2              |    axios 1.13.2 + @pureadmin/utils     |  ⚠️ 需适配  |
| 构建工具  |               Vite 6.3.5               |               Vite 6.3.5               |  ✅ 无差异  |
| 布局系统  |      vite-plugin-vue-meta-layouts      |      vite-plugin-vue-meta-layouts      |   ✅ 相同   |

### 1.2 业务模块清单

Origin 项目包含以下核心业务模块：

1. **基础配置** (`base-config/`)
   - 自动编码、编码类型、平铺类型
   - 计量单位、参数类型、系统参数
   - 产品属性、产品类别、质量代码等

2. **基础数据** (`base-data/`)
   - 商品管理、商品详情
   - 客户管理、供应商管理
   - RFID、第三方客户

3. **采购管理** (`purchase-management/`)
   - 预约采购、批量收货
   - 客户采购、其他入库
   - 收货登记、库存查询

4. **库存管理** (`inventory-management/`)
   - 综合盘点、盘点差异
   - 移库盘点、货架调整
   - 下架调整、差异过账

5. **出库管理** (`outbound/`)
   - 拣货管理
   - 出库类型

6. **日常检查** (`daily-check/`)
   - 异常发货、收未销
   - 发货延迟预警、温度维护

7. **计费配置** (`billing-configuration/`)
   - 计费商品类别、计费日期
   - 计费模式、合同计费方法
   - 费用名称、费用模板等

8. **系统管理** (`system-manage/`)
   - 菜单管理、角色管理
   - 用户管理、组织机构
   - 字典管理、图标管理
   - 系统通知、语言管理

9. **消息中间件** (`message-middle/`)
   - 消息中心、消息模板
   - 工作设置、工作 SQL

10. **区域配置** (`regional-allocation/`)
    - 区域信息、城市类型
    - 地区信息、区域信息

11. **人员配置** (`personnel-config/`)
    - 学历代码、就业状态
    - 性别代码、工作状态

12. **仓库配置** (`ware-config/`)
    - 订单类型

13. **客户报表** (`customer-report/`)
    - 库存报表
    - 有效期预警

### 1.3 特殊功能组件

Origin 项目包含的特殊功能：

- **表单设计器**: `@form-create/designer` + `@form-create/element-ui`
- **流程图**: `@logicflow/core` + `@logicflow/extension`
- **富文本编辑器**: `@wangeditor/editor`
- **打印功能**: `vue-plugin-hiprint`
- **Excel 处理**: `xlsx`
- **PDF 预览**: `pdfobject`
- **图表**: `echarts`

## 2. 迁移策略

### 2.1 迁移原则

1. **渐进式迁移**: 按模块逐步迁移，确保每个模块迁移后都能正常运行
2. **保留优势**: 充分利用 Pure-Admin 的权限系统、布局系统、主题系统
3. **最小改动**: 尽量保持业务逻辑不变，只做必要的适配
4. **测试先行**: 每个模块迁移后都要进行充分测试
5. **文档同步**: 及时更新文档，记录迁移过程中的问题和解决方案

### 2.2 迁移阶段划分

#### 阶段一：基础设施迁移（1-2 周）

**目标**: 建立迁移基础，确保两个项目的基础设施对齐

1. **环境配置对齐**
   - 统一 Vite 配置
   - 统一 TypeScript 配置
   - 统一 ESLint/Prettier 配置

2. **工具函数迁移**
   - 迁移 `origin/src/composables/` 到 `main/src/utils/`
   - 适配 Pure-Admin 的工具函数体系

3. **HTTP 请求层适配**
   - 将 Origin 的 axios 配置迁移到 Pure-Admin 的 HTTP 工具
   - 统一请求拦截器、响应拦截器
   - 统一错误处理机制

4. **状态管理适配**
   - 将 Pinia 持久化插件适配到 responsive-storage
   - 迁移用户状态管理
   - 迁移标签页状态管理

#### 阶段二：公共组件迁移（2-3 周）

**目标**: 迁移所有公共组件，为业务模块迁移做准备

1. **基础组件迁移**
   - `base-form` → 适配 Pure-Admin 的表单系统
   - `table` → 适配 `@pureadmin/table`
   - `pagination` → 使用 Pure-Admin 的分页组件
   - `dialog-promise` → 适配 Pure-Admin 的对话框系统
   - `dinamic-table-form` → 保留并适配

2. **业务组件迁移**
   - `table-title` → 适配 Pure-Admin 的表格工具栏
   - `table-search` → 适配 Pure-Admin 的搜索组件
   - `header-right` → 集成到 Pure-Admin 的导航栏
   - `Excel` → 保留并适配
   - `verifition` → 使用 Pure-Admin 的验证码组件或保留

3. **特殊功能组件**
   - 表单设计器 → 保留并适配
   - 流程图 → 保留并适配（Pure-Admin 已有 LogicFlow）
   - 富文本编辑器 → 保留并适配（Pure-Admin 已有 WangEditor）
   - 打印功能 → 保留并适配

#### 阶段三：API 层迁移（1-2 周）

**目标**: 迁移所有 API 接口定义

1. **API 结构调整**
   - 将 `origin/src/apis/` 迁移到 `main/src/api/`
   - 按业务模块重新组织 API 文件
   - 统一 API 命名规范

2. **API 适配**
   - 适配 Pure-Admin 的 HTTP 请求工具
   - 统一响应数据结构
   - 统一错误处理

#### 阶段四：业务模块迁移（6-8 周）

**目标**: 按优先级逐步迁移所有业务模块

**优先级 P0（核心模块，2 周）**:

1. 系统管理（用户、角色、菜单、权限）
2. 登录/认证模块

**优先级 P1（高频模块，2 周）**: 3. 基础数据（商品、客户、供应商）4. 采购管理 5. 库存管理

**优先级 P2（常用模块，2 周）**: 6. 出库管理 7. 日常检查 8. 基础配置

**优先级 P3（辅助模块，2 周）**: 9. 计费配置 10. 消息中间件 11. 区域配置 12. 人员配置 13. 仓库配置 14. 客户报表

#### 阶段五：测试与优化（2-3 周）

**目标**: 全面测试，优化性能，修复问题

1. **功能测试**
   - 单元测试
   - 集成测试
   - E2E 测试

2. **性能优化**
   - 路由懒加载优化
   - 组件按需加载
   - 打包体积优化

3. **用户体验优化**
   - 响应式适配
   - 加载状态优化
   - 错误提示优化

## 3. 详细迁移步骤

### 3.1 基础设施迁移

#### 3.1.1 HTTP 请求层适配

**Origin 项目的 HTTP 配置**:

```typescript
// origin/src/plugins/http.js
// 使用自定义的 axios 实例
```

**迁移到 Pure-Admin**:

```typescript
// main/src/utils/http/index.ts
// 使用 Pure-Admin 的 HTTP 工具
// 需要适配：
// 1. 请求拦截器（添加 token）
// 2. 响应拦截器（统一处理错误）
// 3. 请求取消机制
```

**迁移步骤**:

1. 分析 Origin 的 HTTP 配置
2. 将配置迁移到 `main/src/utils/http/index.ts`
3. 适配 Pure-Admin 的 HTTP 工具
4. 测试请求是否正常

#### 3.1.2 状态管理适配

**Origin 项目的状态管理**:

```typescript
// origin/src/stores/user.ts
// 使用 pinia-plugin-persistedstate 持久化
```

**迁移到 Pure-Admin**:

```typescript
// main/src/store/modules/user.ts
// 使用 responsive-storage 持久化
// 需要适配：
// 1. 用户信息存储
// 2. Token 存储
// 3. 菜单权限存储
```

**迁移步骤**:

1. 分析 Origin 的状态管理结构
2. 将状态迁移到 `main/src/store/modules/`
3. 适配 responsive-storage
4. 测试状态持久化是否正常

#### 3.1.3 路由系统适配

**Origin 项目的路由**:

- 使用 `unplugin-vue-router` 自动路由
- 使用 `vite-plugin-vue-meta-layouts` 布局系统
- 自定义路由元信息（menuType, text, icon, order）

**Pure-Admin 的路由**:

- 同样使用 `unplugin-vue-router`
- 同样使用 `vite-plugin-vue-meta-layouts`
- 使用 Pure-Admin 的路由元信息（title, roles, keepAlive 等）

**迁移步骤**:

1. 统一路由元信息定义
2. 迁移路由守卫逻辑
3. 适配菜单生成逻辑
4. 测试路由跳转和权限控制

### 3.2 公共组件迁移

#### 3.2.1 表格组件迁移

**Origin 的表格组件**:

```vue
<!-- origin/src/components/table/index.vue -->
<!-- 基于 Element Plus Table 封装 -->
```

**迁移到 Pure-Admin**:

```vue
<!-- 使用 @pureadmin/table -->
<!-- 需要适配：
1. 列配置
2. 分页配置
3. 操作按钮
4. 搜索功能
-->
```

**迁移步骤**:

1. 分析 Origin 表格组件的功能
2. 使用 `@pureadmin/table` 重新实现
3. 保留自定义功能（如果 Pure-Admin 不支持）
4. 更新所有使用表格的页面

#### 3.2.2 表单组件迁移

**Origin 的表单组件**:

```vue
<!-- origin/src/components/base-form/index.vue -->
<!-- 基于 Element Plus Form 封装 -->
```

**迁移到 Pure-Admin**:

```vue
<!-- 使用 Pure-Admin 的表单系统 -->
<!-- 或保留 Origin 的表单组件 -->
```

**迁移步骤**:

1. 评估是否需要保留 Origin 的表单组件
2. 如果保留，适配 Pure-Admin 的样式系统
3. 如果不保留，使用 Pure-Admin 的表单系统重写
4. 更新所有使用表单的页面

### 3.3 业务模块迁移

#### 3.3.1 系统管理模块迁移

**迁移步骤**:

1. **用户管理**
   - 迁移 `origin/src/views/system-manage/user-management/` 到 `main/src/views/system/user/`
   - 适配 Pure-Admin 的用户管理 API
   - 适配 Pure-Admin 的权限系统
   - 测试用户增删改查功能

2. **角色管理**
   - 迁移 `origin/src/views/system-manage/role-management/` 到 `main/src/views/system/role/`
   - 适配 Pure-Admin 的角色管理 API
   - 适配权限分配功能
   - 测试角色增删改查功能

3. **菜单管理**
   - 迁移 `origin/src/views/system-manage/menu-management/` 到 `main/src/views/system/menu/`
   - 适配 Pure-Admin 的菜单管理 API
   - 适配菜单树形结构
   - 测试菜单增删改查功能

4. **组织机构**
   - 迁移 `origin/src/views/system-manage/organization-institution/` 到 `main/src/views/system/dept/`
   - 适配 Pure-Admin 的部门管理 API
   - 适配部门树形结构
   - 测试部门增删改查功能

#### 3.3.2 基础数据模块迁移

**迁移步骤**:

1. **商品管理**
   - 创建 `main/src/views/base-data/commodity/`
   - 迁移商品列表页面
   - 迁移商品详情页面
   - 迁移商品新增/编辑页面
   - 适配 API 接口
   - 测试商品管理功能

2. **客户管理**
   - 创建 `main/src/views/base-data/customer/`
   - 迁移客户列表页面
   - 迁移客户详情页面
   - 迁移客户新增/编辑页面
   - 适配 API 接口
   - 测试客户管理功能

3. **供应商管理**
   - 创建 `main/src/views/base-data/supplier/`
   - 迁移供应商列表页面
   - 迁移供应商详情页面
   - 迁移供应商新增/编辑页面
   - 适配 API 接口
   - 测试供应商管理功能

#### 3.3.3 其他业务模块迁移

按照相同的模式迁移其他业务模块：

1. 创建对应的目录结构
2. 迁移页面组件
3. 适配 API 接口
4. 适配样式
5. 测试功能

### 3.4 样式迁移

#### 3.4.1 全局样式迁移

**Origin 的样式**:

```css
/* origin/src/assets/main.css */
/* 自定义全局样式 */
```

**迁移到 Pure-Admin**:

```scss
/* main/src/style/index.scss */
/* 需要适配 Tailwind CSS */
```

**迁移步骤**:

1. 分析 Origin 的全局样式
2. 将样式迁移到 `main/src/style/`
3. 使用 Tailwind CSS 重写部分样式
4. 保留必要的自定义样式

#### 3.4.2 组件样式迁移

**迁移步骤**:

1. 分析每个组件的样式
2. 使用 Tailwind CSS 重写（推荐）
3. 或保留 SCSS 样式
4. 确保样式在 Pure-Admin 主题下正常显示

### 3.5 国际化迁移

#### 3.5.1 语言文件迁移

**Origin 的国际化**:

```javascript
// origin/src/views/i18n.js
// 使用 vue-i18n rc 版本
```

**迁移到 Pure-Admin**:

```typescript
// main/src/plugins/i18n.ts
// 使用 vue-i18n 正式版
// main/locales/zh-CN.yaml
// main/locales/en.yaml
```

**迁移步骤**:

1. 提取 Origin 的语言文件
2. 转换为 YAML 格式
3. 合并到 Pure-Admin 的语言文件
4. 测试国际化切换功能

## 4. 迁移工具和脚本

### 4.1 自动化迁移脚本

创建迁移辅助脚本：

```typescript
// scripts/migration/migrate-component.ts
// 用于批量迁移组件

// scripts/migration/migrate-api.ts
// 用于批量迁移 API

// scripts/migration/migrate-style.ts
// 用于批量转换样式

// scripts/migration/check-dependencies.ts
// 用于检查依赖冲突
```

### 4.2 代码转换工具

使用 AST 工具进行代码转换：

```typescript
// scripts/migration/transform/
// - transform-import.ts  // 转换导入语句
// - transform-style.ts   // 转换样式
// - transform-api.ts     // 转换 API 调用
```

## 5. 测试策略

### 5.1 单元测试

为每个迁移的组件编写单元测试：

```typescript
// main/src/components/__tests__/
// - base-form.test.ts
// - table.test.ts
// - pagination.test.ts
```

### 5.2 集成测试

为每个业务模块编写集成测试：

```typescript
// main/src/views/__tests__/
// - system/user.test.ts
// - base-data/commodity.test.ts
```

### 5.3 E2E 测试

使用 Playwright 或 Cypress 进行 E2E 测试：

```typescript
// tests/e2e/
// - login.spec.ts
// - user-management.spec.ts
// - commodity-management.spec.ts
```

## 6. 风险评估与应对

### 6.1 技术风险

|     风险项     | 风险等级 |               应对措施               |
| :------------: | :------: | :----------------------------------: |
|  依赖版本冲突  |    中    | 提前检查依赖，使用 pnpm 的 overrides |
| 样式兼容性问题 |    中    |      建立样式测试用例，逐步适配      |
|  路由系统差异  |    低    |      两个项目使用相同的路由插件      |
|  状态管理差异  |    中    |         建立适配层，统一接口         |
|  API 接口变更  |    高    |     建立 API 文档，统一接口规范      |

### 6.2 业务风险

|    风险项    | 风险等级 |          应对措施          |
| :----------: | :------: | :------------------------: |
|   功能遗漏   |    高    |   建立功能清单，逐一核对   |
|   数据丢失   |    高    | 做好数据备份，建立回滚机制 |
| 用户体验下降 |    中    |   充分测试，收集用户反馈   |
|   性能下降   |    中    |   建立性能监控，及时优化   |

### 6.3 进度风险

|  风险项  | 风险等级 |           应对措施           |
| :------: | :------: | :--------------------------: |
| 工期延误 |    中    |  预留缓冲时间，及时调整计划  |
| 资源不足 |    中    | 合理分配任务，必要时增加人手 |
| 需求变更 |    中    |       建立变更管理流程       |

## 7. 迁移检查清单

### 7.1 基础设施检查

- [ ] Vite 配置迁移完成
- [ ] TypeScript 配置迁移完成
- [ ] ESLint/Prettier 配置迁移完成
- [ ] HTTP 请求层适配完成
- [ ] 状态管理适配完成
- [ ] 路由系统适配完成
- [ ] 国际化适配完成

### 7.2 公共组件检查

- [ ] 表格组件迁移完成
- [ ] 表单组件迁移完成
- [ ] 分页组件迁移完成
- [ ] 对话框组件迁移完成
- [ ] 搜索组件迁移完成
- [ ] Excel 组件迁移完成
- [ ] 表单设计器迁移完成
- [ ] 流程图组件迁移完成
- [ ] 富文本编辑器迁移完成

### 7.3 业务模块检查

- [ ] 系统管理模块迁移完成
- [ ] 基础数据模块迁移完成
- [ ] 采购管理模块迁移完成
- [ ] 库存管理模块迁移完成
- [ ] 出库管理模块迁移完成
- [ ] 日常检查模块迁移完成
- [ ] 计费配置模块迁移完成
- [ ] 消息中间件模块迁移完成
- [ ] 区域配置模块迁移完成
- [ ] 人员配置模块迁移完成
- [ ] 仓库配置模块迁移完成
- [ ] 客户报表模块迁移完成

### 7.4 测试检查

- [ ] 单元测试覆盖率 > 80%
- [ ] 集成测试通过
- [ ] E2E 测试通过
- [ ] 性能测试通过
- [ ] 兼容性测试通过

### 7.5 文档检查

- [ ] 迁移文档完成
- [ ] API 文档更新
- [ ] 组件文档更新
- [ ] 用户手册更新
- [ ] 开发指南更新

## 8. 后续优化建议

### 8.1 代码优化

1. **组件优化**
   - 使用 Vue 3 Composition API 重构组件
   - 提取公共逻辑到 composables
   - 优化组件性能

2. **样式优化**
   - 全面使用 Tailwind CSS
   - 统一设计规范
   - 优化响应式布局

3. **类型优化**
   - 完善 TypeScript 类型定义
   - 减少 any 类型使用
   - 提高类型安全性

### 8.2 架构优化

1. **模块化**
   - 按业务领域划分模块
   - 建立清晰的模块边界
   - 减少模块间耦合

2. **可维护性**
   - 统一代码风格
   - 完善注释文档
   - 建立代码审查机制

3. **可扩展性**
   - 建立插件机制
   - 支持主题定制
   - 支持功能扩展

### 8.3 性能优化

1. **加载优化**
   - 路由懒加载
   - 组件按需加载
   - 图片懒加载

2. **打包优化**
   - 代码分割
   - Tree Shaking
   - 压缩优化

3. **运行时优化**
   - 虚拟滚动
   - 防抖节流
   - 缓存优化

## 9. 总结

本迁移方案提供了一个全面的、分阶段的迁移路径，从基础设施到业务模块，从公共组件到特殊功能，都有详细的迁移步骤和检查清单。

**关键成功因素**:

1. 充分的前期调研和规划
2. 渐进式的迁移策略
3. 完善的测试覆盖
4. 及时的问题反馈和解决
5. 持续的优化和改进

**预计时间**: 12-16 周

**建议团队规模**: 2-3 人

**下一步行动**:

1. 评审本迁移方案
2. 确定迁移优先级
3. 分配任务和资源
4. 开始第一阶段迁移
