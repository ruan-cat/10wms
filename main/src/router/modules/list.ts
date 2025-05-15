import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { list } from "@/router/enums";

export default {
	path: "/list",
	redirect: "/list/card",
	meta: {
		icon: "ri/list-check",
		title: $t("menus.pureList"),
		// TODO: 处理此处的类型报错
		rank: list,
	},
	children: [
		{
			path: "/list/card",
			name: "CardList",
			component: () => import("@/views/list/card/index.vue"),
			meta: {
				icon: "ri/bank-card-line",
				title: $t("menus.pureCardList"),
				showParent: true,
			},
		},
	],
} satisfies RouteConfigsTable;
