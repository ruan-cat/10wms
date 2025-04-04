<script lang="ts" setup>
import { ref } from "vue";
import type { PaginationProps as ElPaginationProps } from "element-plus";

/** 预设的分页栏属性 */
type PresetPaginationProps = Partial<ElPaginationProps>;

/**
 * 预设的分页栏属性
 * @description
 * 分页栏就非固定封装一些属性 其他的不提供
 */
const paginationProps = ref<PresetPaginationProps>({
	layout: "total, sizes, prev, pager, next, jumper, ->, slot",
	pageSizes: [10, 15, 30, 50, 100],
	background: true,
});

/** 分页栏属性 */
export interface PaginationProps extends PresetPaginationProps {
	/**
	 * 总页数
	 * @description
	 * 对应的分页接口必须传递总页数
	 */
	total: number;

	/**
	 * 异步请求函数
	 * @description
	 * 分页栏组件会自动监听内部数据变化 同时做出相应的请求
	 */
	asyncFunc: (...args: any[]) => Promise<any>;
}

/** 对外暴露需要设置值的 props */
const props = defineProps<PaginationProps>();

/** 给分页栏组件批量赋值的 props 对象 */
const toPaginationProps = computed(() => {
	return {
		...paginationProps.value,
		...props,
	};
});

/**
 * 当前页码
 * @description
 * 即 PageDTO 的 `pageIndex`
 */
const pageIndex = defineModel<number>();

/**
 * 每页显示最大数据条数
 * @description
 * 即 PageDTO 的 `pageSize`
 */
const pageSize = defineModel<number>();
</script>

<template>
	<ElPagination :="toPaginationProps" v-model:current-page="pageIndex" v-model:page-size="pageSize"></ElPagination>
</template>

<style lang="scss" scoped>
// .pagination {
// 	width: 100%;
// 	background: #fff;
// 	padding: 5px 0;
// 	text-align: center;
// 	margin: 0 auto;
// 	display: flex;
// 	flex-direction: column;
// 	align-items: center;
// }
</style>
