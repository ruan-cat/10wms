import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 预约采购单信息 */
export interface AppointmentPurchaseInfo {
	/** 预约单ID */
	id: string;
	/** 预约单号 */
	appointmentNo: string;
	/** 客户ID */
	customerId: string;
	/** 客户名称 */
	customerName?: string;
	/** 预约日期 */
	appointmentDate: string;
	/** 预约时间段 */
	appointmentTime?: string;
	/** 商品列表 */
	goods?: AppointmentGoodsItem[];
	/** 总数量 */
	totalQuantity?: number;
	/** 状态 0-待确认 1-已确认 2-已完成 3-已取消 */
	status: number;
	/** 备注 */
	remark?: string;
	/** 创建人 */
	createBy?: string;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
}

/** 预约商品明细 */
export interface AppointmentGoodsItem {
	/** 明细ID */
	id?: string;
	/** 商品ID */
	goodsId: string;
	/** 商品编码 */
	goodsCode?: string;
	/** 商品名称 */
	goodsName?: string;
	/** 规格型号 */
	specification?: string;
	/** 计量单位 */
	unit?: string;
	/** 预约数量 */
	quantity: number;
	/** 已收货数量 */
	receivedQuantity?: number;
	/** 备注 */
	remark?: string;
}

/** 添加预约采购单参数 */
export interface AddAppointmentPurchaseParams {
	/** 客户ID */
	customerId: string;
	/** 预约日期 */
	appointmentDate: string;
	/** 预约时间段 */
	appointmentTime?: string;
	/** 商品列表 */
	goods: AppointmentGoodsItem[];
	/** 备注 */
	remark?: string;
}

/** 更新预约采购单参数 */
export interface UpdateAppointmentPurchaseParams extends AddAppointmentPurchaseParams {
	/** 预约单ID */
	id: string;
}

/** 预约采购单查询参数 */
export interface AppointmentPurchaseQueryParams extends PageParams {
	/** 预约单号（模糊查询） */
	appointmentNo?: string;
	/** 客户ID */
	customerId?: string;
	/** 客户名称（模糊查询） */
	customerName?: string;
	/** 预约日期开始 */
	appointmentDateStart?: string;
	/** 预约日期结束 */
	appointmentDateEnd?: string;
	/** 状态 */
	status?: number;
}

/**
 * 获取预约采购单列表（分页）
 */
export const getAppointmentPurchaseList = (params: AppointmentPurchaseQueryParams) => {
	return http.request<PageResult<AppointmentPurchaseInfo>>("get", "/purchase/appointment/list", { params });
};

/**
 * 获取预约采购单详情
 */
export const getAppointmentPurchaseDetail = (id: string) => {
	return http.request<AppointmentPurchaseInfo>("get", `/purchase/appointment/${id}`);
};

/**
 * 添加预约采购单
 */
export const addAppointmentPurchase = (data: AddAppointmentPurchaseParams) => {
	return http.request<string>("post", "/purchase/appointment", { data });
};

/**
 * 更新预约采购单
 */
export const updateAppointmentPurchase = (data: UpdateAppointmentPurchaseParams) => {
	return http.request<void>("put", `/purchase/appointment/${data.id}`, { data });
};

/**
 * 删除预约采购单
 */
export const deleteAppointmentPurchase = (id: string) => {
	return http.request<void>("delete", `/purchase/appointment/${id}`);
};

/**
 * 确认预约采购单
 */
export const confirmAppointmentPurchase = (id: string) => {
	return http.request<void>("post", `/purchase/appointment/${id}/confirm`);
};

/**
 * 取消预约采购单
 */
export const cancelAppointmentPurchase = (id: string, reason?: string) => {
	return http.request<void>("post", `/purchase/appointment/${id}/cancel`, { data: { reason } });
};

/**
 * 完成预约采购单
 */
export const completeAppointmentPurchase = (id: string) => {
	return http.request<void>("post", `/purchase/appointment/${id}/complete`);
};
