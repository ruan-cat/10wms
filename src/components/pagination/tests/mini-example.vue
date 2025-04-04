<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import ComponentsPagination, { type PaginationProps } from "components/pagination/index.vue";

const paginationProps = ref<PaginationProps>({
	asyncFunc: () => Promise.resolve(),
	// pageSize: 10,
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
