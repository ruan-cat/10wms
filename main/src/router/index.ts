import "@/utils/sso";
import Cookies from "js-cookie";
import { getConfig } from "@/config";
import NProgress from "@/utils/progress";
import { transformI18n } from "@/plugins/i18n";
import { buildHierarchyTree } from "@/utils/tree";
import remainingRouter from "./modules/remaining";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { isUrl, openLink, cloneDeep, isAllEmpty, storageLocal } from "@pureadmin/utils";
import {
	ascending,
	getTopMenu,
	initRouter,
	isOneOfArray,
	getHistoryMode,
	findRouteByPath,
	handleAliveRoute,
	formatTwoStageRoutes,
	formatFlatteningRoutes,
	/** @see https://pure-admin.cn/pages/routerMenu/#如何只要静态路由 */
	addPathMatch,
} from "./utils";
import {
	type Router,
	type RouteRecordRaw,
	type RouteComponent,
	// 使用 unplugin-vue-router 自动化路由插件 故不使用原版路由提供的函数
	// createRouter
} from "vue-router";
import { type DataInfo, userKey, removeToken, multipleTabsKey } from "@/utils/auth";

// 自动化路由插件
import { createRouter } from "vue-router/auto";
import { handleHotUpdate, routes as autoRoutes } from "vue-router/auto-routes";

// 自动化布局插件
import { createGetRoutes, setupLayouts } from "virtual:meta-layouts";

/**
 * 是否开启自动化路由？
 * FIXME: 开启自动化路由后 导致死循环 不清楚如何配置。
 */
const isAutoRoutes = false;

/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(["./modules/**/*.ts", "!./modules/**/remaining.ts"], {
	eager: true,
});

/** 原始静态路由（未做任何处理） */
const routes = [];

Object.keys(modules).forEach((key) => {
	routes.push(modules[key].default);
});

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
	// 在没有自动路由前的写法
	formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity)))),

	// 增加自动路由后的写法
	// formatFlatteningRoutes(
	// 	buildHierarchyTree(
	// 		ascending(
	// 			// 根据自动化路由做判断
	// 			(isAutoRoutes ? autoRoutes : routes).flat(Infinity),
	// 		),
	// 	),
	// ),
);

// 改造前
// const initConstantRoutes: Array<RouteRecordRaw> = cloneDeep(constantRoutes);
/**
 * 初始的静态路由，用于退出登录时重置路由
 * @description
 * 改造后：
 *
 * 在对接 布局组件后 此处的路由需要经过 setupLayouts 处理
 * 使其可以正确渲染布局组件
 * 用于处理用户退出登录后重新登陆系统时 页面出现布局页丢失的bug。
 */
const initConstantRoutes: Array<RouteRecordRaw> = cloneDeep(setupLayouts(constantRoutes));

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(
	routes.flat(Infinity),
	// 根据自动化路由做判断
	// (isAutoRoutes ? autoRoutes : routes).flat(Infinity),
).concat(...remainingRouter);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map((v) => {
	return remainingRouter[v].path;
});

/** 创建路由实例 */
export const router: Router = createRouter({
	history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),

	// 改造之前
	// routes: constantRoutes.concat(...(remainingRouter as any)),
	// 改造之后 按照布局插件的要求增加特定的函数 实现自动补全布局组件
	routes: setupLayouts(constantRoutes.concat(...(remainingRouter as any))),

	strict: true,
	scrollBehavior(to, from, savedPosition) {
		return new Promise((resolve) => {
			if (savedPosition) {
				return savedPosition;
			} else {
				if (from.meta.saveSrollTop) {
					const top: number = document.documentElement.scrollTop || document.body.scrollTop;
					resolve({ left: 0, top });
				}
			}
		});
	},
});

/** 重置路由 */
export function resetRouter() {
	router.clearRoutes();
	for (const route of initConstantRoutes.concat(...(remainingRouter as any))) {
		router.addRoute(route);
	}
	router.options.routes = formatTwoStageRoutes(
		formatFlatteningRoutes(
			buildHierarchyTree(
				ascending(
					routes.flat(Infinity),
					// 根据自动化路由做判断
					// (isAutoRoutes ? autoRoutes : routes).flat(Infinity),
				),
			),
		),
	);
	usePermissionStoreHook().clearAllCachePage();
}

/** 路由白名单 */
const whiteList = ["/login"];

const { VITE_HIDE_HOME } = import.meta.env;

