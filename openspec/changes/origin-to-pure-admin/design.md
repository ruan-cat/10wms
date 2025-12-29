# Design Document: Origin 项目迁移到 Pure-Admin

## Context

### 背景

Origin 项目是一个基于 Vue 3 + Element Plus 的 WMS（仓库管理系统）后台项目，包含 13 个核心业务模块和丰富的功能。虽然功能完整，但在权限系统、布局系统、主题系统等基础设施方面存在不足。

Pure-Admin 是一个成熟的后台管理框架，提供了完善的权限系统、布局系统、主题系统和丰富的增强组件。将 Origin 项目迁移到 Pure-Admin 可以显著提升用户体验和开发效率。

### 约束

1. **技术栈一致性**: Origin 和 Pure-Admin 都使用 Vue 3 + Vite + Element Plus，核心技术栈一致，降低迁移难度
2. **业务逻辑不变**: 迁移过程中不重写业务逻辑，保持功能完整性
3. **渐进式迁移**: 按阶段、按模块逐步迁移，降低风险
4. **时间约束**: 预计 12-16 周完成全部迁移工作

### 利益相关者

1. **开发团队**: 需要执行迁移工作，希望有清晰的迁移计划和工具支持
2. **产品团队**: 关注功能完整性和用户体验提升
3. **用户**: 期望获得更好的使用体验，功能保持稳定

## Goals / Non-Goals

### Goals

1. **完整迁移业务功能**: 确保 Origin 项目的所有业务功能都迁移到 Main 项目，无功能遗漏
2. **提升用户体验**: 利用 Pure-Admin 的布局系统、主题系统、权限系统提升用户体验
3. **提高代码质量**: 统一代码规范，提升代码可维护性
4. **优化性能**: 实施性能优化，确保首屏加载时间 < 3s

### Non-Goals

1. **重写业务逻辑**: 不对业务逻辑进行重构或重写
2. **添加新功能**: 迁移过程中不添加新的业务功能
3. **改变用户操作流程**: 保持用户熟悉的操作流程，除非有明确的改进需求
4. **支持旧版浏览器**: 只支持现代浏览器（Chrome、Firefox、Safari、Edge 最新版）

## Decisions

### Decision 1: 使用 Pure-Admin 的基础设施

**决策**: 全面使用 Pure-Admin 的 HTTP 工具、状态管理、路由系统、权限系统等基础设施。

**理由**:

- Pure-Admin 的基础设施更完善，提供了更好的开发体验
- 统一使用 Pure-Admin 的基础设施可以减少代码维护成本
- Pure-Admin 的权限系统、布局系统、主题系统是核心优势

**Alternatives considered**:

- **保留 Origin 的基础设施**: 会导致代码不统一，无法充分利用 Pure-Admin 的优势
- **混合使用**: 增加复杂度，不利于维护

### Decision 2: 保留 Origin 的特殊功能组件

**决策**: 保留 Origin 的表单设计器、流程图、打印功能等特殊功能组件，并适配到 Pure-Admin。

**理由**:

- 这些是 Origin 项目的核心业务功能，重新实现成本高
- Pure-Admin 没有提供这些功能，需要保留
- 适配工作相对简单，主要是样式和导入路径调整

**Alternatives considered**:

- **使用 Pure-Admin 的替代方案**: Pure-Admin 没有提供这些功能的替代方案
- **重新实现**: 成本高，风险大，不现实

### Decision 3: 使用 @pureadmin/table 替代基础表格组件

**决策**: 使用 `@pureadmin/table` 替代 Origin 的基础表格组件。

**理由**:

- `@pureadmin/table` 功能更强大，支持虚拟滚动、列设置、列拖拽等
- 提供更好的性能和用户体验
- 与 Pure-Admin 的整体设计风格一致

**Alternatives considered**:

- **保留 Origin 的表格组件**: 功能相对简单，无法充分利用 Pure-Admin 的表格增强功能
- **同时保留两种表格组件**: 增加维护成本，代码不统一

### Decision 4: 使用 Tailwind CSS 作为主要样式方案

**决策**: 逐步使用 Tailwind CSS 重写样式，保留必要的 SCSS 样式。

**理由**:

