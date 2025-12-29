import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/inventory",
	name: "Inventory",
	component: Layout,
	redirect: "/inventory/check",
	meta: {
		icon: "ri:archive-line",
		title: $t("business.inventory"),
		rank: 35,
	},
	children: [
		{
			path: "/inventory/check",
			name: "InventoryCheck",
			component: () => import("@/pages/inventory/check/index.vue"),
			meta: {
				title: $t("business.inventoryCheck"),
				icon: "ri:file-list-line",
			},
		},
		{
			path: "/inventory/comprehensive-inventory",
			name: "ComprehensiveInventory",
			component: () => import("@/pages/inventory/comprehensive-inventory/index.vue"),
			meta: {
				title: $t("business.comprehensiveInventory"),
				icon: "ri:search-2-line",
			},
		},
		{
			path: "/inventory/stock",
			name: "Stock",
			component: () => import("@/pages/inventory/stock/index.vue"),
			meta: {
				title: $t("business.stock"),
				icon: "ri:search-line",
			},
		},
		{
			path: "/inventory/differentialposting",
			name: "DifferentialPosting",
			component: () => import("@/pages/inventory/differentialposting/index.vue"),
			meta: {
				title: $t("business.differentialPosting"),
				icon: "ri:exchange-line",
			},
		},
		{
			path: "/inventory/double-quotation",
			name: "DoubleQuotation",
			component: () => import("@/pages/inventory/double-quotation/index.vue"),
			meta: {
				title: $t("business.doubleQuotation"),
				icon: "ri:refresh-line",
			},
		},
		{
			path: "/inventory/inventory-difference",
			name: "InventoryDifference",
			component: () => import("@/pages/inventory/inventory-difference/index.vue"),
			meta: {
				title: $t("business.inventoryDifference"),
				icon: "ri:contrast-2-line",
			},
		},
		{
			path: "/inventory/move-inventory",
			name: "MoveInventory",
			component: () => import("@/pages/inventory/move-inventory/index.vue"),
			meta: {
				title: $t("business.moveInventory"),
				icon: "ri:arrow-left-right-line",
			},
		},
		{
			path: "/inventory/moving-count",
			name: "MovingCount",
			component: () => import("@/pages/inventory/moving-count/index.vue"),
			meta: {
				title: $t("business.movingCount"),
				icon: "ri:stack-line",
			},
		},
		{
			path: "/inventory/shelf-adjustment",
			name: "ShelfAdjustment",
			component: () => import("@/pages/inventory/shelf-adjustment/index.vue"),
			meta: {
				title: $t("business.shelfAdjustment"),
				icon: "ri:arrow-up-line",
			},
		},
		{
			path: "/inventory/takedown-adjustment",
			name: "TakedownAdjustment",
			component: () => import("@/pages/inventory/takedown-adjustment/index.vue"),
			meta: {
				title: $t("business.takedownAdjustment"),
				icon: "ri:arrow-down-line",
			},
		},
	],
} satisfies RouteConfigsTable;
