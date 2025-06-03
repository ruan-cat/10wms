import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { VueRouterAutoImports } from "unplugin-vue-router";

export default AutoImport({
	imports: [
		VueRouterAutoImports,
		"@vueuse/core",
		"vue",
		"pinia",
		{ "@vueuse/integrations/useAxios": ["useAxios"] },
		{ "@ruan-cat/utils": ["isConditionsEvery", "isConditionsSome"] },
		{ type: true, from: "@ruan-cat/utils", imports: ["Prettify", "ToNumberLike"] },

		// useAxios-for-01s 类型
		{
			type: true,
			from: "@ruan-cat/utils/vueuse/useAxios-for-01s/index.ts",
			imports: [
				"ParamsPathKey",
				"ParamsQueryKey",
				"ParamsBodyKey",
				"HttpParamWay",
				"AxiosRequestConfigBaseKey",
				"UseAxiosOptionsJsonVO",
				"UseAxiosOptionsImmediate",
				"JsonVO",
				"PageDTO",
			],
		},

		// useAxios-for-01s 函数与变量
		{
			"@ruan-cat/utils/vueuse/useAxios-for-01s/index.ts": [
				"UpType",
				"HttpCode",
				"MapContentTypeUpType",
				"useRequestIn01s",
			],
		},

		// 导入二次封装时使用的vueuse类型
		{
			from: "@ruan-cat/utils/vueuse",
			imports: [
				"KeyHelper",
				"UseAxiosOptions",
				"UseAxiosWrapperParams",
				"KeyAxiosRequestConfig",
				"RemoveUrlMethod",
				"CreateAxiosRequestConfig",
			],
			type: true,
		},

		{
			from: "type-plus",
			imports: ["RequiredPick", "PartialPick"],
			type: true,
		},

		{
			"lodash-es": ["isUndefined", "isEmpty", "cloneDeep", "merge", "uniqueId"],
		},
	],
	ignore: ["vue-router"],
	dirs: [
		{
			glob: "src/**/*",
			types: true,
		},
	],
	dts: "./types/auto-imports.d.ts",
	resolvers: [ElementPlusResolver()],
});
