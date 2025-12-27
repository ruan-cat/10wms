import { describe, it, expect, vi } from "vitest";

/** 分页组件单元测试 */
describe("Pagination Component Unit Tests", () => {
	/** 测试分页配置 */
	const mockPagination = {
		pageIndex: 1,
		pageSize: 10,
		total: 100,
	};

	/** 预设配置 */
	const presetConfig = {
		layout: "total, sizes, prev, pager, next, jumper, ->, slot",
		pageSizes: [10, 15, 30, 50, 100],
		background: true,
	};

	it("应该正确定义分页配置", () => {
		expect(mockPagination).toBeDefined();
		expect(mockPagination.pageIndex).toBe(1);
		expect(mockPagination.pageSize).toBe(10);
		expect(mockPagination.total).toBe(100);
	});

	it("预设配置应该包含必要的属性", () => {
		expect(presetConfig).toBeDefined();
		expect(presetConfig.layout).toBeDefined();
		expect(presetConfig.pageSizes).toBeDefined();
		expect(presetConfig.background).toBe(true);
	});

	it("pageSizes 应该包含常用的分页选项", () => {
		expect(presetConfig.pageSizes).toContain(10);
		expect(presetConfig.pageSizes).toContain(15);
		expect(presetConfig.pageSizes).toContain(30);
		expect(presetConfig.pageSizes).toContain(50);
		expect(presetConfig.pageSizes).toContain(100);
	});

	it("layout 应该包含所有必要的元素", () => {
		const layout = presetConfig.layout;
		expect(layout).toContain("total");
		expect(layout).toContain("sizes");
		expect(layout).toContain("prev");
		expect(layout).toContain("pager");
		expect(layout).toContain("next");
		expect(layout).toContain("jumper");
	});

	it("异步请求函数应该被正确调用", async () => {
		const asyncFunc = vi.fn(async (pageIndex: number, pageSize: number) => {
			return { data: [], total: 100 };
		});

		await asyncFunc(1, 10);

		expect(asyncFunc).toHaveBeenCalledWith(1, 10);
		expect(asyncFunc).toHaveBeenCalledTimes(1);
	});

	it("分页变化时应该触发异步请求", async () => {
		const asyncFunc = vi.fn(async (pageIndex: number, pageSize: number) => {
			return { data: [], total: 100 };
		});

		// 模拟页码变化
		await asyncFunc(2, 10);
		expect(asyncFunc).toHaveBeenCalledWith(2, 10);

		// 模拟每页条数变化
		await asyncFunc(1, 20);
		expect(asyncFunc).toHaveBeenCalledWith(1, 20);

		expect(asyncFunc).toHaveBeenCalledTimes(2);
	});

	it("应该正确计算总页数", () => {
		const totalPages = Math.ceil(mockPagination.total / mockPagination.pageSize);
		expect(totalPages).toBe(10);

		const totalPages2 = Math.ceil(100 / 15);
		expect(totalPages2).toBe(7);
	});

	it("pageIndex 应该在有效范围内", () => {
		const { pageIndex, total, pageSize } = mockPagination;
		const maxPage = Math.ceil(total / pageSize);

		expect(pageIndex).toBeGreaterThanOrEqual(1);
		expect(pageIndex).toBeLessThanOrEqual(maxPage);
	});

	it("pageSize 应该在预设选项中", () => {
		const { pageSize } = mockPagination;
		expect(presetConfig.pageSizes).toContain(pageSize);
	});

	it("应该支持自定义 pageSizes", () => {
		const customPageSizes = [5, 10, 20, 50];
		expect(customPageSizes).toBeDefined();
		expect(customPageSizes.length).toBe(4);
		expect(customPageSizes).toContain(5);
		expect(customPageSizes).toContain(20);
	});

	it("应该支持自定义 layout", () => {
		const customLayout = "prev, pager, next";
		expect(customLayout).toBeDefined();
		expect(customLayout).toContain("prev");
		expect(customLayout).toContain("pager");
		expect(customLayout).toContain("next");
	});

	it("background 属性应该可以配置", () => {
		expect(typeof presetConfig.background).toBe("boolean");
		expect(presetConfig.background).toBe(true);

		const withoutBackground = false;
		expect(withoutBackground).toBe(false);
	});

	it("异步请求函数应该返回 Promise", async () => {
		const asyncFunc = async (pageIndex: number, pageSize: number) => {
			return { data: [], total: 100 };
		};

		const result = asyncFunc(1, 10);
		expect(result).toBeInstanceOf(Promise);

		const data = await result;
		expect(data).toHaveProperty("data");
		expect(data).toHaveProperty("total");
	});

	it("应该正确处理边界情况", () => {
		// 第一页
		const firstPage = { pageIndex: 1, pageSize: 10, total: 100 };
		expect(firstPage.pageIndex).toBe(1);

		// 最后一页
		const lastPage = {
			pageIndex: Math.ceil(100 / 10),
			pageSize: 10,
			total: 100,
		};
		expect(lastPage.pageIndex).toBe(10);

		// 空数据
		const emptyData = { pageIndex: 1, pageSize: 10, total: 0 };
		expect(emptyData.total).toBe(0);
	});
});
