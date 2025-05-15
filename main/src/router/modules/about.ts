import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { about } from "@/router/enums";

export default {
	path: "/about",
	redirect: "/about/index",
	meta: {
		icon: "ri/file-info-line",
		title: $t("menus.pureAbout"),
		rank: about,
	},
	children: [
		{
			path: "/about/index",
			name: "About",
			component: () => import("@/views/about/index.vue"),
			meta: {
				title: $t("menus.pureAbout"),
			},
		},
	],
} satisfies RouteConfigsTable;
