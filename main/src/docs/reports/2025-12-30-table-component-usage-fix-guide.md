# 2025-12-30 Table 组件使用修复指南

## 1. 问题说明

当前有 18 个业务文件错误地在 `tableColumns` 数组中手动添加了特殊列（`type: "selection"` 和 `type: "index"`），导致类型错误。

## 2. 错误用法示例

```typescript
// ❌ 错误：手动添加特殊列
const tableColumns = [
	{ type: "selection", width: 55 }, // 不应该手动添加
	{ type: "index", label: "序号", width: 60 }, // 不应该手动添加
	{ prop: "goodsCode", label: "商品代码", width: 150 },
	{ prop: "goodsName", label: "商品名称", width: 200 },
	// ...
];
```

## 3. 正确用法示例

```typescript
// ✅ 正确：只定义数据列，通过 props 控制特殊列
const tableColumns = [
	{ prop: "goodsCode", label: "商品代码", width: 150 },
	{ prop: "goodsName", label: "商品名称", width: 200 },
	// ...
];
```

```vue
<template>
	<SimpleDataTable
		:data="tableData"
		:columns="tableColumns"
		:is-index="true"
		:is-multiple-select="true"
		@selection-change="handleSelectionChange"
		@page-change="handlePageChange"
	/>
</template>
```

## 4. 需要修复的文件列表

### 4.1. 库存管理模块（7 个文件）

1. `main/src/pages/inventory/differentialposting/index.vue`
2. `main/src/pages/inventory/double-quotation/index.vue`
3. `main/src/pages/inventory/inventory-difference/index.vue`
4. `main/src/pages/inventory/move-inventory/index.vue`
5. `main/src/pages/inventory/moving-count/index.vue`
6. `main/src/pages/inventory/shelf-adjustment/index.vue`
7. `main/src/pages/inventory/takedown-adjustment/index.vue`

### 4.2. 采购管理模块（3 个文件）

8. `main/src/pages/purchase/client-purchase/index.vue`
9. `main/src/pages/purchase/other-warehousing/index.vue`
10. `main/src/pages/purchase/purchase-notification-details/index.vue`

### 4.3. 人事管理模块（3 个文件）

11. `main/src/pages/personnel/employment-status/index.vue`
12. `main/src/pages/personnel/gender-code/index.vue`
13. `main/src/pages/personnel/work-status/index.vue`

### 4.4. 消息管理模块（2 个文件）

14. `main/src/pages/message/work-setting/index.vue`
15. `main/src/pages/message/work-sql/index.vue`

### 4.5. 区域管理模块（2 个文件）

16. `main/src/pages/region/district-information/index.vue`
17. `main/src/pages/region/regional-information/index.vue`

### 4.6. 系统管理模块（1 个文件）

18. `main/src/pages/system/icon/index.vue`

## 5. 修复步骤

### 5.1. 移除特殊列定义

从 `tableColumns` 数组中移除以下类型的列：

- `{ type: "selection", ... }`
- `{ type: "index", ... }`

### 5.2. 确保模板中使用正确的 props

```vue
<SimpleDataTable
  :data="tableData"
  :columns="tableColumns"
  :is-index="true"
  :is-multiple-select="true"
  <!-- 其他 props -->
/>
```

### 5.3. 修复分页事件处理函数

**模式 A**：参数结构不匹配（10 个文件）

```typescript
// 修改前
const handlePageChange = ({ page, limit }: { page: number; limit: number }) => {
	pagination.currentPage = page;
	pagination.pageSize = limit;
	loadTableData();
};

// 修改后
const handlePageChange = ({ currentPage, pageSize }: { currentPage: number; pageSize: number }) => {
	pagination.currentPage = currentPage;
	pagination.pageSize = pageSize;
	loadTableData();
};
```

**模式 B**：参数数量不匹配（7 个文件）

```typescript
// 修改前
const handlePageChange = (page: number, size: number) => {
	pagination.currentPage = page;
	pagination.pageSize = size;
	loadTableData();
};

// 修改后
const handlePageChange = ({ currentPage, pageSize }: { currentPage: number; pageSize: number }) => {
	pagination.currentPage = currentPage;
	pagination.pageSize = pageSize;
	loadTableData();
};
```

## 6. 批量修复脚本（参考）

由于文件数量较多且修改模式一致，建议：

1. **手动修复**：逐个文件检查并修复（推荐，更安全）
2. **使用 IDE 的查找替换功能**：批量替换相同模式的代码
3. **创建子代理任务**：按模块划分，让多个子代理并行修复

## 7. 验证方法

修复后运行以下命令验证：

```bash
cd main
pnpm typecheck
```

预期结果：类型错误数量应该从 35 个减少到 0 个。

## 8. 注意事项

1. **保留操作列**：如果 `tableColumns` 中有 `{ slot: "operation", ... }` 这样的操作列，需要保留
2. **保留数据列**：所有带 `prop` 属性的数据列都需要保留
3. **检查模板**：确保模板中的 `<SimpleDataTable>` 组件使用了正确的 props
4. **测试功能**：修复后需要测试表格的选择、分页、排序等功能是否正常

## 9. 相关文档

- Table 组件源码：`main/src/components/Table/index.vue`
- Table 组件类型定义：`main/src/components/Table/types.ts`
- Table 组件测试示例：`main/src/views/test/table-test.vue`
