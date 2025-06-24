// @ts-check

/**
 * 业务名称分类 由组长对业务名称划分，并提供英文命名规范
 *
 * 暂时不考虑用 i18n 来配置。
 *
 * 暂时不考虑拆分移植该配置。
 * @type { import("@ruan-cat/commitlint-config").ScopesItemWithDesc[] }
 */
const userScopes = [
	{
		code: "dialog-promise",
		value: "命令式弹框",
		desc: "命令式弹框",
	},

	{
		code: "table",
		value: "表格组件",
		desc: "简单表格组件",
	},

	{
		code: "dinamic-table-form",
		value: "动态表格样式表单",
		desc: "动态表格样式表单，可以动态增删表格行的表单",
	},

	{
		code: "base-form",
		value: "通用基础表单",
		desc: "base-form，通用基础表单，本项目内常用的，基础的表单组件。",
	},

	{
		code: "pagination",
		value: "分页栏组件",
		desc: "pagination，分页栏组件，即表格下常用的分页组件。",
	},

	{
		code: "daily-check",
		value: "每日检查",
		desc: "每日检查",
	},
];

module.exports = require("@ruan-cat/commitlint-config").getUserConfig({
	userScopes,
	config: {
		isPrintScopes: false,
	},
});
