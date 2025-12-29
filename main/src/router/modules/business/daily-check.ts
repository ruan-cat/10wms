import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/daily-check",
	name: "DailyCheck",
	component: Layout,
	redirect: "/daily-check/abnormal-delivery",
	meta: {
		icon: "ri:task-line",
		title: $t("business.dailyCheck"),
		rank: 35,
	},
	children: [
		{
			path: "/daily-check/abnormal-delivery",
			name: "AbnormalDelivery",
			component: () => import("@/pages/daily-check/abnormal-delivery/index.vue"),
			meta: {
				title: $t("business.abnormalDelivery"),
				icon: "ri:error-warning-line",
			},
		},
		{
			path: "/daily-check/temperature",
			name: "Temperature",
			component: () => import("@/pages/daily-check/temperature/index.vue"),
			meta: {
				title: $t("business.temperature"),
				icon: "ri:temp-cold-line",
			},
		},
		{
			path: "/daily-check/received-unsold",
			name: "ReceivedUnsold",
			component: () => import("@/pages/daily-check/received-unsold/index.vue"),
			meta: {
				title: $t("business.receivedUnsold"),
				icon: "ri:inbox-unarchive-line",
			},
		},
		{
			path: "/daily-check/shipment-delay-warn",
			name: "ShipmentDelayWarn",
			component: () => import("@/pages/daily-check/shipment-delay-warn/index.vue"),
			meta: {
				title: $t("business.shipmentDelayWarn"),
				icon: "ri:alarm-warning-line",
			},
		},
	],
} satisfies RouteConfigsTable;
