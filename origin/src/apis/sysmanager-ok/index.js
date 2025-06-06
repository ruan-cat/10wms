// sysmanager
import Request from "../request";

/**
 * 获取角色列表（条件+分页）
 */
export function getRoleListAPI(obj) {
	return Request.requestForm(Request.GET, "/sysmanager/role/query-role", obj);
}

/**
 * 录入角色
 */
export function addRoleAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmanager/role/add-role", obj);
}

/**
 * 修改角色
 */
export function updateRoleAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmanager/role/update-role", obj);
}

/**
 * 删除角色
 */
export function deleteRoleAPI(id) {
	return Request.requestForm(Request.GET, `/sysmanager/role/remove-role?id=${id}`);
}

/**
 * 导入角色文件
 */
export function importRoleAPI(file) {
	return Request.postFile("/sysmanager/role/import-role", file);
}

/**
 * 导出角色文件
 */
export function exportRoleAPI() {
	return Request.requestForm(Request.GET, "/sysmanager/role/export-role");
}

/**
 * ================================================
 */
/**
 * 获取用户列表（条件+分页）
 */
export function getUserListAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmanager/user/query-user", obj);
}

/**
 * 添加用户
 */
export function addUserAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmanager/user/adduser", obj);
}

/**
 * 编辑用户详情
 */
export function updateUserAPI(obj) {
	return Request.requestJson(Request.PUT, `/sysmanager/user/modify/userdetail`, obj);
}

/**
 * 删除用户
 */
export function deleteUserAPI(userId) {
	return Request.requestForm(Request.DELETE, `/sysmanager/user/${userId}`);
}

/**
 * 获取组织名称树
 */
export function getOrgNameTreeAPI() {
	return Request.requestForm(Request.GET, "/sysmanager/user/query-department-all");
}

/**
 * 获取角色名称列表（条件+分页）
 */
export function getRoleNameListAPI(obj) {
	return Request.requestForm(Request.GET, "/sysmanager/role/query-rolename", obj);
}

/**
 * 查询用户详情
 */
export function getUserDetailAPI(userId) {
	return Request.requestForm(Request.GET, `/sysmanager/user/get/userdetail/${userId}`);
}

/**
 * 重置用户密码
 */
export function resetUserPasswordAPI(obj) {
	return Request.requestForm(Request.POST, `/sysmanager/user/reset-password`, obj);
}

/**
 * 锁定用户状态
 */
export function lockUserStatusAPI(obj) {
	return Request.requestForm(Request.PUT, `/sysmanager/user/modify/modifyuserstatus-to-ban`, obj);
}

/**
 * 激活用户状态
 */
export function activeUserStatusAPI(obj) {
	return Request.requestForm(Request.PUT, `/sysmanager/user/modify/modifyuserstatus-to-active`, obj);
}

/**
 * 导入用户
 */
export function importUserAPI(file) {
	return Request.postFile("/sysmanager/user/import", file);
}

/**
 * 获取角色用户列表（查询属于该角色的用户）（条件+分页）
 */
export function getRoleUserSearchListAPI(obj) {
	return Request.requestForm(Request.GET, "/sysmanager/role/query-roleUserList", obj);
}

/**
 * 添加角色用户（添加单个
 */
export function addOneRoleUserAPI(obj) {
	return Request.requestForm(Request.POST, "/sysmanager/role/add-roleUser", obj);
}
