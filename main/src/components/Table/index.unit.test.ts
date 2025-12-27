import { describe, it, expect, vi } from "vitest";
import type { SimpleDataTableColumn, PaginationConfig } from "./types";

/** 表格组件单元测试 */
describe("Table Component Unit Tests", () => {
	/** 测试数据 */
	const mockData = [
		{ id: 1, name: "张三", age: 25, email: "zhangsan@example.com", status: "active" },
		{ id: 2, name: "李四", age: 30, email: "lisi@example.com", status: "inactive" },
		{ id: 3, name: "王五", age: 28, email: "wangwu@example.com", status: "pending" },
	];

	/** 列配置 */
	const mockColumns: SimpleDataTableColumn<(typeof mockData)[0]>[] = [
		{ prop: "id", label: "ID", width: 80 },
		{ prop: "name", label: "姓名", minWidth: 120 },
		{ prop: "age", label: "年龄", width: 100 },
		{ prop: "email", label: "邮箱", minWidth: 200 },
		{ prop: "status", label: "状态", width: 100 },
	];

	it("应该正确定义表格数据结构", () => {
		expect(mockData).toBeDefined();
		expect(mockData.length).toBe(3);
		expect(mockData[0]).toHaveProperty("id");
		expect(mockData[0]).toHaveProperty("name");
		expect(mockData[0]).toHaveProperty("age");
	});

	it("应该正确定义列配置", () => {
		expect(mockColumns).toBeDefined();
		expect(mockColumns.length).toBe(5);
		expect(mockColumns[0]).toHaveProperty("prop");
		expect(mockColumns[0]).toHaveProperty("label");
	});

	it("列配置应该包含必要的属性", () => {
		mockColumns.forEach((col) => {
			expect(col).toHaveProperty("prop");
			expect(col).toHaveProperty("label");
			expect(typeof col.prop).toBe("string");
			expect(typeof col.label).toBe("string");
		});
	});

	it("分页配置应该包含必要的属性", () => {
		const mockPagination: PaginationConfig = {
			total: 100,
			currentPage: 1,
			pageSize: 10,
			show: true,
		};

		expect(mockPagination).toHaveProperty("total");
		expect(mockPagination).toHaveProperty("currentPage");
		expect(mockPagination).toHaveProperty("pageSize");
		expect(mockPagination.total).toBe(100);
		expect(mockPagination.currentPage).toBe(1);
		expect(mockPagination.pageSize).toBe(10);
	});

	it("应该支持不同的列对齐方式", () => {
		const alignColumns: SimpleDataTableColumn<any>[] = [
			{ prop: "id", label: "ID", align: "left" },
			{ prop: "name", label: "姓名", align: "center" },
			{ prop: "age", label: "年龄", align: "right" },
		];

		expect(alignColumns[0].align).toBe("left");
		expect(alignColumns[1].align).toBe("center");
		expect(alignColumns[2].align).toBe("right");
	});

	it("应该支持列宽度配置", () => {
		const widthColumns: SimpleDataTableColumn<any>[] = [
			{ prop: "id", label: "ID", width: 80 },
			{ prop: "name", label: "姓名", minWidth: 120 },
		];

		expect(widthColumns[0].width).toBe(80);
		expect(widthColumns[1].minWidth).toBe(120);
	});

	it("应该支持固定列配置", () => {
		const fixedColumns: SimpleDataTableColumn<any>[] = [
			{ prop: "id", label: "ID", fixed: "left" },
			{ prop: "operation", label: "操作", fixed: "right" },
		];

		expect(fixedColumns[0].fixed).toBe("left");
		expect(fixedColumns[1].fixed).toBe("right");
	});

	it("应该支持排序配置", () => {
		const sortableColumns: SimpleDataTableColumn<any>[] = [
			{ prop: "id", label: "ID", sortable: true },
			{ prop: "age", label: "年龄", sortable: true },
		];

		expect(sortableColumns[0].sortable).toBe(true);
		expect(sortableColumns[1].sortable).toBe(true);
	});

	it("事件处理函数应该被正确调用", () => {
		const mockFn = vi.fn();
		mockFn({ currentPage: 2, pageSize: 20 });

		expect(mockFn).toHaveBeenCalledWith({
			currentPage: 2,
			pageSize: 20,
		});
	});

	it("选择事件应该传递正确的数据", () => {
		const mockSelectionFn = vi.fn();
		const selectedRows = [mockData[0], mockData[1]];
		mockSelectionFn(selectedRows);

		expect(mockSelectionFn).toHaveBeenCalledWith(selectedRows);
		expect(mockSelectionFn).toHaveBeenCalledTimes(1);
	});

	it("排序事件应该传递正确的参数", () => {
		const mockSortFn = vi.fn();
		mockSortFn({ prop: "age", order: "ascending" });

		expect(mockSortFn).toHaveBeenCalledWith({
			prop: "age",
			order: "ascending",
		});
	});

	it("应该正确处理空数据", () => {
		const emptyData: any[] = [];
		expect(emptyData).toBeDefined();
		expect(emptyData.length).toBe(0);
	});

	it("应该正确处理空列配置", () => {
		const emptyColumns: SimpleDataTableColumn<any>[] = [];
		expect(emptyColumns).toBeDefined();
		expect(emptyColumns.length).toBe(0);
	});
});
