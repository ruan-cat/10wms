import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { ganttastic } from "@/router/enums";

export default {
	path: "/ganttastic",
	redirect: "/ganttastic/index",
	meta: {
		icon: "ri/bar-chart-horizontal-line",
		title: $t("menus.pureGanttastic"),
		rank: ganttastic,
	},
	children: [
		{
			path: "/ganttastic/index",
			name: "Ganttastic",
			component: () => import("@/views/ganttastic/index.vue"),
			meta: {
				title: $t("menus.pureGanttastic"),
			},
		},
	],
} satisfies RouteConfigsTable;
