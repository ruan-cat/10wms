<script lang="ts" setup>
definePage({
	// 首页的默认路由名称为 Welcome
	name: "10wms-test-Welcome",
	// 认定此处的路由地址为写死 welcome
	path: "/10wms-test-welcome",
	meta: {
		title: "来自pages的首页",
		icon: "f7:menu",
	},
});

import { ref, computed, watch } from "vue";

import WelcomeView from "@/views/welcome/index.vue";
</script>

<template>
	<section class="index-root">
		<WelcomeView></WelcomeView>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
