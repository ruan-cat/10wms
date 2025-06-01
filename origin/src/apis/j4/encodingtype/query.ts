import { ParamsQueryKey, UseAxiosOptionsJsonVO } from "composables/use-request";

/**
 * 编码类型查询参数
 * @description
 * 获取编码类型列表的查询条件
 */
export interface QueryEncodingTypeParams {
	/**
	 * 查询页码
	 */
	pageIndex?: number;
	/**
	 * 查询条数
	 */
	pageSize?: number;
	/**
	 * 编码类型代码
	 */
	snroTypeCode?: string;
	/**
	 * 编码类型名称
	 */
	snroTypeName?: string;
}

/**
 * 编码类型列表显示数据对象
 */
export interface EncodingTypeDisplayDTO {
	/**
	 * id
	 */
	id: string;
	/**
	 * 编码类型代码
	 */
	snroTypeCode: string;
	/**
	 * 编码类型名称
	 */
	snroTypeName: string;
}

/**
 * 编码类型名称查询参数
 * @description
 * 获取编码类型名称列表的查询条件
 */
export interface QueryEncodingTypeNameParams {
	/**
	 * 查询条件
	 */
	query?: string;
}

/**
 * 编码类型名称列表数据对象
 */
export interface EncodingTypeNameDTO {
	/**
	 * 编码类型名称
	 */
	snroTypeName: string;
}

/**
 * 获取编码类型列表（条件+分页）
 * @description
 * 根据条件查询编码类型列表，支持分页
 */
export function queryAllEncodingType<T = PageDTO<EncodingTypeDisplayDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryEncodingTypeParams>({
		url: "/encodingtype/query-encodingtype",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}

/**
 * 获取编码类型名称列表
 * @description
 * 获取编码类型名称列表，支持查询条件筛选
 */
export function getEncodingTypeNameList<T = PageDTO<EncodingTypeNameDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryEncodingTypeNameParams>({
		url: "/encodingtype/getNameList",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {},
		},
	});
}
