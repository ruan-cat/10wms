import { $t } from "@/plugins/i18n";
// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { form } from "@/router/enums";

export default {
	path: "/form",
	redirect: "/form/index",
	meta: {
		icon: "ri/edit-box-line",
		title: $t("menus.pureSchemaForm"),
		rank: form,
	},
	children: [
		{
			path: "/form/index",
			name: "SchemaForm",
			component: () => import("@/views/schema-form/index.vue"),
			meta: {
				title: $t("menus.pureSchemaForm"),
			},
		},
	],
} satisfies RouteConfigsTable;
