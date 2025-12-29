# 2025-12-29 为所有布局模式添加侧边栏类型切换器

## 1. 问题描述

### 1.1 现象

在切换到"顶部菜单"（horizontal）和"混合菜单"（mix）导航模式时，侧边栏类型切换器（SidebarTypeSwitcher）丢失，用户无法在业务侧边栏和案例侧边栏之间切换。

### 1.2 原因分析

1. **NavVertical.vue**：已经集成了 `SidebarTypeSwitcher`，在垂直布局模式下正常工作
2. **NavHorizontal.vue**：虽然导入了 `useSidebarType` 并实现了路由过滤，但没有显示 `SidebarTypeSwitcher` 组件
3. **NavMix.vue**：既没有导入 `useSidebarType`，也没有显示 `SidebarTypeSwitcher` 组件，更没有实现路由过滤

## 2. 解决方案

为 `NavHorizontal.vue` 和 `NavMix.vue` 添加侧边栏类型切换器，并确保路由过滤功能正常工作。

## 3. 修改内容

### 3.1 NavHorizontal.vue

**文件路径**：`main/src/layout/components/lay-sidebar/NavHorizontal.vue`

#### 3.1.1 添加组件导入

```typescript
import SidebarTypeSwitcher from "@/components/SidebarTypeSwitcher/index.vue";
```

#### 3.1.2 在模板中添加切换器

```vue
<div class="horizontal-header-right">
  <!-- 侧边栏类型切换 -->
  <SidebarTypeSwitcher />
  <!-- 菜单搜索 -->
  <LaySearch id="header-search" />
  <!-- ... 其他组件 -->
</div>
```

**说明**：`NavHorizontal.vue` 已经有了路由过滤逻辑，只需要添加 UI 组件即可。

### 3.2 NavMix.vue

**文件路径**：`main/src/layout/components/lay-sidebar/NavMix.vue`

#### 3.2.1 添加 computed 导入

```typescript
import { ref, toRaw, watch, computed, onMounted, nextTick } from "vue";
```

#### 3.2.2 添加必要的导入

```typescript
import { useSidebarType } from "@/composables/use-sidebar-type";
import SidebarTypeSwitcher from "@/components/SidebarTypeSwitcher/index.vue";
```

#### 3.2.3 使用 useSidebarType

```typescript
const { filterRoutesBySidebarType, currentSidebarType } = useSidebarType();

const filteredMenus = computed(() => {
	return filterRoutesBySidebarType(usePermissionStoreHook().wholeMenus, currentSidebarType.value);
});
```

#### 3.2.4 更新 getDefaultActive 函数

```typescript
function getDefaultActive(routePath) {
	const wholeMenus = usePermissionStoreHook().wholeMenus;
	const filteredMenus = filterRoutesBySidebarType(wholeMenus, currentSidebarType.value);
	/** 当前路由的父级路径 */
	const parentRoutes = getParentPaths(routePath, filteredMenus)[0];
	defaultActive.value = !isAllEmpty(route.meta?.activePath)
		? route.meta.activePath
		: findRouteByPath(parentRoutes, filteredMenus)?.children[0]?.path;
}
```

#### 3.2.5 更新 watch 监听

```typescript
watch(
	() => [route.path, usePermissionStoreHook().wholeMenus, currentSidebarType.value],
	() => {
		getDefaultActive(route.path);
	},
);
```

#### 3.2.6 更新模板中的菜单渲染

```vue
<el-menu-item v-for="route in filteredMenus" :key="route.path" :index="resolvePath(route) || route.redirect">
  <!-- ... -->
</el-menu-item>
```

#### 3.2.7 在模板中添加切换器

```vue
<div class="horizontal-header-right">
  <!-- 侧边栏类型切换 -->
  <SidebarTypeSwitcher />
  <!-- 菜单搜索 -->
  <LaySearch id="header-search" />
  <!-- ... 其他组件 -->
</div>
```

## 4. 修改对比

### 4.1 NavHorizontal.vue

|   修改项    | 修改前 | 修改后 |
| :---------: | :----: | :----: |
|  组件导入   |   ❌   |   ✅   |
| UI 组件显示 |   ❌   |   ✅   |
|  路由过滤   |   ✅   |   ✅   |

### 4.2 NavMix.vue

|   修改项    | 修改前 | 修改后 |
| :---------: | :----: | :----: |
|  组件导入   |   ❌   |   ✅   |
| UI 组件显示 |   ❌   |   ✅   |
|  路由过滤   |   ❌   |   ✅   |
| 响应式更新  |   ❌   |   ✅   |

## 5. 功能验证

### 5.1 验证步骤

1. 启动开发服务器：

```bash
cd main
pnpm serve
```

2. 测试垂直布局模式：
   - ✅ 侧边栏切换器显示
   - ✅ 可以切换业务/案例侧边栏
   - ✅ 路由正确过滤

