import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { mind } from "@/router/enums";

const IFrame = () => import("@/layout/frame.vue");

export default {
	path: "/mind-map",
	redirect: "/mind-map/index",
	meta: {
		icon: "ri/mind-map",
		title: $t("menus.pureMindMap"),
		rank: mind,
	},
	children: [
		{
			path: "/mind-map/index",
			name: "FrameMindMap",
			component: IFrame,
			meta: {
				title: $t("menus.pureMindMap"),
				keepAlive: true,
				frameSrc: "https://wanglin2.github.io/mind-map/#/",
			},
		},
	],
} satisfies RouteConfigsTable;
