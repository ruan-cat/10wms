import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 库存信息 */
export interface StockInfo {
	/** 库存ID */
	id: string;
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
	/** 客户ID */
	customerId?: string;
	/** 客户名称 */
	customerName?: string;
	/** 批次号 */
	batchNo?: string;
	/** 托盘号 */
	palletNo?: string;
	/** 储位 */
	location?: string;
	/** 库存数量 */
	quantity: number;
	/** 可用数量 */
	availableQuantity?: number;
	/** 锁定数量 */
	lockedQuantity?: number;
	/** 生产日期 */
	productionDate?: string;
	/** 保质期（天） */
	shelfLife?: number;
	/** 到期日期 */
	expiryDate?: string;
	/** 库存状态 0-正常 1-预警 2-过期 */
	status: number;
	/** 更新时间 */
	updateTime?: string;
}

/** 库存查询参数 */
export interface StockQueryParams extends PageParams {
	/** 商品编码（模糊查询） */
	goodsCode?: string;
	/** 商品名称（模糊查询） */
	goodsName?: string;
	/** 客户ID */
	customerId?: string;
	/** 客户名称（模糊查询） */
	customerName?: string;
	/** 批次号 */
	batchNo?: string;
	/** 托盘号 */
	palletNo?: string;
	/** 储位 */
	location?: string;
	/** 库存状态 */
	status?: number;
}

/** 库存调整参数 */
export interface StockAdjustParams {
	/** 库存ID */
	stockId: string;
	/** 调整类型 1-增加 2-减少 */
	adjustType: number;
	/** 调整数量 */
	quantity: number;
	/** 调整原因 */
	reason: string;
	/** 备注 */
	remark?: string;
}

/** 库存转移参数 */
export interface StockTransferParams {
	/** 源库存ID */
	sourceStockId: string;
	/** 目标储位 */
	targetLocation: string;
	/** 转移数量 */
	quantity: number;
	/** 备注 */
	remark?: string;
}

/** 库存预警信息 */
export interface StockWarningInfo {
	/** 商品ID */
	goodsId: string;
	/** 商品编码 */
	goodsCode: string;
	/** 商品名称 */
	goodsName: string;
	/** 当前库存 */
	currentStock: number;
	/** 安全库存 */
	safetyStock: number;
	/** 预警类型 1-库存不足 2-即将过期 3-已过期 */
	warningType: number;
	/** 预警时间 */
	warningTime: string;
}

/**
 * 获取库存列表（分页）
 */
export const getStockList = (params: StockQueryParams) => {
	return http.request<PageResult<StockInfo>>("get", "/inventory/stock/list", { params });
};

/**
 * 获取库存详情
 */
export const getStockDetail = (id: string) => {
	return http.request<StockInfo>("get", `/inventory/stock/${id}`);
};

/**
 * 根据商品ID获取库存汇总
 */
export const getStockSummaryByGoods = (goodsId: string) => {
	return http.request<{ totalQuantity: number; availableQuantity: number; lockedQuantity: number }>(
		"get",
		`/inventory/stock/summary/goods/${goodsId}`,
	);
};

/**
 * 根据客户ID获取库存汇总
 */
export const getStockSummaryByCustomer = (customerId: string) => {
	return http.request<{ totalQuantity: number; goodsCount: number }>(
		"get",
		`/inventory/stock/summary/customer/${customerId}`,
	);
};

/**
 * 库存调整
 */
export const adjustStock = (data: StockAdjustParams) => {
	return http.request<void>("post", "/inventory/stock/adjust", { data });
};

/**
 * 库存转移
 */
export const transferStock = (data: StockTransferParams) => {
	return http.request<void>("post", "/inventory/stock/transfer", { data });
};

/**
 * 锁定库存
 */
export const lockStock = (stockId: string, quantity: number, reason: string) => {
	return http.request<void>("post", `/inventory/stock/${stockId}/lock`, { data: { quantity, reason } });
};

/**
 * 解锁库存
 */
export const unlockStock = (stockId: string, quantity: number) => {
	return http.request<void>("post", `/inventory/stock/${stockId}/unlock`, { data: { quantity } });
};

/**
 * 获取库存预警列表
 */
export const getStockWarningList = (params: PageParams) => {
	return http.request<PageResult<StockWarningInfo>>("get", "/inventory/stock/warning/list", { params });
};

/**
 * 导出库存数据
 */
export const exportStock = (params?: StockQueryParams) => {
	return http.request<Blob>("get", "/inventory/stock/export", { params, responseType: "blob" });
};
