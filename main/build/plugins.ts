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

// 开发调试插件
import vueDevTools from "vite-plugin-vue-devtools";
import consola from "consola";

import { isEmpty } from "lodash-es";
import { isConditionsEvery } from "@ruan-cat/utils";

/** @see https://uvr.esm.is/guide/extending-routes.html#extending-routes-in-config */
async function extendRoute(route) {
	type EditableTreeNode = typeof route;
	// consola.log("  extendRoute = ", route);

	// if (route.path === "") {
	// 	route.path = `${route.fullPath}/index`;
	// } else {
	// 	route.path = `${route.fullPath}`;
	// }

	/** 生成含有index尾缀的路径 */
	function makeIndexSuffixPath(path: string) {
		return `${path}/index`;
	}

	function hasOnlyOneChild(route: EditableTreeNode) {
		return route?.children?.length === 1;
	}

	function hasParent(route: EditableTreeNode) {
		return !isEmpty(route?.parent);
	}

	// 当前路由下面只有一个子路由？
	if (hasOnlyOneChild(route)) {
		const currentPath = route.path;
		const redirectPath = makeIndexSuffixPath(currentPath);
		// 警告 无法实现 不提供该属性来设置
		// route.redirect = redirectPath;
		route.path = route.fullPath;
	}

	// 当前路由有父级 且 父级只有一个子路由
	if (hasParent(route) && hasOnlyOneChild(route?.parent)) {
		const parent = route.parent;
		const parentPath = parent.fullPath;
		route.path = makeIndexSuffixPath(parentPath);
	}

	// route.path = `${route.fullPath}`;

	route.addToMeta({
		title: "默认标题（VueRouter）",
		icon: "solar:question-circle-bold",
	});

	consola.warn("  extendRoute = ", route.fullPath);
}

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
		 * 布局插件
		 * @description 注意到布局插件源码demo的写法 这里把布局组件移动到 `路由插件` 上面。
		 * @see https://vscode.dev/github/dishait/vite-plugin-vue-meta-layouts/blob/main/examples/unplugin-vue-router/vite.config.ts#L11-L17
		 * @see https://vscode.dev/github/dishait/vite-plugin-vue-meta-layouts/blob/main/examples/vite-plugin-pages/vite.config.ts#L8
		 *
		 * @see https://github.com/dishait/vite-plugin-vue-meta-layouts/blob/main/README_EN.md#config
		 */
		MetaLayouts({
			// 本项目的路由文件夹名称为 layout
			target: "src/layout",
			// 为了避免影响其他地方 故设置默认布局的名称为 index
			defaultLayout: "index",
			skipTopLevelRouteLayout: true,
			/**
			 * 忽略掉全部 components 文件夹下面的组件 避免识别成布局组件
			 * @see https://vscode.dev/github/dishait/vite-plugin-vue-meta-layouts/blob/main/examples/unplugin-vue-router/vite.config.ts#L13
			 */
			excludes: ["**/components/**/*.vue"],
		}),

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
					// src: "src/views/10wms",
					// src: "src/views",
					src: "src/pages",
					// 目前不需要路由前缀来区分标识了
					// path: "10wms-pages-",
					// path: "/10wms-pages-",
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
			// extendRoute
		}),

		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag === "deep-chat",
				},
			},
		}),

		/**
		 * 开发调试插件
		 * @description
		 * vueDevTools 必须在 createHtmlPlugin 的前面导入
		 *
		 * @see https://devtools.vuejs.org/help/troubleshooting#devtools-vite-plugin-doesn-t-render-as-expected
		 * @see https://github.com/vuejs/devtools/issues/278#issuecomment-2167415057
		 */
		vueDevTools(),

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
			ignore: ["vue-router", "src/views/**/svg/**"],
			dirs: [
				{
					glob: "src/**/*,!src/views/**/svg/**",
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
