<script setup lang="ts">
import { Amap } from "@/components/ReMap";

defineOptions({
	name: "MapPage",
});
</script>

<template>
	<Amap />
</template>

<style scoped>
.main-content {
	margin: 2px 0 0 !important;
}
</style>
