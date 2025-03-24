import { defineRuancatPresetTheme } from "@ruan-cat/vitepress-preset-config/theme";

import "./style.css";

// 全局导入element-plus组件 并全局注册
import elementplus from "element-plus";
import "element-plus/dist/index.css";

export default defineRuancatPresetTheme({
	enhanceAppCallBack({ app, router, siteData }) {
		app.use(elementplus);
	},
});
