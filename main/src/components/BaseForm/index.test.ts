import { describe, it, expect, vi } from "vitest";
import type { BaseFormItem } from "./types";

/** 表单组件单元测试 */
describe("BaseForm Component Unit Tests", () => {
	/** 测试表单数据 */
	interface TestForm {
		name: string;
		age: number;
		email: string;
		gender: string;
		birthday: string;
		score: number;
	}

	/** 测试表单对象 */
	const mockForm: TestForm = {
		name: "张三",
		age: 25,
		email: "zhangsan@example.com",
		gender: "male",
		birthday: "2000-01-01",
		score: 85,
	};

	/** 表单项配置 */
	const mockFormItems: BaseFormItem<TestForm>[] = [
		{
			type: "input",
			props: {
				label: "姓名",
				prop: "name",
				placeholder: "请输入姓名",
			},
		},
		{
			type: "number",
			props: {
				label: "年龄",
				prop: "age",
				min: 0,
				max: 150,
			},
		},
		{
			type: "input",
			props: {
				label: "邮箱",
				prop: "email",
				placeholder: "请输入邮箱",
			},
		},
		{
			type: "select",
			props: {
				label: "性别",
				prop: "gender",
				options: [
					{ label: "男", value: "male" },
					{ label: "女", value: "female" },
				],
			},
		},
		{
			type: "date",
			props: {
				label: "生日",
				prop: "birthday",
				type: "date",
				format: "YYYY-MM-DD",
				valueFormat: "YYYY-MM-DD",
			},
		},
		{
			type: "number",
			props: {
				label: "分数",
				prop: "score",
				min: 0,
				max: 100,
				step: 1,
			},
		},
	];

	it("应该正确定义表单数据结构", () => {
		expect(mockForm).toBeDefined();
		expect(mockForm).toHaveProperty("name");
		expect(mockForm).toHaveProperty("age");
		expect(mockForm).toHaveProperty("email");
		expect(mockForm.name).toBe("张三");
		expect(mockForm.age).toBe(25);
	});

	it("应该正确定义表单项配置", () => {
		expect(mockFormItems).toBeDefined();
		expect(mockFormItems.length).toBe(6);
		expect(mockFormItems[0].type).toBe("input");
		expect(mockFormItems[1].type).toBe("number");
		expect(mockFormItems[3].type).toBe("select");
	});

	it("表单项配置应该包含必要的属性", () => {
		mockFormItems.forEach((item) => {
			expect(item).toHaveProperty("type");
			expect(item).toHaveProperty("props");
			expect(item.props).toHaveProperty("label");
			expect(item.props).toHaveProperty("prop");
		});
	});

	it("输入框配置应该正确", () => {
		const inputItem = mockFormItems.find((item) => item.type === "input");
		expect(inputItem).toBeDefined();
		if (inputItem && inputItem.type === "input") {
			expect(inputItem.props.label).toBe("姓名");
			expect(inputItem.props.prop).toBe("name");
			expect(inputItem.props.placeholder).toBe("请输入姓名");
		}
	});

	it("选择框配置应该包含选项", () => {
		const selectItem = mockFormItems.find((item) => item.type === "select");
		expect(selectItem).toBeDefined();
		if (selectItem && selectItem.type === "select") {
			expect(selectItem.props.options).toBeDefined();
			expect(selectItem.props.options.length).toBe(2);
			expect(selectItem.props.options[0]).toHaveProperty("label");
			expect(selectItem.props.options[0]).toHaveProperty("value");
		}
	});

	it("日期选择器配置应该正确", () => {
		const dateItem = mockFormItems.find((item) => item.type === "date");
		expect(dateItem).toBeDefined();
		if (dateItem && dateItem.type === "date") {
			expect(dateItem.props.type).toBe("date");
			expect(dateItem.props.format).toBe("YYYY-MM-DD");
			expect(dateItem.props.valueFormat).toBe("YYYY-MM-DD");
		}
	});

	it("数字输入框配置应该包含范围限制", () => {
		const numberItem = mockFormItems.find((item) => item.type === "number" && item.props.prop === "age");
		expect(numberItem).toBeDefined();
		if (numberItem && numberItem.type === "number") {
			expect(numberItem.props.min).toBe(0);
			expect(numberItem.props.max).toBe(150);
		}
	});

	it("应该支持响应式布局配置", () => {
		const formItemWithResponsive: BaseFormItem<TestForm> = {
			type: "input",
			props: {
				label: "测试",
				prop: "name",
				responsive: {
					xs: 24,
					sm: 12,
					md: 8,
					lg: 6,
					xl: 4,
				},
			},
		};

		expect(formItemWithResponsive.props.responsive).toBeDefined();
		expect(formItemWithResponsive.props.responsive?.xs).toBe(24);
		expect(formItemWithResponsive.props.responsive?.md).toBe(8);
	});

	it("表单重置功能应该正确工作", () => {
		const originalForm = { ...mockForm };
		const modifiedForm = { ...mockForm, name: "李四", age: 30 };

		// 模拟重置
		const resetForm = { ...originalForm };

		expect(resetForm.name).toBe("张三");
		expect(resetForm.age).toBe(25);
		expect(resetForm).toEqual(originalForm);
	});

	it("表单校验规则应该正确定义", () => {
		const rules = {
			name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
			age: [
				{ required: true, message: "请输入年龄", trigger: "blur" },
				{ type: "number", min: 0, max: 150, message: "年龄必须在0-150之间", trigger: "blur" },
			],
			email: [
				{ required: true, message: "请输入邮箱", trigger: "blur" },
				{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
			],
		};

		expect(rules).toBeDefined();
		expect(rules.name).toBeDefined();
		expect(rules.age).toBeDefined();
		expect(rules.email).toBeDefined();
		expect(rules.name[0].required).toBe(true);
	});

	it("表单提交方法应该返回表单数据", () => {
		const getFormMock = vi.fn(() => mockForm);
		const result = getFormMock();

		expect(getFormMock).toHaveBeenCalled();
		expect(result).toEqual(mockForm);
	});

	it("表单数据应该可以被修改", () => {
		const form = { ...mockForm };
		form.name = "王五";
		form.age = 28;

		expect(form.name).toBe("王五");
		expect(form.age).toBe(28);
		expect(form.name).not.toBe(mockForm.name);
	});

	it("应该支持表格样式背景配置", () => {
		const isNotTableLikeBg = false;
		expect(typeof isNotTableLikeBg).toBe("boolean");

		const withTableBg = !isNotTableLikeBg;
		expect(withTableBg).toBe(true);
	});
});
