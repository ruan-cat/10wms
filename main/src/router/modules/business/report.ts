import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/report",
	name: "Report",
	component: Layout,
	redirect: "/report/stock",
	meta: {
		icon: "ri:bar-chart-2-line",
		title: $t("business.report"),
		rank: 90,
	},
	children: [
		{
			path: "/report/stock",
			name: "StockReport",
			component: () => import("@/pages/report/stock/index.vue"),
			meta: {
				title: $t("business.stockReport"),
				icon: "ri:file-chart-line",
			},
		},
		{
			path: "/report/expiry-warning",
			name: "ExpiryWarning",
			component: () => import("@/pages/report/expiry-warning/index.vue"),
			meta: {
				title: $t("business.expiryWarning"),
				icon: "ri:alarm-warning-line",
			},
		},
	],
} satisfies RouteConfigsTable;
