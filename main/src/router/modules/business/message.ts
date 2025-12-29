import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

/** 消息中间件模块路由 */
const messageRouter: RouteConfigsTable = {
	path: "/message",
	name: "Message",
	component: Layout,
	redirect: "/message/message-center",
	meta: {
		title: $t("menus.message"),
		icon: "ep:message",
		rank: 8,
	},
	children: [
		{
			path: "/message/message-center",
			name: "MessageCenter",
			component: () => import("@/pages/message/message-center/index.vue"),
			meta: {
				title: $t("menus.messageCenter"),
				showLink: true,
			},
		},
		{
			path: "/message/message-template",
			name: "MessageTemplate",
			component: () => import("@/pages/message/message-template/index.vue"),
			meta: {
				title: $t("menus.messageTemplate"),
				showLink: true,
			},
		},
		{
			path: "/message/work-setting",
			name: "WorkSetting",
			component: () => import("@/pages/message/work-setting/index.vue"),
			meta: {
				title: $t("menus.workSetting"),
				showLink: true,
			},
		},
		{
			path: "/message/work-sql",
			name: "WorkSql",
			component: () => import("@/pages/message/work-sql/index.vue"),
			meta: {
				title: $t("menus.workSql"),
				showLink: true,
			},
		},
	],
};

export default messageRouter;
