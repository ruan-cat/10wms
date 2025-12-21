# 项目上下文

## 1. Purpose

阮喵喵 10wms 项目 - 一个 WMS（仓库管理系统）后台项目的升级改造工程。项目采用 monorepo 架构，包含原始版本（origin）、主要改造版本（main）和示例代码（examples），目标是将旧版 WMS 系统迁移到基于 vue-pure-admin 的现代化技术栈。

## 2. 技术栈

### 2.1 Main 项目（主要改造版本）

|     类别     |                             技术                              |
| :----------: | :-----------------------------------------------------------: |
|   前端框架   |                     Vue 3 + TypeScript                        |
|   构建工具   |                             Vite                              |
|   UI 组件库  |                         Element Plus                          |
|   样式方案   |                     Tailwind CSS + SCSS                       |
|   状态管理   |                            Pinia                              |
|    国际化    |                           vue-i18n                            |
|   图表可视化 |                           ECharts                             |
| UI 组件扩展  |           @pureadmin/table, @pureadmin/descriptions           |
|   动画效果   |                        @vueuse/motion                         |

### 2.2 Origin 项目（原始版本）

|     类别     |                             技术                              |
| :----------: | :-----------------------------------------------------------: |
|   前端框架   |                     Vue 3 + TypeScript                        |
|   构建工具   |                             Vite                              |
|   UI 组件库  |                         Element Plus                          |
|   状态管理   |                    Pinia + 持久化插件                         |
|  表单设计器  |                    @form-create/designer                      |
|    流程图    |            @logicflow/core, @logicflow/extension              |
|  富文本编辑  |                      @wangeditor/editor                       |
|   文档系统   |                          VitePress                            |

### 2.3 工程化工具

|     类别     |                             技术                              |
| :----------: | :-----------------------------------------------------------: |
|   包管理器   |                       pnpm v10.16.1                           |
|  Node 版本   |                          >=22.14.0                            |
| Monorepo 构建|                            Turbo                              |
|     部署     |                           Vercel                              |

## 3. 项目约定

### 3.1 代码风格

- **ESLint**: 使用 @antfu/eslint-config 配置
- **Prettier**: 集成代码格式化
- **Stylelint**: 样式检查
- **注释规范**: JavaScript/TypeScript 代码注释必须使用 JSDoc 格式
- **Markdown 表格**: 必须使用居中对齐格式
- **Vue 代码片段**: 在 Markdown 中必须包含 `<template>` 标签
- **标题序号**: Markdown 的二级和三级标题需添加数字序号

### 3.2 架构模式

- **Monorepo 架构**: 使用 pnpm workspaces 管理多个子项目
- **组件化开发**: 基于 Vue 3 Composition API
- **响应式存储**: 使用 responsive-storage 管理本地存储
- **模块化路由**: 动态路由配置

### 3.3 测试策略

- **测试框架**: Vitest
- **测试 UI**: Vitest UI（端口 4000）
- **运行命令**: `pnpm test`（根目录）或 `cd origin && pnpm test`

### 3.4 Git 工作流

- **主分支**: main
- **开发分支**: dev
- **提交规范**: 使用 commitlint 进行提交信息规范校验
- **提交格式**: 支持 emoji 前缀（如 🦄 refactor, 📃 docs, 🐞 fix, 📦 deps, 🐳 chore）

## 4. 领域上下文

WMS（Warehouse Management System）仓库管理系统，用于管理仓库的入库、出库、库存、盘点等核心业务流程。本项目是对现有 WMS 后台管理系统的现代化升级改造。

## 5. 重要约束

|         约束类型         |                             说明                              |
| :----------------------: | :-----------------------------------------------------------: |
|        包管理器限制      |                   必须使用 pnpm 作为包管理器                  |
|        内存配置          |   Main 项目开发环境 4GB，构建环境 8GB                         |
|        多环境支持        |         支持 development、staging、production 环境            |
|      依赖编译控制        |        配置了 onlyBuiltDependencies 控制编译依赖              |

## 6. 外部依赖

|         服务/系统        |                             用途                              |
| :----------------------: | :-----------------------------------------------------------: |
|          Vercel          |                        项目部署平台                           |
|       Element Plus       |                        UI 组件库                              |
|      vue-pure-admin      |                      后台管理框架基础                         |
|         ECharts          |                        数据可视化                             |
|        LogicFlow         |                        流程图引擎                             |
