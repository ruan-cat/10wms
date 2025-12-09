# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个名为"阮喵喵 10wms 项目"的 monorepo，用于实现一个 WMS（仓库管理系统）后台项目的升级改造。项目包含原始版本（origin）、主要改造版本（main）和示例代码（examples）。

## 代码/编码格式要求

### 1. markdown 文档的 table 编写格式

每当你在 markdown 文档内编写表格时，表格的格式一定是**居中对齐**的，必须满足**居中对齐**的格式要求。

### 2. markdown 文档的 vue 组件代码片段编写格式

错误写法：

1. 代码块语言用 vue，且不带有 `<template>` 标签来包裹。

```vue
<wd-popup v-model="showModal">
  <wd-cell-group>
    <!-- 内容 -->
  </wd-cell-group>
</wd-popup>
```

2. 代码块语言用 html。

```html
<wd-popup v-model="showModal">
	<wd-cell-group>
		<!-- 内容 -->
	</wd-cell-group>
</wd-popup>
```

正确写法：代码块语言用 vue ，且带有 `<template>` 标签来包裹。

```vue
<template>
	<wd-popup v-model="showModal">
		<wd-cell-group>
			<!-- 内容 -->
		</wd-cell-group>
	</wd-popup>
</template>
```

### 3. javascript / typescript 的代码注释写法

代码注释写法应该写成 jsdoc 格式。而不是单纯的双斜杠注释。比如：

不合适的双斜线注释写法如下：

```ts
// 模拟成功响应
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

合适的，满足期望的 jsdoc 注释写法如下：

```ts
/** 模拟成功响应 */
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

### 4. markdown 的多级标题要主动提供序号

对于每一份 markdown 文件的`二级标题`和`三级标题`，你都应该要：

1. 主动添加**数字**序号，便于我阅读文档。
2. 主动**维护正确的数字序号顺序**。如果你处理的 markdown 文档，其手动添加的序号顺序不对，请你及时的更新序号顺序。

## 报告编写规范

在大多数情况下，你的更改是**不需要**编写任何说明报告的。但是每当你需要编写报告时，请你首先遵循以下要求：

- 报告地址： 默认在 `apps\admin\src\docs\reports` 文件夹内编写报告。
- 报告文件格式： `*.md` 通常是 markdown 文件格式。
- 报告文件名称命名要求：
  1. 前缀以日期命名。包括年月日。日期格式 `YYYY-MM-DD` 。
  2. 用小写英文加短横杠的方式命名。
- 报告的一级标题： 必须是日期`YYYY-MM-DD`+报告名的格式。
  - 好的例子： `2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误` 。前缀包含有 `YYYY-MM-DD` 日期。
  - 糟糕的例子： `构建与 fdir/Vite 事件复盘报告` 。前缀缺少 `YYYY-MM-DD` 日期。
- 报告日志信息的代码块语言： 一律用 `log` 作为日志信息的代码块语言。如下例子：

  ````markdown
  日志如下：

  ```log
  日志信息……
  ```
  ````

- 报告语言： 默认用简体中文。

## 工作区结构

项目采用 pnpm workspaces 管理，包含以下子项目：

- **origin/**: 原始的 10wms 项目，待改造的项目
- **main/**: 当前的主项目，基于 vue-pure-admin 重构
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

### Main 项目（基于 vue-pure-admin）

- **技术栈**: Vue 3 + TypeScript + Vite + Element Plus + Tailwind CSS + Pinia
- **核心特性**:
  - 基于 vue-pure-admin 框架构建的现代化后台管理系统
  - 支持国际化(vue-i18n)
  - 响应式存储(responsive-storage)
  - 丰富的 UI 组件库(@pureadmin/table, @pureadmin/descriptions)
  - 图表可视化(echarts)
  - 动画效果(@vueuse/motion)

### Origin 项目（原始版本）

- **技术栈**: Vue 3 + TypeScript + Vite + Element Plus + Pinia
- **核心特性**:
  - 表单设计器(@form-create/designer)
  - 流程图组件(@logicflow/core, @logicflow/extension)
  - 富文本编辑器(@wangeditor/editor)
  - 文档系统(vitepress)

### 构建配置

- **包管理器**: pnpm v10.16.1（严格要求）
- **Node 版本**: >=22.14.0
- **构建工具**: Turbo（用于 monorepo 构建优化）
- **部署**: Vercel（使用自定义部署脚本）

## 开发注意事项

### 包管理

- 必须使用 pnpm 作为包管理器
- 项目配置了`onlyBuiltDependencies`来控制需要编译的依赖

### 代码规范

- 使用@antfu/eslint-config 作为 ESLint 配置
- 集成 Prettier 进行代码格式化
- 使用 Stylelint 进行样式检查
- 配置了 commitlint 进行提交信息规范

### 构建和打包

- Main 项目使用较大的内存配置（开发 4GB，构建 8GB）
- 支持多环境构建（development、staging、production）
- 集成 bundle analyzer 和压缩插件

### 国际化支持

- Main 项目完整支持国际化
- Origin 项目使用 vue-i18n rc 版本

### 状态管理

- 两个项目都使用 Pinia 作为状态管理
- Origin 项目额外配置了持久化插件

### 样式系统

- Main 项目使用 Tailwind CSS + SCSS
- Origin 项目主要使用 CSS + SCSS
- 都集成了 Element Plus 组件库
