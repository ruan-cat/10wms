import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/region",
	name: "Region",
	component: Layout,
	redirect: "/region/area-information",
	meta: {
		icon: "ep:location",
		title: "区域配置",
		rank: 52,
	},
	children: [
		{
			path: "/region/area-information",
			name: "AreaInformation",
			component: () => import("@/pages/region/area-information/index.vue"),
			meta: {
				title: "大区信息",
			},
		},
		{
			path: "/region/city-type",
			name: "CityType",
			component: () => import("@/pages/region/city-type/index.vue"),
			meta: {
				title: "城市分类",
			},
		},
	],
} satisfies RouteConfigsTable;
