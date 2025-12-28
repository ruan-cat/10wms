import { $t } from "@/plugins/i18n";

/** 测试路由模块 */
export default {
	path: "/test",
	redirect: "/test/table",
	meta: {
		icon: "ep:data-analysis",
		title: "测试页面",
		rank: 999,
	},
	children: [
		{
			path: "/test/table",
			name: "TableTest",
			component: () => import("@/views/test/table-test.vue"),
			meta: {
				title: "表格组件测试",
			},
		},
	],
} satisfies RouteConfigsTable;
