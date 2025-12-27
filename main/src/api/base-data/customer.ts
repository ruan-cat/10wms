import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/** 客户信息 */
export interface CustomerInfo {
	/** 客户ID */
	id: string;
	/** 客户编码 */
	customerCode: string;
	/** 客户名称 */
	customerName: string;
	/** 客户类型 */
	customerType?: string;
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

/** 添加客户参数 */
export interface AddCustomerParams {
	/** 客户编码 */
	customerCode: string;
	/** 客户名称 */
	customerName: string;
	/** 客户类型 */
	customerType?: string;
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

/** 更新客户参数 */
export interface UpdateCustomerParams extends AddCustomerParams {
	/** 客户ID */
	id: string;
}

/** 客户查询参数 */
export interface CustomerQueryParams extends PageParams {
	/** 客户编码（模糊查询） */
	customerCode?: string;
	/** 客户名称（模糊查询） */
	customerName?: string;
	/** 客户类型 */
	customerType?: string;
	/** 联系电话 */
	phone?: string;
	/** 状态 */
	status?: number;
}

/**
 * 获取客户列表（分页）
 */
export const getCustomerList = (params: CustomerQueryParams) => {
	return http.request<PageResult<CustomerInfo>>("get", "/md/customer/list", { params });
};

/**
 * 获取所有客户（不分页）
 */
export const getAllCustomers = () => {
	return http.request<CustomerInfo[]>("get", "/md/customer/all");
};

/**
 * 获取客户详情
 */
export const getCustomerDetail = (id: string) => {
	return http.request<CustomerInfo>("get", `/md/customer/${id}`);
};

/**
 * 根据客户编码获取客户信息
 */
export const getCustomerByCode = (customerCode: string) => {
	return http.request<CustomerInfo>("get", "/md/customer/by-code", { params: { customerCode } });
};

/**
 * 添加客户
 */
export const addCustomer = (data: AddCustomerParams) => {
	return http.request<string>("post", "/md/customer", { data });
};

/**
 * 更新客户
 */
export const updateCustomer = (data: UpdateCustomerParams) => {
	return http.request<void>("put", `/md/customer/${data.id}`, { data });
};

/**
 * 删除客户
 */
export const deleteCustomer = (id: string) => {
	return http.request<void>("delete", `/md/customer/${id}`);
};

/**
 * 批量删除客户
 */
export const batchDeleteCustomer = (ids: string[]) => {
	return http.request<void>("delete", "/md/customer/batch", { data: { ids } });
};

/**
 * 修改客户状态
 */
export const updateCustomerStatus = (id: string, status: number) => {
	return http.request<void>("put", `/md/customer/${id}/status`, { data: { status } });
};

/**
 * 导入客户数据
 */
export const importCustomer = (file: File) => {
	const formData = new FormData();
	formData.append("file", file);
	return http.request<{ successCount: number; failCount: number; failList: any[] }>("post", "/md/customer/import", {
		data: formData,
		headers: { "Content-Type": "multipart/form-data" },
	});
};

/**
 * 导出客户数据
 */
export const exportCustomer = (params?: CustomerQueryParams) => {
	return http.request<Blob>("get", "/md/customer/export", { params, responseType: "blob" });
};
