import { consola } from "consola";
import { readFileSync } from "fs";
import { join } from "path";

interface DependencyConflict {
	name: string;
	originVersion: string;
	mainVersion: string;
}

/** 检查依赖冲突 */
function checkDependencyConflicts(): DependencyConflict[] {
	const conflicts: DependencyConflict[] = [];

	try {
		// 读取 Origin 项目的 package.json
		const originPkgPath = join(process.cwd(), "origin", "package.json");
		const originPkg = JSON.parse(readFileSync(originPkgPath, "utf-8"));

		// 读取 Main 项目的 package.json
		const mainPkgPath = join(process.cwd(), "main", "package.json");
		const mainPkg = JSON.parse(readFileSync(mainPkgPath, "utf-8"));

		// 合并所有依赖
		const originDeps = {
			...originPkg.dependencies,
			...originPkg.devDependencies,
		};
		const mainDeps = {
			...mainPkg.dependencies,
			...mainPkg.devDependencies,
		};

		// 检查版本冲突
		for (const [name, originVersion] of Object.entries(originDeps)) {
			const mainVersion = mainDeps[name];
			if (mainVersion && originVersion !== mainVersion) {
				conflicts.push({
					name,
					originVersion: originVersion as string,
					mainVersion: mainVersion as string,
				});
			}
		}

		return conflicts;
	} catch (error) {
		consola.error("读取 package.json 失败:", error);
		return [];
	}
}

/** 生成 pnpm overrides 配置 */
function generateOverrides(conflicts: DependencyConflict[]): Record<string, string> {
	const overrides: Record<string, string> = {};

	for (const conflict of conflicts) {
		// 优先使用 Main 项目的版本
		overrides[conflict.name] = conflict.mainVersion;
	}

	return overrides;
}

/** 主函数 */
function main() {
	consola.start("开始检查依赖冲突...");

	const conflicts = checkDependencyConflicts();

	if (conflicts.length === 0) {
		consola.success("未发现依赖冲突！");
		return;
	}

	consola.warn(`发现 ${conflicts.length} 个依赖冲突:`);

	// 显示冲突详情
	for (const conflict of conflicts) {
		consola.info(`  ${conflict.name}:`);
		consola.info(`    Origin: ${conflict.originVersion}`);
		consola.info(`    Main:   ${conflict.mainVersion}`);
	}

	// 生成 overrides 配置
	const overrides = generateOverrides(conflicts);

	consola.box("建议的 pnpm.overrides 配置:\n\n" + JSON.stringify(overrides, null, 2));

	consola.info("\n请将以上配置添加到根目录 package.json 的 pnpm.overrides 字段中");
}

main();
