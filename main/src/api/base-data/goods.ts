import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 商品信息 */
export interface GoodsInfo {
	/** 商品ID */
	id: string;
	/** 商品编码 */
	goodsCode: string;
	/** 商品名称 */
	goodsName: string;
	/** 商品分类ID */
	categoryId?: string;
	/** 商品分类名称 */
	categoryName?: string;
	/** 规格型号 */
	specification?: string;
	/** 计量单位 */
	unit?: string;
	/** 条形码 */
	barcode?: string;
	/** 商品图片 */
	image?: string;
	/** 成本价 */
	costPrice?: number;
	/** 销售价 */
	salePrice?: number;
	/** 库存数量 */
	stockQuantity?: number;
	/** 安全库存 */
	safetyStock?: number;
	/** 状态 0-禁用 1-启用 */
	status: number;
	/** 备注 */
	remark?: string;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
}

/** 添加商品参数 */
export interface AddGoodsParams {
	/** 商品编码 */
	goodsCode: string;
	/** 商品名称 */
	goodsName: string;
	/** 商品分类ID */
	categoryId?: string;
	/** 规格型号 */
	specification?: string;
	/** 计量单位 */
	unit?: string;
	/** 条形码 */
	barcode?: string;
	/** 商品图片 */
	image?: string;
	/** 成本价 */
	costPrice?: number;
	/** 销售价 */
	salePrice?: number;
	/** 安全库存 */
	safetyStock?: number;
	/** 状态 0-禁用 1-启用 */
	status?: number;
	/** 备注 */
	remark?: string;
}

/** 更新商品参数 */
export interface UpdateGoodsParams extends AddGoodsParams {
	/** 商品ID */
	id: string;
}

/** 商品查询参数 */
export interface GoodsQueryParams extends PageParams {
	/** 商品编码（模糊查询） */
	goodsCode?: string;
	/** 商品名称（模糊查询） */
	goodsName?: string;
	/** 商品分类ID */
	categoryId?: string;
	/** 条形码 */
	barcode?: string;
	/** 状态 */
	status?: number;
}

/**
 * 获取商品列表（分页）
 */
export const getGoodsList = (params: GoodsQueryParams) => {
	return http.request<PageResult<GoodsInfo>>("get", "/md/goods/query-all", { params });
};

/**
 * 获取所有商品（不分页）
 */
export const getAllGoods = () => {
	return http.request<GoodsInfo[]>("get", "/md/goods/all");
};

/**
 * 获取商品详情
 */
export const getGoodsDetail = (id: string) => {
	return http.request<GoodsInfo>("get", `/md/goods/${id}`);
};

/**
 * 根据商品编码获取商品信息
 */
export const getGoodsByCode = (goodsCode: string) => {
	return http.request<GoodsInfo>("get", "/md/goods/by-code", { params: { goodsCode } });
};

/**
 * 根据条形码获取商品信息
 */
export const getGoodsByBarcode = (barcode: string) => {
	return http.request<GoodsInfo>("get", "/md/goods/by-barcode", { params: { barcode } });
};

/**
 * 添加商品
 */
export const addGoods = (data: AddGoodsParams) => {
	return http.request<string>("post", "/md/goods", { data });
};

/**
 * 更新商品
 */
export const updateGoods = (data: UpdateGoodsParams) => {
	return http.request<void>("put", `/md/goods/${data.id}`, { data });
};

/**
 * 删除商品
 */
export const deleteGoods = (id: string) => {
	return http.request<void>("delete", `/md/goods/${id}`);
};

/**
 * 批量删除商品
 */
export const batchDeleteGoods = (ids: string[]) => {
	return http.request<void>("delete", "/md/goods/batch", { data: { ids } });
};

/**
 * 修改商品状态
 */
export const updateGoodsStatus = (id: string, status: number) => {
	return http.request<void>("put", `/md/goods/${id}/status`, { data: { status } });
};

/**
 * 导入商品数据
 */
export const importGoods = (file: File) => {
	const formData = new FormData();
	formData.append("file", file);
	return http.request<{ successCount: number; failCount: number; failList: any[] }>("post", "/md/goods/import", {
		data: formData,
		headers: { "Content-Type": "multipart/form-data" },
	});
};

/**
 * 导出商品数据
 */
export const exportGoods = (params?: GoodsQueryParams) => {
	return http.request<Blob>("get", "/md/goods/export", { params, responseType: "blob" });
};
