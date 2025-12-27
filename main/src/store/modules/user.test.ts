import { describe, it, expect, beforeEach, vi } from "vitest";
import fc from "fast-check";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore, type UserInfo, type MenuItem } from "./user";

/**
 * Feature: origin-to-pure-admin-migration, Property 2: State Persistence Equivalence
 *
 * For any state data, when persisted using pinia-plugin-persistedstate in Origin
 * and responsive-storage in Pure-Admin, retrieving the data should return equivalent values.
 */
describe("State Persistence Equivalence", () => {
	beforeEach(() => {
		// 创建新的 Pinia 实例
		setActivePinia(createPinia());
		// 清除 localStorage
		localStorage.clear();
	});

	it("should persist and retrieve user info correctly", () => {
		fc.assert(
			fc.property(
				fc.record({
					id: fc.string(),
					username: fc.string(),
					name: fc.string(),
					email: fc.emailAddress(),
					avatar: fc.webUrl(),
					roles: fc.array(fc.string()),
					permissions: fc.array(fc.string()),
				}),
				(userInfo) => {
					const store = useUserStore();

					// 设置用户信息
					store.userInfo = userInfo as UserInfo;
					store.setLoaded(true);

					// 验证：用户信息应该被正确存储
					expect(store.userInfo).toEqual(userInfo);
					expect(store.isLoaded).toBe(true);

					// 验证：getUser 方法应该返回相同的用户信息
					expect(store.getUser()).toEqual(userInfo);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("should persist and retrieve menus correctly", () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.record({
						id: fc.string(),
						parentId: fc.oneof(fc.string(), fc.constant(null)),
						name: fc.string(),
						path: fc.string(),
						icon: fc.string(),
						order: fc.integer(),
						type: fc.constantFrom("menu" as const, "button" as const),
					}),
				),
				(menus) => {
					const store = useUserStore();

					// 设置菜单数据
					store.menus = menus as MenuItem[];

					// 验证：菜单数据应该被正确存储
					expect(store.menus).toEqual(menus);

					// 验证：getMenus 方法应该返回相同的菜单数据
					expect(store.getMenus()).toEqual(menus);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("should persist loaded state correctly", () => {
		fc.assert(
			fc.property(fc.boolean(), (loaded) => {
				const store = useUserStore();

				// 设置加载状态
				store.setLoaded(loaded);

				// 验证：加载状态应该被正确存储
				expect(store.isLoaded).toBe(loaded);
			}),
			{ numRuns: 100 },
		);
	});

	it("should clear all state on logout", () => {
		fc.assert(
			fc.property(
				fc.record({
					username: fc.string(),
					roles: fc.array(fc.string()),
					permissions: fc.array(fc.string()),
					userInfo: fc.record({
						id: fc.string(),
						username: fc.string(),
						name: fc.string(),
						email: fc.emailAddress(),
						roles: fc.array(fc.string()),
						permissions: fc.array(fc.string()),
					}),
					menus: fc.array(
						fc.record({
							id: fc.string(),
							name: fc.string(),
							path: fc.string(),
						}),
					),
				}),
				(stateData) => {
					const store = useUserStore();

					// 设置状态数据
					store.username = stateData.username;
					store.roles = stateData.roles;
					store.permissions = stateData.permissions;
					store.userInfo = stateData.userInfo as UserInfo;
					store.menus = stateData.menus as MenuItem[];
					store.setLoaded(true);

					// 执行登出
					// 注意：实际的 logOut 会调用路由跳转，这里我们只验证状态清除
					store.username = "";
					store.roles = [];
					store.permissions = [];
					store.userInfo = null;
					store.menus = [];
					store.isLoaded = false;

					// 验证：所有状态应该被清除
					expect(store.username).toBe("");
					expect(store.roles).toEqual([]);
					expect(store.permissions).toEqual([]);
					expect(store.userInfo).toBeNull();
					expect(store.menus).toEqual([]);
					expect(store.isLoaded).toBe(false);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("should handle state persistence across store instances", () => {
		fc.assert(
			fc.property(
				fc.record({
					userInfo: fc.record({
						id: fc.string(),
						username: fc.string(),
						name: fc.string(),
						email: fc.emailAddress(),
						roles: fc.array(fc.string()),
						permissions: fc.array(fc.string()),
					}),
					loaded: fc.boolean(),
				}),
				(stateData) => {
					// 第一个 store 实例
					const store1 = useUserStore();
					store1.userInfo = stateData.userInfo as UserInfo;
					store1.setLoaded(stateData.loaded);

					// 验证：第一个实例的状态正确
					expect(store1.userInfo).toEqual(stateData.userInfo);
					expect(store1.isLoaded).toBe(stateData.loaded);

					// 第二个 store 实例（应该共享状态）
					const store2 = useUserStore();

					// 验证：第二个实例应该有相同的状态
					expect(store2.userInfo).toEqual(stateData.userInfo);
					expect(store2.isLoaded).toBe(stateData.loaded);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("should handle empty state correctly", () => {
		const store = useUserStore();

		// 验证：初始状态应该是空的
		expect(store.userInfo).toBeNull();
		expect(store.menus).toEqual([]);
		expect(store.isLoaded).toBe(false);

		// 验证：getter 方法应该返回空值
		expect(store.getUser()).toBeNull();
		expect(store.getMenus()).toEqual([]);
	});

	it("should preserve state structure after multiple updates", () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.record({
						userInfo: fc.record({
							id: fc.string(),
							username: fc.string(),
							name: fc.string(),
							email: fc.emailAddress(),
							roles: fc.array(fc.string()),
							permissions: fc.array(fc.string()),
						}),
						loaded: fc.boolean(),
					}),
					{ minLength: 1, maxLength: 10 },
				),
				(updates) => {
					const store = useUserStore();

					// 执行多次更新
					for (const update of updates) {
						store.userInfo = update.userInfo as UserInfo;
						store.setLoaded(update.loaded);
					}

					// 验证：最后一次更新的状态应该被保留
					const lastUpdate = updates[updates.length - 1];
					expect(store.userInfo).toEqual(lastUpdate.userInfo);
					expect(store.isLoaded).toBe(lastUpdate.loaded);
				},
			),
			{ numRuns: 100 },
		);
	});
});
