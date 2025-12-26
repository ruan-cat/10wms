# Components Migration Specification

## ADDED Requirements

### Requirement: 表格组件使用 @pureadmin/table

系统 SHALL 使用 `@pureadmin/table` 替代 Origin 的基础表格组件，提供更强大的表格功能。

#### Scenario: 表格基本渲染

- **GIVEN** 页面需要展示表格数据
- **WHEN** 使用 PureTable 组件
- **THEN** 表格 SHALL 正确渲染数据、列配置和分页信息

#### Scenario: 表格分页功能

- **GIVEN** 表格数据超过一页
- **WHEN** 用户切换页码或修改每页条数
- **THEN** 表格 SHALL 触发 page-change 事件并重新加载数据

#### Scenario: 表格操作列自定义

- **GIVEN** 表格需要操作按钮
- **WHEN** 使用 operation 插槽
- **THEN** 系统 SHALL 允许自定义操作按钮的内容和行为

### Requirement: 表单组件保留并适配

系统 SHALL 保留 Origin 的 base-form 组件，并适配 Pure-Admin 的样式系统。

#### Scenario: 表单组件样式适配

- **GIVEN** base-form 组件已迁移
- **WHEN** 在 Pure-Admin 主题下渲染表单
- **THEN** 表单样式 SHALL 与 Pure-Admin 的设计风格一致

#### Scenario: 表单验证功能保持

- **GIVEN** 表单配置了验证规则
- **WHEN** 用户提交表单
- **THEN** 表单验证功能 SHALL 与 Origin 项目保持一致

### Requirement: 对话框组件保留并适配

系统 SHALL 保留 Origin 的 dialog-promise 组件，提供 Promise 化的对话框功能。

#### Scenario: Promise 化对话框调用

- **GIVEN** 需要弹出确认对话框
- **WHEN** 调用 dialog-promise 组件
- **THEN** 组件 SHALL 返回 Promise，用户确认时 resolve，取消时 reject

#### Scenario: 对话框样式适配

- **GIVEN** dialog-promise 组件已迁移
- **WHEN** 在 Pure-Admin 主题下显示对话框
- **THEN** 对话框样式 SHALL 与 Pure-Admin 的设计风格一致

### Requirement: 动态表格表单组件保留

系统 SHALL 保留 Origin 的 dinamic-table-form 组件，并适配到 Pure-Admin。

#### Scenario: 动态表格表单功能保持

- **GIVEN** dinamic-table-form 组件已迁移
- **WHEN** 在业务页面中使用
- **THEN** 组件的动态添加/删除行功能 SHALL 保持与 Origin 项目一致

#### Scenario: 动态表格表单样式适配

- **GIVEN** dinamic-table-form 组件已迁移
- **WHEN** 在 Pure-Admin 主题下渲染
- **THEN** 组件样式 SHALL 与 Pure-Admin 的设计风格一致

### Requirement: 表单设计器功能保留

系统 SHALL 保留 Origin 的表单设计器功能（@form-create/designer），并确保其在 Pure-Admin 中正常工作。

#### Scenario: 表单设计器正常加载

- **GIVEN** 用户访问表单设计器页面
- **WHEN** 页面加载完成
- **THEN** 表单设计器 SHALL 正确显示并可以正常使用

#### Scenario: 表单设计器配置保存

- **GIVEN** 用户在表单设计器中设计了表单
- **WHEN** 用户保存表单配置
- **THEN** 系统 SHALL 正确保存表单配置并可以在业务页面中使用

### Requirement: 流程图组件功能保留

系统 SHALL 保留 Origin 的流程图组件（@logicflow），并确保其在 Pure-Admin 中正常工作。

#### Scenario: 流程图正常渲染

- **GIVEN** 用户访问包含流程图的页面
- **WHEN** 页面加载完成
- **THEN** 流程图 SHALL 正确渲染并支持交互操作

#### Scenario: 流程图数据保存

- **GIVEN** 用户编辑了流程图
- **WHEN** 用户保存流程图数据
- **THEN** 系统 SHALL 正确保存流程图配置

### Requirement: 打印功能保留

系统 SHALL 保留 Origin 的打印功能（vue-plugin-hiprint），并确保其在 Pure-Admin 中正常工作。

#### Scenario: 打印模板正常加载

- **GIVEN** 用户访问打印功能页面
- **WHEN** 页面加载完成
- **THEN** 打印模板 SHALL 正确加载并可以正常编辑

#### Scenario: 打印预览功能正常

- **GIVEN** 用户设计了打印模板
- **WHEN** 用户点击打印预览
- **THEN** 系统 SHALL 正确显示打印预览效果

#### Scenario: 打印输出功能正常

- **GIVEN** 用户完成打印模板设计
- **WHEN** 用户执行打印操作
- **THEN** 系统 SHALL 正确调用打印功能
