<script setup lang="ts" generic="T extends Object, Column extends SimpleDataTableColumn<T>">
import { computed, ref } from "vue";
import type {
	SimpleDataTableProps,
	SimpleDataTableEmits,
	SimpleDataTableColumn,
	SimpleDataTableColumnProp,
} from "./types";

/**
 * 表格组件
 * @description 封装 @pureadmin/table，兼容 Origin 的 API
 */

const props = withDefaults(defineProps<SimpleDataTableProps<T, Column>>(), {
	stripe: true,
	border: true,
	isIndex: false,
	isMultipleSelect: false,
	loading: false,
	emptyText: "暂无数据",
});

const emit = defineEmits<SimpleDataTableEmits<T>>();

defineSlots<{
	bodyCell?(props: { row: T; prop: SimpleDataTableColumnProp<T>; index: number; column: Column }): any;
	table?(): any;
	operation?(props: { row: T; index: number }): any;
}>();

/** 表格引用 */
const tableRef = ref();

/** 转换后的列配置 */
const pureColumns = computed(() => {
	const cols: any[] = [];

	// 添加选择列
	if (props.isMultipleSelect) {
		cols.push({
			type: "selection",
			width: 50,
			align: "center",
			reserveSelection: true,
		});
	}

	// 添加索引列
	if (props.isIndex) {
		cols.push({
			type: "index",
			label: "序号",
			width: 70,
			align: "center",
			index: (index: number) => index + 1,
		});
	}

	// 添加数据列
	props.columns.forEach((col) => {
		cols.push({
			...col,
			align: col.align || "center",
		});
	});

	return cols;
});

/** 处理选择变化 */
function handleSelectionChange(selection: T[]) {
	emit("selection-change", selection);
}

/** 处理分页变化 */
function handlePageChange(page: { currentPage: number; pageSize: number }) {
	emit("page-change", page);
}

/** 处理排序变化 */
function handleSortChange({ prop, order }: { prop: string; order: string | null }) {
	emit("sort-change", { prop, order });
}

/** 暴露方法给父组件 */
defineExpose({
	/** 获取表格实例 */
	getTableRef: () => tableRef.value,
	/** 清空选择 */
	clearSelection: () => tableRef.value?.clearSelection(),
	/** 切换所有行的选中状态 */
	toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
	/** 切换某一行的选中状态 */
	toggleRowSelection: (row: T, selected?: boolean) => tableRef.value?.toggleRowSelection(row, selected),
});
</script>

<template>
	<div class="table-wrapper">
		<el-table
			ref="tableRef"
			:data="props.data"
			:stripe="props.stripe"
			:border="props.border"
			:height="props.height"
			:max-height="props.maxHeight"
			:row-key="props.rowKey"
			:empty-text="props.emptyText"
			v-loading="props.loading"
			@selection-change="handleSelectionChange"
			@sort-change="handleSortChange"
		>
			<!-- 自定义表格插槽 -->
			<slot name="table"></slot>

			<!-- 渲染列 -->
			<template v-for="(col, colIndex) in pureColumns" :key="col.prop || colIndex">
				<el-table-column v-bind="col">
					<!-- 如果不是特殊列（selection, index），则支持自定义内容 -->
					<template v-if="!col.type" #default="scope">
						<!-- 操作列插槽 -->
						<slot v-if="col.prop === 'operation'" name="operation" :row="scope.row" :index="scope.$index"></slot>

						<!-- 自定义单元格插槽 -->
						<slot v-else name="bodyCell" :row="scope.row" :prop="col.prop" :index="scope.$index" :column="col">
							{{ scope.row[col.prop] }}
						</slot>
					</template>
				</el-table-column>
			</template>
		</el-table>

		<!-- 分页 -->
		<div v-if="props.pagination?.show !== false && props.pagination" class="pagination-wrapper">
			<el-pagination
				:current-page="props.pagination.currentPage"
				:page-size="props.pagination.pageSize"
				:page-sizes="props.pagination.pageSizes || [10, 20, 50, 100]"
				:layout="props.pagination.layout || 'total, sizes, prev, pager, next, jumper'"
				:total="props.pagination.total"
				@size-change="(size) => handlePageChange({ currentPage: props.pagination!.currentPage, pageSize: size })"
				@current-change="(page) => handlePageChange({ currentPage: page, pageSize: props.pagination!.pageSize })"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.table-wrapper {
	width: 100%;

	.pagination-wrapper {
		margin-top: 16px;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
