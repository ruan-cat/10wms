# 2025-12-26 迁移工具和脚本

## 1. 迁移工具概述

为了提高迁移效率，我们需要创建一系列自动化工具来辅助迁移过程。

## 2. 依赖检查工具

### 2.1 检查依赖冲突

```typescript
// scripts/migration/check-dependencies.ts
import { readFileSync } from "fs";
import { resolve } from "path";
import consola from "consola";

interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

/** 读取 package.json */
function readPackageJson(path: string): PackageJson {
	const content = readFileSync(path, "utf-8");
	return JSON.parse(content);
}

/** 检查依赖冲突 */
function checkDependencyConflicts() {
	const originPkg = readPackageJson(resolve(__dirname, "../../origin/package.json"));
	const mainPkg = readPackageJson(resolve(__dirname, "../../main/package.json"));

	const conflicts: Array<{
		name: string;
		originVersion: string;
		mainVersion: string;
	}> = [];

	// 检查 dependencies
	const allDeps = new Set([...Object.keys(originPkg.dependencies || {}), ...Object.keys(mainPkg.dependencies || {})]);

	for (const dep of allDeps) {
		const originVersion = originPkg.dependencies?.[dep];
		const mainVersion = mainPkg.dependencies?.[dep];

		if (originVersion && mainVersion && originVersion !== mainVersion) {
			conflicts.push({
				name: dep,
				originVersion,
				mainVersion,
			});
		}
	}

	// 输出结果
	if (conflicts.length === 0) {
		consola.success("没有发现依赖冲突");
	} else {
		consola.warn(`发现 ${conflicts.length} 个依赖冲突：`);
		conflicts.forEach(({ name, originVersion, mainVersion }) => {
			consola.info(`  ${name}:`);
			consola.info(`    Origin: ${originVersion}`);
			consola.info(`    Main: ${mainVersion}`);
		});
	}

	return conflicts;
}

/** 生成 overrides 配置 */
function generateOverrides(conflicts: Array<{ name: string; mainVersion: string }>) {
	const overrides: Record<string, string> = {};

	conflicts.forEach(({ name, mainVersion }) => {
		overrides[name] = mainVersion;
	});

	consola.box("建议的 pnpm overrides 配置：");
	console.log(JSON.stringify({ pnpm: { overrides } }, null, 2));
}

// 执行检查
const conflicts = checkDependencyConflicts();
if (conflicts.length > 0) {
	generateOverrides(conflicts);
}
```

### 2.2 检查缺失依赖

```typescript
// scripts/migration/check-missing-deps.ts
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join } from "path";
import consola from "consola";

/** 从文件中提取 import 语句 */
function extractImports(content: string): string[] {
	const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
	const imports: string[] = [];
	let match;

	while ((match = importRegex.exec(content)) !== null) {
		const importPath = match[1];
		// 只关注 npm 包，忽略相对路径
		if (!importPath.startsWith(".") && !importPath.startsWith("@/")) {
			// 提取包名（处理 @scope/package 的情况）
			const packageName = importPath.startsWith("@")
				? importPath.split("/").slice(0, 2).join("/")
				: importPath.split("/")[0];
			imports.push(packageName);
		}
	}

	return imports;
}

/** 递归扫描目录 */
function scanDirectory(dir: string, extensions: string[] = [".ts", ".tsx", ".vue", ".js", ".jsx"]): string[] {
	const files: string[] = [];

	function scan(currentDir: string) {
		const items = readdirSync(currentDir);

		for (const item of items) {
			const fullPath = join(currentDir, item);
			const stat = statSync(fullPath);

			if (stat.isDirectory()) {
				// 忽略 node_modules 和 dist
				if (item !== "node_modules" && item !== "dist") {
					scan(fullPath);
				}
			} else if (stat.isFile()) {
				const ext = item.substring(item.lastIndexOf("."));
				if (extensions.includes(ext)) {
					files.push(fullPath);
				}
			}
		}
	}

	scan(dir);
	return files;
}

/** 检查缺失依赖 */
function checkMissingDependencies() {
	const originSrc = resolve(__dirname, "../../origin/src");
	const mainPkg = JSON.parse(readFileSync(resolve(__dirname, "../../main/package.json"), "utf-8"));

	const allDeps = {
		...mainPkg.dependencies,
		...mainPkg.devDependencies,
	};

	// 扫描 origin 项目的所有文件
	const files = scanDirectory(originSrc);
	const usedPackages = new Set<string>();

	files.forEach((file) => {
		const content = readFileSync(file, "utf-8");
		const imports = extractImports(content);
		imports.forEach((pkg) => usedPackages.add(pkg));
	});

	// 检查缺失的依赖
	const missingDeps: string[] = [];
	usedPackages.forEach((pkg) => {
		if (!allDeps[pkg]) {
			missingDeps.push(pkg);
		}
	});

	// 输出结果
	if (missingDeps.length === 0) {
		consola.success("没有发现缺失的依赖");
	} else {
		consola.warn(`发现 ${missingDeps.length} 个缺失的依赖：`);
		missingDeps.forEach((dep) => {
			consola.info(`  - ${dep}`);
		});

		consola.box("建议执行：");
		console.log(`pnpm add ${missingDeps.join(" ")}`);
	}
}

checkMissingDependencies();
```

