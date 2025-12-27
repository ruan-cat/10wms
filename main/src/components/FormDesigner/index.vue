<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Props {
	/** 设计器高度 */
	height?: string;
	/** 初始表单配置 */
	initialConfig?: any;
}

const props = withDefaults(defineProps<Props>(), {
	height: "600px",
	initialConfig: undefined,
});

const emit = defineEmits<{
	change: [config: any];
	save: [config: any];
}>();

const designerRef = ref();

/** 获取表单配置 */
function getFormConfig() {
	return designerRef.value?.getOption();
}

/** 设置表单配置 */
function setFormConfig(config: any) {
	designerRef.value?.setOption(config);
}

/** 清空表单 */
function clearForm() {
	designerRef.value?.clearDragRule();
}

/** 预览表单 */
function previewForm() {
	const config = getFormConfig();
	return config;
}

onMounted(() => {
	if (props.initialConfig) {
		setFormConfig(props.initialConfig);
	}
});

defineExpose({
	getFormConfig,
	setFormConfig,
	clearForm,
	previewForm,
});
</script>

<template>
	<div class="form-designer">
		<!-- 
			注意：需要先安装依赖
			pnpm add @form-create/designer @form-create/element-ui
			
			然后在 main.ts 中注册：
			import FcDesigner from "@form-create/designer";
			import "@form-create/designer/dist/style.css";
			app.use(FcDesigner);
		-->
		<fc-designer ref="designerRef" :height="height" @change="emit('change', $event)" @save="emit('save', $event)" />
	</div>
</template>

<style lang="scss" scoped>
.form-designer {
	width: 100%;
	height: 100%;

	:deep(.fc-designer) {
		// Pure-Admin 样式适配
		border-radius: 4px;
		overflow: hidden;
	}
}
</style>
