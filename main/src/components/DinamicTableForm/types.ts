import type { SimpleDataTableColumn } from "@/components/Table/types";

/**
 * 可编辑表格列的配置
 * @description
 * 从表格组件的 SimpleDataTableColumn 类型派生而来
 * 从数据列派生成为专门的可编辑列
 */
export type EditableTableColumn<T> = SimpleDataTableColumn<T> & {
	/**
	 * 当前列是否可编辑
	 * @default true 默认全部的字段都是可以编辑的
	 */
	editable: boolean;

	/** 当前列字段是否是必填项 */
	requirred?: boolean;
};

/**
 * 简单表格移除掉特定的配置
 * @description
 * 移除掉特定的字段 便于重设新的字段
 * @private
 */
export type _OmitSimpleDataTableProps<T extends object, Column extends SimpleDataTableColumn<T>> = Omit<
	SimpleDataTableProps<T, Column>,
	"columns" | "data"
>;

/** 简单表格 Props 类型（从 Table 组件导入） */
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
}

/** 动态表格样式表单 事件 */
export interface DinamicTableFormEmit<T extends object> {
	/** 数据表更新事件 时刻地将更改的数据返回给父级组件 */
	(e: "update:data", rows: T[]): void;
	/** 数据变化事件（兼容旧版） */
	(e: "change-data", rows: T[]): void;
}