## 3. 代码转换工具

### 3.1 转换导入路径

```typescript
// scripts/migration/transform-imports.ts
import { readFileSync, writeFileSync } from "fs";
import consola from "consola";

/** 导入路径映射 */
const importMappings: Record<string, string> = {
	// API 路径
	"@/apis/": "@/api/",
	// 工具函数路径
	"@/composables/": "@/utils/",
	// 布局路径
	"@/layouts/": "@/layout/",
	// 路由路径
	"@/routers/": "@/router/",
	// 状态管理路径
	"@/stores/": "@/store/",
};

/** 转换文件中的导入路径 */
function transformImports(filePath: string): boolean {
	let content = readFileSync(filePath, "utf-8");
	let changed = false;

	// 转换导入路径
	for (const [oldPath, newPath] of Object.entries(importMappings)) {
		const regex = new RegExp(oldPath.replace(/\//g, "\\/"), "g");
		if (regex.test(content)) {
			content = content.replace(regex, newPath);
			changed = true;
		}
	}

	// 如果有修改，写回文件
	if (changed) {
		writeFileSync(filePath, content, "utf-8");
		consola.success(`已转换: ${filePath}`);
	}

	return changed;
}

/** 批量转换目录 */
function transformDirectory(dir: string) {
	const files = scanDirectory(dir);
	let count = 0;

	files.forEach((file) => {
		if (transformImports(file)) {
			count++;
		}
	});

	consola.box(`转换完成，共修改 ${count} 个文件`);
}

// 使用示例
// transformDirectory(resolve(__dirname, "../../main/src"));
```

### 3.2 转换 API 调用

```typescript
// scripts/migration/transform-api.ts
import { readFileSync, writeFileSync } from "fs";
import consola from "consola";

/** 转换 axios 调用为 Pure-Admin 的 http 工具 */
function transformApiCalls(filePath: string): boolean {
	let content = readFileSync(filePath, "utf-8");
	let changed = false;

	// 转换 axios 导入
	if (content.includes("import axios from")) {
		content = content.replace(/import axios from ['"]axios['"]/g, 'import { http } from "@/utils/http"');
		changed = true;
	}

	// 转换 axios 实例导入
	if (content.includes("import { axiosInstance }")) {
		content = content.replace(/import { axiosInstance } from ['"].*?['"]/g, 'import { http } from "@/utils/http"');
		changed = true;
	}

	// 转换 GET 请求
	content = content.replace(/axios\.get\((.*?)\)/g, "http.get($1)");
	content = content.replace(/axiosInstance\.get\((.*?)\)/g, "http.get($1)");

	// 转换 POST 请求
	content = content.replace(/axios\.post\((.*?)\)/g, "http.post($1)");
	content = content.replace(/axiosInstance\.post\((.*?)\)/g, "http.post($1)");

	// 转换 PUT 请求
	content = content.replace(/axios\.put\((.*?)\)/g, "http.put($1)");
	content = content.replace(/axiosInstance\.put\((.*?)\)/g, "http.put($1)");

	// 转换 DELETE 请求
	content = content.replace(/axios\.delete\((.*?)\)/g, "http.delete($1)");
	content = content.replace(/axiosInstance\.delete\((.*?)\)/g, "http.delete($1)");

	if (changed) {
		writeFileSync(filePath, content, "utf-8");
		consola.success(`已转换 API 调用: ${filePath}`);
	}

	return changed;
}
```

### 3.3 转换样式

