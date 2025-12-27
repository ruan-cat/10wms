import { http } from "@/utils/http";
import type { TreeNode } from "@/types/common";

/** 部门信息 */
export interface DeptInfo extends TreeNode {
	/** 部门ID */
	id: string;
	/** 部门名称 */
	deptName: string;
	/** 部门编码 */
	deptCode?: string;
	/** 父部门ID */
	parentId: string;
	/** 组织类型 */
	orgType?: string;
	/** 排序 */
	sort?: number;
	/** 负责人 */
	leader?: string;
	/** 联系电话 */
	phone?: string;
	/** 邮箱 */
	email?: string;
	/** 状态 0-禁用 1-启用 */
	status: number;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
	/** 子部门列表 */
	children?: DeptInfo[];
}

/** 添加部门参数 */
export interface AddDeptParams {
	/** 部门名称 */
	deptName: string;
	/** 部门编码 */
	deptCode?: string;
	/** 父部门ID */
	parentId: string;
	/** 组织类型 */
	orgType?: string;
	/** 排序 */
	sort?: number;
	/** 负责人 */
	leader?: string;
	/** 联系电话 */
	phone?: string;
	/** 邮箱 */
	email?: string;
	/** 状态 0-禁用 1-启用 */
	status?: number;
}

/** 更新部门参数 */
export interface UpdateDeptParams extends AddDeptParams {
	/** 部门ID */
	id: string;
}

/** 部门查询参数 */
export interface DeptQueryParams {
	/** 部门名称（模糊查询） */
	deptName?: string;
	/** 状态 */
	status?: number;
}

/**
 * 获取部门树形列表
 */
export const getDeptTree = (params?: DeptQueryParams) => {
	return http.request<DeptInfo[]>("get", "/system/dept/tree", { params });
};

/**
 * 获取部门列表（扁平）
 */
export const getDeptList = (params?: DeptQueryParams) => {
	return http.request<DeptInfo[]>("get", "/system/dept/list", { params });
};

/**
 * 获取部门详情
 */
export const getDeptDetail = (id: string) => {
	return http.request<DeptInfo>("get", `/system/dept/${id}`);
};

/**
 * 添加部门
 */
export const addDept = (data: AddDeptParams) => {
	return http.request<string>("post", "/system/dept", { data });
};

/**
 * 更新部门
 */
export const updateDept = (data: UpdateDeptParams) => {
	return http.request<void>("put", `/system/dept/${data.id}`, { data });
};

/**
 * 删除部门
 */
export const deleteDept = (id: string) => {
	return http.request<void>("delete", `/system/dept/${id}`);
};

/**
 * 修改部门状态
 */
export const updateDeptStatus = (id: string, status: number) => {
	return http.request<void>("put", `/system/dept/${id}/status`, { data: { status } });
};

/**
 * 获取部门下的用户数量
 */
export const getDeptUserCount = (id: string) => {
	return http.request<number>("get", `/system/dept/${id}/user-count`);
};
