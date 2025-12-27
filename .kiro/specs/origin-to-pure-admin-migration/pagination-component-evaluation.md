# 2025-12-27 分页组件评估

## 1. Origin 分页组件分析

### 1.1 组件概述

**组件名称**: `pagination`  
**文件位置**: `origin/src/components/pagination/`  
**核心功能**: 封装 Element Plus 分页组件，提供自动请求功能

### 1.2 核心特性

| 特性     | 说明                                      |
| :------- | :---------------------------------------- |
| 预设配置 | 预设 layout、pageSizes、background 等属性 |
| 双向绑定 | 使用 v-model 绑定 pageIndex 和 pageSize   |
| 自动请求 | 监听分页变化，自动触发异步请求函数        |
| 灵活配置 | 支持覆盖预设配置                          |

### 1.3 组件 API

```typescript
interface PaginationProps {
	total: number;                          // 总条数（必填）
	asyncFunc: (...args: any[]) => Promise<any>; // 异步请求函数（必填）
	// 其他 Element Plus 分页属性（可选）
}

// 双向绑定
v-model:pageIndex  // 当前页码
v-model:pageSize   // 每页条数
```

### 1.4 预设配置

```typescript
{
	layout: "total, sizes, prev, pager, next, jumper, ->, slot",
	pageSizes: [10, 15, 30, 50, 100],
	background: true,
}
```

## 2. Pure-Admin 分页方案分析

### 2.1 Pure-Admin 的分页实现

Pure-Admin 主要使用以下方式处理分页：

1. **直接使用 Element Plus 分页**: 大部分场景直接使用 `<el-pagination>`
2. **集成在 Table 组件中**: 我们的 Table 组件已经集成了分页功能
3. **手动处理分页事件**: 在组件中手动监听分页变化并请求数据

### 2.2 Pure-Admin 的优势

- 灵活性高，可以根据场景自定义
- 与 Table 组件集成良好
- 代码简洁，易于理解

### 2.3 Pure-Admin 的不足

- 需要手动处理分页事件
- 没有自动请求功能
- 每个页面都需要重复编写分页逻辑

## 3. 迁移方案评估

### 3.1 方案一：保留 Origin 分页组件（推荐）

**优点**:

- 保留自动请求功能
- 减少重复代码
- 业务代码改动最小
- 提供统一的分页体验

**缺点**:

- 需要额外维护一个组件
- 与 Table 组件的分页功能有重叠

**结论**: ✅ **推荐采用此方案**

### 3.2 方案二：完全使用 Element Plus 分页

**优点**:

- 不需要额外组件
- 灵活性最高

**缺点**:

- 需要大量修改业务代码
- 每个页面都需要重复编写分页逻辑
- 工作量大

**结论**: ❌ 不推荐

### 3.3 方案三：仅在 Table 组件中使用分页

**优点**:

- 与 Table 组件集成
- 代码统一

**缺点**:

- 不适用于非表格场景（如卡片列表）
- 限制了使用场景

**结论**: ⚠️ 部分场景适用

## 4. 推荐方案详细说明

### 4.1 迁移策略

采用**方案一：保留 Origin 分页组件**

#### 迁移步骤

1. **复制组件文件**
   - 从 `origin/src/components/pagination/` 复制到 `main/src/components/Pagination/`

2. **调整导入路径**
   - 确保导入路径正确

3. **适配样式系统**
   - 使用 Pure-Admin 主题变量
   - 确保在亮色/暗色主题下都能正常显示

4. **测试验证**
   - 编写单元测试
   - 验证自动请求功能
   - 验证主题兼容性

### 4.2 使用场景

#### 场景一：独立使用（推荐用于非表格场景）

```vue
<template>
	<div>
		<!-- 内容区域 -->
		<div v-for="item in dataList" :key="item.id">
			{{ item.name }}
		</div>

		<!-- 分页组件 -->
		<Pagination
			v-model:pageIndex="pagination.pageIndex"
			v-model:pageSize="pagination.pageSize"
			:total="pagination.total"
			:asyncFunc="loadData"
		/>
	</div>
</template>

<script setup lang="ts">
import Pagination from "@/components/Pagination/index.vue";

const pagination = reactive({
	pageIndex: 1,
	pageSize: 10,
	total: 0,
});

async function loadData(pageIndex: number, pageSize: number) {
	// 请求数据
	const { data, total } = await fetchData({ pageIndex, pageSize });
	dataList.value = data;
	pagination.total = total;
}
</script>
```

#### 场景二：与 Table 组件配合使用

```vue
<template>
	<Table :data="tableData" :columns="columns" :pagination="pagination" @page-change="handlePageChange" />
</template>

<script setup lang="ts">
// Table 组件已经集成了分页功能
// 不需要额外使用 Pagination 组件
</script>
```

### 4.3 兼容性保证

| 功能项   | Origin | Main | 兼容性 |
| :------- | :----: | :--: | :----: |
| 预设配置 |   ✅   |  ✅  |   ✅   |
| 双向绑定 |   ✅   |  ✅  |   ✅   |
| 自动请求 |   ✅   |  ✅  |   ✅   |
| 灵活配置 |   ✅   |  ✅  |   ✅   |
| 亮色主题 |   ✅   |  ✅  |   ✅   |
| 暗色主题 |   ❌   |  ✅  |   ✅   |

## 5. 风险评估

### 5.1 技术风险

| 风险项            | 风险等级 | 应对措施     |
| :---------------- | :------: | :----------- |
| 样式兼容性问题    |    低    | 使用主题变量 |
| 自动请求功能失效  |    低    | 充分测试     |
| 与 Table 组件冲突 |    低    | 明确使用场景 |

### 5.2 业务风险

| 风险项       | 风险等级 | 应对措施               |
| :----------- | :------: | :--------------------- |
| 功能缺失     |    低    | 完整复制，保留所有功能 |
| 业务代码改动 |    低    | 仅需调整导入路径       |

## 6. 工作量评估

| 任务项       | 预计工时 | 优先级 |
| :----------- | :------: | :----: |
| 复制组件文件 |   0.3h   |   P0   |
| 调整导入路径 |   0.2h   |   P0   |
| 适配样式系统 |   0.5h   |   P0   |
| 编写单元测试 |    1h    |   P1   |
| 创建使用示例 |   0.5h   |   P1   |
| **总计**     | **2.5h** |   -    |

## 7. 结论

**推荐采用方案一：保留 Origin 分页组件**

**理由**:

1. ✅ 保留自动请求功能，减少重复代码
2. ✅ 业务代码改动最小
3. ✅ 提供统一的分页体验
4. ✅ 适用于非表格场景
5. ✅ 与 Table 组件互补，不冲突

**使用建议**:

- 非表格场景（如卡片列表）：使用 Pagination 组件
- 表格场景：使用 Table 组件内置的分页功能

**下一步行动**:

- 复制组件文件到 Main 项目
- 调整导入路径
- 适配样式系统
- 编写单元测试
