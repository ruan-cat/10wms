import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { guide } from "@/router/enums";

export default {
	path: "/guide",
	redirect: "/guide/index",
	meta: {
		icon: "ep/guide",
		title: $t("menus.pureGuide"),
		rank: guide,
	},
	children: [
		{
			path: "/guide/index",
			name: "Guide",
			component: () => import("@/views/guide/index.vue"),
			meta: {
				title: $t("menus.pureGuide"),
			},
		},
	],
} satisfies RouteConfigsTable;
