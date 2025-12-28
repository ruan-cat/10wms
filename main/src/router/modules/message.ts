import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/message",
	name: "Message",
	component: Layout,
	redirect: "/message/message-center",
	meta: {
		icon: "ep:message",
		title: "消息中间件",
		rank: 51,
	},
	children: [
		{
			path: "/message/message-center",
			name: "MessageCenter",
			component: () => import("@/pages/message/message-center/index.vue"),
			meta: {
				title: "消息中心",
			},
		},
		{
			path: "/message/message-template",
			name: "MessageTemplate",
			component: () => import("@/pages/message/message-template/index.vue"),
			meta: {
				title: "消息模板",
			},
		},
	],
} satisfies RouteConfigsTable;
