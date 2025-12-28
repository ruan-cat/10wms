const Layout = () => import("@/layout/index.vue");

export default {
	path: "/system",
	name: "System",
	component: Layout,
	redirect: "/system/user",
	meta: {
		icon: "ep:setting",
		title: "系统管理",
		rank: 10,
	},
	children: [
		{
			path: "/system/user",
			name: "User",
			component: () => import("@/pages/system/user/index.vue"),
			meta: {
				title: "用户管理",
			},
		},
		{
			path: "/system/role",
			name: "Role",
			component: () => import("@/pages/system/role/index.vue"),
			meta: {
				title: "角色管理",
			},
		},
		{
			path: "/system/menu",
			name: "Menu",
			component: () => import("@/pages/system/menu/index.vue"),
			meta: {
				title: "菜单管理",
			},
		},
		{
			path: "/system/dept",
			name: "Dept",
			component: () => import("@/pages/system/dept/index.vue"),
			meta: {
				title: "部门管理",
			},
		},
		{
			path: "/system/dictionary",
			name: "Dictionary",
			component: () => import("@/pages/system/dictionary/index.vue"),
			meta: {
				title: "字典管理",
			},
		},
		{
			path: "/system/category",
			name: "Category",
			component: () => import("@/pages/system/category/index.vue"),
			meta: {
				title: "分类管理",
			},
		},
		{
			path: "/system/icon",
			name: "Icon",
			component: () => import("@/pages/system/icon/index.vue"),
			meta: {
				title: "图标管理",
			},
		},
		{
			path: "/system/language",
			name: "Language",
			component: () => import("@/pages/system/language/index.vue"),
			meta: {
				title: "语言管理",
			},
		},
		{
			path: "/system/system-notice",
			name: "SystemNotice",
			component: () => import("@/pages/system/system-notice/index.vue"),
			meta: {
				title: "系统通知",
			},
		},
	],
} satisfies RouteConfigsTable;
