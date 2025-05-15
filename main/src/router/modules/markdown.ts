import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { markdown } from "@/router/enums";

export default {
	path: "/markdown",
	redirect: "/markdown/index",
	meta: {
		icon: "ri/markdown-line",
		title: $t("menus.pureMarkdown"),
		rank: markdown,
	},
	children: [
		{
			path: "/markdown/index",
			name: "Markdown",
			component: () => import("@/views/markdown/index.vue"),
			meta: {
				title: $t("menus.pureMarkdown"),
				extraIcon: "IF-pure-iconfont-new svg",
			},
		},
	],
} satisfies RouteConfigsTable;
