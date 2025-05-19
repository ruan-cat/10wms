<script lang="ts" setup>
definePage({
	meta: {
		title: "A页面-菜单",
		icon: "f7:menu",
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>A 菜单 不应该显示出来</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
