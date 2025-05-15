import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { codemirror } from "@/router/enums";

export default {
	path: "/codemirror",
	redirect: "/codemirror/index",
	meta: {
		icon: "ri/code-box-line",
		title: $t("menus.pureCodeMirror"),
		rank: codemirror,
	},
	children: [
		{
			path: "/codemirror/index",
			name: "CodeMirror",
			component: () => import("@/views/codemirror/index.vue"),
			meta: {
				title: $t("menus.pureCodeMirror"),
				extraIcon: "IF-pure-iconfont-new svg",
			},
		},
	],
} satisfies RouteConfigsTable;
