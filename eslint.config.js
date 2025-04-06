// @ts-check
import antfu from "@antfu/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default antfu(
	{
		// 基础样式规则
		stylistic: {
			indent: 2,
			quotes: "double",
			semi: true,
		},

		// TypeScript 配置
		typescript: {
			tsconfigPath: "./tsconfig.json",
			parserOptions: {
				project: "tsconfig.json",
				sourceType: "module",
				// tsconfigRootDir: __dirname,
			},
		},

		// Vue 支持
		vue: true,

		// JavaScript 配置
		javascript: {
			overrides: {
				"jsdoc/require-description": "error",
				"jsdoc/check-values": "error",
			},
		},

		// 禁用 jsonc 和 yaml
		jsonc: false,
		yaml: false,

		// 忽略文件
		ignores: ["**/fixtures", "dist", "node_modules", "public"],

		// 格式化工具配置
		formatters: {
			css: true,
			html: true,
			markdown: "prettier",
		},
	},

	// 自定义规则
	{
		rules: {
			// JavaScript
			"no-console": "off",
			"no-debugger": "off",
			"no-alert": "off",
			"no-unused-vars": "off",
			"no-undef": "off",
			"no-unused-expressions": "off",
			"no-restricted-syntax": "off",

			// Vue
			"vue/no-mutating-props": ["error"],
			"vue/multi-word-component-names": "off",
			"vue/attribute-hyphenation": "off",
			"vue/attributes-order": "off",

			// TypeScript
			"@typescript-eslint/no-explicit-any": "off",
		},
	},

	// Prettier 配置
	{
		rules: {
			"prettier/prettier": [
				"error",
				{
					usePrettierrc: true,
					singleQuote: false,
					printWidth: 120,
					semi: true,
					jsxSingleQuote: true,
					useTabs: true,
					tabWidth: 2,
					endOfLine: "auto",
				},
			],
		},
	},

	// 合并 Prettier
	eslintConfigPrettier,
	eslintPluginPrettierRecommended,
);
