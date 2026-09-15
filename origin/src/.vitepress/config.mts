import {
	addChangelog2doc,
	setGenerateSidebar,
	setUserConfig,
	copyClaudeFiles,
} from "@ruan-cat/vitepress-preset-config/config";

import AutoImport from "../plugins/unplugin-auto-import/index.ts";
import tsAlias from "../plugins/vite-plugin-ts-alias/index.ts";

// 将根目录 .claude 下的 agents/commands/skills 复制到文档目录内。
// 注意：copyClaudeAgents 是幽灵 API，任何已发布版本的 preset-config 均只提供 copyClaudeFiles。
// vitepress 运行目录为 origin/，target 相对于该目录解析。
copyClaudeFiles({
	target: "src/docs/claude",
});

// 为文档添加自动生成的changelog
addChangelog2doc({
	// 设置changelog的目标文件夹
	target: "./src",
	// 设置changelog顶部的yaml数据。通常是排序
	data: {
		order: 1000,
		dir: {
			order: 1000,
		},
	},
});

const userConfig = setUserConfig({
	title: "10wms前端组技术文档",
	description: "本前端项目内的组件使用、api、类型以及使用文档",
	themeConfig: {
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/ruan-cat/10wms",
			},
		],
	},
});
// @ts-ignore
userConfig.themeConfig.sidebar = setGenerateSidebar({
	documentRootPath: "./src",
});
// @ts-ignore
userConfig.vite.plugins = [AutoImport, tsAlias, ...userConfig.vite.plugins];
export default userConfig;
