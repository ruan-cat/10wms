import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 温度记录信息 */
export interface TemperatureRecordInfo {
	/** 记录ID */
	id: string;
	/** 记录日期 */
	recordDate: string;
	/** 记录时间 */
	recordTime: string;
	/** 区域/设备 */
	area: string;
	/** 温度值（℃） */
	temperature: number;
	/** 湿度值（%） */
	humidity?: number;
	/** 标准温度范围 */
	standardTempRange?: string;
	/** 是否异常 */
	isAbnormal: boolean;
	/** 异常原因 */
	abnormalReason?: string;
	/** 处理措施 */
	handleMeasure?: string;
	/** 记录人 */
	recorder?: string;
	/** 备注 */
	remark?: string;
	/** 创建时间 */
	createTime?: string;
}

/** 添加温度记录参数 */
export interface AddTemperatureRecordParams {
	/** 记录日期 */
	recordDate: string;
	/** 记录时间 */
	recordTime: string;
	/** 区域/设备 */
	area: string;
	/** 温度值 */
	temperature: number;
	/** 湿度值 */
	humidity?: number;
	/** 标准温度范围 */
	standardTempRange?: string;
	/** 异常原因 */
	abnormalReason?: string;
	/** 处理措施 */
	handleMeasure?: string;
	/** 备注 */
	remark?: string;
}

/** 更新温度记录参数 */
export interface UpdateTemperatureRecordParams extends AddTemperatureRecordParams {
	/** 记录ID */
	id: string;
}

/** 温度记录查询参数 */
export interface TemperatureRecordQueryParams extends PageParams {
	/** 记录日期开始 */
	recordDateStart?: string;
	/** 记录日期结束 */
	recordDateEnd?: string;
	/** 区域/设备 */
	area?: string;
	/** 是否异常 */
	isAbnormal?: boolean;
	/** 记录人 */
	recorder?: string;
}

/**
 * 获取温度记录列表（分页）
 */
export const getTemperatureRecordList = (params: TemperatureRecordQueryParams) => {
	return http.request<PageResult<TemperatureRecordInfo>>("get", "/daily-check/temperature/list", { params });
};

/**
 * 获取温度记录详情
 */
export const getTemperatureRecordDetail = (id: string) => {
	return http.request<TemperatureRecordInfo>("get", `/daily-check/temperature/${id}`);
};

/**
 * 添加温度记录
 */
export const addTemperatureRecord = (data: AddTemperatureRecordParams) => {
	return http.request<string>("post", "/daily-check/temperature", { data });
};

/**
 * 更新温度记录
 */
export const updateTemperatureRecord = (data: UpdateTemperatureRecordParams) => {
	return http.request<void>("put", `/daily-check/temperature/${data.id}`, { data });
};

/**
 * 删除温度记录
 */
export const deleteTemperatureRecord = (id: string) => {
	return http.request<void>("delete", `/daily-check/temperature/${id}`);
};

/**
 * 批量删除温度记录
 */
export const batchDeleteTemperatureRecord = (ids: string[]) => {
	return http.request<void>("delete", "/daily-check/temperature/batch", { data: { ids } });
};

/**
 * 导出温度记录
 */
export const exportTemperatureRecord = (params?: TemperatureRecordQueryParams) => {
	return http.request<Blob>("get", "/daily-check/temperature/export", { params, responseType: "blob" });
};
