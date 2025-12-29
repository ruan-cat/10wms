import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSidebarType } from "../index";

describe("useSidebarType", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	describe("初始化", () => {
		it("应该默认为 wmsBusinessPage", () => {
			const { currentSidebarType } = useSidebarType();
			expect(currentSidebarType.value).toBe("wmsBusinessPage");
		});

		it("应该从 localStorage 读取保存的类型", () => {
			localStorage.setItem("sidebar-type", "pureAdminExamplePage");
			const { currentSidebarType } = useSidebarType();
			expect(currentSidebarType.value).toBe("pureAdminExamplePage");
		});
	});

	describe("switchSidebarType", () => {
		it("应该能够切换侧边栏类型", () => {
			const { currentSidebarType, switchSidebarType } = useSidebarType();
			switchSidebarType("pureAdminExamplePage");
			expect(currentSidebarType.value).toBe("pureAdminExamplePage");
		});

		it("应该持久化侧边栏类型到 localStorage", () => {
			const { switchSidebarType } = useSidebarType();
			switchSidebarType("pureAdminExamplePage");
			expect(localStorage.getItem("sidebar-type")).toBe("pureAdminExamplePage");
		});

		it("应该能够切换回 wmsBusinessPage", () => {
			const { currentSidebarType, switchSidebarType } = useSidebarType();
			switchSidebarType("pureAdminExamplePage");
			switchSidebarType("wmsBusinessPage");
			expect(currentSidebarType.value).toBe("wmsBusinessPage");
		});
	});

	describe("filterRoutesBySidebarType", () => {
		const mockRoutes = [
			{
				path: "/system",
				meta: { sidebarType: "wmsBusinessPage" as SidebarType },
				children: [
					{ path: "/system/user", meta: { sidebarType: "wmsBusinessPage" as SidebarType } },
					{ path: "/system/role", meta: { sidebarType: "wmsBusinessPage" as SidebarType } },
				],
			},
			{
				path: "/components",
				meta: { sidebarType: "pureAdminExamplePage" as SidebarType },
				children: [{ path: "/components/button", meta: { sidebarType: "pureAdminExamplePage" as SidebarType } }],
			},
		];

		it("应该过滤出 wmsBusinessPage 类型的路由", () => {
			const { filterRoutesBySidebarType } = useSidebarType();
			const filtered = filterRoutesBySidebarType(mockRoutes, "wmsBusinessPage");
			expect(filtered).toHaveLength(1);
			expect(filtered[0].path).toBe("/system");
		});

		it("应该过滤出 pureAdminExamplePage 类型的路由", () => {
			const { filterRoutesBySidebarType } = useSidebarType();
			const filtered = filterRoutesBySidebarType(mockRoutes, "pureAdminExamplePage");
			expect(filtered).toHaveLength(1);
			expect(filtered[0].path).toBe("/components");
		});

		it("应该递归过滤子路由", () => {
			const { filterRoutesBySidebarType } = useSidebarType();
			const filtered = filterRoutesBySidebarType(mockRoutes, "wmsBusinessPage");
			expect(filtered[0].children).toHaveLength(2);
		});

		it("应该使用当前类型过滤（不传 type 参数）", () => {
			const { filterRoutesBySidebarType, switchSidebarType } = useSidebarType();
			switchSidebarType("pureAdminExamplePage");
			const filtered = filterRoutesBySidebarType(mockRoutes);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].path).toBe("/components");
		});
	});

	describe("getSidebarTypeFromRoute", () => {
		it("应该从 meta.sidebarType 获取类型", () => {
			const { getSidebarTypeFromRoute } = useSidebarType();
			const route = { path: "/test", meta: { sidebarType: "pureAdminExamplePage" as SidebarType } };
			expect(getSidebarTypeFromRoute(route)).toBe("pureAdminExamplePage");
		});

		it("应该根据路径特征判断类型", () => {
			const { getSidebarTypeFromRoute } = useSidebarType();
			const route = { path: "/components/button" };
			expect(getSidebarTypeFromRoute(route)).toBe("pureAdminExamplePage");
		});

		it("应该默认返回 wmsBusinessPage", () => {
			const { getSidebarTypeFromRoute } = useSidebarType();
			const route = { path: "/unknown" };
			expect(getSidebarTypeFromRoute(route)).toBe("wmsBusinessPage");
		});
	});

	describe("isCurrentSidebarType", () => {
		it("应该正确判断路由是否属于当前类型", () => {
			const { isCurrentSidebarType, switchSidebarType } = useSidebarType();
			switchSidebarType("wmsBusinessPage");
			const route = { path: "/system", meta: { sidebarType: "wmsBusinessPage" as SidebarType } };
			expect(isCurrentSidebarType(route)).toBe(true);
		});

		it("应该正确判断路由不属于当前类型", () => {
			const { isCurrentSidebarType, switchSidebarType } = useSidebarType();
			switchSidebarType("wmsBusinessPage");
			const route = { path: "/components", meta: { sidebarType: "pureAdminExamplePage" as SidebarType } };
			expect(isCurrentSidebarType(route)).toBe(false);
		});
	});

	describe("getSidebarTypeName", () => {
		it("应该返回 wmsBusinessPage 的显示名称", () => {
			const { getSidebarTypeName } = useSidebarType();
			expect(getSidebarTypeName("wmsBusinessPage")).toBe("主业务");
		});

		it("应该返回 pureAdminExamplePage 的显示名称", () => {
			const { getSidebarTypeName } = useSidebarType();
			expect(getSidebarTypeName("pureAdminExamplePage")).toBe("案例示例");
		});
	});

	describe("computed properties", () => {
		it("isBusinessSidebar 应该正确反映当前状态", () => {
			const { isBusinessSidebar, switchSidebarType } = useSidebarType();
			switchSidebarType("wmsBusinessPage");
			expect(isBusinessSidebar.value).toBe(true);
			switchSidebarType("pureAdminExamplePage");
			expect(isBusinessSidebar.value).toBe(false);
		});

		it("isExampleSidebar 应该正确反映当前状态", () => {
			const { isExampleSidebar, switchSidebarType } = useSidebarType();
			switchSidebarType("pureAdminExamplePage");
			expect(isExampleSidebar.value).toBe(true);
			switchSidebarType("wmsBusinessPage");
			expect(isExampleSidebar.value).toBe(false);
		});
	});
});
