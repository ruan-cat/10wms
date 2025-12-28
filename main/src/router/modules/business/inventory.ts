const Layout = () => import("@/layout/index.vue");

export default {
	path: "/inventory",
	name: "Inventory",
	component: Layout,
	redirect: "/inventory/check",
	meta: {
		icon: "ep:box",
		title: "库存管理",
		rank: 35,
	},
	children: [
		{
			path: "/inventory/check",
			name: "InventoryCheck",
			component: () => import("@/pages/inventory/check/index.vue"),
			meta: {
				title: "库存盘点",
			},
		},
		{
			path: "/inventory/comprehensive-inventory",
			name: "ComprehensiveInventory",
			component: () => import("@/pages/inventory/comprehensive-inventory/index.vue"),
			meta: {
				title: "综合库存查询",
			},
		},
		{
			path: "/inventory/stock",
			name: "Stock",
			component: () => import("@/pages/inventory/stock/index.vue"),
			meta: {
				title: "库存查询",
			},
		},
		{
			path: "/inventory/differentialposting",
			name: "DifferentialPosting",
			component: () => import("@/pages/inventory/differentialposting/index.vue"),
			meta: {
				title: "差异过账管理",
			},
		},
		{
			path: "/inventory/double-quotation",
			name: "DoubleQuotation",
			component: () => import("@/pages/inventory/double-quotation/index.vue"),
			meta: {
				title: "复盘",
			},
		},
		{
			path: "/inventory/inventory-difference",
			name: "InventoryDifference",
			component: () => import("@/pages/inventory/inventory-difference/index.vue"),
			meta: {
				title: "盘点差异",
			},
		},
		{
			path: "/inventory/move-inventory",
			name: "MoveInventory",
			component: () => import("@/pages/inventory/move-inventory/index.vue"),
			meta: {
				title: "移库管理",
			},
		},
		{
			path: "/inventory/moving-count",
			name: "MovingCount",
			component: () => import("@/pages/inventory/moving-count/index.vue"),
			meta: {
				title: "动仓盘点",
			},
		},
		{
			path: "/inventory/shelf-adjustment",
			name: "ShelfAdjustment",
			component: () => import("@/pages/inventory/shelf-adjustment/index.vue"),
			meta: {
				title: "上架调整",
			},
		},
		{
			path: "/inventory/takedown-adjustment",
			name: "TakedownAdjustment",
			component: () => import("@/pages/inventory/takedown-adjustment/index.vue"),
			meta: {
				title: "下架调整",
			},
		},
	],
} satisfies RouteConfigsTable;
