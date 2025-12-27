import { consola } from "consola";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

interface TransformOptions {
	transformImports?: boolean;
	transformStyles?: boolean;
	transformApi?: boolean;
}

/** 转换单个文件 */
function transformFile(filePath: string, options: TransformOptions): boolean {
	try {
		const ext = extname(filePath);

		// 只处理 .ts, .tsx, .vue, .js, .jsx 文件
		if (![".ts", ".tsx", ".vue", ".js", ".jsx"].includes(ext)) {
			return false;
		}

		let content = readFileSync(filePath, "utf-8");
		let modified = false;

		// 转换导入语句
		if (options.transformImports) {
			// 转换 axios 导入为 http 工具类
			if (content.includes("import axios") || content.includes("from 'axios'")) {
				content = content.replace(/import\s+axios\s+from\s+['"]axios['"]/g, "import { http } from '@/utils/http'");
				modified = true;
			}

			// 转换 pinia-plugin-persistedstate 为 responsive-storage
			if (content.includes("pinia-plugin-persistedstate")) {
				content = content.replace(
					/import.*pinia-plugin-persistedstate.*/g,
					"import { storageLocal } from '@pureadmin/utils'",
				);
				modified = true;
			}
		}

		// 转换 API 调用
		if (options.transformApi) {
			// 转换 axios 实例调用
			content = content.replace(/axios\.(get|post|put|delete|patch)/g, "http.$1");
			modified = true;
		}

		// 转换样式
		if (options.transformStyles) {
			// 这里可以添加样式转换逻辑
			// 例如：将某些 CSS 类转换为 Tailwind CSS 类
		}

		if (modified) {
			writeFileSync(filePath, content, "utf-8");
			return true;
		}

		return false;
	} catch (error) {
		consola.error(`转换文件失败: ${filePath}`, error);
		return false;
	}
}

/** 递归转换目录 */
function transformDirectory(dir: string, options: TransformOptions): number {
	let count = 0;

	try {
		const files = readdirSync(dir);

		for (const file of files) {
			const filePath = join(dir, file);
			const stat = statSync(filePath);

			if (stat.isDirectory()) {
				// 跳过 node_modules 和 dist 目录
				if (file === "node_modules" || file === "dist" || file === ".git") {
					continue;
				}
				count += transformDirectory(filePath, options);
			} else if (stat.isFile()) {
				if (transformFile(filePath, options)) {
					count++;
					consola.success(`已转换: ${filePath}`);
				}
			}
		}
	} catch (error) {
		consola.error(`转换目录失败: ${dir}`, error);
	}

	return count;
}

/** 主函数 */
function main() {
	const args = process.argv.slice(2);
	const targetDir = args[0] || "origin";

	const options: TransformOptions = {
		transformImports: true,
		transformStyles: false,
		transformApi: true,
	};

	consola.start(`开始转换代码: ${targetDir}`);

	const count = transformDirectory(targetDir, options);

	if (count > 0) {
		consola.success(`转换完成！共转换 ${count} 个文件`);
	} else {
		consola.info("未发现需要转换的文件");
	}
}

main();
