<script lang="ts" setup>
import { ref } from "vue";
import ComponentsPagination, { type PaginationProps } from "components/pagination/index.vue";
import { sleep } from "@antfu/utils";

async function asyncFunc() {
	await sleep(1000);
	console.log(" 模拟请求成功 ");
}

const paginationProps = ref<PaginationProps>({
	asyncFunc,
	total: 100,
});

interface SomeListDTO {
	pageIndex: number;
	pageSize: number;
}

const someListDTO = ref<SomeListDTO>({
	pageIndex: 3,
	pageSize: 30,
});
</script>

<template>
	<section class="root">
		<ComponentsPagination
			:="paginationProps"
			v-model:pageIndex="someListDTO.pageIndex"
			v-model:pageSize="someListDTO.pageSize"
		/>

		{{ someListDTO }}
	</section>
</template>

<style lang="scss" scoped>
.root {
	min-height: 18vh;
}
</style>
