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
		{
			path: "/billing/billing-commodity-category",
			name: "BillingCommodityCategory",
			component: () => import("@/pages/billing/billing-commodity-category/index.vue"),
			meta: {
				title: "计费商品类别",
			},
		},
		{
			path: "/billing/billing-date",
			name: "BillingDate",
			component: () => import("@/pages/billing/billing-date/index.vue"),
			meta: {
				title: "计费日期",
			},
		},
		{
			path: "/billing/contract-billing-method",
			name: "ContractBillingMethod",
			component: () => import("@/pages/billing/contract-billing-method/index.vue"),
			meta: {
				title: "合同计费方式",
			},
		},
		{
			path: "/billing/customer-billing-configuration",
			name: "CustomerBillingConfiguration",
			component: () => import("@/pages/billing/customer-billing-configuration/index.vue"),
			meta: {
				title: "客户计费配置",
			},
		},
		{
			path: "/billing/expense-name",
			name: "ExpenseName",
			component: () => import("@/pages/billing/expense-name/index.vue"),
			meta: {
				title: "费用名称",
			},
		},
		{
			path: "/billing/expense-type",
			name: "ExpenseType",
			component: () => import("@/pages/billing/expense-type/index.vue"),
			meta: {
				title: "费用类型",
			},
		},
		{
			path: "/billing/measurement-type",
			name: "MeasurementType",
			component: () => import("@/pages/billing/measurement-type/index.vue"),
			meta: {
				title: "计量类型",
			},
		},
		{
			path: "/billing/price-type",
			name: "PriceType",
			component: () => import("@/pages/billing/price-type/index.vue"),
			meta: {
				title: "价格类型",
			},
		},
		{
			path: "/billing/warehousing-rate",
			name: "WarehousingRate",
			component: () => import("@/pages/billing/warehousing-rate/index.vue"),
			meta: {
				title: "入库费率",
			},
		},
	],
} satisfies RouteConfigsTable;
