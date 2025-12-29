import { ref, computed } from "vue";
import { storageLocal } from "@pureadmin/utils";

/** 侧边栏类型的存储键 */
const SIDEBAR_TYPE_KEY = "sidebar-type";

/** 当前激活的侧边栏类型 */
const currentSidebarType = ref<SidebarType>(
	(storageLocal().getItem<SidebarType>(SIDEBAR_TYPE_KEY) as SidebarType) || "wmsBusinessPage",
);

/** 路由/菜单项类型（兼容 RouteRecordRaw 和 menuType） */
type RouteMenuItem = {
	path?: string;
	children?: RouteMenuItem[];
	meta?: {
		sidebarType?: SidebarType;
		[key: string]: any;
	};
	[key: string]: any;
};

/**
 * 侧边栏类型管理
 * @description 用于管理和区分不同类型的侧边栏菜单
 */
export function useSidebarType() {
	/**
	 * 切换侧边栏类型
	 * @param type 侧边栏类型
	 */
	function switchSidebarType(type: SidebarType) {
		currentSidebarType.value = type;
		storageLocal().setItem(SIDEBAR_TYPE_KEY, type);
	}

	/**
	 * 从路由路径判断侧边栏类型（约定式）
	 * @param routePath 路由文件路径
	 * @returns 侧边栏类型
	 */
	function getSidebarTypeFromPath(routePath: string): SidebarType {
		// 根据路由文件路径判断
		if (routePath.includes("/modules/pure-admin/")) {
			return "pureAdminExamplePage";
		}
		if (routePath.includes("/modules/business/")) {
			return "wmsBusinessPage";
		}
		// 默认为业务页面
		return "wmsBusinessPage";
	}

	/**
	 * 获取路由的侧边栏类型
	 * @param route 路由对象
	 * @returns 侧边栏类型
	 */
	function getSidebarTypeFromRoute(route: any): SidebarType {
		// 1. 优先使用显式配置的 sidebarType
		if (route.meta?.sidebarType) {
			return route.meta.sidebarType;
		}

		// 2. 根据路由路径判断（约定式）
		// 注意：这里需要从路由的 __file 或其他元信息中获取文件路径
		// 由于 Vue Router 不直接提供文件路径，我们使用路由 path 作为判断依据

		// 如果路由有 __routeFilePath 元信息（需要在路由加载时添加）
		if (route.__routeFilePath) {
			return getSidebarTypeFromPath(route.__routeFilePath);
		}

		// 3. 根据路由 path 的特征判断
		// Pure-Admin 示例路由通常有特定的路径特征
		const pureAdminPaths = [
			"/components",
			"/able",
			"/flowchart",
			"/editor",
			"/list",
			"/form",
			"/table",
			"/nested",
			"/guide",
			"/result",
			"/error",
			"/ppt",
			"/ganttastic",
			"/board",
			"/chatai",
			"/codemirror",
			"/formdesign",
			"/markdown",
			"/menuoverflow",
			"/mind",
			"/vueflow",
		];

		const routePath = route.path || "";
		if (pureAdminPaths.some((path) => routePath.startsWith(path))) {
			return "pureAdminExamplePage";
		}

		// 4. 默认为业务页面
		return "wmsBusinessPage";
	}

	/**
	 * 根据侧边栏类型过滤路由
	 * @param routes 路由/菜单数组
	 * @param type 侧边栏类型（不传则使用当前类型）
	 * @returns 过滤后的路由/菜单数组
	 */
	function filterRoutesBySidebarType<T extends RouteMenuItem>(routes: T[], type?: SidebarType): T[] {
		const targetType = type || currentSidebarType.value;

		return routes
			.map((route) => {
				const routeType = getSidebarTypeFromRoute(route);

				// 如果当前路由类型匹配
				if (routeType === targetType) {
					// 递归处理子路由
					if (route.children && route.children.length > 0) {
						return {
							...route,
							children: filterRoutesBySidebarType(route.children as T[], targetType),
						} as T;
					}
					return route;
				}

				// 如果当前路由类型不匹配，但有子路由，检查子路由
				if (route.children && route.children.length > 0) {
					const filteredChildren = filterRoutesBySidebarType(route.children as T[], targetType);
					if (filteredChildren.length > 0) {
						return {
							...route,
							children: filteredChildren,
						} as T;
					}
				}

				// 不匹配且没有匹配的子路由，返回 null
				return null;
			})
			.filter((route): route is T => route !== null);
	}

	/**
	 * 判断路由是否属于当前侧边栏类型
	 * @param route 路由对象
	 * @returns 是否属于当前侧边栏类型
	 */
	function isCurrentSidebarType(route: any): boolean {
		return getSidebarTypeFromRoute(route) === currentSidebarType.value;
	}

	/**
	 * 获取侧边栏类型的显示名称
	 * @param type 侧边栏类型
	 * @returns 显示名称
	 */
	function getSidebarTypeName(type: SidebarType): string {
		const names: Record<SidebarType, string> = {
			wmsBusinessPage: "主业务",
			pureAdminExamplePage: "案例示例",
		};
		return names[type] || type;
	}

	/**
	 * 是否为业务侧边栏
	 */
	const isBusinessSidebar = computed(() => currentSidebarType.value === "wmsBusinessPage");

	/**
	 * 是否为示例侧边栏
	 */
	const isExampleSidebar = computed(() => currentSidebarType.value === "pureAdminExamplePage");

	return {
		/** 当前激活的侧边栏类型 */
		currentSidebarType,
		/** 切换侧边栏类型 */
		switchSidebarType,
		/** 根据类型过滤路由 */
		filterRoutesBySidebarType,
		/** 获取路由的侧边栏类型 */
		getSidebarTypeFromRoute,
		/** 判断路由是否属于当前侧边栏类型 */
		isCurrentSidebarType,
		/** 获取侧边栏类型的显示名称 */
		getSidebarTypeName,
		/** 是否为业务侧边栏 */
		isBusinessSidebar,
		/** 是否为示例侧边栏 */
		isExampleSidebar,
	};
}
