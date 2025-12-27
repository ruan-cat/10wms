import { http } from "@/utils/http";
import type { PageParams, PageResult } from "@/types/common";

/**
 * 添加用户接口参数
 */
export interface AddUserParams {
	/** 用户账号 */
	username: string;
	/** 密码 */
	password: string;
	/** 用户姓名 */
	realname?: string;
	/** 邮箱 */
	email?: string;
	/** 手机号码 */
	mobilePhone?: string;
	/** 办公电话 */
	officePhone?: string;
	/** 部门ID数组 */
	departmentIds: string[];
	/** 角色ID数组 */
	roleIds: string[];
	/** 用户类型：1-系统用户, 2-接口用户, 3-公司权限, 4-当前用户接口 */
	userType?: "1" | "2" | "3" | "4";
}

/**
 * 用户信息
 */
export interface UserDTO {
	/** 用户ID */
	id: string;
	/** 用户账号 */
	username: string;
	/** 用户姓名 */
	realname: string;
	/** 邮箱 */
	email?: string;
	/** 手机号码 */
	mobilePhone?: string;
	/** 办公电话 */
	officePhone?: string;
	/** 用户类型 */
	userType: string;
	/** 部门信息 */
	departments?: Array<{
		id: string;
		name: string;
	}>;
	/** 角色信息 */
	roles?: Array<{
		id: string;
		name: string;
	}>;
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
	/** 状态：1-启用, 0-禁用 */
	status: "0" | "1";
}

/**
 * 获取用户列表参数
 */
export interface GetUserListParams extends PageParams {
	/** 用户名（模糊查询） */
	username?: string;
	/** 真实姓名（模糊查询） */
	realname?: string;
	/** 用户类型 */
	userType?: string;
	/** 状态 */
	status?: "0" | "1";
	/** 部门ID */
	departmentId?: string;
}

/**
 * 重置密码参数
 */
export interface ResetPasswordParams {
	/** 用户ID */
	userId: string;
	/** 新密码 */
	newPassword: string;
}

/**
 * 添加用户
 * @description 添加新用户到系统
 * @param data 用户信息
 */
export function addUser(data: AddUserParams) {
	return http.request<string>("post", "/sys-manager/adduser", { data });
}

/**
 * 删除用户
 * @description 删除指定用户
 * @param userId 用户ID
 */
export function deleteUser(userId: string) {
	return http.request<string>("delete", `/sys-manager/${userId}`);
}

/**
 * 批量删除用户
 * @description 批量删除多个用户
 * @param userIds 用户ID数组
 */
export function batchDeleteUsers(userIds: string[]) {
	return http.request<string>("delete", "/sys-manager/batch", {
		data: { userIds },
	});
}

/**
 * 重置用户密码
 * @description 重置指定用户的密码
 * @param data 重置密码参数
 */
export function resetPassword(data: ResetPasswordParams) {
	return http.request<string>("post", "/sys-manager/reset-password", { data });
}

/**
 * 获取用户列表
 * @description 分页查询用户列表
 * @param params 查询参数
 */
export function getUserList(params: GetUserListParams) {
	return http.request<PageResult<UserDTO>>("get", "/sys-manager/users", { params });
}

/**
 * 获取用户详情
 * @description 获取指定用户的详细信息
 * @param userId 用户ID
 */
export function getUserDetail(userId: string) {
	return http.request<UserDTO>("get", `/sys-manager/users/${userId}`);
}

/**
 * 更新用户信息
 * @description 更新指定用户的信息
 * @param userId 用户ID
 * @param data 用户信息（部分更新）
 */
export function updateUser(userId: string, data: Partial<AddUserParams>) {
	return http.request<string>("put", `/sys-manager/users/${userId}`, { data });
}

/**
 * 启用/禁用用户
 * @description 切换用户的启用状态
 * @param userId 用户ID
 * @param status 状态：1-启用, 0-禁用
 */
export function toggleUserStatus(userId: string, status: "0" | "1") {
	return http.request<string>("put", `/sys-manager/users/${userId}/status`, {
		data: { status },
	});
}

/**
 * 获取用户的角色列表
 * @description 获取指定用户拥有的角色
 * @param userId 用户ID
 */
export function getUserRoles(userId: string) {
	return http.request<Array<{ id: string; name: string }>>("get", `/sys-manager/users/${userId}/roles`);
}

/**
 * 分配用户角色
 * @description 为用户分配角色
 * @param userId 用户ID
 * @param roleIds 角色ID数组
 */
export function assignUserRoles(userId: string, roleIds: string[]) {
	return http.request<string>("post", `/sys-manager/users/${userId}/roles`, {
		data: { roleIds },
	});
}
