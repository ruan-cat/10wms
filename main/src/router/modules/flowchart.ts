import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { flowchart } from "@/router/enums";

export default {
	path: "/flow-chart",
	redirect: "/flow-chart/index",
	meta: {
		icon: "ep/set-up",
		title: $t("menus.pureFlowChart"),
		rank: flowchart,
	},
	children: [
		{
			path: "/flow-chart/index",
			name: "FlowChart",
			component: () => import("@/views/flow-chart/index.vue"),
			meta: {
				title: $t("menus.pureFlowChart"),
			},
		},
	],
} satisfies RouteConfigsTable;
