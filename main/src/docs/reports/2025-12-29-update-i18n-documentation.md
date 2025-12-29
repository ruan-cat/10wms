# 2025-12-29 更新 i18n 规范到项目文档

## 1. 概述

本次更新将业务路由国际化（i18n）的配置规范和使用方法添加到项目的全部规范文档中，确保开发团队能够正确使用 i18n 功能。

## 2. 更新内容

### 2.1 Kiro Spec Requirements 文档

**文件路径**：`.kiro/specs/origin-to-pure-admin-migration/requirements.md`

**更新内容**：

1. **新增术语定义**（Glossary 部分）：
   - i18n：国际化（Internationalization）的缩写
   - $t 函数：Pure-Admin 框架提供的国际化翻译函数
   - i18n 键：国际化配置文件中的键名
   - business 命名空间：业务路由专用的 i18n 命名空间

2. **新增 Requirement 17**：国际化配置需求
   - 使用 $t 函数引用 i18n 键
   - 在 business 命名空间下配置所有文本
   - 使用 camelCase 格式的键名
   - 为父级和子级路由配置 i18n
   - 验证路由标题正确显示
   - 导入 $t 函数

### 2.2 Kiro Spec Design 文档

**文件路径**：`.kiro/specs/origin-to-pure-admin-migration/design.md`

**更新内容**：

在 Route Configuration Model 部分新增了详细的 i18n 配置规范注释，包括：

1. **配置位置**：main/locales/zh-CN.yaml 的 business 命名空间
2. **使用方式**：
   - 导入 $t 函数
   - 在 meta.title 中使用 $t 函数
   - 在 yaml 文件中配置中文文本
3. **键名规范**：camelCase 格式，语义匹配
4. **示例代码**：
   - YAML 配置示例
   - 路由配置示例
   - 错误示例（硬编码、错误命名空间）

### 2.3 OpenSpec Router Spec 文档

**文件路径**：`openspec/changes/origin-to-pure-admin/specs/router/spec.md`

**更新内容**：

新增 **5.4 国际化（i18n）配置规范** 章节，包括：

1. **配置原则**：
   - 禁止硬编码中文文本
   - 统一使用 business 命名空间
   - 语义化键名

2. **配置位置**：main/locales/zh-CN.yaml

3. **使用步骤**：
   - 导入 $t 函数
   - 使用 $t 函数引用 i18n 键
   - 配置 YAML 文件

4. **配置示例**：
   - YAML 配置示例（系统管理、基础数据模块）
   - 路由配置示例（完整的路由文件）
   - 错误示例（硬编码、错误命名空间、未导入）

5. **键名规范**：
   - 父级模块使用简短名称
   - 子级页面使用组合名称
   - 使用 camelCase
   - 语义清晰

6. **验证方法**：
   - 检查 $t 函数导入
   - 检查 meta.title 使用
   - 检查 YAML 配置
   - 浏览器验证

### 2.4 CLAUDE.md 文档

**文件路径**：`CLAUDE.md`

**更新内容**：

新增 **3.6 路由国际化（i18n）配置规范** 章节，内容与 OpenSpec 文档保持一致，包括：

1. 配置原则
2. 配置位置
3. 使用步骤
4. 配置示例（YAML 和路由配置）
5. 错误示例
6. 键名规范
7. 验证方法

## 3. 文档一致性

所有文档的 i18n 规范保持一致，确保：

1. **术语统一**：所有文档使用相同的术语定义
2. **示例一致**：使用相同的代码示例和错误示例
3. **规范统一**：配置原则、键名规范、验证方法保持一致
4. **格式统一**：表格使用居中对齐，代码块使用正确的语言标识

## 4. 已完成的 i18n 实现

在文档更新之前，i18n 功能已经完成实现：

1. **配置文件**：`main/locales/zh-CN.yaml` 已添加 business 命名空间
2. **路由文件**：10 个业务路由文件已全部使用 $t 函数
3. **i18n 键**：67 个业务模块 i18n 键已配置完成
4. **验证通过**：所有文件通过类型检查，菜单显示正常

详细实现报告参见：`main/src/docs/reports/2025-12-29-implement-i18n-for-business-routes.md`

## 5. 文档更新清单

- [x] `.kiro/specs/origin-to-pure-admin-migration/requirements.md` - 新增术语和 Requirement 17
- [x] `.kiro/specs/origin-to-pure-admin-migration/design.md` - 新增 i18n 配置规范注释
- [x] `openspec/changes/origin-to-pure-admin/specs/router/spec.md` - 新增 5.4 章节
- [x] `CLAUDE.md` - 新增 3.6 章节
- [x] 创建本报告文档

## 6. 后续工作

### 6.1 修复遗漏的命名空间问题（2025-12-29）

在文档更新完成后，发现部分路由文件仍在使用错误的 `menus.` 命名空间而不是 `business.` 命名空间。

**问题文件**：

- `main/src/router/modules/business/message.ts` - 使用了 `menus.message` 等
- `main/src/router/modules/business/region.ts` - 使用了 `menus.region` 等
- `main/src/router/modules/business/personnel.ts` - 使用了 `menus.personnel` 等

**修复内容**：

- 将 message 路由的 4 个 i18n 键从 `menus.` 改为 `business.`
- 将 region 路由的 5 个 i18n 键从 `menus.` 改为 `business.`
- 将 personnel 路由的 5 个 i18n 键从 `menus.` 改为 `business.`

**验证结果**：

- ✅ 所有文件通过 TypeScript 类型检查
- ✅ i18n 键名与 zh-CN.yaml 中的配置完全匹配
- ✅ 菜单应该能够正确显示中文文本

### 6.2 完成状态

i18n 相关的全部工作已完成：

1. ✅ 实现 i18n 配置和路由更新
2. ✅ 更新项目文档
3. ✅ 验证功能正常
4. ✅ 修复遗漏的命名空间问题

无需进一步的 i18n 相关工作。

## 7. 总结

本次文档更新确保了 i18n 规范在项目的全部规范文档中得到完整记录，为后续的开发工作提供了清晰的指导。所有文档保持一致性，包含了详细的配置说明、代码示例和验证方法。
