import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStoreHook } from "./user";

/**
 * Store Hook 函数测试
 */
describe("useUserStoreHook", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		localStorage.clear();
	});

	it("should return a valid store instance", () => {
		const store = useUserStoreHook();

		// 验证：store 实例应该存在
		expect(store).toBeDefined();

		// 验证：store 应该有必要的属性
		expect(store).toHaveProperty("username");
		expect(store).toHaveProperty("roles");
		expect(store).toHaveProperty("permissions");
		expect(store).toHaveProperty("userInfo");
		expect(store).toHaveProperty("menus");
		expect(store).toHaveProperty("isLoaded");
	});

	it("should return the same store instance on multiple calls", () => {
		const store1 = useUserStoreHook();
		const store2 = useUserStoreHook();

		// 验证：多次调用应该返回同一个实例
		expect(store1).toBe(store2);
	});

	it("should have all required actions", () => {
		const store = useUserStoreHook();

		// 验证：store 应该有所有必要的 actions
		expect(store).toHaveProperty("SET_AVATAR");
		expect(store).toHaveProperty("SET_USERNAME");
		expect(store).toHaveProperty("SET_NICKNAME");
		expect(store).toHaveProperty("SET_ROLES");
		expect(store).toHaveProperty("SET_PERMS");
		expect(store).toHaveProperty("loginByUsername");
		expect(store).toHaveProperty("logOut");
		expect(store).toHaveProperty("handRefreshToken");
		expect(store).toHaveProperty("loadUser");
		expect(store).toHaveProperty("loadMenus");
		expect(store).toHaveProperty("setLoaded");
		expect(store).toHaveProperty("getToken");
		expect(store).toHaveProperty("getUser");
		expect(store).toHaveProperty("getMenus");

		// 验证：actions 应该是函数
		expect(typeof store.SET_AVATAR).toBe("function");
		expect(typeof store.SET_USERNAME).toBe("function");
		expect(typeof store.loginByUsername).toBe("function");
		expect(typeof store.logOut).toBe("function");
		expect(typeof store.loadUser).toBe("function");
		expect(typeof store.loadMenus).toBe("function");
	});

	it("should allow state modifications through the hook", () => {
		const store = useUserStoreHook();

		// 修改状态
		store.SET_USERNAME("testuser");
		store.SET_ROLES(["admin", "user"]);
		store.setLoaded(true);

		// 验证：状态应该被正确修改
		expect(store.username).toBe("testuser");
		expect(store.roles).toEqual(["admin", "user"]);
		expect(store.isLoaded).toBe(true);
	});

	it("should share state across different hook calls", () => {
		const store1 = useUserStoreHook();
		const store2 = useUserStoreHook();

		// 通过第一个 hook 修改状态
		store1.SET_USERNAME("testuser");
		store1.SET_ROLES(["admin"]);

		// 验证：第二个 hook 应该看到相同的状态
		expect(store2.username).toBe("testuser");
		expect(store2.roles).toEqual(["admin"]);
	});

	it("should work with Origin compatibility methods", () => {
		const store = useUserStoreHook();

		// 设置用户信息
		store.userInfo = {
			id: "1",
			username: "testuser",
			name: "Test User",
			email: "test@example.com",
			roles: ["admin"],
			permissions: ["read", "write"],
		};

		// 设置菜单
		store.menus = [
			{
				id: "1",
				parentId: null,
				name: "Dashboard",
				path: "/dashboard",
				order: 1,
				type: "menu",
			},
		];

		// 验证：Origin 兼容方法应该正常工作
		expect(store.getUser()).toEqual(store.userInfo);
		expect(store.getMenus()).toEqual(store.menus);
	});
});
