import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/warehouse-config",
	name: "WarehouseConfig",
	component: Layout,
	redirect: "/warehouse-config/order-type",
	meta: {
		icon: "ri:building-2-line",
		title: $t("business.warehouseConfig"),
		rank: 80,
	},
	children: [
		{
			path: "/warehouse-config/order-type",
			name: "OrderType",
			component: () => import("@/pages/warehouse-config/order-type/index.vue"),
			meta: {
				title: $t("business.orderType"),
				icon: "ri:file-list-3-line",
			},
		},
	],
} satisfies RouteConfigsTable;
