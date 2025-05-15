import { $t } from "@/plugins/i18n";

// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { result } from "@/router/enums";

export default {
	path: "/result",
	redirect: "/result/success",
	meta: {
		icon: "ri/checkbox-circle-line",
		title: $t("menus.pureResult"),
		rank: result,
	},
	children: [
		{
			path: "/result/success",
			name: "Success",
			component: () => import("@/views/result/success.vue"),
			meta: {
				title: $t("menus.pureSuccess"),
			},
		},
		{
			path: "/result/fail",
			name: "Fail",
			component: () => import("@/views/result/fail.vue"),
			meta: {
				title: $t("menus.pureFail"),
			},
		},
	],
} satisfies RouteConfigsTable;