```typescript
// scripts/migration/transform-styles.ts
import { readFileSync, writeFileSync } from "fs";
import consola from "consola";

/** CSS 到 Tailwind 的映射 */
const styleMappings: Record<string, string> = {
	"padding: 20px": "p-5",
	"margin: 20px": "m-5",
	"background: #fff": "bg-white",
	"border-radius: 4px": "rounded",
	"display: flex": "flex",
	"justify-content: center": "justify-center",
	"align-items: center": "items-center",
	"flex-direction: column": "flex-col",
	"width: 100%": "w-full",
	"height: 100%": "h-full",
};

/** 转换样式为 Tailwind */
function transformStyles(filePath: string): boolean {
	let content = readFileSync(filePath, "utf-8");
	let changed = false;

	// 提取 style 标签内容
	const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
	let match;

	while ((match = styleRegex.exec(content)) !== null) {
		const styleContent = match[1];
		let newStyleContent = styleContent;

		// 转换样式
		for (const [cssStyle, tailwindClass] of Object.entries(styleMappings)) {
			if (newStyleContent.includes(cssStyle)) {
				// 这里只是示例，实际转换需要更复杂的逻辑
				consola.info(`发现可转换样式: ${cssStyle} -> ${tailwindClass}`);
				changed = true;
			}
		}
	}

	return changed;
}

/** 生成样式转换报告 */
function generateStyleReport(dir: string) {
	const files = scanDirectory(dir, [".vue"]);
	const report: Array<{
		file: string;
		styles: string[];
	}> = [];

	files.forEach((file) => {
		const content = readFileSync(file, "utf-8");
		const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
		let match;

		while ((match = styleRegex.exec(content)) !== null) {
			const styleContent = match[1];
			const convertibleStyles: string[] = [];

			for (const cssStyle of Object.keys(styleMappings)) {
				if (styleContent.includes(cssStyle)) {
					convertibleStyles.push(cssStyle);
				}
			}

			if (convertibleStyles.length > 0) {
				report.push({
					file,
					styles: convertibleStyles,
				});
			}
		}
	});

	// 输出报告
	consola.box("样式转换报告");
	report.forEach(({ file, styles }) => {
		consola.info(`文件: ${file}`);
		styles.forEach((style) => {
			consola.info(`  - ${style} -> ${styleMappings[style]}`);
		});
	});
}
```

## 4. 组件迁移工具

### 4.1 组件迁移脚本

```typescript
// scripts/migration/migrate-component.ts
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import consola from "consola";

interface MigrateOptions {
	/** 源文件路径 */
	source: string;
	/** 目标文件路径 */
	target: string;
	/** 是否转换导入路径 */
	transformImports?: boolean;
	/** 是否转换样式 */
	transformStyles?: boolean;
}

/** 迁移组件 */
function migrateComponent(options: MigrateOptions) {
	const { source, target, transformImports = true, transformStyles = false } = options;

	// 确保目标目录存在
	const targetDir = dirname(target);
	if (!existsSync(targetDir)) {
		mkdirSync(targetDir, { recursive: true });
	}

	// 复制文件
	copyFileSync(source, target);
	consola.success(`已复制: ${source} -> ${target}`);

	// 转换导入路径
	if (transformImports) {
		transformImports(target);
	}

	// 转换样式
	if (transformStyles) {
		transformStyles(target);
	}
}

/** 批量迁移组件 */
function migrateComponents(components: MigrateOptions[]) {
	consola.start(`开始迁移 ${components.length} 个组件...`);

	components.forEach((component, index) => {
		consola.info(`[${index + 1}/${components.length}] 迁移组件: ${component.source}`);
		migrateComponent(component);
	});

	consola.success("组件迁移完成！");
}

// 使用示例
const componentsToMigrate: MigrateOptions[] = [
	{
		source: resolve(__dirname, "../../origin/src/components/base-form/index.vue"),
		target: resolve(__dirname, "../../main/src/components/BaseForm/index.vue"),
		transformImports: true,
		transformStyles: true,
	},
	{
		source: resolve(__dirname, "../../origin/src/components/table/index.vue"),
		target: resolve(__dirname, "../../main/src/components/Table/index.vue"),
		transformImports: true,
		transformStyles: true,
	},
];

// migrateComponents(componentsToMigrate);
```

### 4.2 页面迁移脚本

