import { cdn } from "./cdn";
import vue from "@vitejs/plugin-vue";
import { pathResolve } from "./utils";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import Icons from "unplugin-icons/vite";
import type { PluginOption, ConfigEnv } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import tailwindcss from "@tailwindcss/vite";
import { configCompressPlugin } from "./compress";
import removeNoMatch from "vite-plugin-router-warn";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { codeInspectorPlugin } from "code-inspector-plugin";
import { vitePluginFakeServer } from "vite-plugin-fake-server";

// 自动化路由插件
import VueRouter from "unplugin-vue-router/vite";
import { getRouteName } from "@ruan-cat/utils/unplugin-vue-router";

// 布局插件
import MetaLayouts from "vite-plugin-vue-meta-layouts";

// 自动导入插件
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { VueRouterAutoImports } from "unplugin-vue-router";

export function getPluginsList(
	VITE_CDN: boolean,
	VITE_COMPRESSION: ViteCompression,
	/**
	 * 模式
	 * @description
	 * 原框架没有 这里额外拓展的
	 */
	mode: ConfigEnv["mode"],
): PluginOption[] {
	const lifecycle = process.env.npm_lifecycle_event;
	return [
		tailwindcss(),

		/**
		 * 类型化路由插件
		 * @description
		 * 其定义位置必须在 `@vitejs/plugin-vue` 插件之前。
		 *
		 * @see https://uvr.esm.is/introduction.html#installation
		 */
		VueRouter({
			dts: "./types/typed-router.d.ts",
			routesFolder: [
				{
					/**
					 * 在我们项目中，页面放在 views 文件夹下。
					 * 文档建议是写在pages内
					 * src: "src/pages",
					 */
					// TODO: 做出自定义配置
					src: "src/views",
					exclude: [
						// TODO: 做出自定义配置
						...[
							// 全部的components文件夹都不需要生成路由
							"**/components",
							// status菜单栏下面的全部页面 不生成自动路由
							"src/views/status/**",
						],
						/**
						 * 自动路由组件的忽略配置
						 * 如果是生产环境模式，就排除掉多余的案例组件
						 */
						// TODO: 做出自定义配置
						...(mode === "production" ? ["src/views/sample/**"] : []),
					],
				},
			],
			getRouteName,
		}),

		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag === "deep-chat",
				},
			},
		}),

		/** @see https://github.com/dishait/vite-plugin-vue-meta-layouts/blob/main/README_EN.md#config */
		MetaLayouts(),

		/** 自动导入插件 */
		AutoImport({
			imports: [
				VueRouterAutoImports,
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

				// import { RequiredPick, PartialPick } from "type-plus";
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

			// TODO: 稍后补充安装element-plus
			// resolvers: [ElementPlusResolver()],
		}),

		// jsx、tsx语法支持
		vueJsx(),
		VueI18nPlugin({
			include: [pathResolve("../locales/**")],
		}),
		/**
		 * 在页面上按住组合键时，鼠标在页面移动即会在 DOM 上出现遮罩层并显示相关信息，点击一下将自动打开 IDE 并将光标定位到元素对应的代码位置
		 * Mac 默认组合键 Option + Shift
		 * Windows 默认组合键 Alt + Shift
		 * 更多用法看 https://inspector.fe-dev.cn/guide/start.html
		 */
		codeInspectorPlugin({
			bundler: "vite",
			hideConsole: true,
		}),
		viteBuildInfo(),
		/**
		 * 开发环境下移除非必要的vue-router动态路由警告No match found for location with path
		 * 非必要具体看 https://github.com/vuejs/router/issues/521 和 https://github.com/vuejs/router/issues/359
		 * vite-plugin-router-warn只在开发环境下启用，只处理vue-router文件并且只在服务启动或重启时运行一次，性能消耗可忽略不计
		 */
		removeNoMatch(),
		// mock支持
		vitePluginFakeServer({
			logger: false,
			include: "mock",
			infixName: false,
			enableProd: true,
		}),
		// svg组件化支持
		svgLoader(),
		// 自动按需加载图标
		Icons({
			compiler: "vue3",
			scale: 1,
		}),
		VITE_CDN ? cdn : null,
		configCompressPlugin(VITE_COMPRESSION),
		// 线上环境删除console
		removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
		// 打包分析
		lifecycle === "report" ? visualizer({ open: true, brotliSize: true, filename: "report.html" }) : (null as any),
	];
}
