import { describe, it } from "vitest";
import { queryAllEncodingType, getEncodingTypeNameList } from "./query";

describe("编码类型查询接口实现", () => {
	it("获取编码类型列表（条件+分页）", async () => {
		const { execute, data } = queryAllEncodingType({
			onSuccess(data) {
				console.log("获取编码类型列表 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				snroTypeCode: "TYPE001",
				snroTypeName: "测试编码类型",
			},
		});
		const res = data.value;
		console.log("查看简单的 data.value ", JSON.stringify(res, null, 2));
		console.warn(" rows =  ", res?.data.rows);
	});

	it("获取编码类型列表（仅分页，无筛选条件）", async () => {
		const { execute, data } = queryAllEncodingType({
			onSuccess(data) {
				console.log("获取编码类型列表（仅分页） onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 20,
			},
		});
		console.log("查看简单的 data.value ", data.value);
	});

	it("获取编码类型列表（按编码类型代码筛选）", async () => {
		const { execute, data } = queryAllEncodingType({
			onSuccess(data) {
				console.log("按编码类型代码筛选 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				snroTypeCode: "ENC",
			},
		});
		console.log("查看简单的 data.value ", data.value);
	});

	it("获取编码类型列表（按编码类型名称筛选）", async () => {
		const { execute, data } = queryAllEncodingType({
			onSuccess(data) {
				console.log("按编码类型名称筛选 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				snroTypeName: "产品编码",
			},
		});
		console.log("查看简单的 data.value ", data.value);
	});

	it("获取编码类型名称列表（无查询条件）", async () => {
		const { execute, data } = getEncodingTypeNameList({
			onSuccess(data) {
				console.log("获取编码类型名称列表 onSuccess", data);
			},
		});
		await execute({
			data: {},
		});
		const res = data.value;
		console.log("查看编码类型名称列表 data.value ", JSON.stringify(res, null, 2));
		console.warn("编码类型名称列表 rows = ", res?.data.rows);
	});

	it("获取编码类型名称列表（带查询条件）", async () => {
		const { execute, data } = getEncodingTypeNameList({
			onSuccess(data) {
				console.log("获取编码类型名称列表（带查询条件） onSuccess", data);
			},
		});
		await execute({
			data: {
				query: "产品",
			},
		});
		const res = data.value;
		console.log("查看筛选后的编码类型名称列表 data.value ", JSON.stringify(res, null, 2));
		console.warn("筛选后的编码类型名称列表 rows = ", res?.data.rows);
	});

	it("获取编码类型名称列表（模糊搜索）", async () => {
		const { execute, data } = getEncodingTypeNameList({
			onSuccess(data) {
				console.log("获取编码类型名称列表（模糊搜索） onSuccess", data);
			},
		});
		await execute({
			data: {
				query: "编码",
			},
		});
		const res = data.value;
		console.log("查看模糊搜索结果 data.value ", JSON.stringify(res, null, 2));
		console.warn("模糊搜索结果 rows = ", res?.data.rows);
	});
});
