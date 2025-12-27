<script lang="ts" setup generic="T extends Record<string, any>">
import type { _OmitSimpleDataTableProps, DinamicTableFormEmit, EditableTableColumn } from "./types";
import type { SimpleDataTableColumn } from "@/components/Table/types";

import type { Ref } from "vue";
import ComponentsTable from "@/components/Table/index.vue";
import { ElMessage } from "element-plus";
import { cloneDeep, isEmpty, isEqual, remove } from "lodash-es";
import { computed, ref } from "vue";

/**
 * 动态表格样式表单 props值
 * @description
 * 动态表格样式的表单组件，支持动态增删行和可编辑列
 */
export interface DinamicTableFormProps<
	T extends Record<string, any>,
	Column extends SimpleDataTableColumn<T> = EditableTableColumn<T>,
> extends _OmitSimpleDataTableProps<T, Column> {
	/**
	 * 新行数据
	 * @description
	 * 新增一行时，所使用的默认行数据
	 * 你可以提供一个填写有默认数据的对象，用于新增一行时的默认数据
	 * 一般来说，这里的数据应该是业务意义的对象，拥有全部的字段，但是每个字段的取值均为业务意义上的空数据
	 */
	newRowData: T;

	/**
	 * 被修改的数组
	 * @description
	 * 表格数据数组，支持 v-model:data 双向绑定
	 */
	data: T[];

	/**
	 * 表格列配置
	 * @description
	 * 列配置数组，支持 editable 属性控制是否可编辑
	 */
	columns: Column[];
}

const props = withDefaults(defineProps<DinamicTableFormProps<T>>(), {
	isIndex: true,
	isMultipleSelect: true,
});

const emit = defineEmits<DinamicTableFormEmit<T>>();

/** 增加固定的操作栏 */
const columnsWithOperation = computed(() => {
	const cols = [...props.columns];
	cols.push({
		prop: "operation-bar" as any,
		label: "操作",
		width: 60,
		editable: true,
	} as Column);
	return cols;
});

/**
 * 多选项
 * @description
 * 这里要做强制类型转换 详情请阅读此 issue
 * @see https://github.com/vuejs/core/issues/2136#issuecomment-908269949
 */
const multipleSelection = ref<T[]>([]) as Ref<T[]>;

/** 内部数据副本 */
const internalData = computed({
	get: () => props.data,
	set: (value) => {
		emit("update:data", value);
		emit("change-data", value);
	},
});

/** 新增行 */
function addNewRow() {
	const newData = [...internalData.value, cloneDeep(props.newRowData)];
	internalData.value = newData;
}

/** 删除单行 */
function deleteRow(index: number) {
	const newData = [...internalData.value];
	newData.splice(index, 1);
	internalData.value = newData;
}

/** 删除选中行 */
function deleteSelected() {
	if (isEmpty(multipleSelection.value)) {
		ElMessage.warning("请先选择要删除的行");
		return;
	}

	const newData = [...internalData.value];
	remove(newData, (item) => multipleSelection.value.some((selectedItem) => isEqual(item, selectedItem)));
	internalData.value = newData;
}

/** 处理多选 */
function handleSelectionChange(rows: T[]) {
	multipleSelection.value = rows;
}

/** 获取列是否可编辑 */
function getEditable(column: EditableTableColumn<T>) {
	return column.editable;
}

/** 处理单元格值变化 */
function handleCellChange(row: T, prop: keyof T, value: any) {
	const index = internalData.value.findIndex((item) => isEqual(item, row));
	if (index !== -1) {
		const newData = [...internalData.value];
		newData[index] = { ...newData[index], [prop]: value };
		internalData.value = newData;
	}
}
</script>

<template>
	<div class="dinamic-table-form">
		<div class="table-actions">
			<el-button @click="addNewRow" type="primary"> 新增行 </el-button>
			<el-button @click="deleteSelected" type="danger"> 删除所选行 </el-button>
		</div>

		<ComponentsTable
			:data="internalData"
			:columns="columnsWithOperation"
			:is-index="props.isIndex"
			:is-multiple-select="props.isMultipleSelect"
			empty-text="请新增行"
			@selection-change="handleSelectionChange"
		>
			<template #bodyCell="{ index, prop, row, column }">
				<!-- 操作栏 -->
				<template v-if="prop === 'operation-bar'">
					<el-button @click="deleteRow(index)" link type="danger"> 删除 </el-button>
				</template>

				<!-- 数据列 -->
				<template v-if="prop !== 'index-bar' && prop !== 'operation-bar' && prop !== 'selection-bar'">
					<template v-if="getEditable(column)">
						<el-input :model-value="row[prop]" @update:model-value="(value) => handleCellChange(row, prop, value)" />
					</template>
					<span v-else>{{ row[prop] }}</span>
				</template>
			</template>
		</ComponentsTable>
	</div>
</template>

<style lang="scss" scoped>
.dinamic-table-form {
	padding: 20px;
	background: var(--el-bg-color);
	box-shadow: var(--el-box-shadow-light);
	border-radius: 8px;
}

.table-actions {
	margin-bottom: 15px;
}
</style>
