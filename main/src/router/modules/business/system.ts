import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/system",
	name: "System",
	component: Layout,
	redirect: "/system/user",
	meta: {
		icon: "ri:shield-user-line",
		title: $t("business.system"),
		rank: 10,
	},
	children: [
		{
			path: "/system/user",
			name: "User",
			component: () => import("@/pages/system/user/index.vue"),
			meta: {
				title: $t("business.user"),
				icon: "ri:user-line",
			},
		},
		{
			path: "/system/role",
			name: "Role",
			component: () => import("@/pages/system/role/index.vue"),
			meta: {
				title: $t("business.role"),
				icon: "ri:admin-line",
			},
		},
		{
			path: "/system/menu",
			name: "Menu",
			component: () => import("@/pages/system/menu/index.vue"),
			meta: {
				title: $t("business.menu"),
				icon: "ri:menu-line",
			},
		},
		{
			path: "/system/dept",
			name: "Dept",
			component: () => import("@/pages/system/dept/index.vue"),
			meta: {
				title: $t("business.dept"),
				icon: "ri:organization-chart",
			},
		},
		{
			path: "/system/dictionary",
			name: "Dictionary",
			component: () => import("@/pages/system/dictionary/index.vue"),
			meta: {
				title: $t("business.dictionary"),
				icon: "ri:book-2-line",
			},
		},
		{
			path: "/system/category",
			name: "Category",
			component: () => import("@/pages/system/category/index.vue"),
			meta: {
				title: $t("business.category"),
				icon: "ri:folder-open-line",
			},
		},
		{
			path: "/system/icon",
			name: "Icon",
			component: () => import("@/pages/system/icon/index.vue"),
			meta: {
				title: $t("business.icon"),
				icon: "ri:palette-line",
			},
		},
		{
			path: "/system/language",
			name: "Language",
			component: () => import("@/pages/system/language/index.vue"),
			meta: {
				title: $t("business.language"),
				icon: "ri:translate-2",
			},
		},
		{
			path: "/system/system-notice",
			name: "SystemNotice",
			component: () => import("@/pages/system/system-notice/index.vue"),
			meta: {
				title: $t("business.systemNotice"),
				icon: "ri:notification-2-line",
			},
		},
	],
} satisfies RouteConfigsTable;
