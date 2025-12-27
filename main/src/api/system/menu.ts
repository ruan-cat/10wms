import { http } from "@/utils/http";

/**
 * 菜单类型
 */
export type MenuType = "0" | "1" | "2"; // 0-目录, 1-菜单, 2-按钮

/**
 * 菜单信息
 */
export interface MenuDTO {
	/** 菜单ID */
	id: string;
	/** 父菜单ID */
	parentId: string;
	/** 菜单名称 */
	name: string;
	/** 菜单标题 */
	title: string;
	/** 菜单路径 */
	path: string;
	/** 组件路径 */
	component?: string;
	/** 菜单图标 */
	icon?: string;
	/** 菜单类型 */
	type: MenuType;
	/** 排序 */
	sort: number;
	/** 是否隐藏 */
	hidden: boolean;
	/** 权限标识 */
	permission?: string;
	/** 子菜单 */
	children?: MenuDTO[];
	/** 创建时间 */
	createTime: string;
	/** 更新时间 */
	updateTime: string;
}

/**
 * 添加菜单参数
 */
export interface AddMenuParams {
	/** 父菜单ID */
	parentId: string;
	/** 菜单名称 */
	name: string;
	/** 菜单标题 */
	title: string;
	/** 菜单路径 */
	path: string;
	/** 组件路径 */
	component?: string;
	/** 菜单图标 */
	icon?: string;
	/** 菜单类型 */
	type: MenuType;
	/** 排序 */
	sort: number;
	/** 是否隐藏 */
	hidden: boolean;
	/** 权限标识 */
	permission?: string;
}

/**
 * 获取菜单列表
 * @description 获取所有菜单（树形结构）
 */
export function getMenuList() {
	return http.request<MenuDTO[]>("get", "/sysmanager/menu/get-menu-list");
}

/**
 * 获取菜单详情
 * @description 获取指定菜单的详细信息
 * @param menuId 菜单ID
 */
export function getMenuDetail(menuId: string) {
	return http.request<MenuDTO>("get", `/menu/menu/${menuId}`);
}

/**
 * 获取菜单树
 * @description 获取菜单树形结构（用于选择父菜单）
 * @param menuId 菜单ID（可选，用于排除自身及子菜单）
 */
export function getMenuTree(menuId?: string) {
	const url = menuId ? `/sysmanager/menu/get-menu-list/${menuId}` : "/sysmanager/menu/query-menu-tree";
	return http.request<MenuDTO[]>("get", url);
}

/**
 * 添加菜单
 * @description 添加新菜单
 * @param data 菜单信息
 */
export function addMenu(data: AddMenuParams) {
	return http.request<string>("post", "/sysmanager/menu/addmenu", { data });
}

/**
 * 更新菜单
 * @description 更新菜单信息
 * @param data 菜单信息
 */
export function updateMenu(data: Partial<AddMenuParams> & { id: string }) {
	return http.request<string>("put", "/sysmanager/menu/modify", { data });
}

/**
 * 删除菜单
 * @description 删除指定菜单
 * @param menuId 菜单ID
 */
export function deleteMenu(menuId: string) {
	return http.request<string>("delete", `/sysmanager/menu/remove/${menuId}`);
}

/**
 * 获取用户菜单
 * @description 获取当前用户有权限的菜单
 */
export function getUserMenus() {
	return http.request<MenuDTO[]>("get", "/sysmanager/menu/user-menus");
}