```typescript
// scripts/migration/migrate-page.ts
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, join, dirname } from "path";
import consola from "consola";

interface MigratePageOptions {
	/** 源目录 */
	sourceDir: string;
	/** 目标目录 */
	targetDir: string;
	/** 是否递归 */
	recursive?: boolean;
}

/** 迁移页面 */
function migratePage(options: MigratePageOptions) {
	const { sourceDir, targetDir, recursive = true } = options;

	// 确保目标目录存在
	if (!existsSync(targetDir)) {
		mkdirSync(targetDir, { recursive: true });
	}

	// 读取源目录
	const items = readdirSync(sourceDir);

	items.forEach((item) => {
		const sourcePath = join(sourceDir, item);
		const targetPath = join(targetDir, item);
		const stat = statSync(sourcePath);

		if (stat.isDirectory()) {
			if (recursive) {
				migratePage({
					sourceDir: sourcePath,
					targetDir: targetPath,
					recursive,
				});
			}
		} else if (stat.isFile()) {
			// 复制文件
			const targetFileDir = dirname(targetPath);
			if (!existsSync(targetFileDir)) {
				mkdirSync(targetFileDir, { recursive: true });
			}

			copyFileSync(sourcePath, targetPath);
			consola.success(`已复制: ${sourcePath} -> ${targetPath}`);

			// 转换文件
			transformImports(targetPath);
			transformApiCalls(targetPath);
		}
	});
}

// 使用示例
const pagesToMigrate = [
	{
		sourceDir: resolve(__dirname, "../../origin/src/views/system-manage/user-management"),
		targetDir: resolve(__dirname, "../../main/src/views/system/user"),
	},
	{
		sourceDir: resolve(__dirname, "../../origin/src/views/system-manage/role-management"),
		targetDir: resolve(__dirname, "../../main/src/views/system/role"),
	},
];

// pagesToMigrate.forEach(migratePage);
```

## 5. API 迁移工具

### 5.1 API 文件迁移

```typescript
// scripts/migration/migrate-api.ts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import consola from "consola";

interface ApiModule {
	/** 模块名称 */
	name: string;
	/** 源文件路径 */
	source: string;
	/** 目标文件路径 */
	target: string;
}

/** 迁移 API 文件 */
function migrateApiFile(module: ApiModule) {
	const { name, source, target } = module;

	consola.start(`迁移 API 模块: ${name}`);

	// 读取源文件
	let content = readFileSync(source, "utf-8");

	// 转换导入路径
	content = content.replace(/@\/apis\//g, "@/api/");
	content = content.replace(/from ['"]\.\.\/request['"]/g, 'from "@/utils/http"');

	// 转换 axios 调用
	content = content.replace(/import axios from ['"]axios['"]/g, 'import { http } from "@/utils/http"');
	content = content.replace(/axios\./g, "http.");

	// 确保目标目录存在
	const targetDir = dirname(target);
	if (!existsSync(targetDir)) {
		mkdirSync(targetDir, { recursive: true });
	}

	// 写入目标文件
	writeFileSync(target, content, "utf-8");

	consola.success(`已迁移: ${source} -> ${target}`);
}

/** 批量迁移 API */
function migrateApis(modules: ApiModule[]) {
	consola.box(`开始迁移 ${modules.length} 个 API 模块`);

	modules.forEach((module, index) => {
		consola.info(`[${index + 1}/${modules.length}]`);
		migrateApiFile(module);
	});

	consola.success("API 迁移完成！");
}

// 使用示例
const apiModules: ApiModule[] = [
	{
		name: "用户管理",
		source: resolve(__dirname, "../../origin/src/apis/sys-manager/user.ts"),
		target: resolve(__dirname, "../../main/src/api/system/user.ts"),
	},
	{
		name: "角色管理",
		source: resolve(__dirname, "../../origin/src/apis/sys-manager/role.ts"),
		target: resolve(__dirname, "../../main/src/api/system/role.ts"),
	},
];

// migrateApis(apiModules);
```

## 6. 迁移进度跟踪

### 6.1 进度跟踪工具

