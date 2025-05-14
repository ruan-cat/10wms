import type { Config } from "@ruan-cat/vercel-deploy-tool/src/config.ts";
import { domains } from "@ruan-cat/domains";

// 这里使用的是阮喵喵的vercel账号
export default <Config>{
	// 01星球专门的vercel部署项目
	vercelProjetName: "01s-vercel",
	vercelOrgId: "team_cUeGw4TtOCLp0bbuH8kA7BYH",
	vercelProjectId: "prj_0dbaKzhoqP9C3A7C4QDkzjSprN2L",
	vercelToken: "",

	// 暂不需要反向代理
	// vercelJsonPath: "./vercel.reverse-proxy.json",
	// TODO: 处理项目的404页面显示，让vercel项目可以自己显示出404
	// vercelJsonPath: "./vercel.404.json",

	deployTargets: [
		// wms 主项目 预发布环境
		{
			type: "userCommands",
			targetCWD: "./origin",
			outputDirectory: "dist",
			url: domains["10wms"] as unknown as string[],
			userCommands: ["pnpm -C=./origin build"],
		},

		// wms 前端技术文档
		{
			type: "userCommands",
			targetCWD: ".origin/src",
			outputDirectory: ".vitepress/dist",
			// url: domains["10wms"] as unknown as string[],
			url: ["01s-10wms-frontend-docs.ruancat6312.top"],
			userCommands: ["pnpm -C=./origin docs:build"],
		},
	],
};
