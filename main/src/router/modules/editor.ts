import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { editor } from "@/router/enums";

export default {
	path: "/editor",
	redirect: "/editor/index",
	meta: {
		icon: "ep/edit",
		title: $t("menus.pureEditor"),
		rank: editor,
	},
	children: [
		{
			path: "/editor/index",
			name: "Editor",
			component: () => import("@/views/editor/index.vue"),
			meta: {
				title: $t("menus.pureEditor"),
				keepAlive: true,
			},
		},
	],
} satisfies RouteConfigsTable;
