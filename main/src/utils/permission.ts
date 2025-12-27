import type { MenuDTO } from "@/api/system/menu";
import type { RouteRecordRaw } from "vue-router";

/**
 * 权限数据转换工具
 * 用于将 Origin 的菜单权限数据结构转换为 Pure-Admin 的路由数据结构
 */

/** Pure-Admin 路由元信息 */
export interface RouteMeta {
	/** 菜单名称（兼容国际化、非国际化，如果用国际化的写法就必须在根目录的locales文件夹下对应添加） */
	title?: string;
	/** 菜单图标 */
	icon?: string;
	/** 是否在菜单中显示（默认`true`）*/
	showLink?: boolean;
	/** 是否显示父级菜单 */
	showParent?: boolean;
	/** 页面级别权限设置 */
	roles?: Array<string>;
	/** 按钮级别权限设置 */
	auths?: Array<string>;
	/** 路由组件缓存（开启 `true`、关闭 `false`）*/
	keepAlive?: boolean;
	/** 内嵌的`iframe`链接 */
	frameSrc?: string;
	/** `iframe`页是否开启首次加载动画（默认`true`）*/
	frameLoading?: boolean;
	/** 是否是外链 */
	isLink?: string;
	/** 菜单排序，值越高排的越后（只针对顶级路由）*/
	rank?: number;
}

/**
 * 将 Origin 的菜单数据转换为 Pure-Admin 的路由配置
 * @param menus Origin 菜单数据
 * @returns Pure-Admin 路由配置
 */
export function transformMenusToRoutes(menus: MenuDTO[]): RouteRecordRaw[] {
	if (!menus || menus.length === 0) {
		return [];
	}

	return menus
		.filter((menu) => menu.type !== "2") // 过滤掉按钮类型
		.map((menu) => transformMenuToRoute(menu));
}

/**
 * 将单个菜单转换为路由
 * @param menu 菜单数据
 * @returns 路由配置
 */
function transformMenuToRoute(menu: MenuDTO): RouteRecordRaw {
	const route: RouteRecordRaw = {
		path: menu.path,
		name: menu.name,
		meta: {
			title: menu.title,
			icon: menu.icon,
			showLink: !menu.hidden,
			rank: menu.sort,
		} as RouteMeta,
	};

	// 如果是菜单类型，设置组件
	if (menu.type === "1" && menu.component) {
		// 动态导入组件
		route.component = () => import(`@/views/${menu.component}.vue`);
	}

	// 如果有子菜单，递归转换
	if (menu.children && menu.children.length > 0) {
		route.children = transformMenusToRoutes(menu.children);
	}

	return route;
}

/**
 * 从菜单中提取按钮权限
 * @param menus 菜单数据
 * @returns 按钮权限数组
 */
export function extractButtonPermissions(menus: MenuDTO[]): string[] {
	const permissions: string[] = [];

	function extract(menuList: MenuDTO[]) {
		menuList.forEach((menu) => {
			// 如果是按钮类型且有权限标识，添加到权限数组
			if (menu.type === "2" && menu.permission) {
				permissions.push(menu.permission);
			}

			// 递归处理子菜单
			if (menu.children && menu.children.length > 0) {
				extract(menu.children);
			}
		});
	}

	extract(menus);
	return permissions;
}

/**
 * 从菜单中提取路由级别的权限（auths）
 * @param menus 菜单数据
 * @returns 路由权限映射 { [routeName]: [permissions] }
 */
export function extractRouteAuths(menus: MenuDTO[]): Record<string, string[]> {
	const authsMap: Record<string, string[]> = {};

	function extract(menuList: MenuDTO[]) {
		menuList.forEach((menu) => {
			// 如果是菜单类型
			if (menu.type === "1") {
				// 收集该菜单下的所有按钮权限
				const buttonPerms: string[] = [];

				if (menu.children && menu.children.length > 0) {
					menu.children.forEach((child) => {
						if (child.type === "2" && child.permission) {
							buttonPerms.push(child.permission);
						}
					});
				}

				// 如果有按钮权限，添加到映射
				if (buttonPerms.length > 0) {
					authsMap[menu.name] = buttonPerms;
				}

				// 递归处理子菜单
				if (menu.children && menu.children.length > 0) {
					extract(menu.children.filter((c) => c.type !== "2"));
				}
			}
		});
	}

	extract(menus);
	return authsMap;
}

/**
 * 检查用户是否有指定权限
 * @param userPermissions 用户拥有的权限列表
 * @param requiredPermissions 需要的权限（单个或数组）
 * @returns 是否有权限
 */
export function checkPermission(userPermissions: string[], requiredPermissions: string | string[]): boolean {
	if (!requiredPermissions) return true;
	if (!userPermissions || userPermissions.length === 0) return false;

	// 超级管理员权限
	if (userPermissions.includes("*:*:*")) return true;

	const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

	// 检查是否有任意一个权限
	return permissions.some((perm) => userPermissions.includes(perm));
}

/**
 * 过滤用户有权限的路由
 * @param routes 所有路由
 * @param userPermissions 用户权限
 * @returns 过滤后的路由
 */
export function filterRoutesByPermission(routes: RouteRecordRaw[], userPermissions: string[]): RouteRecordRaw[] {
	return routes.filter((route) => {
		// 如果路由有角色要求，检查权限
		if (route.meta?.roles && Array.isArray(route.meta.roles)) {
			const hasPermission = checkPermission(userPermissions, route.meta.roles);
			if (!hasPermission) return false;
		}

		// 递归过滤子路由
		if (route.children && route.children.length > 0) {
			route.children = filterRoutesByPermission(route.children, userPermissions);
		}

		return true;
	});
}

/**
 * 将扁平的菜单列表转换为树形结构
 * @param menus 扁平菜单列表
 * @returns 树形菜单结构
 */
export function buildMenuTree(menus: MenuDTO[]): MenuDTO[] {
	if (!menus || menus.length === 0) return [];

	// 创建映射
	const menuMap = new Map<string, MenuDTO>();
	const rootMenus: MenuDTO[] = [];

	// 第一遍遍历：建立映射
	menus.forEach((menu) => {
		menuMap.set(menu.id, { ...menu, children: [] });
	});

	// 第二遍遍历：建立父子关系
	menus.forEach((menu) => {
		const menuItem = menuMap.get(menu.id)!;

		if (!menu.parentId || menu.parentId === "0") {
			// 根节点
			rootMenus.push(menuItem);
		} else {
			// 子节点
			const parent = menuMap.get(menu.parentId);
			if (parent) {
				if (!parent.children) {
					parent.children = [];
				}
				parent.children.push(menuItem);
			}
		}
	});

	return rootMenus;
}
