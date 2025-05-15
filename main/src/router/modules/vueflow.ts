// 业务变更 为了适应自动导入插件 故此处注释掉手动导入的枚举
// import { vueflow } from "@/router/enums";

export default {
	path: "/vue-flow",
	redirect: "/vue-flow/index",
	meta: {
		icon: "ep/set-up",
		title: "vue-flow",
		rank: vueflow,
	},
	children: [
		{
			path: "/vue-flow/index",
			name: "VueFlow",
			component: () => import("@/views/vue-flow/layouting/index.vue"),
			meta: {
				title: "vue-flow",
			},
		},
	],
} satisfies RouteConfigsTable;
