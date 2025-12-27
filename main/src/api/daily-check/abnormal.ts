import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 异常发货记录信息 */
export interface AbnormalShipmentInfo {
	/** 记录ID */
	id: string;
	/** 异常单号 */
	abnormalNo: string;
	/** 出库单号 */
	outboundNo?: string;
	/** 客户ID */
	customerId: string;
	/** 客户名称 */
	customerName?: string;
	/** 异常日期 */
	abnormalDate: string;
	/** 异常类型 1-数量异常 2-质量异常 3-包装异常 4-其他 */
	abnormalType: number;
	/** 异常描述 */
	abnormalDesc: string;
	/** 商品列表 */
	goods?: AbnormalGoodsItem[];
	/** 处理状态 0-待处理 1-处理中 2-已处理 */
	status: number;
	/** 处理措施 */
	handleMeasure?: string;
	/** 处理人 */
	handler?: string;
	/** 处理时间 */
	handleTime?: string;
	/** 备注 */
	remark?: string;
	/** 创建人 */
	createBy?: string;
	/** 创建时间 */
	createTime?: string;
}

/** 异常商品明细 */
export interface AbnormalGoodsItem {
	/** 明细ID */
	id?: string;
	/** 商品ID */
	goodsId: string;
	/** 商品编码 */
	goodsCode?: string;
	/** 商品名称 */
	goodsName?: string;
	/** 异常数量 */
	abnormalQuantity: number;
	/** 异常说明 */
	abnormalNote?: string;
}

/** 添加异常发货记录参数 */
export interface AddAbnormalShipmentParams {
	/** 出库单号 */
	outboundNo?: string;
	/** 客户ID */
	customerId: string;
	/** 异常日期 */
	abnormalDate: string;
	/** 异常类型 */
	abnormalType: number;
	/** 异常描述 */
	abnormalDesc: string;
	/** 商品列表 */
	goods: AbnormalGoodsItem[];
	/** 备注 */
	remark?: string;
}

/** 更新异常发货记录参数 */
export interface UpdateAbnormalShipmentParams extends AddAbnormalShipmentParams {
	/** 记录ID */
	id: string;
}

/** 异常发货记录查询参数 */
export interface AbnormalShipmentQueryParams extends PageParams {
	/** 异常单号（模糊查询） */
	abnormalNo?: string;
	/** 出库单号（模糊查询） */
	outboundNo?: string;
	/** 客户ID */
	customerId?: string;
	/** 客户名称（模糊查询） */
	customerName?: string;
	/** 异常日期开始 */
	abnormalDateStart?: string;
	/** 异常日期结束 */
	abnormalDateEnd?: string;
	/** 异常类型 */
	abnormalType?: number;
	/** 处理状态 */
	status?: number;
}

/**
 * 获取异常发货记录列表（分页）
 */
export const getAbnormalShipmentList = (params: AbnormalShipmentQueryParams) => {
	return http.request<PageResult<AbnormalShipmentInfo>>("get", "/daily-check/abnormal/list", { params });
};

/**
 * 获取异常发货记录详情
 */
export const getAbnormalShipmentDetail = (id: string) => {
	return http.request<AbnormalShipmentInfo>("get", `/daily-check/abnormal/${id}`);
};

/**
 * 添加异常发货记录
 */
export const addAbnormalShipment = (data: AddAbnormalShipmentParams) => {
	return http.request<string>("post", "/daily-check/abnormal", { data });
};

/**
 * 更新异常发货记录
 */
export const updateAbnormalShipment = (data: UpdateAbnormalShipmentParams) => {
	return http.request<void>("put", `/daily-check/abnormal/${data.id}`, { data });
};

/**
 * 删除异常发货记录
 */
export const deleteAbnormalShipment = (id: string) => {
	return http.request<void>("delete", `/daily-check/abnormal/${id}`);
};

/**
 * 处理异常发货
 */
export const handleAbnormalShipment = (id: string, handleMeasure: string) => {
	return http.request<void>("post", `/daily-check/abnormal/${id}/handle`, { data: { handleMeasure } });
};

/**
 * 完成异常处理
 */
export const completeAbnormalShipment = (id: string) => {
	return http.request<void>("post", `/daily-check/abnormal/${id}/complete`);
};
