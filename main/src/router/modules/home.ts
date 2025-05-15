import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

const oldHomeRoute = {
	path: "/",
	name: "Home",
	component: Layout,
	redirect: "/welcome",
	meta: {
		icon: "ep/home-filled",
		title: $t("menus.pureHome"),
		rank: RouterOrderEnums.home,
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

const newHomeRoute = {
	path: "/welcome",
	name: "Welcome",
	component: () => import("@/views/welcome/index.vue"),
	meta: {
		title: $t("menus.pureHome"),
		showLink: VITE_HIDE_HOME === "true" ? false : true,
	},
} satisfies RouteConfigsTable;

// export default oldHomeRoute;
export default newHomeRoute;
