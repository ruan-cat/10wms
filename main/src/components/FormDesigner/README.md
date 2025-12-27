# FormDesigner 组件

基于 `@form-create/designer` 的可视化表单设计器组件。

## 安装依赖

```bash
pnpm add @form-create/designer @form-create/element-ui
```

## 全局注册

在 `main.ts` 中注册：

```typescript
import FcDesigner from "@form-create/designer";
import "@form-create/designer/dist/style.css";

app.use(FcDesigner);
```

## 特性

- ✅ 可视化拖拽设计表单
- ✅ 丰富的表单组件库
- ✅ 支持表单配置导入导出
- ✅ 实时预览
- ✅ 完整的 TypeScript 类型支持

## 基础用法

```vue
<template>
	<div>
		<FormDesigner ref="designerRef" height="600px" @change="handleChange" @save="handleSave" />

		<el-button @click="handleGetConfig">获取配置</el-button>
		<el-button @click="handlePreview">预览表单</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormDesigner from "@/components/FormDesigner/index.vue";

const designerRef = ref();

function handleChange(config: any) {
	console.log("表单配置变化", config);
}

function handleSave(config: any) {
	console.log("保存表单配置", config);
	// 保存到后端
}

function handleGetConfig() {
	const config = designerRef.value.getFormConfig();
	console.log("当前表单配置", config);
}

function handlePreview() {
	const config = designerRef.value.previewForm();
	// 打开预览对话框
}
</script>
```

## 加载已有配置

```vue
<template>
	<FormDesigner :initial-config="formConfig" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const formConfig = ref({
	// 表单配置对象
	list: [],
	config: {},
});
</script>
```

## API

### Props

|     参数      |     说明     |   类型   |  默认值   |
| :-----------: | :----------: | :------: | :-------: |
|    height     |  设计器高度  | `string` | `"600px"` |
| initialConfig | 初始表单配置 |  `any`   |     -     |

### Events

| 事件名 |        说明        |     参数      |
| :----: | :----------------: | :-----------: |
| change | 表单配置变化时触发 | `config: any` |
|  save  |   点击保存时触发   | `config: any` |

### Methods

|    方法名     |         说明         |     参数      | 返回值 |
| :-----------: | :------------------: | :-----------: | :----: |
| getFormConfig |     获取表单配置     |       -       | `any`  |
| setFormConfig |     设置表单配置     | `config: any` |   -    |
|   clearForm   |       清空表单       |       -       |   -    |
|  previewForm  | 预览表单（获取配置） |       -       | `any`  |

## 使用场景

1. **动态表单生成**：
   - 后台管理系统的表单配置
   - 工作流表单设计
   - 问卷调查表单

2. **表单模板管理**：
   - 保存常用表单模板
   - 导入导出表单配置
   - 表单版本管理

3. **低代码平台**：
   - 可视化页面搭建
   - 表单快速生成
   - 业务流程配置

## 注意事项

1. **依赖安装**：
   - 必须安装 `@form-create/designer` 和 `@form-create/element-ui`
   - 必须在 `main.ts` 中全局注册

2. **样式冲突**：
   - 可能与 Pure-Admin 的样式有冲突
   - 建议在独立页面中使用

3. **性能优化**：
   - 复杂表单可能影响性能
   - 建议限制表单字段数量

4. **配置保存**：
   - 表单配置是 JSON 对象
   - 建议保存到数据库
   - 支持导入导出功能

## 表单配置示例

```json
{
	"list": [
		{
			"type": "input",
			"field": "username",
			"title": "用户名",
			"props": {
				"placeholder": "请输入用户名"
			},
			"validate": [
				{
					"required": true,
					"message": "用户名不能为空"
				}
			]
		},
		{
			"type": "select",
			"field": "role",
			"title": "角色",
			"options": [
				{ "label": "管理员", "value": "admin" },
				{ "label": "普通用户", "value": "user" }
			]
		}
	],
	"config": {
		"labelWidth": "100px",
		"labelPosition": "right"
	}
}
```

## 迁移说明

从 Origin 项目迁移到 Pure-Admin：

- ✅ 保留完整功能
- ✅ 适配 Pure-Admin 样式系统
- ✅ 封装常用方法
- ✅ 完整的 TypeScript 类型支持
- ✅ 详细的使用文档

## 相关链接

- [form-create 官方文档](https://www.form-create.com/)
- [form-create Designer 文档](https://www.form-create.com/v3/designer/)
