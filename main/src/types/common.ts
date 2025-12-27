/**
 * 分页参数
 */
export interface PageParams {
	/** 当前页码 */
	page: number;
	/** 每页数量 */
	size: number;
	/** 排序字段 */
	sortField?: string;
	/** 排序方向 */
	sortOrder?: "asc" | "desc";
}

/**
 * 分页结果
 */
export interface PageResult<T> {
	/** 数据列表 */
	list: T[];
	/** 总数 */
	total: number;
	/** 当前页码 */
	page: number;
	/** 每页数量 */
	size: number;
}

/**
 * 通用响应
 */
export interface ApiResponse<T = any> {
	/** 状态码 */
	code: number;
	/** 消息 */
	message: string;
	/** 数据 */
	data: T;
	/** 时间戳 */
	timestamp: number;
}

/**
 * 树形节点
 */
export interface TreeNode<T = any> {
	/** 节点ID */
	id: string;
	/** 父节点ID */
	parentId: string;
	/** 节点标签 */
	label: string;
	/** 子节点 */
	children?: TreeNode<T>[];
	/** 其他数据 */
	data?: T;
}

/**
 * 选项
 */
export interface Option<V = string> {
	/** 标签 */
	label: string;
	/** 值 */
	value: V;
	/** 是否禁用 */
	disabled?: boolean;
	/** 其他数据 */
	[key: string]: any;
}

/**
 * 键值对
 */
export interface KeyValue<K = string, V = any> {
	key: K;
	value: V;
}