router.beforeEach(
	(
		/**
		 * to:ToRouteType
		 * 不手动增加类型了 目前使用了自动化路由 增加了很多类型
		 * 该类型会导致很多报错 故不增加冗余的类型 使其自动推断即可
		 */
		to,
		_from,
		next,
	) => {
		if (to.meta?.keepAlive) {
			handleAliveRoute(to, "add");
			// 页面整体刷新和点击标签页刷新
			if (
				_from.name === undefined ||
				// @ts-ignore 忽略 Redirect 具名路由的比较错误
				_from.name === "Redirect"
			) {
				handleAliveRoute(to);
			}
		}
		const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
		NProgress.start();
		const externalLink = isUrl(to?.name as string);
		if (!externalLink) {
			to.matched.some((item) => {
				if (!item.meta.title) return "";
				const Title = getConfig().Title;
				if (Title) document.title = `${transformI18n(item.meta.title)} | ${Title}`;
				else document.title = transformI18n(item.meta.title);
			});
		}
		/** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
		function toCorrectRoute() {
			whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
		}
		if (Cookies.get(multipleTabsKey) && userInfo) {
			// 无权限跳转403页面
			if (to.meta?.roles && !isOneOfArray(to.meta?.roles, userInfo?.roles)) {
				next({ path: "/error/403" });
			}
			// 开启隐藏首页后在浏览器地址栏手动输入首页welcome路由则跳转到404页面
			if (VITE_HIDE_HOME === "true" && to.fullPath === "/welcome") {
				next({ path: "/error/404" });
			}
			if (_from?.name) {
				// name为超链接
				if (externalLink) {
					openLink(to?.name as string);
					NProgress.done();
				} else {
					toCorrectRoute();
				}
			} else {
				// 刷新
				if (usePermissionStoreHook().wholeMenus.length === 0 && to.path !== "/login") {
					function oldInitRouter() {
						initRouter().then((router: Router) => {
							if (!useMultiTagsStoreHook().getMultiTagsCache) {
								const { path } = to;
								const route = findRouteByPath(path, router.options.routes[0].children);
								getTopMenu(true);
								// query、params模式路由传参数的标签页不在此处处理
								if (route && route.meta?.title) {
									if (isAllEmpty(route.parentId) && route.meta?.backstage) {
										// 此处为动态顶级路由（目录）
										const { path, name, meta } = route.children[0];
										useMultiTagsStoreHook().handleTags("push", {
											path,
											name,
											meta,
										});
									} else {
										const { path, name, meta } = route;
										useMultiTagsStoreHook().handleTags("push", {
											path,
											name,
											meta,
										});
									}
								}
							}
							// 确保动态路由完全加入路由列表并且不影响静态路由（注意：动态路由刷新时router.beforeEach可能会触发两次，第一次触发动态路由还未完全添加，第二次动态路由才完全添加到路由列表，如果需要在router.beforeEach做一些判断可以在to.name存在的条件下去判断，这样就只会触发一次）
							if (isAllEmpty(to.name)) router.push(to.fullPath);
						});
					}

					/** @see https://pure-admin.cn/pages/routerMenu/#如何只要静态路由 */
					function newInitRouter() {
						// 使用下面方法替换initRouter
						usePermissionStoreHook().handleWholeMenus([]);
						addPathMatch();
						if (!useMultiTagsStoreHook().getMultiTagsCache) {
							console.log("newInitRouter to", to);

							const { path } = to;
							const route = findRouteByPath(path, router.options.routes[0].children);
							getTopMenu(true);
							// query、params模式路由传参数的标签页不在此处处理
							if (route && route.meta?.title) {
								if (isAllEmpty(route.parentId) && route.meta?.backstage) {
									// 此处为动态顶级路由（目录）
									const { path, name, meta } = route.children[0];
									useMultiTagsStoreHook().handleTags("push", {
										path,
										name,
										meta,
									});
								} else {
									const { path, name, meta } = route;
									useMultiTagsStoreHook().handleTags("push", {
										path,
										name,
										meta,
									});
								}
							}
						}
						// 确保动态路由完全加入路由列表并且不影响静态路由（注意：动态路由刷新时router.beforeEach可能会触发两次，第一次触发动态路由还未完全添加，第二次动态路由才完全添加到路由列表，如果需要在router.beforeEach做一些判断可以在to.name存在的条件下去判断，这样就只会触发一次）
						if (isAllEmpty(to.name)) router.push(to.fullPath);
					}
					newInitRouter();
				}
				toCorrectRoute();
			}
		} else {
			if (to.path !== "/login") {
				if (whiteList.indexOf(to.path) !== -1) {
					next();
				} else {
					removeToken();
					next({ path: "/login" });
				}
			} else {
				next();
			}
		}
	},
);

router.afterEach(() => {
	NProgress.done();
});

export default router;
