import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 盘点单信息 */
export interface InventoryCheckInfo {
	/** 盘点单ID */
	id: string;
	/** 盘点单号 */
	checkNo: string;
	/** 盘点类型 1-综合盘点 2-移库盘点 3-货架调整 */
	checkType: number;
	/** 盘点日期 */
	checkDate: string;
	/** 盘点范围（储位、区域等） */
	checkScope?: string;
	/** 盘点人 */
	checker?: string;
	/** 商品列表 */
	goods?: InventoryCheckGoodsItem[];
	/** 状态 0-待盘点 1-盘点中 2-已完成 3-已审核 */
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

/** 盘点商品明细 */
export interface InventoryCheckGoodsItem {
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
	/** 账面数量 */
	bookQuantity: number;
	/** 实盘数量 */
	actualQuantity?: number;
	/** 盈亏数量 */
	differenceQuantity?: number;
	/** 盈亏原因 */
	differenceReason?: string;
	/** 备注 */
	remark?: string;
}

/** 添加盘点单参数 */
export interface AddInventoryCheckParams {
	/** 盘点类型 1-综合盘点 2-移库盘点 3-货架调整 */
	checkType: number;
	/** 盘点日期 */
	checkDate: string;
	/** 盘点范围 */
	checkScope?: string;
	/** 盘点人 */
	checker?: string;
	/** 商品列表 */
	goods: InventoryCheckGoodsItem[];
	/** 备注 */
	remark?: string;
}

/** 更新盘点单参数 */
export interface UpdateInventoryCheckParams extends AddInventoryCheckParams {
	/** 盘点单ID */
	id: string;
}

/** 盘点单查询参数 */
export interface InventoryCheckQueryParams extends PageParams {
	/** 盘点单号（模糊查询） */
	checkNo?: string;
	/** 盘点类型 */
	checkType?: number;
	/** 盘点日期开始 */
	checkDateStart?: string;
	/** 盘点日期结束 */
	checkDateEnd?: string;
	/** 盘点人 */
	checker?: string;
	/** 状态 */
	status?: number;
}

/**
 * 获取盘点单列表（分页）
 */
export const getInventoryCheckList = (params: InventoryCheckQueryParams) => {
	return http.request<PageResult<InventoryCheckInfo>>("get", "/inventory/check/list", { params });
};

/**
 * 获取盘点单详情
 */
export const getInventoryCheckDetail = (id: string) => {
	return http.request<InventoryCheckInfo>("get", `/inventory/check/${id}`);
};

/**
 * 添加盘点单
 */
export const addInventoryCheck = (data: AddInventoryCheckParams) => {
	return http.request<string>("post", "/inventory/check", { data });
};

/**
 * 更新盘点单
 */
export const updateInventoryCheck = (data: UpdateInventoryCheckParams) => {
	return http.request<void>("put", `/inventory/check/${data.id}`, { data });
};

/**
 * 删除盘点单
 */
export const deleteInventoryCheck = (id: string) => {
	return http.request<void>("delete", `/inventory/check/${id}`);
};

/**
 * 开始盘点
 */
export const startInventoryCheck = (id: string) => {
	return http.request<void>("post", `/inventory/check/${id}/start`);
};

/**
 * 完成盘点
 */
export const completeInventoryCheck = (id: string) => {
	return http.request<void>("post", `/inventory/check/${id}/complete`);
};

/**
 * 审核盘点单
 */
export const auditInventoryCheck = (id: string, approved: boolean, reason?: string) => {
	return http.request<void>("post", `/inventory/check/${id}/audit`, { data: { approved, reason } });
};

/**
 * 生成盘点差异报告
 */
export const generateDifferenceReport = (id: string) => {
	return http.request<Blob>("get", `/inventory/check/${id}/difference-report`, { responseType: "blob" });
};
