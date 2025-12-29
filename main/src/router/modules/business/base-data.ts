import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/base-data",
	name: "BaseData",
	component: Layout,
	redirect: "/base-data/goods",
	meta: {
		icon: "ri:database-2-line",
		title: $t("business.baseData"),
		rank: 30,
	},
	children: [
		{
			path: "/base-data/goods",
			name: "Goods",
			component: () => import("@/pages/base-data/goods/index.vue"),
			meta: {
				title: $t("business.goods"),
				icon: "ri:shopping-bag-3-line",
			},
		},
		{
			path: "/base-data/goods-detail",
			name: "GoodsDetail",
			component: () => import("@/pages/base-data/goods-detail/index.vue"),
			meta: {
				title: $t("business.goodsDetail"),
				icon: "ri:file-list-3-line",
			},
		},
		{
			path: "/base-data/customer",
			name: "Customer",
			component: () => import("@/pages/base-data/customer/index.vue"),
			meta: {
				title: $t("business.customer"),
				icon: "ri:user-3-line",
			},
		},
		{
			path: "/base-data/supplier",
			name: "Supplier",
			component: () => import("@/pages/base-data/supplier/index.vue"),
			meta: {
				title: $t("business.supplier"),
				icon: "ri:truck-line",
			},
		},
		{
			path: "/base-data/rfid",
			name: "RFID",
			component: () => import("@/pages/base-data/rfid/index.vue"),
			meta: {
				title: $t("business.rfid"),
				icon: "ri:radio-line",
			},
		},
		{
			path: "/base-data/third-customer",
			name: "ThirdCustomer",
			component: () => import("@/pages/base-data/third-customer/index.vue"),
			meta: {
				title: $t("business.thirdCustomer"),
				icon: "ri:group-line",
			},
		},
	],
} satisfies RouteConfigsTable;
