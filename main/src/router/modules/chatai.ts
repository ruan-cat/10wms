// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { chatai } from "@/router/enums";

export default {
	path: "/chatai",
	redirect: "/chatai/index",
	meta: {
		icon: "ri/chat-search-line",
		title: "chat-ai",
		rank: chatai,
	},
	children: [
		{
			path: "/chatai/index",
			name: "ChatAi",
			component: () => import("@/views/chatai/index.vue"),
			meta: {
				title: "chat-ai",
				extraIcon: "IF-pure-iconfont-new svg",
			},
		},
	],
} satisfies RouteConfigsTable;
