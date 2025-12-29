import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/billing",
	name: "Billing",
	component: Layout,
	redirect: "/billing/billing-mode",
	meta: {
		icon: "ri:money-dollar-circle-line",
		title: $t("business.billing"),
		rank: 50,
	},
	children: [
		{
			path: "/billing/billing-mode",
			name: "BillingMode",
			component: () => import("@/pages/billing/billing-mode/index.vue"),
			meta: {
				title: $t("business.billingMode"),
				icon: "ri:calculator-line",
			},
		},
		{
			path: "/billing/expense-template",
			name: "ExpenseTemplate",
			component: () => import("@/pages/billing/expense-template/index.vue"),
			meta: {
				title: $t("business.expenseTemplate"),
				icon: "ri:file-text-line",
			},
		},
		{
			path: "/billing/billing-commodity-category",
			name: "BillingCommodityCategory",
			component: () => import("@/pages/billing/billing-commodity-category/index.vue"),
			meta: {
				title: $t("business.billingCommodityCategory"),
				icon: "ri:price-tag-2-line",
			},
		},
		{
			path: "/billing/billing-date",
			name: "BillingDate",
			component: () => import("@/pages/billing/billing-date/index.vue"),
			meta: {
				title: $t("business.billingDate"),
				icon: "ri:calendar-2-line",
			},
		},
		{
			path: "/billing/contract-billing-method",
			name: "ContractBillingMethod",
			component: () => import("@/pages/billing/contract-billing-method/index.vue"),
			meta: {
				title: $t("business.contractBillingMethod"),
				icon: "ri:file-list-2-line",
			},
		},
		{
			path: "/billing/customer-billing-configuration",
			name: "CustomerBillingConfiguration",
			component: () => import("@/pages/billing/customer-billing-configuration/index.vue"),
			meta: {
				title: $t("business.customerBillingConfiguration"),
				icon: "ri:user-settings-line",
			},
		},
		{
			path: "/billing/expense-name",
			name: "ExpenseName",
			component: () => import("@/pages/billing/expense-name/index.vue"),
			meta: {
				title: $t("business.expenseName"),
				icon: "ri:text",
			},
		},
		{
			path: "/billing/expense-type",
			name: "ExpenseType",
			component: () => import("@/pages/billing/expense-type/index.vue"),
			meta: {
				title: $t("business.expenseType"),
				icon: "ri:list-check",
			},
		},
		{
			path: "/billing/measurement-type",
			name: "MeasurementType",
			component: () => import("@/pages/billing/measurement-type/index.vue"),
			meta: {
				title: $t("business.measurementType"),
				icon: "ri:scales-3-line",
			},
		},
		{
			path: "/billing/price-type",
			name: "PriceType",
			component: () => import("@/pages/billing/price-type/index.vue"),
			meta: {
				title: $t("business.priceType"),
				icon: "ri:money-cny-circle-line",
			},
		},
		{
			path: "/billing/warehousing-rate",
			name: "WarehousingRate",
			component: () => import("@/pages/billing/warehousing-rate/index.vue"),
			meta: {
				title: $t("business.warehousingRate"),
				icon: "ri:percent-line",
			},
		},
	],
} satisfies RouteConfigsTable;
