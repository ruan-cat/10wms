import type { App } from "vue";
import { auth } from "./auth";
import { perms } from "./perms";

/**
 * 注册全局指令
 * @param app Vue 应用实例
 */
export function setupDirectives(app: App) {
	// 注册 v-auth 指令（基于路由 meta.auths）
	app.directive("auth", auth);

	// 注册 v-perms 指令（基于用户 permissions）
	app.directive("perms", perms);
}
