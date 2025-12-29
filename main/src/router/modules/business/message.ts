import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

/** 消息中间件模块路由 */
const messageRouter: RouteConfigsTable = {
	path: "/message",
	name: "Message",
	component: Layout,
	redirect: "/message/message-center",
	meta: {
		title: $t("business.message"),
		icon: "ri:mail-line",
		rank: 8,
	},
	children: [
		{
			path: "/message/message-center",
			name: "MessageCenter",
			component: () => import("@/pages/message/message-center/index.vue"),
			meta: {
				title: $t("business.messageCenter"),
				icon: "ri:inbox-line",
				showLink: true,
			},
		},
		{
			path: "/message/message-template",
			name: "MessageTemplate",
			component: () => import("@/pages/message/message-template/index.vue"),
			meta: {
				title: $t("business.messageTemplate"),
				icon: "ri:file-copy-line",
				showLink: true,
			},
		},
		{
			path: "/message/work-setting",
			name: "WorkSetting",
			component: () => import("@/pages/message/work-setting/index.vue"),
			meta: {
				title: $t("business.workSetting"),
				icon: "ri:settings-2-line",
				showLink: true,
			},
		},
		{
			path: "/message/work-sql",
			name: "WorkSql",
			component: () => import("@/pages/message/work-sql/index.vue"),
			meta: {
				title: $t("business.workSql"),
				icon: "ri:code-s-slash-line",
				showLink: true,
			},
		},
	],
};

export default messageRouter;
