import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/outbound",
	name: "Outbound",
	component: Layout,
	redirect: "/outbound/picking",
	meta: {
		icon: "ri:truck-line",
		title: $t("business.outbound"),
		rank: 50,
	},
	children: [
		{
			path: "/outbound/picking",
			name: "Picking",
			component: () => import("@/pages/outbound/picking/index.vue"),
			meta: {
				title: $t("business.picking"),
				icon: "ri:hand-coin-line",
			},
		},
	],
} satisfies RouteConfigsTable;
