import { http } from "@/utils/http";

/** 订单类型查询参数 */
export interface OrderTypeQuery {
	typeName?: string;
	typeCode?: string;
	pageIndex: number;
	pageSize: number;
}

/** 订单类型数据 */
export interface OrderTypeItem {
	id?: number;
	typeCode: string;
	typeName: string;
	description?: string;
	status: number;
	createTime?: string;
	updateTime?: string;
}

/**
 * 获取订单类型列表
 */
export function getOrderTypeList(data: OrderTypeQuery) {
	return http.request<{
		records: OrderTypeItem[];
		total: number;
	}>("post", "/api/warehouse-config/order-type/list", { data });
}

/**
 * 新增订单类型
 */
export function addOrderType(data: OrderTypeItem) {
	return http.request("post", "/api/warehouse-config/order-type/add", { data });
}

/**
 * 更新订单类型
 */
export function updateOrderType(data: OrderTypeItem) {
	return http.request("put", "/api/warehouse-config/order-type/update", { data });
}

/**
 * 删除订单类型
 */
export function deleteOrderType(id: number) {
	return http.request("delete", `/api/warehouse-config/order-type/delete/${id}`);
}

/**
 * 批量删除订单类型
 */
export function batchDeleteOrderType(ids: number[]) {
	return http.request("delete", "/api/warehouse-config/order-type/batch-delete", {
		data: { ids },
	});
}
