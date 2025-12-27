import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 供应商信息 */
export interface SupplierInfo {
	/** 供应商ID */
	id: string;
	/** 供应商编码 */
	supplierCode: string;
	/** 供应商名称 */
	supplierName: string;
	/** 供应商类型 */
	supplierType?: string;
	/** 联系人 */
	contact?: string;
	/** 联系电话 */
	phone?: string;
	/** 邮箱 */
	email?: string;
	/** 地址 */
	address?: string;
	/** 信用等级 */
	creditLevel?: string;
	/** 状态 0-禁用 1-启用 */
	status: number;
	/** 备注 */
	remark?: string;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
}

/** 添加供应商参数 */
export interface AddSupplierParams {
	/** 供应商编码 */
	supplierCode: string;
	/** 供应商名称 */
	supplierName: string;
	/** 供应商类型 */
	supplierType?: string;
	/** 联系人 */
	contact?: string;
	/** 联系电话 */
	phone?: string;
	/** 邮箱 */
	email?: string;
	/** 地址 */
	address?: string;
	/** 信用等级 */
	creditLevel?: string;
	/** 状态 0-禁用 1-启用 */
	status?: number;
	/** 备注 */
	remark?: string;
}

/** 更新供应商参数 */
export interface UpdateSupplierParams extends AddSupplierParams {
	/** 供应商ID */
	id: string;
}

/** 供应商查询参数 */
export interface SupplierQueryParams extends PageParams {
	/** 供应商编码（模糊查询） */
	supplierCode?: string;
	/** 供应商名称（模糊查询） */
	supplierName?: string;
	/** 供应商类型 */
	supplierType?: string;
	/** 联系电话 */
	phone?: string;
	/** 状态 */
	status?: number;
}

/**
 * 获取供应商列表（分页）
 */
export const getSupplierList = (params: SupplierQueryParams) => {
	return http.request<PageResult<SupplierInfo>>("get", "/md/supplier/list", { params });
};

/**
 * 获取所有供应商（不分页）
 */
export const getAllSuppliers = () => {
	return http.request<SupplierInfo[]>("get", "/md/supplier/all");
};

/**
 * 获取供应商详情
 */
export const getSupplierDetail = (id: string) => {
	return http.request<SupplierInfo>("get", `/md/supplier/${id}`);
};

/**
 * 根据供应商编码获取供应商信息
 */
export const getSupplierByCode = (supplierCode: string) => {
	return http.request<SupplierInfo>("get", "/md/supplier/by-code", { params: { supplierCode } });
};

/**
 * 添加供应商
 */
export const addSupplier = (data: AddSupplierParams) => {
	return http.request<string>("post", "/md/supplier", { data });
};

/**
 * 更新供应商
 */
export const updateSupplier = (data: UpdateSupplierParams) => {
	return http.request<void>("put", `/md/supplier/${data.id}`, { data });
};

/**
 * 删除供应商
 */
export const deleteSupplier = (id: string) => {
	return http.request<void>("delete", `/md/supplier/${id}`);
};

/**
 * 批量删除供应商
 */
export const batchDeleteSupplier = (ids: string[]) => {
	return http.request<void>("delete", "/md/supplier/batch", { data: { ids } });
};

/**
 * 修改供应商状态
 */
export const updateSupplierStatus = (id: string, status: number) => {
	return http.request<void>("put", `/md/supplier/${id}/status`, { data: { status } });
};

/**
 * 导入供应商数据
 */
export const importSupplier = (file: File) => {
	const formData = new FormData();
	formData.append("file", file);
	return http.request<{ successCount: number; failCount: number; failList: any[] }>("post", "/md/supplier/import", {
		data: formData,
		headers: { "Content-Type": "multipart/form-data" },
	});
};

/**
 * 导出供应商数据
 */
export const exportSupplier = (params?: SupplierQueryParams) => {
	return http.request<Blob>("get", "/md/supplier/export", { params, responseType: "blob" });
};
