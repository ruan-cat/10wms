import type { Router } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useUserStoreHook } from "@/store/modules/user";
import { getUserMenus } from "@/api/system/menu";
import { transformMenusToRoutes, extractButtonPermissions } from "@/utils/permission";
import { ElMessage } from "element-plus";

// 配置 NProgress
NProgress.configure({ showSpinner: false });

// 白名单路由（不需要登录即可访问）
const whiteList = ["/login", "/register", "/404", "/403"];

/**
 * 设置路由守卫
 * @param router 路由实例
 */
export function setupRouterGuard(router: Router) {
	router.beforeEach(async (to, from, next) => {
		NProgress.start();

		const userStore = useUserStoreHook();
		const token = userStore.getToken();

		// 如果有 token
		if (token) {
			// 如果要去登录页，直接跳转到首页
			if (to.path === "/login") {
				next({ path: "/" });
				NProgress.done();
				return;
			}

			// 如果还没有加载用户信息和菜单
			if (!userStore.isLoaded) {
				try {
					// 加载用户信息
					await userStore.loadUser();

					// 加载用户菜单
					const menus = await getUserMenus();

					// 提取按钮权限
					const permissions = extractButtonPermissions(menus);

					// 更新用户权限
					userStore.SET_PERMS(permissions);

					// 转换菜单为路由
					const dynamicRoutes = transformMenusToRoutes(menus);

					// 动态添加路由
					dynamicRoutes.forEach((route) => {
						router.addRoute(route);
					});

					// 标记已加载
					userStore.setLoaded(true);

					// 重新导航到目标路由
					next({ ...to, replace: true });
				} catch (error) {
					console.error("加载用户信息失败:", error);
					ElMessage.error("加载用户信息失败，请重新登录");

					// 清除用户信息
					userStore.logOut();
					next({ path: "/login", query: { redirect: to.fullPath } });
				}
				NProgress.done();
				return;
			}

			// 已加载，直接放行
			next();
		} else {
			// 没有 token
			if (whiteList.includes(to.path)) {
				// 在白名单中，直接放行
				next();
			} else {
				// 不在白名单中，跳转到登录页
				next({ path: "/login", query: { redirect: to.fullPath } });
			}
		}

		NProgress.done();
	});

	router.afterEach(() => {
		NProgress.done();
	});

	router.onError((error) => {
		console.error("路由错误:", error);
		NProgress.done();
	});
}
