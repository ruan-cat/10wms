<script setup lang="ts">
import { reactive, ref } from "vue";
import type { CSSProperties } from "vue";

interface Mark {
	style: CSSProperties;
	label: string;
}

type Marks = Record<number, Mark | string>;

const value = ref([30, 60]);
const marks = reactive<Marks>({
	0: "0°C",
	8: "8°C",
	37: "37°C",
	50: {
		style: {
			color: "#1989FA",
		},
		label: "50%",
	},
});
</script>

<template>
	<div class="slider-demo-block">
		<el-slider v-model="value" range :marks="marks" />
	</div>
</template>

<style lang="scss" scoped>
.slider-demo-block {
	display: flex;
	align-items: center;
	max-width: 600px;
}

.slider-demo-block .el-slider {
	margin-top: 0;
	margin-left: 12px;
}
</style>
