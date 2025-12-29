import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

/** 区域配置模块路由 */
const regionRouter: RouteConfigsTable = {
	path: "/region",
	name: "Region",
	component: Layout,
	redirect: "/region/area-information",
	meta: {
		title: $t("business.region"),
		icon: "ri:map-pin-line",
		rank: 10,
	},
	children: [
		{
			path: "/region/area-information",
			name: "AreaInformation",
			component: () => import("@/pages/region/area-information/index.vue"),
			meta: {
				title: $t("business.areaInformation"),
				icon: "ri:map-2-line",
				showLink: true,
			},
		},
		{
			path: "/region/city-type",
			name: "CityType",
			component: () => import("@/pages/region/city-type/index.vue"),
			meta: {
				title: $t("business.cityType"),
				icon: "ri:building-2-line",
				showLink: true,
			},
		},
		{
			path: "/region/district-information",
			name: "DistrictInformation",
			component: () => import("@/pages/region/district-information/index.vue"),
			meta: {
				title: $t("business.districtInformation"),
				icon: "ri:community-line",
				showLink: true,
			},
		},
		{
			path: "/region/regional-information",
			name: "RegionalInformation",
			component: () => import("@/pages/region/regional-information/index.vue"),
			meta: {
				title: $t("business.regionalInformation"),
				icon: "ri:global-line",
				showLink: true,
			},
		},
	],
};

export default regionRouter;
