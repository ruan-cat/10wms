<script lang="ts" setup>
import { User } from "@element-plus/icons-vue";

definePage({
	meta: {
		menuType: "folder",
		text: "人员配置",
		icon: User,
	},
});
</script>

<template>
	<section class="personnel-config-root">
		<RouterView></RouterView>
	</section>
</template>

<style lang="scss" scoped>
.personnel-config-root {
}
</style>
