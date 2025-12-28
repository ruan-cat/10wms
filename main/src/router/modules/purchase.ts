const Layout = () => import("@/layout/index.vue");

export default {
	path: "/purchase",
	name: "Purchase",
	component: Layout,
	redirect: "/purchase/appointment",
	meta: {
		icon: "ep:shopping-cart",
		title: "采购管理",
		rank: 32,
	},
	children: [
		{
			path: "/purchase/appointment",
			name: "Appointment",
			component: () => import("@/pages/purchase/appointment/index.vue"),
			meta: {
				title: "预约采购",
			},
		},
		{
			path: "/purchase/batch-receiving",
			name: "BatchReceiving",
			component: () => import("@/pages/purchase/batch-receiving/index.vue"),
			meta: {
				title: "批量收货",
			},
		},
		{
			path: "/purchase/receiving",
			name: "Receiving",
			component: () => import("@/pages/purchase/receiving/index.vue"),
			meta: {
				title: "收货管理",
			},
		},
		{
			path: "/purchase/stock-inquiry",
			name: "StockInquiry",
			component: () => import("@/pages/purchase/stock-inquiry/index.vue"),
			meta: {
				title: "库存查询",
			},
		},
	],
} satisfies RouteConfigsTable;
