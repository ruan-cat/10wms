# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个名为"阮喵喵10wms项目"的monorepo，用于实现一个WMS（仓库管理系统）后台项目的升级改造。项目包含原始版本（origin）、主要改造版本（main）和示例代码（examples）。

## 工作区结构

项目采用pnpm workspaces管理，包含以下子项目：
- **origin/**: 原始的10wms项目，待改造的项目
- **main/**: 当前的主项目，基于vue-pure-admin重构
- **examples/**: 用于参考的示例项目

## 常用命令

### 开发环境
```bash
# 在main项目中启动开发服务器
cd main && pnpm serve
# 或者
cd main && pnpm vite:dev

# 在origin项目中启动开发服务器
cd origin && pnpm dev
```

### 构建和部署
```bash
# 构建所有项目
pnpm build

# 构建main项目
cd main && pnpm build

# 构建origin项目
cd origin && pnpm build

# 部署到Vercel
pnpm deploy-vercel
```

### 测试
```bash
# 运行测试（在根目录）
pnpm test
# 使用Vitest UI在端口4000

# 在origin项目中运行测试
cd origin && pnpm test
```

### 代码质量
```bash
# 格式化所有项目代码
pnpm format

# 在main项目中执行linting
cd main && pnpm lint
cd main && pnpm lint:eslint
cd main && pnpm lint:prettier
cd main && pnpm lint:stylelint

# 类型检查
cd main && pnpm typecheck
```

### 依赖管理
```bash
# 清理依赖和缓存
pnpm clear
pnpm clear:deps
pnpm clear:cache

# 升级@ruan-cat相关依赖
pnpm up-ruan-cat

# 升级所有依赖（使用taze）
pnpm up-taze
```

## 架构设计

### Main项目（基于vue-pure-admin）
- **技术栈**: Vue 3 + TypeScript + Vite + Element Plus + Tailwind CSS + Pinia
- **核心特性**:
  - 基于vue-pure-admin框架构建的现代化后台管理系统
  - 支持国际化(vue-i18n)
  - 响应式存储(responsive-storage)
  - 丰富的UI组件库(@pureadmin/table, @pureadmin/descriptions)
  - 图表可视化(echarts)
  - 动画效果(@vueuse/motion)

### Origin项目（原始版本）
- **技术栈**: Vue 3 + TypeScript + Vite + Element Plus + Pinia
- **核心特性**:
  - 表单设计器(@form-create/designer)
  - 流程图组件(@logicflow/core, @logicflow/extension)
  - 富文本编辑器(@wangeditor/editor)
  - 文档系统(vitepress)

### 构建配置
- **包管理器**: pnpm v10.16.1（严格要求）
- **Node版本**: >=22.14.0
- **构建工具**: Turbo（用于monorepo构建优化）
- **部署**: Vercel（使用自定义部署脚本）

## 开发注意事项

### 包管理
- 必须使用pnpm作为包管理器
- 项目配置了`onlyBuiltDependencies`来控制需要编译的依赖

### 代码规范
- 使用@antfu/eslint-config作为ESLint配置
- 集成Prettier进行代码格式化
- 使用Stylelint进行样式检查
- 配置了commitlint进行提交信息规范

### 构建和打包
- Main项目使用较大的内存配置（开发4GB，构建8GB）
- 支持多环境构建（development、staging、production）
- 集成bundle analyzer和压缩插件

### 国际化支持
- Main项目完整支持国际化
- Origin项目使用vue-i18n rc版本

### 状态管理
- 两个项目都使用Pinia作为状态管理
- Origin项目额外配置了持久化插件

### 样式系统
- Main项目使用Tailwind CSS + SCSS
- Origin项目主要使用CSS + SCSS
- 都集成了Element Plus组件库