- Tailwind CSS 是现代化的原子化 CSS 方案，开发效率高
- Pure-Admin 已经集成了 Tailwind CSS
- 可以减少样式文件数量，提升可维护性

**Alternatives considered**:

- **完全保留 SCSS 样式**: 无法利用 Tailwind CSS 的优势，样式文件多
- **完全使用 Tailwind CSS**: 复杂样式和动画难以实现，需要保留部分 SCSS

### Decision 5: 按优先级分阶段迁移业务模块

**决策**: 将业务模块分为 P0、P1、P2、P3 四个优先级，按优先级逐步迁移。

**理由**:

- 核心模块（系统管理、登录认证）优先迁移，确保基础功能可用
- 高频模块（基础数据、采购管理、库存管理）次之
- 辅助模块最后迁移，降低风险

**Alternatives considered**:

- **按业务领域迁移**: 可能导致某些领域的功能长时间不可用
- **随机迁移**: 无法保证核心功能优先可用

### Decision 6: 使用 responsive-storage 替代 pinia-plugin-persistedstate

**决策**: 使用 Pure-Admin 的 responsive-storage 替代 pinia-plugin-persistedstate。

**理由**:

- responsive-storage 是 Pure-Admin 官方推荐的持久化方案
- 提供响应式的存储 API，与 Vue 3 响应式系统集成更好
- 与 Pure-Admin 的其他功能集成更紧密

**Alternatives considered**:

- **保留 pinia-plugin-persistedstate**: 两套持久化方案共存，代码不统一

## Risks / Trade-offs

### Risk 1: 功能遗漏

**风险**: 迁移过程中可能遗漏某些业务功能。

**影响**: 高 - 影响用户正常使用

**缓解措施**:

1. 建立详细的功能清单，逐一核对
2. 在每个阶段完成后进行功能验收
3. 编写完整的测试用例
4. 邀请用户进行 UAT 测试

### Risk 2: API 接口变更导致功能异常

**风险**: API 接口适配过程中可能引入错误。

**影响**: 高 - 影响数据准确性和业务流程

**缓解措施**:

1. 建立 API 文档，明确接口规范
2. 编写 API 层的单元测试和集成测试
3. 在测试环境充分验证后再迁移到生产环境

### Risk 3: 依赖版本冲突

**风险**: Origin 和 Pure-Admin 的依赖版本可能存在冲突。

**影响**: 中 - 可能导致某些功能异常

**缓解措施**:

1. 使用 pnpm overrides 统一依赖版本
2. 提前进行依赖冲突检查
3. 充分测试依赖升级后的功能

### Risk 4: 样式兼容性问题

**风险**: 迁移到 Tailwind CSS 后可能出现样式错乱。

**影响**: 中 - 影响用户体验

**缓解措施**:

1. 建立样式测试用例
2. 在多种浏览器和屏幕尺寸下测试
3. 保留必要的 SCSS 样式作为兜底方案

### Risk 5: 工期延误

**风险**: 实际迁移时间可能超过预期。

**影响**: 中 - 影响项目交付时间

**缓解措施**:

1. 预留 20% 的缓冲时间
2. 建立每周进度检查机制
3. 及时调整计划和资源分配
4. 优先保证核心功能迁移完成

## Migration Plan

### 阶段划分

1. **阶段一（1-2 周）**: 基础设施迁移
2. **阶段二（2-3 周）**: 公共组件迁移
3. **阶段三（1-2 周）**: API 层迁移
4. **阶段四（6-8 周）**: 业务模块迁移
5. **阶段五（2-3 周）**: 测试与优化

### 回滚策略

1. **保留 Origin 项目**: 始终保留完整的 Origin 项目作为备份
2. **版本控制**: 每个阶段创建独立的 Git 分支
3. **环境隔离**: 在独立的测试环境进行迁移和测试
4. **灰度发布**: 先在部分用户中试用，验证无问题后全量发布

### 数据迁移

**说明**: 本次迁移不涉及数据迁移，因为：

1. Origin 和 Main 项目共享同一个后端 API
2. 不改变数据存储结构
3. 只迁移前端代码

## Open Questions

