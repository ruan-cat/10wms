import { http } from "@/utils/http";
import type { PageParams, PageResult, ApiResponse } from "@/types/common";

/** 角色信息 */
export interface RoleInfo {
	/** 角色ID */
	id: string;
	/** 角色名称 */
	roleName: string;
	/** 角色编码 */
	roleCode: string;
	/** 角色描述 */
	description?: string;
	/** 状态 0-禁用 1-启用 */
	status: number;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
}

/** 添加角色参数 */
export interface AddRoleParams {
	/** 角色名称 */
	roleName: string;
	/** 角色编码 */
	roleCode: string;
	/** 角色描述 */
	description?: string;
	/** 状态 0-禁用 1-启用 */
	status?: number;
	/** 菜单权限ID列表 */
	menuIds?: string[];
}

/** 更新角色参数 */
export interface UpdateRoleParams extends AddRoleParams {
	/** 角色ID */
	id: string;
}

/** 角色查询参数 */
export interface RoleQueryParams extends PageParams {
	/** 角色名称（模糊查询） */
	roleName?: string;
	/** 角色编码（模糊查询） */
	roleCode?: string;
	/** 状态 */
	status?: number;
}

/** 角色权限分配参数 */
export interface AssignPermissionParams {
	/** 角色ID */
	roleId: string;
	/** 菜单权限ID列表 */
	menuIds: string[];
}

/**
 * 获取角色列表（分页）
 */
export const getRoleList = (params: RoleQueryParams) => {
	return http.request<PageResult<RoleInfo>>("get", "/system/role/list", { params });
};

/**
 * 获取所有角色（不分页）
 */
export const getAllRoles = () => {
	return http.request<RoleInfo[]>("get", "/system/role/all");
};

/**
 * 获取角色详情
 */
export const getRoleDetail = (id: string) => {
	return http.request<RoleInfo>("get", `/system/role/${id}`);
};

/**
 * 添加角色
 */
export const addRole = (data: AddRoleParams) => {
	return http.request<string>("post", "/system/role", { data });
};

/**
 * 更新角色
 */
export const updateRole = (data: UpdateRoleParams) => {
	return http.request<void>("put", `/system/role/${data.id}`, { data });
};

/**
 * 删除角色
 */
export const deleteRole = (id: string) => {
	return http.request<void>("delete", `/system/role/${id}`);
};

/**
 * 批量删除角色
 */
export const batchDeleteRole = (ids: string[]) => {
	return http.request<void>("delete", "/system/role/batch", { data: { ids } });
};

/**
 * 分配角色权限
 */
export const assignPermission = (data: AssignPermissionParams) => {
	return http.request<void>("post", "/system/role/permission", { data });
};

/**
 * 获取角色已分配的权限ID列表
 */
export const getRolePermissions = (roleId: string) => {
	return http.request<string[]>("get", `/system/role/${roleId}/permissions`);
};

/**
 * 修改角色状态
 */
export const updateRoleStatus = (id: string, status: number) => {
	return http.request<void>("put", `/system/role/${id}/status`, { data: { status } });
};
