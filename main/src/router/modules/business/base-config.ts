import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
	path: "/base-config",
	name: "BaseConfig",
	component: Layout,
	redirect: "/base-config/measuring-unit",
	meta: {
		icon: "ri:settings-3-line",
		title: $t("business.baseConfig"),
		rank: 40,
	},
	children: [
		{
			path: "/base-config/measuring-unit",
			name: "MeasuringUnit",
			component: () => import("@/pages/base-config/measuring-unit/index.vue"),
			meta: {
				title: $t("business.measuringUnit"),
				icon: "ri:ruler-line",
			},
		},
		{
			path: "/base-config/product-category",
			name: "ProductCategory",
			component: () => import("@/pages/base-config/product-category/index.vue"),
			meta: {
				title: $t("business.productCategory"),
				icon: "ri:folder-3-line",
			},
		},
		{
			path: "/base-config/encoding-type",
			name: "EncodingType",
			component: () => import("@/pages/base-config/encoding-type/index.vue"),
			meta: {
				title: $t("business.encodingType"),
				icon: "ri:barcode-line",
			},
		},
		{
			path: "/base-config/flat-type",
			name: "FlatType",
			component: () => import("@/pages/base-config/flat-type/index.vue"),
			meta: {
				title: $t("business.flatType"),
				icon: "ri:home-4-line",
			},
		},
		{
			path: "/base-config/parameter-type",
			name: "ParameterType",
			component: () => import("@/pages/base-config/parameter-type/index.vue"),
			meta: {
				title: $t("business.parameterType"),
				icon: "ri:list-settings-line",
			},
		},
		{
			path: "/base-config/product-attribute",
			name: "ProductAttribute",
			component: () => import("@/pages/base-config/product-attribute/index.vue"),
			meta: {
				title: $t("business.productAttribute"),
				icon: "ri:price-tag-3-line",
			},
		},
		{
			path: "/base-config/quality-code",
			name: "QualityCode",
			component: () => import("@/pages/base-config/quality-code/index.vue"),
			meta: {
				title: $t("business.qualityCode"),
				icon: "ri:medal-line",
			},
		},
		{
			path: "/base-config/quality-inspection-status",
			name: "QualityInspectionStatus",
			component: () => import("@/pages/base-config/quality-inspection-status/index.vue"),
			meta: {
				title: $t("business.qualityInspectionStatus"),
				icon: "ri:checkbox-circle-line",
			},
		},
		{
			path: "/base-config/system-parameter",
			name: "SystemParameter",
			component: () => import("@/pages/base-config/system-parameter/index.vue"),
			meta: {
				title: $t("business.systemParameter"),
				icon: "ri:settings-4-line",
			},
		},
	],
} satisfies RouteConfigsTable;
