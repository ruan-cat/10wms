<script lang="ts" setup>
definePage({
	path: "/10wms-test-a",
	meta: {
		title: "A页面-菜单",
		icon: "f7:menu",
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>测试用的A页面- 预期应该看不到</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
