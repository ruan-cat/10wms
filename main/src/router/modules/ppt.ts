// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { ppt } from "@/router/enums";

const IFrame = () => import("@/layout/frame.vue");

export default {
	path: "/ppt",
	redirect: "/ppt/index",
	meta: {
		icon: "ri/file-ppt-2-line",
		title: "PPT",
		rank: ppt,
	},
	children: [
		{
			path: "/ppt/index",
			name: "FramePpt",
			component: IFrame,
			meta: {
				title: "PPT",
				keepAlive: true,
				frameSrc: "https://pipipi-pikachu.github.io/PPTist/",
				frameLoading: false,
			},
		},
	],
} satisfies RouteConfigsTable;
