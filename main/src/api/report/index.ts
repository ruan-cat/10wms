import { http } from "@/utils/http";

/** 库存报表查询参数 */
export interface StockReportQuery {
	customerName?: string;
	goodsName?: string;
	warehouseName?: string;
	pageIndex: number;
	pageSize: number;
}

/** 库存报表数据 */
export interface StockReportItem {
	id: number;
	customerName: string;
	goodsName: string;
	goodsCode: string;
	specification: string;
	unit: string;
	quantity: number;
	warehouseName: string;
	locationName: string;
	batchNo: string;
	productionDate: string;
	expiryDate: string;
}

/** 有效期预警查询参数 */
export interface ExpiryWarningQuery {
	customerName?: string;
	goodsName?: string;
	warningDays: number;
	pageIndex: number;
	pageSize: number;
}

/** 有效期预警数据 */
export interface ExpiryWarningItem extends StockReportItem {
	remainingDays: number;
}

/**
 * 获取库存报表列表
 */
export function getStockReportList(data: StockReportQuery) {
	return http.request<{
		records: StockReportItem[];
		total: number;
	}>("post", "/api/report/stock/list", { data });
}

/**
 * 导出库存报表
 */
export function exportStockReport(data: Omit<StockReportQuery, "pageIndex" | "pageSize">) {
	return http.request("post", "/api/report/stock/export", { data });
}

/**
 * 获取有效期预警列表
 */
export function getExpiryWarningList(data: ExpiryWarningQuery) {
	return http.request<{
		records: ExpiryWarningItem[];
		total: number;
	}>("post", "/api/report/expiry-warning/list", { data });
}

/**
 * 导出有效期预警
 */
export function exportExpiryWarning(data: Omit<ExpiryWarningQuery, "pageIndex" | "pageSize">) {
	return http.request("post", "/api/report/expiry-warning/export", { data });
}
