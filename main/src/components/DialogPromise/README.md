# DialogPromise 组件

基于 `@vueuse/core` 的 `createTemplatePromise` 实现的命令式对话框组件。

## 特性

- ✅ Promise 风格的 API，支持 async/await
- ✅ 可拖拽对话框
- ✅ 自动销毁（destroy-on-close）
- ✅ 完整的 TypeScript 类型支持
- ✅ 灵活的插槽系统

## 基础用法

```vue
<template>
	<div>
		<el-button @click="handleOpen">打开对话框</el-button>

		<DialogPromise ref="dialogRef" :="dialogProps">
			<template #default>
				<el-form :model="form">
					<el-form-item label="名称">
						<el-input v-model="form.name" />
					</el-form-item>
				</el-form>
			</template>

			<template #footer="{ resolve, reject }">
				<el-button @click="dialogProps.onDialogClose({ resolve, reject })"> 取消 </el-button>
				<el-button type="primary" @click="handleConfirm({ resolve, reject })"> 确认 </el-button>
			</template>
		</DialogPromise>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DialogPromise from "@/components/DialogPromise/index.vue";
import type { DialogPromiseProps } from "@/components/DialogPromise/types";
import { ElMessage } from "element-plus";

const dialogRef = ref();
const form = ref({ name: "" });

const dialogProps = ref<DialogPromiseProps<any>>({
	dialogProps: {
		title: "编辑信息",
		width: "500px",
	},
	async onDialogClose({ resolve, reject }) {
		// 处理关闭逻辑
		if (form.value.name) {
			const confirmed = await ElMessageBox.confirm("确定要关闭吗？未保存的数据将丢失。", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).catch(() => false);

			if (confirmed) {
				reject();
				return true; // 允许关闭
			}
			return false; // 阻止关闭
		}
		reject();
		return true;
	},
});

async function handleOpen() {
	try {
		const result = await dialogRef.value.open();
		console.log("对话框返回结果：", result);
		ElMessage.success("操作成功");
	} catch (error) {
		console.log("对话框被取消");
	}
}

function handleConfirm({ resolve, reject }) {
	if (!form.value.name) {
		ElMessage.warning("请输入名称");
		return;
	}
	resolve(form.value);
}
</script>
```

## API

### Props

|     参数      |                                   说明                                    |                        类型                         | 默认值 |
| :-----------: | :-----------------------------------------------------------------------: | :-------------------------------------------------: | :----: |
| onDialogClose |            对话框关闭回调，返回 true 允许关闭，false 阻止关闭             | `(params: { resolve, reject }) => Promise<boolean>` |   -    |
|  dialogProps  | Element Plus Dialog 组件的属性（排除 modelValue、draggable、beforeClose） |               `Partial<DialogProps>`                |   -    |

### Slots

|  名称   |      说明      |         参数          |
| :-----: | :------------: | :-------------------: |
| header  | 对话框标题内容 |           -           |
| default | 对话框主体内容 |           -           |
| footer  | 对话框底部内容 | `{ resolve, reject }` |

### Methods

| 方法名 |    说明    | 参数 |    返回值    |
| :----: | :--------: | :--: | :----------: |
|  open  | 打开对话框 |  -   | `Promise<T>` |

## 注意事项

1. **不允许外部传递的属性**：
   - `modelValue`：由组件内部管理
   - `draggable`：固定为 true
   - `beforeClose`：由 `onDialogClose` 处理

2. **关闭逻辑**：
   - `onDialogClose` 返回 `true` 时对话框关闭
   - `onDialogClose` 返回 `false` 时对话框保持打开
   - 调用 `resolve(data)` 表示确认操作
   - 调用 `reject()` 表示取消操作

3. **TypeScript 支持**：
   - 组件支持泛型，可以指定返回值类型
   - 完整的类型提示和检查

## 迁移说明

从 Origin 项目迁移到 Pure-Admin：

- ✅ 保留完整功能
- ✅ 适配 Pure-Admin 样式系统
- ✅ 使用 Element Plus 组件
- ✅ 完整的 TypeScript 类型定义
