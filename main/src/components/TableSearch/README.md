# TableSearch 组件

通用的表格搜索组件，封装了常见的搜索表单布局和操作按钮。

## 特性

- ✅ 内联表单布局
- ✅ 自动包含查询和重置按钮
- ✅ 支持自定义搜索条件
- ✅ 支持额外操作按钮
- ✅ 加载状态支持

## 基础用法

```vue
<template>
	<div>
		<TableSearch @search="handleSearch" @reset="handleReset">
			<el-form-item label="商品编码">
				<el-input v-model="searchForm.goodsCode" placeholder="请输入商品编码" clearable />
			</el-form-item>
			<el-form-item label="商品名称">
				<el-input v-model="searchForm.goodsName" placeholder="请输入商品名称" clearable />
			</el-form-item>
			<el-form-item label="状态">
				<el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
					<el-option label="启用" :value="1" />
					<el-option label="禁用" :value="0" />
				</el-select>
			</el-form-item>
		</TableSearch>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TableSearch from "@/components/TableSearch/index.vue";

const searchForm = ref({
	goodsCode: "",
	goodsName: "",
	status: undefined,
});

function handleSearch() {
	console.log("搜索", searchForm.value);
	// 执行搜索逻辑
}

function handleReset() {
	searchForm.value = {
		goodsCode: "",
		goodsName: "",
		status: undefined,
	};
	// 重新加载数据
}
</script>
```

## 带额外按钮

```vue
<template>
	<TableSearch @search="handleSearch" @reset="handleReset">
		<el-form-item label="关键词">
			<el-input v-model="keyword" placeholder="请输入关键词" clearable />
		</el-form-item>

		<template #extra>
			<el-button type="success" :icon="Download" @click="handleExport"> 导出 </el-button>
		</template>
	</TableSearch>
</template>
```

## 加载状态

```vue
<template>
	<TableSearch :loading="loading" @search="handleSearch" @reset="handleReset">
		<el-form-item label="名称">
			<el-input v-model="name" placeholder="请输入名称" clearable />
		</el-form-item>
	</TableSearch>
</template>

<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);

async function handleSearch() {
	loading.value = true;
	try {
		// 执行搜索
	} finally {
		loading.value = false;
	}
}
</script>
```

## API

### Props

|    参数    |       说明       |   类型    |  默认值  |
| :--------: | :--------------: | :-------: | :------: |
| showReset  | 是否显示重置按钮 | `boolean` |  `true`  |
| showSearch | 是否显示查询按钮 | `boolean` |  `true`  |
| searchText |   查询按钮文本   | `string`  | `"查询"` |
| resetText  |   重置按钮文本   | `string`  | `"重置"` |
|  loading   |    是否加载中    | `boolean` | `false`  |

### Events

| 事件名 |     说明     | 参数 |
| :----: | :----------: | :--: |
| search | 点击查询按钮 |  -   |
| reset  | 点击重置按钮 |  -   |

### Slots

|  名称   |        说明        |
| :-----: | :----------------: |
| default |    搜索条件区域    |
|  extra  | 额外的操作按钮区域 |

## 使用建议

1. **搜索条件**：使用 `el-form-item` 包裹每个搜索字段
2. **重置逻辑**：在 `@reset` 事件中清空表单并重新加载数据
3. **查询逻辑**：在 `@search` 事件中执行搜索并更新表格数据
4. **额外按钮**：使用 `#extra` 插槽添加导出、导入等操作按钮

## 迁移说明

从 Origin 项目迁移到 Pure-Admin：

- ✅ 简化的搜索表单封装
- ✅ 统一的样式和布局
- ✅ 灵活的插槽系统
- ✅ 完整的 TypeScript 类型支持
