import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { board } from "@/router/enums";

const IFrame = () => import("@/layout/frame.vue");

export default {
	path: "/board",
	redirect: "/board/index",
	meta: {
		icon: "ri/artboard-line",
		title: $t("menus.pureBoard"),
		rank: board,
	},
	children: [
		{
			path: "/board/index",
			name: "FrameBoard",
			component: IFrame,
			meta: {
				title: $t("menus.pureBoard"),
				keepAlive: true,
				frameSrc: "https://songlh.top/paint-board/",
			},
		},
	],
} satisfies RouteConfigsTable;
