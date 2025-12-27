/**
 * 表格组件类型定义
 * @description 兼容 Origin 的表格组件 API
 */

import type { TableColumnCtx } from "element-plus";

/** 表格列属性类型 */
export type SimpleDataTableColumnProp<T extends Object> = keyof T | string;

/** 表格列配置 */
export interface SimpleDataTableColumn<T extends Object = any> {
	/** 列标识 */
	prop: SimpleDataTableColumnProp<T>;
	/** 列标题 */
	label: string;
	/** 列宽度 */
	width?: number | string;
	/** 最小列宽度 */
	minWidth?: number | string;
	/** 对齐方式 */
	align?: "left" | "center" | "right";
	/** 是否固定列 */
	fixed?: boolean | "left" | "right";
	/** 是否可排序 */
	sortable?: boolean | "custom";
	/** 列类型 */
	type?: "selection" | "index" | "expand";
	/** 自定义索引方法 */
	index?: (index: number) => number;
	/** 是否显示 tooltip */
	showOverflowTooltip?: boolean;
	/** 自定义类名 */
	className?: string;
	/** 自定义标题类名 */
	headerClassName?: string;
	/** 格式化函数 */
	formatter?: (row: T, column: TableColumnCtx<T>, cellValue: any, index: number) => string | number;
}

/** 表格 Props */
export interface SimpleDataTableProps<
	T extends Object = any,
	Column extends SimpleDataTableColumn<T> = SimpleDataTableColumn<T>,
> {
	/** 表格数据 */
	data: T[];
	/** 表格列配置 */
	columns: Column[];
	/** 是否显示索引列 */
	isIndex?: boolean;
	/** 是否支持多选 */
	isMultipleSelect?: boolean;
	/** 是否显示斑马纹 */
	stripe?: boolean;
	/** 是否显示边框 */
	border?: boolean;
	/** 表格高度 */
	height?: number | string;
	/** 表格最大高度 */
	maxHeight?: number | string;
	/** 是否加载中 */
	loading?: boolean;
	/** 空数据文本 */
	emptyText?: string;
	/** 行的 key */
	rowKey?: string | ((row: T) => string);
	/** 分页配置 */
	pagination?: PaginationConfig;
}

/** 分页配置 */
export interface PaginationConfig {
	/** 总条数 */
	total: number;
	/** 当前页码 */
	currentPage: number;
	/** 每页条数 */
	pageSize: number;
	/** 每页条数选项 */
	pageSizes?: number[];
	/** 布局 */
	layout?: string;
	/** 是否显示分页 */
	show?: boolean;
}

/** 表格事件 */
export interface SimpleDataTableEmits<T extends Object = any> {
	/** 选择变化事件 */
	(e: "selection-change", rows: T[]): void;
	/** 分页变化事件 */
	(e: "page-change", page: { currentPage: number; pageSize: number }): void;
	/** 排序变化事件 */
	(e: "sort-change", sort: { prop: string; order: string | null }): void;
}

/** 表格插槽 */
export interface SimpleDataTableSlots<
	T extends Object = any,
	Column extends SimpleDataTableColumn<T> = SimpleDataTableColumn<T>,
> {
	/** 自定义单元格内容 */
	bodyCell?: (props: { row: T; prop: SimpleDataTableColumnProp<T>; index: number; column: Column }) => any;
	/** 自定义表格内容 */
	table?: () => any;
	/** 操作列插槽 */
	operation?: (props: { row: T; index: number }) => any;
}
