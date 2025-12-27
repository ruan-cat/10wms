<script lang="ts" setup generic="T extends Object">
import type { DialogPromiseProps } from "./types";
import { createTemplatePromise, useToggle } from "@vueuse/core";

const props = defineProps<DialogPromiseProps<T>>();

const TemplatePromise = createTemplatePromise<T>();

/** 维护弹框的显示与打开属性 是为了触发弹框的回调事件函数 */
const [isOpen, toggleOpen] = useToggle(false);

/** 对外暴露使用的弹框打开函数 开始执行异步行为 */
async function open() {
	// 打开弹框 触发弹框组件的事件
	toggleOpen(true);
	return await TemplatePromise.start();
}

defineExpose({
	open,
});
</script>

<template>
	<TemplatePromise v-slot="{ promise, resolve, reject, args }">
		<el-dialog
			class="dialog-promise-root"
			:model-value="isOpen"
			:draggable="true"
			:destroy-on-close="true"
			:before-close="async () => await props.onDialogClose({ resolve, reject })"
			v-bind="props.dialogProps"
		>
			<template #header>
				<slot name="header" />
			</template>

			<template #default>
				<slot name="default">默认的弹框内容，请传递你的弹框内容。</slot>
			</template>

			<template #footer>
				<slot name="footer" :resolve="resolve" :reject="reject">
					<el-button type="danger" @click="props.onDialogClose({ resolve, reject })"> 关闭弹框 </el-button>
				</slot>
			</template>
		</el-dialog>
	</TemplatePromise>
</template>

<style lang="scss" scoped>
.dialog-promise-root {
	// Pure-Admin 样式适配
}
</style>
