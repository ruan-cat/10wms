import { $t } from "@/plugins/i18n";
import type { RouteConfigsTable } from "@/types/global";

const Layout = () => import("@/layout/index.vue");

/** 区域配置模块路由 */
const regionRouter: RouteConfigsTable = {
	path: "/region",
	name: "Region",
	component: Layout,
	redirect: "/region/area-information",
	meta: {
		title: $t("menus.region"),
		icon: "ep:location",
		rank: 10,
	},
	children: [
		{
			path: "/region/area-information",
			name: "AreaInformation",
			component: () => import("@/pages/region/area-information/index.vue"),
			meta: {
				title: $t("menus.areaInformation"),
				showLink: true,
			},
		},
		{
			path: "/region/city-type",
			name: "CityType",
			component: () => import("@/pages/region/city-type/index.vue"),
			meta: {
				title: $t("menus.cityType"),
				showLink: true,
			},
		},
		{
			path: "/region/district-information",
			name: "DistrictInformation",
			component: () => import("@/pages/region/district-information/index.vue"),
			meta: {
				title: $t("menus.districtInformation"),
				showLink: true,
			},
		},
		{
			path: "/region/regional-information",
			name: "RegionalInformation",
			component: () => import("@/pages/region/regional-information/index.vue"),
			meta: {
				title: $t("menus.regionalInformation"),
				showLink: true,
			},
		},
	],
};

export default regionRouter;
