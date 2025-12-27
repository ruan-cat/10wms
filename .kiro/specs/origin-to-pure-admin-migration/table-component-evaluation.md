# 表格组件迁移方案评估

## 评估概述

本文档评估 Origin 表格组件迁移到 Pure-Admin 的方案。

**评估时间**: 2025-12-26

## Origin 表格组件分析

### 组件位置

`origin/src/components/table/index.vue`

### 核心功能

1. **基础表格**
   - 数据展示
   - 列配置
   - 斑马纹（默认开启）
   - 边框（默认开启）

2. **索引列**
   - `isIndex` 属性控制
   - 自动添加序号列
   - 可自定义索引列配置

3. **多选功能**
   - `isMultipleSelect` 属性控制
   - 自动添加选择列
   - `selection-change` 事件

4. **插槽支持**
   - `bodyCell` 插槽：自定义单元格内容
   - `table` 插槽：自定义整个表格

5. **列配置**
   - 默认居中对齐
   - 支持自定义列属性
   - 使用 lodash merge 合并配置

### 技术特点

- 使用 TypeScript 泛型
- 使用 `<script setup>` 语法
- 基于 Element Plus Table
- 使用 lodash 工具函数

### 接口定义

```typescript
interface SimpleDataTableProps<T, Column> {
  data: T[];
  columns: Column[];
  isIndex?: boolean;
  isMultipleSelect?: boolean;
}

// 事件
emit('selection-change', rows: T[])

// 插槽
bodyCell(props: { row, prop, index, column })
table()
```

## Pure-Admin 表格方案

### @pureadmin/table

Pure-Admin 使用 `@pureadmin/table` 包，这是一个基于 Element Plus Table 的增强组件。

**版本**: 3.3.0

### 核心功能

1. **基础表格**
   - 完整的 Element Plus Table 功能
   - 响应式设计
   - 虚拟滚动支持

2. **高级功能**
   - 列拖拽排序
   - 列显示/隐藏
   - 列宽度调整
   - 表格工具栏
   - 分页集成

3. **性能优化**
   - 虚拟滚动
   - 懒加载
   - 大数据量优化

### 使用示例

```vue
<template>
	<pure-table :data="tableData" :columns="columns" :pagination="pagination" @page-change="handlePageChange">
		<template #operation="{ row }">
			<el-button @click="handleEdit(row)">编辑</el-button>
		</template>
	</pure-table>
</template>
```

## 迁移方案对比

### 方案 A：直接使用 @pureadmin/table

**优点**:

- ✅ 功能更强大
- ✅ 性能更好（虚拟滚动）
- ✅ 维护成本低
- ✅ 与 Pure-Admin 生态集成好

**缺点**:

- ❌ API 与 Origin 不同，需要适配
- ❌ 学习成本
- ❌ 需要修改所有使用表格的页面

### 方案 B：保留 Origin 表格组件

**优点**:

- ✅ 无需修改现有代码
- ✅ 保持一致性
- ✅ 迁移成本低

**缺点**:

- ❌ 功能较少
- ❌ 性能一般
- ❌ 需要自己维护
- ❌ 无法利用 Pure-Admin 的高级功能

### 方案 C：封装适配层（推荐）

**优点**:

- ✅ 兼容 Origin API
- ✅ 使用 @pureadmin/table 的功能
- ✅ 渐进式迁移
- ✅ 最佳平衡

**缺点**:

- ⚠️ 需要编写适配代码
- ⚠️ 维护适配层

## 推荐方案：方案 C（封装适配层）

### 实现策略

创建一个封装组件 `main/src/components/Table/index.vue`，它：

1. **对外暴露 Origin 的 API**
   - 保持 `SimpleDataTableProps` 接口
   - 保持 `bodyCell` 插槽
   - 保持 `selection-change` 事件

2. **内部使用 @pureadmin/table**
   - 转换 props 到 @pureadmin/table 格式
   - 映射事件
   - 适配插槽

3. **渐进式增强**
   - 初期完全兼容 Origin
   - 后期逐步暴露 @pureadmin/table 的高级功能

### 实现示例

