<script setup lang="ts">
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

defineProps({
	graphData: Object,
});
</script>

<template>
	<vue-json-pretty :path="'res'" :deep="3" :showLength="true" :data="graphData" />
</template>
