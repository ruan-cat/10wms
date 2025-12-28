import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/billing",
	name: "Billing",
	component: Layout,
	redirect: "/billing/billing-mode",
	meta: {
		icon: "ep:money",
		title: "计费配置",
		rank: 50,
	},
	children: [
		{
			path: "/billing/billing-mode",
			name: "BillingMode",
			component: () => import("@/pages/billing/billing-mode/index.vue"),
			meta: {
				title: "计费模式",
			},
		},
		{
			path: "/billing/expense-template",
			name: "ExpenseTemplate",
			component: () => import("@/pages/billing/expense-template/index.vue"),
			meta: {
				title: "费用模板",
			},
		},
	],
} satisfies RouteConfigsTable;
