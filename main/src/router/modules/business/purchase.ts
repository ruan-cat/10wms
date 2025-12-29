import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/purchase",
	name: "Purchase",
	component: Layout,
	redirect: "/purchase/appointment",
	meta: {
		icon: "ri:shopping-cart-2-line",
		title: $t("business.purchase"),
		rank: 32,
	},
	children: [
		{
			path: "/purchase/appointment",
			name: "Appointment",
			component: () => import("@/pages/purchase/appointment/index.vue"),
			meta: {
				title: $t("business.appointment"),
				icon: "ri:calendar-check-line",
			},
		},
		{
			path: "/purchase/batch-receiving",
			name: "BatchReceiving",
			component: () => import("@/pages/purchase/batch-receiving/index.vue"),
			meta: {
				title: $t("business.batchReceiving"),
				icon: "ri:inbox-archive-line",
			},
		},
		{
			path: "/purchase/receiving",
			name: "Receiving",
			component: () => import("@/pages/purchase/receiving/index.vue"),
			meta: {
				title: $t("business.receiving"),
				icon: "ri:inbox-line",
			},
		},
		{
			path: "/purchase/stock-inquiry",
			name: "StockInquiry",
			component: () => import("@/pages/purchase/stock-inquiry/index.vue"),
			meta: {
				title: $t("business.stockInquiry"),
				icon: "ri:search-eye-line",
			},
		},
		{
			path: "/purchase/client-purchase",
			name: "ClientPurchase",
			component: () => import("@/pages/purchase/client-purchase/index.vue"),
			meta: {
				title: $t("business.clientPurchase"),
				icon: "ri:user-add-line",
			},
		},
		{
			path: "/purchase/other-warehousing",
			name: "OtherWarehousing",
			component: () => import("@/pages/purchase/other-warehousing/index.vue"),
			meta: {
				title: $t("business.otherWarehousing"),
				icon: "ri:download-2-line",
			},
		},
		{
			path: "/purchase/purchase-notification-details",
			name: "PurchaseNotificationDetails",
			component: () => import("@/pages/purchase/purchase-notification-details/index.vue"),
			meta: {
				title: $t("business.purchaseNotificationDetails"),
				icon: "ri:notification-3-line",
			},
		},
		{
			path: "/purchase/receiving-register",
			name: "ReceivingRegister",
			component: () => import("@/pages/purchase/receiving-register/index.vue"),
			meta: {
				title: $t("business.receivingRegister"),
				icon: "ri:file-add-line",
			},
		},
		{
			path: "/purchase/received-unlisted-stock",
			name: "ReceivedUnlistedStock",
			component: () => import("@/pages/purchase/received-unlisted-stock/index.vue"),
			meta: {
				title: $t("business.receivedUnlistedStock"),
				icon: "ri:inbox-2-line",
			},
		},
	],
} satisfies RouteConfigsTable;