```typescript
// scripts/migration/track-progress.ts
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import consola from "consola";

interface MigrationTask {
	/** 任务 ID */
	id: string;
	/** 任务名称 */
	name: string;
	/** 任务类型 */
	type: "component" | "page" | "api" | "util" | "other";
	/** 任务状态 */
	status: "pending" | "in-progress" | "completed" | "blocked";
	/** 优先级 */
	priority: "high" | "medium" | "low";
	/** 负责人 */
	assignee?: string;
	/** 备注 */
	notes?: string;
}

interface MigrationProgress {
	/** 任务列表 */
	tasks: MigrationTask[];
	/** 更新时间 */
	updatedAt: string;
}

const progressFile = resolve(__dirname, "../../migration-progress.json");

/** 加载进度 */
function loadProgress(): MigrationProgress {
	if (existsSync(progressFile)) {
		const content = readFileSync(progressFile, "utf-8");
		return JSON.parse(content);
	}

	return {
		tasks: [],
		updatedAt: new Date().toISOString(),
	};
}

/** 保存进度 */
function saveProgress(progress: MigrationProgress) {
	progress.updatedAt = new Date().toISOString();
	writeFileSync(progressFile, JSON.stringify(progress, null, 2), "utf-8");
	consola.success("进度已保存");
}

/** 添加任务 */
function addTask(task: Omit<MigrationTask, "id">) {
	const progress = loadProgress();
	const id = `task-${Date.now()}`;

	progress.tasks.push({
		id,
		...task,
	});

	saveProgress(progress);
	consola.success(`已添加任务: ${task.name}`);
}

/** 更新任务状态 */
function updateTaskStatus(taskId: string, status: MigrationTask["status"]) {
	const progress = loadProgress();
	const task = progress.tasks.find((t) => t.id === taskId);

	if (task) {
		task.status = status;
		saveProgress(progress);
		consola.success(`已更新任务状态: ${task.name} -> ${status}`);
	} else {
		consola.error(`任务不存在: ${taskId}`);
	}
}

/** 显示进度统计 */
function showProgress() {
	const progress = loadProgress();
	const total = progress.tasks.length;
	const completed = progress.tasks.filter((t) => t.status === "completed").length;
	const inProgress = progress.tasks.filter((t) => t.status === "in-progress").length;
	const pending = progress.tasks.filter((t) => t.status === "pending").length;
	const blocked = progress.tasks.filter((t) => t.status === "blocked").length;

	consola.box("迁移进度统计");
	consola.info(`总任务数: ${total}`);
	consola.info(`已完成: ${completed} (${((completed / total) * 100).toFixed(2)}%)`);
	consola.info(`进行中: ${inProgress}`);
	consola.info(`待开始: ${pending}`);
	consola.info(`已阻塞: ${blocked}`);

	// 按类型统计
	consola.box("按类型统计");
	const types = ["component", "page", "api", "util", "other"] as const;
	types.forEach((type) => {
		const tasks = progress.tasks.filter((t) => t.type === type);
		const completedTasks = tasks.filter((t) => t.status === "completed");
		consola.info(`${type}: ${completedTasks.length}/${tasks.length}`);
	});
}

// 使用示例
// addTask({
//   name: "迁移用户管理页面",
//   type: "page",
//   status: "pending",
//   priority: "high",
// });

// showProgress();
```

## 7. 使用说明

### 7.1 安装依赖

```bash
# 在项目根目录执行
pnpm add -D tsx consola
```

### 7.2 运行工具

```bash
# 检查依赖冲突
tsx scripts/migration/check-dependencies.ts

# 检查缺失依赖
tsx scripts/migration/check-missing-deps.ts

# 转换导入路径
tsx scripts/migration/transform-imports.ts

# 迁移组件
tsx scripts/migration/migrate-component.ts

# 迁移页面
tsx scripts/migration/migrate-page.ts

# 迁移 API
tsx scripts/migration/migrate-api.ts

# 查看进度
tsx scripts/migration/track-progress.ts
```

### 7.3 配置 package.json

```json
{
	"scripts": {
		"migration:check-deps": "tsx scripts/migration/check-dependencies.ts",
		"migration:check-missing": "tsx scripts/migration/check-missing-deps.ts",
		"migration:transform": "tsx scripts/migration/transform-imports.ts",
		"migration:component": "tsx scripts/migration/migrate-component.ts",
		"migration:page": "tsx scripts/migration/migrate-page.ts",
		"migration:api": "tsx scripts/migration/migrate-api.ts",
		"migration:progress": "tsx scripts/migration/track-progress.ts"
	}
}
```

## 8. 注意事项

### 8.1 使用前备份

在运行任何迁移工具前，请确保：

1. 代码已提交到 Git
2. 创建了备份分支
3. 了解工具的作用

### 8.2 逐步验证

每次运行工具后：

1. 检查修改的文件
2. 运行测试
3. 手动验证功能
4. 提交代码

### 8.3 工具限制

这些工具只能处理常见的迁移场景，对于复杂的情况需要手动处理：

1. 复杂的组件逻辑
2. 特殊的样式处理
3. 业务逻辑调整
4. 性能优化

## 9. 总结

这些迁移工具可以大大提高迁移效率，但不能完全自动化迁移过程。建议：

1. **先小范围测试**: 在少量文件上测试工具
2. **逐步推进**: 按模块逐步迁移
3. **充分测试**: 每次迁移后都要测试
4. **及时调整**: 根据实际情况调整工具和策略
