import { consola } from "consola";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

interface MigrationTask {
	id: string;
	name: string;
	type: "component" | "page" | "api" | "util" | "other";
	status: "pending" | "in-progress" | "completed" | "blocked";
	priority: "high" | "medium" | "low";
	assignee?: string;
	notes?: string;
	startTime?: string;
	endTime?: string;
	dependencies?: string[];
}

interface MigrationProgress {
	tasks: MigrationTask[];
	updatedAt: string;
}

const PROGRESS_FILE = join(process.cwd(), ".kiro", "specs", "origin-to-pure-admin-migration", "progress.json");

/** 加载进度数据 */
function loadProgress(): MigrationProgress {
	if (existsSync(PROGRESS_FILE)) {
		try {
			const content = readFileSync(PROGRESS_FILE, "utf-8");
			return JSON.parse(content);
		} catch (error) {
			consola.warn("读取进度文件失败，创建新的进度数据");
		}
	}

	return {
		tasks: [],
		updatedAt: new Date().toISOString(),
	};
}

/** 保存进度数据 */
function saveProgress(progress: MigrationProgress): void {
	progress.updatedAt = new Date().toISOString();
	writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), "utf-8");
}

/** 添加任务 */
function addTask(task: Omit<MigrationTask, "id">): void {
	const progress = loadProgress();
	const newTask: MigrationTask = {
		...task,
		id: `task-${Date.now()}`,
	};
	progress.tasks.push(newTask);
	saveProgress(progress);
	consola.success(`已添加任务: ${newTask.name}`);
}

/** 更新任务状态 */
function updateTaskStatus(taskId: string, status: MigrationTask["status"]): void {
	const progress = loadProgress();
	const task = progress.tasks.find((t) => t.id === taskId);

	if (!task) {
		consola.error(`未找到任务: ${taskId}`);
		return;
	}

	task.status = status;

	if (status === "in-progress" && !task.startTime) {
		task.startTime = new Date().toISOString();
	}

	if (status === "completed" && !task.endTime) {
		task.endTime = new Date().toISOString();
	}

	saveProgress(progress);
	consola.success(`已更新任务状态: ${task.name} -> ${status}`);
}

/** 显示进度统计 */
function showProgress(): void {
	const progress = loadProgress();

	const stats = {
		total: progress.tasks.length,
		pending: progress.tasks.filter((t) => t.status === "pending").length,
		inProgress: progress.tasks.filter((t) => t.status === "in-progress").length,
		completed: progress.tasks.filter((t) => t.status === "completed").length,
		blocked: progress.tasks.filter((t) => t.status === "blocked").length,
	};

	consola.box(
		`迁移进度统计\n\n` +
			`总任务数: ${stats.total}\n` +
			`待开始: ${stats.pending}\n` +
			`进行中: ${stats.inProgress}\n` +
			`已完成: ${stats.completed}\n` +
			`已阻塞: ${stats.blocked}\n\n` +
			`完成率: ${stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(2) : 0}%\n` +
			`更新时间: ${progress.updatedAt}`,
	);

	// 显示任务列表
	if (progress.tasks.length > 0) {
		consola.info("\n任务列表:");
		for (const task of progress.tasks) {
			const statusIcon = {
				pending: "⏳",
				"in-progress": "🔄",
				completed: "✅",
				blocked: "🚫",
			}[task.status];

			consola.info(`  ${statusIcon} [${task.priority}] ${task.name} (${task.type})`);
			if (task.notes) {
				consola.info(`     备注: ${task.notes}`);
			}
		}
	}
}

/** 主函数 */
function main() {
	const args = process.argv.slice(2);
	const command = args[0];

	switch (command) {
		case "add": {
			const name = args[1];
			const type = (args[2] as MigrationTask["type"]) || "other";
			const priority = (args[3] as MigrationTask["priority"]) || "medium";

			if (!name) {
				consola.error("请提供任务名称");
				return;
			}

			addTask({
				name,
				type,
				status: "pending",
				priority,
			});
			break;
		}

		case "update": {
			const taskId = args[1];
			const status = args[2] as MigrationTask["status"];

			if (!taskId || !status) {
				consola.error("请提供任务ID和状态");
				return;
			}

			updateTaskStatus(taskId, status);
			break;
		}

		case "show":
		default:
			showProgress();
			break;
	}
}

main();
