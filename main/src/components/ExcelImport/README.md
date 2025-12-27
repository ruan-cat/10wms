# ExcelImport 组件

Excel 文件导入组件，支持文件上传、数据预览和解析。

## 特性

- ✅ 支持 xlsx/xls 格式文件
- ✅ 拖拽上传
- ✅ 多文件上传
- ✅ 数据预览（默认前 50 条）
- ✅ 文件列表管理
- ✅ 完整的错误处理
- ✅ TypeScript 类型支持

## 基础用法

```vue
<template>
	<div>
		<ExcelImport upload-url="/api/import" @success="handleSuccess" @error="handleError" />
	</div>
</template>

<script setup lang="ts">
import ExcelImport from "@/components/ExcelImport/index.vue";
import { ElMessage } from "element-plus";

function handleSuccess(data: any[]) {
	console.log("导入成功", data);
	ElMessage.success(`成功导入 ${data.length} 条数据`);
}

function handleError(error: any) {
	console.error("导入失败", error);
	ElMessage.error("导入失败，请重试");
}
</script>
```

## 自动上传

```vue
<template>
	<ExcelImport upload-url="/api/import" :auto-upload="true" @success="handleSuccess" />
</template>
```

## 自定义预览行数

```vue
<template>
	<ExcelImport upload-url="/api/import" :max-preview-rows="100" @success="handleSuccess" />
</template>
```

## API

### Props

|      参数      |     说明     |   类型    | 默认值  |
| :------------: | :----------: | :-------: | :-----: |
|   uploadUrl    |   上传地址   | `string`  |  `""`   |
| maxPreviewRows | 最大预览行数 | `number`  |  `50`   |
|   autoUpload   | 是否自动上传 | `boolean` | `false` |

### Events

| 事件名  |      说明      |     参数      |
| :-----: | :------------: | :-----------: |
| success | 上传成功时触发 | `data: any[]` |
|  error  | 上传失败时触发 | `error: any`  |

## 使用说明

### 文件格式

- 支持 `.xlsx` 和 `.xls` 格式
- 自动解析第一个工作表
- 第一行作为列标题

### 数据预览

- 默认显示前 50 条数据
- 可通过 `maxPreviewRows` 自定义预览行数
- 支持横向和纵向滚动

### 文件管理

- 支持多文件上传
- 点击文件名可切换预览
- 点击删除图标可移除文件
- 删除文件时会自动切换到相邻文件

### 上传模式

**手动上传（默认）**：

- 选择文件后不会立即上传
- 需要点击"开始上传"按钮
- 适合需要确认后再上传的场景

**自动上传**：

- 选择文件后立即上传
- 无需手动点击上传按钮
- 适合快速导入的场景

## 注意事项

1. **文件大小**：建议单个文件不超过 10MB
2. **数据量**：大量数据建议分批导入
3. **格式要求**：确保 Excel 文件格式正确
4. **错误处理**：建议在 `@error` 事件中处理上传失败的情况

## 迁移说明

从 Origin 项目迁移到 Pure-Admin：

- ✅ 保留完整功能
- ✅ 优化 UI 设计（使用 el-card 布局）
- ✅ 改进交互体验（拖拽上传、文件管理）
- ✅ 完整的 TypeScript 类型定义
- ✅ 适配 Pure-Admin 样式系统
- ✅ 使用 Element Plus 图标
