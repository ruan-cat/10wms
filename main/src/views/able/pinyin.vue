<script setup lang="ts">
import { html } from "pinyin-pro";

defineOptions({
	name: "Pinyin",
});
</script>

<template>
	<el-card shadow="never">
		<template #header>
			<div class="card-header">
				<p class="font-medium">汉语拼音</p>
				<el-link
					class="mt-2"
					href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/pinyin.vue"
					target="_blank"
				>
					代码位置 src/views/able/pinyin.vue
				</el-link>
			</div>
		</template>
		<p v-html="html('带 音 调')" />
		<p class="mt-2!" v-html="html('不 带 音 调', { toneType: 'none' })" />
		<p class="mt-2! custom" v-html="html('自 定 义 样 式')" />
	</el-card>
</template>

<style lang="scss" scoped>
.custom {
	/* 汉字的样式 */
	:deep(.py-chinese-item) {
		color: #409eff;
	}

	/* 拼音的样式 */
	:deep(.py-pinyin-item) {
		color: #f56c6c;
	}
}
</style>
