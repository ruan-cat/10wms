import { $t } from "@/plugins/i18n";

// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { table } from "@/router/enums";

export default {
	path: "/table",
	redirect: "/table/index",
	meta: {
		icon: "ri/table-line",
		title: $t("menus.pureTable"),
		rank: table,
	},
	children: [
		{
			path: "/table/index",
			name: "PureTable",
			component: () => import("@/views/table/index.vue"),
			meta: {
				title: $t("menus.pureTableBase"),
			},
		},
		{
			path: "/table/high",
			name: "PureTableHigh",
			component: () => import("@/views/table/high.vue"),
			meta: {
				title: $t("menus.pureTableHigh"),
			},
		},
		{
			path: "/table/edit",
			name: "PureTableEdit",
			component: () => import("@/views/table/edit.vue"),
			meta: {
				title: $t("menus.pureTableEdit"),
			},
		},
		{
			path: "/table/virtual",
			name: "VxeTable",
			component: () => import("@/views/table/virtual.vue"),
			meta: {
				title: $t("menus.pureVxeTable"),
			},
		},
	],
} satisfies RouteConfigsTable;
