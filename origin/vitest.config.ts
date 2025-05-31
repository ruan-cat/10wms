import { fileURLToPath } from "node:url";

import AutoImport from "unplugin-auto-import/vite";
import tsAlias from "vite-plugin-ts-alias";

import { configDefaults, defineConfig } from "vitest/config";
import { loadEnv } from "vite";

// 提供类型声明 便于得到使用提示
const env = loadEnv("development", process.cwd()) as unknown as ImportMetaEnv;
const VITE_PROXY_PREFIX = env.VITE_PROXY_PREFIX;
const VITE_BASE_URL = env.VITE_BASE_URL;

// 定义测试配置
const testConfig = defineConfig({
	test: {
		environment: "jsdom",
		exclude: [...configDefaults.exclude, "e2e/**"],
		root: fileURLToPath(new URL("./", import.meta.url)),
	},

	// 测试框架 不使用任何反向代理的配置
	// server: {
	// 	proxy: {
	// 		// 对特定前缀的请求地址 做反向代理
	// 		[VITE_PROXY_PREFIX]: {
	// 			changeOrigin: true,
	// 			target: VITE_BASE_URL,
	// 			rewrite: (path) => path.replace(new RegExp("^" + VITE_PROXY_PREFIX), ""),
	// 		},
	// 	},
	// },

	plugins: [
		AutoImport({
			imports: [
				// VueRouterAutoImports,
				"@vueuse/core",
				"vue",
				"pinia",
				{
					"@vueuse/integrations/useAxios": ["useAxios"],
				},
				{
					"@ruan-cat/utils": ["isConditionsEvery", "isConditionsSome"],
				},
				{
					from: "@ruan-cat/utils",
					imports: ["Prettify", "ToNumberLike"],
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
			// resolvers: [ElementPlusResolver()],
		}),

		tsAlias({
			/**
			 * tsconfig name, optional.
			 * @default 'tsconfig.json'
			 */
			tsConfigName: "tsconfig.app.json",
		}),
	],
});

// 导出合并后的配置
export default defineConfig(({ mode }) => {
	/**
	 * 暂不考虑从vite内获取配置 目前vite允许导入ts文件，而vitest却不允许
	 * @see https://cn.vitejs.dev/config/#configuring-vite
	 * 故目前vitest不导入vite配置。
	 */

	// @ts-ignore
	// return mergeConfig(testConfig, viteConfig({ mode }));
	return testConfig;
});
