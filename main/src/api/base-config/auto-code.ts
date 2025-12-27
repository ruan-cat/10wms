import { http } from "@/utils/http";

const BASE_URL = "/autocode/baseconfig/automaticencoding";

/** 自动编码数据类型 */
export interface AutoCodeData {
	/** 自动编码唯一ID */
	id?: string;
	/** 编号类型 */
	snroTypeCode?: string;
	/** 组织机构 */
	snroOrg?: string;
	/** 前缀 */
	snroFindex?: string;
	/** 分隔符 */
	snroSplit?: string;
	/** 年位数 */
	snroYear?: string;
	/** 月位数 */
	snroMonth?: string;
	/** 日位数 */
	snroDay?: string;
	/** 序号位数 */
	snroSeri?: string;
	/** 示例号码 */
	snroExp?: string;
}

/** 查询参数 */
export interface AutoCodeQueryParams {
	pageIndex?: number;
	pageSize?: number;
	[key: string]: any;
}

/** 分页响应 */
export interface PageResponse<T> {
	rows: T[];
	total: number;
	pages: number;
}

/** 获取自动编码列表（分页） */
export function listAutoCode(params: AutoCodeQueryParams) {
	return http.request<PageResponse<AutoCodeData>>("get", `${BASE_URL}/queryall`, { params });
}

/** 新增自动编码 */
export function addAutoCode(data: AutoCodeData) {
	return http.request<AutoCodeData>("post", `${BASE_URL}/save`, { data });
}

/** 更新自动编码 */
export function updateAutoCode(data: AutoCodeData) {
	return http.request<AutoCodeData>("post", `${BASE_URL}/update`, { data });
}

/** 删除自动编码（支持批量） */
export function deleteAutoCode(ids: string[]) {
	return http.request<boolean>("delete", `${BASE_URL}/delete`, { data: ids });
}

/** 导出自动编码 */
export function exportAutoCode(params?: any) {
	return http.request<Blob>("get", `${BASE_URL}/export`, { params, responseType: "blob" });
}

/** 导入自动编码 */
export function importAutoCode(data: FormData) {
	return http.request<boolean>("post", `${BASE_URL}/import`, { data });
}