1. **是否需要支持移动端适配？**
   - 当前 Pure-Admin 主要针对桌面端，移动端适配需要额外工作
   - 需要与产品团队确认是否需要移动端支持

2. **是否需要支持 IE 浏览器？**
   - Pure-Admin 不支持 IE 浏览器
   - 需要与利益相关者确认浏览器支持范围

3. **是否需要在迁移过程中进行代码重构？**
   - 当前计划是保持业务逻辑不变
   - 是否允许在发现明显问题时进行局部重构？

4. **如何处理 Origin 项目的自定义主题色？**
   - Origin 项目可能有自定义的主题色配置
   - 需要确认是否保留原有主题色还是使用 Pure-Admin 的默认主题

## Implementation Guidelines

### 代码规范

1. **遵循 Pure-Admin 的代码规范**: 使用 ESLint、Prettier、Stylelint
2. **TypeScript 类型定义**: 所有新增代码必须有完整的类型定义
3. **注释规范**: 使用 JSDoc 格式编写注释
4. **命名规范**: 遵循 Pure-Admin 的命名规范

### 组件开发规范

1. **优先使用 Pure-Admin 的组件**: 尽量使用 Pure-Admin 提供的增强组件
2. **组件样式**: 优先使用 Tailwind CSS，复杂样式使用 SCSS
3. **组件复用**: 提取公共组件，避免代码重复

### 测试规范

1. **单元测试**: 每个公共组件和工具函数都应有单元测试
2. **集成测试**: 核心业务模块应有集成测试
3. **E2E 测试**: 核心用户流程应有 E2E 测试
4. **测试覆盖率**: 目标覆盖率 > 80%

## Success Criteria

### 功能完整性

- ✅ 所有业务功能正常运行
- ✅ 无功能遗漏
- ✅ 用户体验良好

### 代码质量

- ✅ 代码规范统一
- ✅ 类型定义完善
- ✅ 测试覆盖率 > 80%

### 性能指标

- ✅ 首屏加载时间 < 3s
- ✅ 打包体积合理（主 chunk < 500KB gzip 后）
- ✅ 运行流畅无卡顿

### 用户验收

- ✅ 用户 UAT 测试通过
- ✅ 无严重 bug
- ✅ 用户满意度 > 85%

## Decision 7: 移除自动路由配置，采用 Pure-Admin 标准路由方式

**决策**: 移除 vue-router/auto、virtual:meta-layouts、@ruan-cat/utils/unplugin-vue-router、vite-plugin-vue-meta-layouts 等自动化路由依赖，采用 Pure-Admin 标准的手动路由配置方式。

**理由**:

- 自动化路由增加了项目复杂度和学习成本
- 与 Pure-Admin 的标准路由方式不一致，不利于团队协作
- 调试困难，路由生成过程不透明
- 可能导致路由冲突和死循环问题
- Pure-Admin 官方文档和示例都使用手动路由配置

**Alternatives considered**:

- **保留自动路由配置**: 虽然提供了便利，但与框架标准不一致，增加维护成本
- **混合使用**: 会导致路由配置方式不统一，更加混乱

**实施方案**:

1. 从 main/src/router/index.ts 移除所有自动路由相关的导入和逻辑
2. 恢复使用 vue-router 原生的 createRouter 函数
3. 在 main/src/router/modules 目录下手动定义所有业务路由
4. 使用动态 import 实现路由懒加载

## Decision 8: 规范页面文件存储结构

**决策**: 将从 Origin 项目迁移的业务页面统一存放到 main/src/pages 目录，Pure-Admin 框架自带的示例页面保留在 main/src/views 目录。

**理由**:

- 清晰区分框架示例代码和业务代码
- 便于代码管理和维护
- 避免测试页面污染业务代码目录
- 符合项目规范和团队约定

**Alternatives considered**:

- **全部放在 views 目录**: 无法区分框架代码和业务代码
- **全部放在 pages 目录**: 会丢失框架示例代码的参考价值

**实施方案**:

1. 删除 main/src/pages 目录下的测试页面（a、b 目录）
2. 确认所有业务页面已按业务模块分类存储在 main/src/pages 目录
3. 保留 main/src/views 目录下的 Pure-Admin 示例页面作为参考

## Router Configuration Cleanup Details