```vue
<script setup lang="ts" generic="T extends Object">
import { PureTable } from "@pureadmin/table";
import { computed } from "vue";
import type { SimpleDataTableProps } from "./types";

const props = defineProps<SimpleDataTableProps<T>>();
const emit = defineEmits<{
	(e: "selection-change", rows: T[]): void;
}>();

// 转换 columns 格式
const pureColumns = computed(() => {
	const cols = [...props.columns];

	// 添加索引列
	if (props.isIndex) {
		cols.unshift({
			type: "index",
			label: "序号",
			width: 70,
		});
	}

	// 添加选择列
	if (props.isMultipleSelect) {
		cols.unshift({
			type: "selection",
			width: 50,
		});
	}

	return cols;
});

// 处理选择变化
function handleSelectionChange(rows: T[]) {
	emit("selection-change", rows);
}
</script>

<template>
	<pure-table :data="props.data" :columns="pureColumns" stripe border @selection-change="handleSelectionChange">
		<template v-for="col in props.columns" #[col.prop]="{ row, index }">
			<slot name="bodyCell" :row="row" :prop="col.prop" :index="index" :column="col">
				{{ row[col.prop] }}
			</slot>
		</template>
	</pure-table>
</template>
```

## 迁移步骤

### 阶段 1：创建适配组件（1-2 天）

1. 创建 `main/src/components/Table/index.vue`
2. 实现 Origin API 兼容
3. 编写单元测试

### 阶段 2：功能验证（1-2 天）

1. 创建测试页面
2. 验证所有功能
3. 性能测试

### 阶段 3：文档和示例（1 天）

1. 编写使用文档
2. 创建示例代码
3. 迁移指南

### 阶段 4：渐进式迁移（持续）

1. 新页面使用新组件
2. 旧页面逐步迁移
3. 收集反馈优化

## 功能对比表

|     功能     | Origin | @pureadmin/table | 适配组件 |
| :----------: | :----: | :--------------: | :------: |
|   基础表格   |   ✅   |        ✅        |    ✅    |
|    索引列    |   ✅   |        ✅        |    ✅    |
|     多选     |   ✅   |        ✅        |    ✅    |
| 自定义单元格 |   ✅   |        ✅        |    ✅    |
|     分页     |   ❌   |        ✅        |    ✅    |
|   虚拟滚动   |   ❌   |        ✅        |    ✅    |
|    列拖拽    |   ❌   |        ✅        |    🔄    |
| 列显示/隐藏  |   ❌   |        ✅        |    🔄    |
|    工具栏    |   ❌   |        ✅        |    🔄    |

说明：

- ✅ 支持
- ❌ 不支持
- 🔄 可选支持（后期添加）

## API 映射表

### Props 映射

|       Origin       | @pureadmin/table |        说明         |
| :----------------: | :--------------: | :-----------------: |
|       `data`       |      `data`      |      直接映射       |
|     `columns`      |    `columns`     |    需要转换格式     |
|     `isIndex`      |        -         | 转换为 columns 配置 |
| `isMultipleSelect` |        -         | 转换为 columns 配置 |

### Events 映射

|       Origin       |  @pureadmin/table  |   说明   |
| :----------------: | :----------------: | :------: |
| `selection-change` | `selection-change` | 直接映射 |

### Slots 映射

|   Origin   | @pureadmin/table |   说明   |
| :--------: | :--------------: | :------: |
| `bodyCell` |     动态插槽     | 需要转换 |
|  `table`   |    `default`     | 直接映射 |

## 风险评估

### 低风险

- ✅ API 兼容性好
- ✅ 功能覆盖完整
- ✅ 有成熟的库支持

### 中风险

- ⚠️ 需要编写适配代码
- ⚠️ 可能有性能差异
- ⚠️ 需要测试覆盖

### 高风险

- ❌ 无

## 测试策略

### 单元测试

- 测试 props 转换
- 测试事件映射
- 测试插槽功能

### 集成测试

- 测试完整的 CRUD 场景
- 测试分页功能
- 测试多选功能

### 性能测试

- 大数据量渲染
- 虚拟滚动性能
- 内存占用

## 决策

**最终决策**: 采用方案 C（封装适配层）

**理由**:

1. 兼容 Origin API，迁移成本低
2. 使用 @pureadmin/table 的强大功能
3. 渐进式迁移，风险可控
4. 长期维护成本合理

**下一步**:

1. 创建适配组件
2. 编写单元测试
3. 创建使用示例
4. 开始迁移

---

**评估人**: AI Assistant  
**评估时间**: 2025-12-26  
**决策**: ✅ 采用封装适配层方案
