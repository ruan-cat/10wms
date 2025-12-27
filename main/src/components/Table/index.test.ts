import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import fc from "fast-check";
import Table from "./index.vue";
import type { SimpleDataTableColumn, PaginationConfig } from "./types";

/**
 * Feature: origin-to-pure-admin-migration, Property 4: Table Component Feature Parity
 *
 * For any table configuration from Origin, when adapted to @pureadmin/table,
 * all original features (sorting, filtering, pagination, selection) should remain functional.
 */

describe("Table Component Property-Based Tests", () => {
	/**
	 * 生成随机的表格数据
	 */
	const tableDataArbitrary = fc.array(
		fc.record({
			id: fc.integer({ min: 1, max: 10000 }),
			name: fc.string({ minLength: 1, maxLength: 20 }),
			age: fc.integer({ min: 1, max: 100 }),
			email: fc.emailAddress(),
			status: fc.constantFrom("active", "inactive", "pending"),
		}),
		{ minLength: 0, maxLength: 50 },
	);

	/**
	 * 生成随机的列配置
	 */
	const columnsArbitrary = fc.constant([
		{ prop: "id", label: "ID", width: 80, sortable: true },
		{ prop: "name", label: "姓名", minWidth: 120 },
		{ prop: "age", label: "年龄", width: 100, sortable: true },
		{ prop: "email", label: "邮箱", minWidth: 200 },
		{ prop: "status", label: "状态", width: 100 },
	] as SimpleDataTableColumn<any>[]);

	/**
	 * 生成随机的分页配置
	 */
	const paginationArbitrary = fc.record({
		total: fc.integer({ min: 0, max: 1000 }),
		currentPage: fc.integer({ min: 1, max: 10 }),
		pageSize: fc.constantFrom(10, 20, 50, 100),
		show: fc.boolean(),
	}) as fc.Arbitrary<PaginationConfig>;

	it("should render table with any valid data and columns configuration", () => {
		fc.assert(
			fc.property(tableDataArbitrary, columnsArbitrary, (data, columns) => {
				const wrapper = mount(Table, {
					props: {
						data,
						columns,
					},
				});

				// 验证表格已渲染
				expect(wrapper.find(".table-wrapper").exists()).toBe(true);
				expect(wrapper.find(".el-table").exists()).toBe(true);

				// 验证列数正确（不包括特殊列）
				const tableColumns = wrapper.findAll(".el-table__header th");
				expect(tableColumns.length).toBeGreaterThanOrEqual(columns.length);

				wrapper.unmount();
			}),
			{ numRuns: 100 },
		);
	});

	it("should handle pagination configuration correctly for any valid pagination settings", () => {
		fc.assert(
			fc.property(tableDataArbitrary, columnsArbitrary, paginationArbitrary, (data, columns, pagination) => {
				const wrapper = mount(Table, {
					props: {
						data,
						columns,
						pagination,
					},
				});

				if (pagination.show !== false) {
					// 验证分页组件存在
					expect(wrapper.find(".pagination-wrapper").exists()).toBe(true);
					expect(wrapper.find(".el-pagination").exists()).toBe(true);
				} else {
					// 验证分页组件不存在
					expect(wrapper.find(".pagination-wrapper").exists()).toBe(false);
				}

				wrapper.unmount();
			}),
			{ numRuns: 100 },
		);
	});

	it("should support selection feature when isMultipleSelect is enabled", () => {
		fc.assert(
			fc.property(tableDataArbitrary, columnsArbitrary, fc.boolean(), (data, columns, isMultipleSelect) => {
				const onSelectionChange = vi.fn();
				const wrapper = mount(Table, {
					props: {
						data,
						columns,
						isMultipleSelect,
					},
					attrs: {
						onSelectionChange,
					},
				});

				if (isMultipleSelect && data.length > 0) {
					// 验证选择列存在
					const selectionColumn = wrapper.find('.el-table-column[type="selection"]');
					// 注意：由于 el-table-column 是运行时渲染的，我们主要验证配置是否正确传递
					expect(wrapper.vm.pureColumns.some((col: any) => col.type === "selection")).toBe(true);
				}

				wrapper.unmount();
			}),
			{ numRuns: 100 },
		);
	});

	it("should support index column when isIndex is enabled", () => {
		fc.assert(
			fc.property(tableDataArbitrary, columnsArbitrary, fc.boolean(), (data, columns, isIndex) => {
				const wrapper = mount(Table, {
					props: {
						data,
						columns,
						isIndex,
					},
				});

				if (isIndex) {
					// 验证索引列存在
					expect(wrapper.vm.pureColumns.some((col: any) => col.type === "index")).toBe(true);
				} else {
					// 验证索引列不存在
					expect(wrapper.vm.pureColumns.some((col: any) => col.type === "index")).toBe(false);
				}

				wrapper.unmount();
			}),
			{ numRuns: 100 },
		);
	});

	it("should emit page-change event with correct parameters when pagination changes", () => {
		fc.assert(
			fc.property(
				tableDataArbitrary,
				columnsArbitrary,
				fc.integer({ min: 1, max: 10 }),
				fc.constantFrom(10, 20, 50),
				(data, columns, newPage, newPageSize) => {
					const onPageChange = vi.fn();
					const wrapper = mount(Table, {
						props: {
							data,
							columns,
							pagination: {
								total: 100,
								currentPage: 1,
								pageSize: 10,
								show: true,
							},
						},
						attrs: {
							onPageChange,
						},
					});

					// 触发分页变化
					wrapper.vm.handlePageChange({ currentPage: newPage, pageSize: newPageSize });

					// 验证事件被触发且参数正确
					expect(onPageChange).toHaveBeenCalledWith({
						currentPage: newPage,
						pageSize: newPageSize,
					});

					wrapper.unmount();
				},
			),
			{ numRuns: 100 },
		);
	});

	it("should emit sort-change event when sortable column is sorted", () => {
		fc.assert(
			fc.property(
				tableDataArbitrary,
				fc.constantFrom("id", "age"),
				fc.constantFrom("ascending", "descending", null),
				(data, prop, order) => {
					const onSortChange = vi.fn();
					const wrapper = mount(Table, {
						props: {
							data,
							columns: [
								{ prop: "id", label: "ID", sortable: true },
								{ prop: "name", label: "姓名" },
								{ prop: "age", label: "年龄", sortable: true },
							],
						},
						attrs: {
							onSortChange,
						},
					});

					// 触发排序变化
					wrapper.vm.handleSortChange({ prop, order });

					// 验证事件被触发且参数正确
					expect(onSortChange).toHaveBeenCalledWith({ prop, order });

					wrapper.unmount();
				},
			),
			{ numRuns: 100 },
		);
	});

	it("should display loading state correctly", () => {
		fc.assert(
			fc.property(tableDataArbitrary, columnsArbitrary, fc.boolean(), (data, columns, loading) => {
				const wrapper = mount(Table, {
					props: {
						data,
						columns,
						loading,
					},
				});

				// 验证 loading 属性正确传递
				const table = wrapper.findComponent({ name: "ElTable" });
				expect(table.props("loading")).toBe(loading);

				wrapper.unmount();
			}),
			{ numRuns: 100 },
		);
	});

	it("should handle empty data correctly", () => {
		fc.assert(
			fc.property(columnsArbitrary, fc.string(), (columns, emptyText) => {
				const wrapper = mount(Table, {
					props: {
						data: [],
						columns,
						emptyText: emptyText || "暂无数据",
					},
				});

				// 验证空数据文本正确传递
				const table = wrapper.findComponent({ name: "ElTable" });
				expect(table.props("emptyText")).toBe(emptyText || "暂无数据");

				wrapper.unmount();
			}),
			{ numRuns: 100 },
		);
	});

	it("should preserve all column configurations including width, align, and sortable", () => {
		fc.assert(
			fc.property(
				tableDataArbitrary,
				fc.array(
					fc.record({
						prop: fc.constantFrom("id", "name", "age", "email", "status"),
						label: fc.string({ minLength: 1, maxLength: 10 }),
						width: fc.option(fc.integer({ min: 50, max: 300 })),
						minWidth: fc.option(fc.integer({ min: 50, max: 300 })),
						align: fc.option(fc.constantFrom("left", "center", "right")),
						sortable: fc.option(fc.boolean()),
						fixed: fc.option(fc.constantFrom("left", "right", true, false)),
					}),
					{ minLength: 1, maxLength: 5 },
				),
				(data, columns) => {
					const wrapper = mount(Table, {
						props: {
							data,
							columns: columns as SimpleDataTableColumn<any>[],
						},
					});

					// 验证列配置被正确处理
					const pureColumns = wrapper.vm.pureColumns;

					columns.forEach((col, index) => {
						// 找到对应的列（跳过特殊列）
						const pureCol = pureColumns.find((pc: any) => pc.prop === col.prop);
						if (pureCol) {
							// 验证配置被保留
							if (col.width) expect(pureCol.width).toBe(col.width);
							if (col.minWidth) expect(pureCol.minWidth).toBe(col.minWidth);
							if (col.sortable !== undefined) expect(pureCol.sortable).toBe(col.sortable);
							if (col.fixed !== undefined) expect(pureCol.fixed).toBe(col.fixed);
							// align 有默认值 center
							expect(pureCol.align).toBe(col.align || "center");
						}
					});

					wrapper.unmount();
				},
			),
			{ numRuns: 100 },
		);
	});

	it("should support stripe and border configurations", () => {
		fc.assert(
			fc.property(tableDataArbitrary, columnsArbitrary, fc.boolean(), fc.boolean(), (data, columns, stripe, border) => {
				const wrapper = mount(Table, {
					props: {
						data,
						columns,
						stripe,
						border,
					},
				});

				// 验证 stripe 和 border 属性正确传递
				const table = wrapper.findComponent({ name: "ElTable" });
				expect(table.props("stripe")).toBe(stripe);
				expect(table.props("border")).toBe(border);

				wrapper.unmount();
			}),
			{ numRuns: 100 },
		);
	});
});