### 当前问题分析

main/src/router/index.ts 当前使用了以下自动化路由相关的依赖：

```typescript
// 问题代码
import { createRouter } from "vue-router/auto";
import { handleHotUpdate, routes as autoRoutes } from "vue-router/auto-routes";
import { createGetRoutes, setupLayouts } from "virtual:meta-layouts";
import { disposalAutoRouter } from "@ruan-cat/utils/unplugin-vue-router";

const isAutoRoutes = false;
const flattenAutoRoutes = formatFlatteningRoutes(buildHierarchyTree(ascending(autoRoutes.flat(Infinity))));
const cleanedAutoRoutes = disposalAutoRouter(autoRoutes);
```

这些代码带来的问题：

1. 增加了不必要的依赖和复杂度
2. 与 Pure-Admin 标准路由方式不一致
3. 存在大量调试代码（console.warn）
4. 路由创建逻辑复杂，难以理解和维护

### 目标状态

简化后的路由配置应该：

```typescript
// 目标代码
import { createRouter } from "vue-router";

// 简洁的路由实例创建
export const router: Router = createRouter({
	history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
	routes: constantRoutes.concat(...(remainingRouter as any)),
	strict: true,
	scrollBehavior(to, from, savedPosition) {
		// ...
	},
});
```

### 页面结构规范

**main/src/pages 目录结构**（业务页面）:

```plain
main/src/pages/
├── system/              # 系统管理模块
│   ├── user/           # 用户管理
│   ├── role/           # 角色管理
│   ├── menu/           # 菜单管理
│   └── dept/           # 部门管理
├── base-data/          # 基础数据模块
│   ├── goods/          # 商品管理
│   ├── customer/       # 客户管理
│   └── supplier/       # 供应商管理
├── purchase/           # 采购管理模块
├── inventory/          # 库存管理模块
├── outbound/           # 出库管理模块
├── daily-check/        # 日常检查模块
├── base-config/        # 基础配置模块
├── warehouse-config/   # 仓库配置模块
├── report/             # 客户报表模块
└── personnel-config/   # 人员配置模块
```

**main/src/views 目录**（框架示例页面）:

保留 Pure-Admin 框架自带的示例页面，如：

- able/: 功能示例
- components/: 组件示例
- table/: 表格示例
- error/: 错误页面
- login/: 登录页面
- welcome/: 欢迎页面

### 路由注册规范

每个业务模块在 main/src/router/modules 目录下创建对应的路由配置文件：

```typescript
// main/src/router/modules/system.ts
const systemRouter: RouteConfigsTable = {
	path: "/system",
	redirect: "/system/user",
	meta: {
		icon: "ri:settings-3-line",
		title: "系统管理",
		rank: 10,
	},
	children: [
		{
			path: "/system/user",
			name: "SystemUser",
			component: () => import("@/pages/system/user/index.vue"),
			meta: {
				title: "用户管理",
				showLink: true,
			},
		},
		// ... 其他子路由
	],
};

export default systemRouter;
```

### 迁移检查清单

- [ ] 移除 vue-router/auto 相关导入和使用
- [ ] 移除 virtual:meta-layouts 相关导入和使用
- [ ] 移除 @ruan-cat/utils/unplugin-vue-router 相关导入和使用
- [ ] 移除 vite-plugin-vue-meta-layouts 相关配置
- [ ] 恢复使用 vue-router 原生 createRouter
- [ ] 删除 main/src/pages/a 和 main/src/pages/b 测试目录
- [ ] 确认所有业务页面在 main/src/pages 目录
- [ ] 为所有业务模块创建路由配置文件
- [ ] 验证所有路由可正常访问
- [ ] 验证菜单显示正常
- [ ] 验证路由懒加载正常

## Risk 6: 路由配置清理可能导致路由失效

**风险**: 移除自动路由配置后，可能导致部分路由失效或无法访问。

**影响**: 高 - 影响用户访问业务页面

**缓解措施**:

1. 在独立分支进行路由配置清理
2. 逐个模块验证路由配置
3. 建立路由配置检查清单
4. 充分测试所有业务页面的路由访问
5. 保留原有配置作为备份，确保可以快速回滚
