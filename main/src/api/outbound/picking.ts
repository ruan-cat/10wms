import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 拣货单信息 */
export interface PickingInfo {
	/** 拣货单ID */
	id: string;
	/** 拣货单号 */
	pickingNo: string;
	/** 出库单ID */
	outboundId?: string;
	/** 出库单号 */
	outboundNo?: string;
	/** 客户ID */
	customerId: string;
	/** 客户名称 */
	customerName?: string;
	/** 拣货日期 */
	pickingDate: string;
	/** 拣货人 */
	picker?: string;
	/** 商品列表 */
	goods?: PickingGoodsItem[];
	/** 总数量 */
	totalQuantity?: number;
	/** 状态 0-待拣货 1-拣货中 2-已完成 */
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

/** 拣货商品明细 */
export interface PickingGoodsItem {
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
	/** 批次号 */
	batchNo?: string;
	/** 托盘号 */
	palletNo?: string;
	/** 储位 */
	location?: string;
	/** 应拣数量 */
	expectedQuantity: number;
	/** 实拣数量 */
	actualQuantity?: number;
	/** 备注 */
	remark?: string;
}

/** 添加拣货单参数 */
export interface AddPickingParams {
	/** 出库单ID（可选） */
	outboundId?: string;
	/** 客户ID */
	customerId: string;
	/** 拣货日期 */
	pickingDate: string;
	/** 拣货人 */
	picker?: string;
	/** 商品列表 */
	goods: PickingGoodsItem[];
	/** 备注 */
	remark?: string;
}

/** 更新拣货单参数 */
export interface UpdatePickingParams extends AddPickingParams {
	/** 拣货单ID */
	id: string;
}

/** 拣货单查询参数 */
export interface PickingQueryParams extends PageParams {
	/** 拣货单号（模糊查询） */
	pickingNo?: string;
	/** 出库单号（模糊查询） */
	outboundNo?: string;
	/** 客户ID */
	customerId?: string;
	/** 客户名称（模糊查询） */
	customerName?: string;
	/** 拣货日期开始 */
	pickingDateStart?: string;
	/** 拣货日期结束 */
	pickingDateEnd?: string;
	/** 拣货人 */
	picker?: string;
	/** 状态 */
	status?: number;
}

/**
 * 获取拣货单列表（分页）
 */
export const getPickingList = (params: PickingQueryParams) => {
	return http.request<PageResult<PickingInfo>>("get", "/outbound/picking/list", { params });
};

/**
 * 获取拣货单详情
 */
export const getPickingDetail = (id: string) => {
	return http.request<PickingInfo>("get", `/outbound/picking/${id}`);
};

/**
 * 添加拣货单
 */
export const addPicking = (data: AddPickingParams) => {
	return http.request<string>("post", "/outbound/picking", { data });
};

/**
 * 更新拣货单
 */
export const updatePicking = (data: UpdatePickingParams) => {
	return http.request<void>("put", `/outbound/picking/${data.id}`, { data });
};

/**
 * 删除拣货单
 */
export const deletePicking = (id: string) => {
	return http.request<void>("delete", `/outbound/picking/${id}`);
};

/**
 * 开始拣货
 */
export const startPicking = (id: string) => {
	return http.request<void>("post", `/outbound/picking/${id}/start`);
};

/**
 * 完成拣货
 */
export const completePicking = (id: string) => {
	return http.request<void>("post", `/outbound/picking/${id}/complete`);
};

/**
 * 打印拣货单
 */
export const printPicking = (id: string) => {
	return http.request<Blob>("get", `/outbound/picking/${id}/print`, { responseType: "blob" });
};
