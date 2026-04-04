// vercel-deploy-tool.config.ts (新文件名)
import { defineConfig } from "@ruan-cat/vercel-deploy-tool";
import { getDomains } from "@ruan-cat/domains";

export default defineConfig({
	// 01星球专门的vercel部署项目
	vercelProjectName: "01s-vercel",
	vercelOrgId: "team_cUeGw4TtOCLp0bbuH8kA7BYH",
	vercelProjectId: "prj_0dbaKzhoqP9C3A7C4QDkzjSprN2L",
	vercelToken: "",

	deployTargets: [
		// wms 主项目 预发布环境 静态写法
		{
			type: "static",
			targetCWD: "./origin",
			isNeedVercelBuild: false,
			url: getDomains("10wms"),
			watchPaths: [
				"origin/.env.development",
				"origin/.env.production",
				"origin/index.html",
				"origin/package.json",
				"origin/postcss.config.mjs",
				"origin/public/**",
				"origin/scripts/**",
				"origin/src/apis/**",
				"origin/src/assets/**",
				"origin/src/components/**",
				"origin/src/composables/**",
				"origin/src/App.vue",
				"origin/src/layouts/**",
				"origin/src/main.ts",
				"origin/src/plugins/**",
				"origin/src/routers/**",
				"origin/src/stores/**",
				"origin/src/tests/**",
				"origin/src/types/**",
				"origin/src/views/**",
				"origin/tsconfig.app.json",
				"origin/tsconfig.json",
				"origin/tsconfig.node.json",
				"origin/turbo.json",
				"origin/types/**",
				"origin/vite.config.ts",
				"package.json",
				"vercel-deploy-tool.config.ts",
				"vercel.404.json",
				"vercel.reverse-proxy.json",
			],
		},

		// wms 前端技术文档 静态写法
		{
			type: "static",
			targetCWD: "./origin/src/.vitepress/dist",
			url: getDomains("10wms-doc"),
			watchPaths: [
				"origin/package.json",
				"origin/src/.vitepress/**",
				"origin/src/docs/**",
				"origin/src/index.md",
				"origin/tsconfig.md.json",
				"package.json",
				"vercel-deploy-tool.config.ts",
			],
		},
	],
});
