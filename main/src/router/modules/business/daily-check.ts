const Layout = () => import("@/layout/index.vue");

export default {
	path: "/daily-check",
	name: "DailyCheck",
	component: Layout,
	redirect: "/daily-check/abnormal-delivery",
	meta: {
		icon: "ri:task-line",
		title: "日常检查",
		rank: 35,
	},
	children: [
		{
			path: "/daily-check/abnormal-delivery",
			name: "AbnormalDelivery",
			component: () => import("@/pages/daily-check/abnormal-delivery/index.vue"),
			meta: {
				title: "异常发货",
				icon: "ri:error-warning-line",
			},
		},
		{
			path: "/daily-check/temperature",
			name: "Temperature",
			component: () => import("@/pages/daily-check/temperature/index.vue"),
			meta: {
				title: "温度维护",
				icon: "ri:temp-cold-line",
			},
		},
		{
			path: "/daily-check/received-unsold",
			name: "ReceivedUnsold",
			component: () => import("@/pages/daily-check/received-unsold/index.vue"),
			meta: {
				title: "收货未上架",
				icon: "ri:inbox-unarchive-line",
			},
		},
		{
			path: "/daily-check/shipment-delay-warn",
			name: "ShipmentDelayWarn",
			component: () => import("@/pages/daily-check/shipment-delay-warn/index.vue"),
			meta: {
				title: "出货延迟预警",
				icon: "ri:alarm-warning-line",
			},
		},
	],
} satisfies RouteConfigsTable;