3. 切换到顶部菜单模式：
   - ✅ 侧边栏切换器显示
   - ✅ 可以切换业务/案例侧边栏
   - ✅ 路由正确过滤

4. 切换到混合菜单模式：
   - ✅ 侧边栏切换器显示
   - ✅ 可以切换业务/案例侧边栏
   - ✅ 路由正确过滤

### 5.2 预期效果

在所有三种布局模式下：

1. **侧边栏切换器始终可见**：位于顶部导航栏右侧，菜单搜索图标之前
2. **路由正确过滤**：
   - 选择"主业务"时，只显示业务路由
   - 选择"案例示例"时，只显示 Pure-Admin 示例路由
3. **状态持久化**：切换布局模式后，侧边栏类型选择保持不变
4. **响应式更新**：切换侧边栏类型后，菜单立即更新

## 6. 技术细节

### 6.1 路由过滤机制

所有三个导航组件现在都使用相同的路由过滤机制：

```typescript
const { filterRoutesBySidebarType, currentSidebarType } = useSidebarType();

const filteredMenus = computed(() => {
	return filterRoutesBySidebarType(usePermissionStoreHook().wholeMenus, currentSidebarType.value);
});
```

### 6.2 响应式更新

通过 `computed` 和 `watch` 确保：

1. 当 `currentSidebarType` 变化时，`filteredMenus` 自动更新
2. 当路由变化时，`defaultActive` 自动更新
3. UI 实时反映最新状态

### 6.3 组件位置

`SidebarTypeSwitcher` 在所有布局模式下的位置保持一致：

```plain
[Logo/菜单] ... [侧边栏切换] [搜索] [国际化] [全屏] [通知] [用户] [设置]
```

## 7. 影响范围

### 7.1 修改的文件

|                          文件路径                          |   修改类型   |
| :--------------------------------------------------------: | :----------: |
| `main/src/layout/components/lay-sidebar/NavHorizontal.vue` | 添加 UI 组件 |
|    `main/src/layout/components/lay-sidebar/NavMix.vue`     | 完整功能集成 |

**总计**：2 个文件

### 7.2 不受影响的功能

1. ✅ 原有的垂直布局功能
2. ✅ 路由导航
3. ✅ 菜单展开/收起
4. ✅ 其他顶部导航栏功能

## 8. 一致性保证

### 8.1 三种布局模式的一致性

|     功能     | 垂直布局 | 顶部菜单 | 混合菜单 |
| :----------: | :------: | :------: | :------: |
| 侧边栏切换器 |    ✅    |    ✅    |    ✅    |
|   路由过滤   |    ✅    |    ✅    |    ✅    |
|  状态持久化  |    ✅    |    ✅    |    ✅    |
|  响应式更新  |    ✅    |    ✅    |    ✅    |

### 8.2 用户体验一致性

无论用户选择哪种布局模式，侧边栏类型切换功能的：

1. **位置**：始终在顶部导航栏右侧
2. **样式**：保持一致的视觉效果
3. **行为**：相同的交互方式
4. **状态**：跨布局模式保持

## 9. 后续优化建议

### 9.1 代码复用

考虑将侧边栏切换器相关的逻辑提取为一个 composable：

```typescript
// useNavbarSidebar.ts
export function useNavbarSidebar() {
	const { filterRoutesBySidebarType, currentSidebarType } = useSidebarType();

	const filteredMenus = computed(() => {
		return filterRoutesBySidebarType(usePermissionStoreHook().wholeMenus, currentSidebarType.value);
	});

	return {
		filteredMenus,
		currentSidebarType,
	};
}
```

### 9.2 性能优化

如果菜单数量很大，考虑：

1. 使用 `shallowRef` 优化性能
2. 添加防抖处理
3. 使用虚拟滚动

### 9.3 测试覆盖

建议添加：

1. 单元测试：测试路由过滤逻辑
2. 集成测试：测试切换器在不同布局模式下的行为
3. E2E 测试：测试完整的用户交互流程

## 10. 总结

### 10.1 修改统计

|     类别     | 数量 |
| :----------: | :--: |
|   修改文件   |  2   |
|   新增导入   |  4   |
| 新增计算属性 |  1   |
|   更新函数   |  1   |
|   更新监听   |  1   |
| 新增 UI 组件 |  2   |

**总计**：11 处修改

### 10.2 效果

- ✅ 所有布局模式都支持侧边栏类型切换
- ✅ 路由过滤功能在所有模式下正常工作
- ✅ 用户体验保持一致
- ✅ 代码结构清晰，易于维护

### 10.3 用户价值

1. **功能完整性**：无论选择哪种布局，都能使用侧边栏切换功能
2. **使用便捷性**：切换器位置固定，易于找到和使用
3. **体验一致性**：跨布局模式的一致体验
4. **灵活性**：可以根据需要自由切换布局和侧边栏类型

---

**报告生成时间**：2025-12-29  
**报告版本**：v1.0  
**报告作者**：Kiro AI Assistant  
**修改状态**：✅ 已完成
