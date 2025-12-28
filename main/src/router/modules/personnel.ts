import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/personnel",
	name: "Personnel",
	component: Layout,
	redirect: "/personnel/academic-code",
	meta: {
		icon: "ep:user",
		title: "人员配置",
		rank: 53,
	},
	children: [
		{
			path: "/personnel/academic-code",
			name: "AcademicCode",
			component: () => import("@/pages/personnel/academic-code/index.vue"),
			meta: {
				title: "学历代码",
			},
		},
	],
} satisfies RouteConfigsTable;
