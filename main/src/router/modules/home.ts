import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { home } from "@/router/enums";

const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
	path: "/",
	name: "Home",
	component: Layout,
	redirect: "/welcome",
	meta: {
		icon: "ep/home-filled",
		title: $t("menus.pureHome"),
		rank: home,
	},
	children: [
		{
			path: "/welcome",
			name: "Welcome",
			component: () => import("@/views/welcome/index.vue"),
			meta: {
				title: $t("menus.pureHome"),
				showLink: VITE_HIDE_HOME === "true" ? false : true,
			},
		},
	],
} satisfies RouteConfigsTable;
