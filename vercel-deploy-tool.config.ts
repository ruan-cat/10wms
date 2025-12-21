// vercel-deploy-tool.config.ts (新文件名)
import { defineConfig } from "@ruan-cat/vercel-deploy-tool";
import { domains } from "@ruan-cat/domains";

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
			url: domains["10wms"] as unknown as string[],
		},

		// wms 前端技术文档 静态写法
		{
			type: "static",
			targetCWD: "./origin/src/.vitepress/dist",
			url: domains["10wms-doc"] as unknown as string[],
		},
	],
});
