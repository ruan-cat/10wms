/**
 * 路由守卫辅助函数
 * @description 集成 Origin 和 Pure-Admin 的路由守卫逻辑
 */

import { ElMessage } from "element-plus";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import { getToken, removeToken } from "@/utils/auth";

/** 路由白名单 */
export const ROUTE_WHITE_LIST = ["/login", "/error/404", "/error/403", "/error/500"];

/**
 * 检查路由是否在白名单中
 */
export function isInWhiteList(path: string): boolean {
	return ROUTE_WHITE_LIST.includes(path);
}

/**
 * 检查用户是否有指定角色
 */
export function hasRole(requiredRoles: string[], userRoles: string[]): boolean {
	if (!requiredRoles || requiredRoles.length === 0) {
		return true;
	}
	return requiredRoles.some((role) => userRoles.includes(role));
}

/**
 * 显示认证错误消息
 */
export function showAuthError(message: string) {
	ElMessage.warning(message);
}

/**
 * 重定向到登录页
 */
export function redirectToLogin(next: NavigationGuardNext, message?: string) {
	if (message) {
		showAuthError(message);
	}
	removeToken();
	next({ path: "/login" });
}

/**
 * Origin 兼容：检查 Token 并加载用户数据
 * @returns true 表示验证通过，false 表示需要跳转登录
 */
export async function checkAuthAndLoadData(to: RouteLocationNormalized, next: NavigationGuardNext): Promise<boolean> {
	// 1. 白名单检查
	if (isInWhiteList(to.path)) {
		return true;
	}

	// 2. Token 检查
	const tokenData = getToken();
	if (!tokenData) {
		redirectToLogin(next, "在未登录时，禁止访问其他页面！");
		return false;
	}

	// 3. 初始化数据加载
	const userStore = useUserStoreHook();
	if (!userStore.isLoaded) {
		try {
			await userStore.loadUser();
			await userStore.loadMenus();
			userStore.setLoaded(true);
		} catch (error) {
			console.error("加载用户数据失败:", error);
			redirectToLogin(next, "加载用户数据失败，请重新登录");
			return false;
		}
	}

	// 4. 权限检查
	if (to.meta?.roles && !hasRole(to.meta.roles as string[], userStore.roles)) {
		ElMessage.error("权限不够，请联系管理员");
		next({ path: "/error/403" });
		return false;
	}

	return true;
}

/**
 * 开发环境：检查是否是示例模块
 */
export function isSampleRoute(path: string): boolean {
	return import.meta.env.DEV && path.includes("sample");
}
