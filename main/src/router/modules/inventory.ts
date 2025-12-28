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
	],
} satisfies RouteConfigsTable;
