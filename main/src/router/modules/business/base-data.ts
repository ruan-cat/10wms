const Layout = () => import("@/layout/index.vue");

export default {
	path: "/base-data",
	name: "BaseData",
	component: Layout,
	redirect: "/base-data/goods",
	meta: {
		icon: "ep:box",
		title: "基础数据",
		rank: 30,
	},
	children: [
		{
			path: "/base-data/goods",
			name: "Goods",
			component: () => import("@/pages/base-data/goods/index.vue"),
			meta: {
				title: "商品管理",
			},
		},
		{
			path: "/base-data/goods-detail",
			name: "GoodsDetail",
			component: () => import("@/pages/base-data/goods-detail/index.vue"),
			meta: {
				title: "商品详情",
			},
		},
		{
			path: "/base-data/customer",
			name: "Customer",
			component: () => import("@/pages/base-data/customer/index.vue"),
			meta: {
				title: "客户管理",
			},
		},
		{
			path: "/base-data/supplier",
			name: "Supplier",
			component: () => import("@/pages/base-data/supplier/index.vue"),
			meta: {
				title: "供应商管理",
			},
		},
		{
			path: "/base-data/rfid",
			name: "RFID",
			component: () => import("@/pages/base-data/rfid/index.vue"),
			meta: {
				title: "RFID管理",
			},
		},
		{
			path: "/base-data/third-customer",
			name: "ThirdCustomer",
			component: () => import("@/pages/base-data/third-customer/index.vue"),
			meta: {
				title: "第三方客户",
			},
		},
	],
} satisfies RouteConfigsTable;
