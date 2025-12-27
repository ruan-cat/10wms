import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 收货单信息 */
export interface ReceivingInfo {
	/** 收货单ID */
	id: string;
	/** 收货单号 */
	receivingNo: string;
	/** 预约单ID */
	appointmentId?: string;
	/** 预约单号 */
	appointmentNo?: string;
	/** 客户ID */
	customerId: string;
	/** 客户名称 */
	customerName?: string;
	/** 收货日期 */
	receivingDate: string;
	/** 商品列表 */
	goods?: ReceivingGoodsItem[];
	/** 总数量 */
	totalQuantity?: number;
	/** 状态 0-待收货 1-收货中 2-已完成 */
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

/** 收货商品明细 */
export interface ReceivingGoodsItem {
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
	/** 应收数量 */
	expectedQuantity: number;
	/** 实收数量 */
	actualQuantity?: number;
	/** 生产日期 */
	productionDate?: string;
	/** 保质期（天） */
	shelfLife?: number;
	/** 批次号 */
	batchNo?: string;
	/** 托盘号 */
	palletNo?: string;
	/** 储位 */
	location?: string;
	/** 备注 */
	remark?: string;
}

/** 添加收货单参数 */
export interface AddReceivingParams {
	/** 预约单ID（可选） */
	appointmentId?: string;
	/** 客户ID */
	customerId: string;
	/** 收货日期 */
	receivingDate: string;
	/** 商品列表 */
	goods: ReceivingGoodsItem[];
	/** 备注 */
	remark?: string;
}

/** 更新收货单参数 */
export interface UpdateReceivingParams extends AddReceivingParams {
	/** 收货单ID */
	id: string;
}

/** 收货单查询参数 */
export interface ReceivingQueryParams extends PageParams {
	/** 收货单号（模糊查询） */
	receivingNo?: string;
	/** 预约单号（模糊查询） */
	appointmentNo?: string;
	/** 客户ID */
	customerId?: string;
	/** 客户名称（模糊查询） */
	customerName?: string;
	/** 收货日期开始 */
	receivingDateStart?: string;
	/** 收货日期结束 */
	receivingDateEnd?: string;
	/** 状态 */
	status?: number;
}

/** 批量收货参数 */
export interface BatchReceivingParams {
	/** 收货单ID列表 */
	receivingIds: string[];
	/** 收货日期 */
	receivingDate: string;
}

/**
 * 获取收货单列表（分页）
 */
export const getReceivingList = (params: ReceivingQueryParams) => {
	return http.request<PageResult<ReceivingInfo>>("get", "/purchase/receiving/list", { params });
};

/**
 * 获取收货单详情
 */
export const getReceivingDetail = (id: string) => {
	return http.request<ReceivingInfo>("get", `/purchase/receiving/${id}`);
};

/**
 * 添加收货单
 */
export const addReceiving = (data: AddReceivingParams) => {
	return http.request<string>("post", "/purchase/receiving", { data });
};

/**
 * 更新收货单
 */
export const updateReceiving = (data: UpdateReceivingParams) => {
	return http.request<void>("put", `/purchase/receiving/${data.id}`, { data });
};

/**
 * 删除收货单
 */
export const deleteReceiving = (id: string) => {
	return http.request<void>("delete", `/purchase/receiving/${id}`);
};

/**
 * 开始收货
 */
export const startReceiving = (id: string) => {
	return http.request<void>("post", `/purchase/receiving/${id}/start`);
};

/**
 * 完成收货
 */
export const completeReceiving = (id: string) => {
	return http.request<void>("post", `/purchase/receiving/${id}/complete`);
};

/**
 * 批量收货
 */
export const batchReceiving = (data: BatchReceivingParams) => {
	return http.request<void>("post", "/purchase/receiving/batch", { data });
};
