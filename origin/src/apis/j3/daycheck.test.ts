import { describe, it } from "vitest";
import { getNoUpGoods } from "./daycheck";

describe("每日检查接口实现", () => {
	it("获取出货未上架（基础分页查询）", async () => {
		const { execute, data } = getNoUpGoods({
			onSuccess(data) {
				console.log("获取出货未上架 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
			},
		});
		const res = data.value;
		console.log("查看出货未上架数据 data.value ", JSON.stringify(res, null, 2));
		console.warn("出货未上架列表 = ", res?.data);
	});

	it("获取出货未上架（按储位筛选）", async () => {
		const { execute, data } = getNoUpGoods({
			onSuccess(data) {
				console.log("按储位筛选出货未上架 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				bin_id: "A001",
			},
		});
		const res = data.value;
		console.log("查看按储位筛选的数据 data.value ", JSON.stringify(res, null, 2));
		console.warn("按储位筛选结果 = ", res?.data);
	});

	it("获取出货未上架（按客户编码筛选）", async () => {
		const { execute, data } = getNoUpGoods({
			onSuccess(data) {
				console.log("按客户编码筛选出货未上架 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				cus_code: "CUS001",
			},
		});
		const res = data.value;
		console.log("查看按客户编码筛选的数据 data.value ", JSON.stringify(res, null, 2));
		console.warn("按客户编码筛选结果 = ", res?.data);
	});

	it("获取出货未上架（按商品编码筛选）", async () => {
		const { execute, data } = getNoUpGoods({
			onSuccess(data) {
				console.log("按商品编码筛选出货未上架 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				goods_id: "GOODS001",
			},
		});
		const res = data.value;
		console.log("查看按商品编码筛选的数据 data.value ", JSON.stringify(res, null, 2));
		console.warn("按商品编码筛选结果 = ", res?.data);
	});

	it("获取出货未上架（按商品名称筛选）", async () => {
		const { execute, data } = getNoUpGoods({
			onSuccess(data) {
				console.log("按商品名称筛选出货未上架 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				shp_ming_cheng: "苹果",
			},
		});
		const res = data.value;
		console.log("查看按商品名称筛选的数据 data.value ", JSON.stringify(res, null, 2));
		console.warn("按商品名称筛选结果 = ", res?.data);
	});

	it("获取出货未上架（按托盘筛选）", async () => {
		const { execute, data } = getNoUpGoods({
			onSuccess(data) {
				console.log("按托盘筛选出货未上架 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				tin_id: "TIN001",
			},
		});
		const res = data.value;
		console.log("查看按托盘筛选的数据 data.value ", JSON.stringify(res, null, 2));
		console.warn("按托盘筛选结果 = ", res?.data);
	});

	it("获取出货未上架（按客户名称筛选）", async () => {
		const { execute, data } = getNoUpGoods({
			onSuccess(data) {
				console.log("按客户名称筛选出货未上架 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 10,
				zhong_wen_qch: "阿里巴巴",
			},
		});
		const res = data.value;
		console.log("查看按客户名称筛选的数据 data.value ", JSON.stringify(res, null, 2));
		console.warn("按客户名称筛选结果 = ", res?.data);
	});

	it("获取出货未上架（组合查询条件）", async () => {
		const { execute, data } = getNoUpGoods({
			onSuccess(data) {
				console.log("组合查询条件出货未上架 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 20,
				bin_id: "A001",
				cus_code: "CUS001",
				shp_ming_cheng: "苹果",
			},
		});
		const res = data.value;
		console.log("查看组合查询条件的数据 data.value ", JSON.stringify(res, null, 2));
		console.warn("组合查询条件结果 = ", res?.data);
	});

	it("获取出货未上架（大页面查询）", async () => {
		const { execute, data } = getNoUpGoods({
			onSuccess(data) {
				console.log("大页面查询出货未上架 onSuccess", data);
			},
		});
		await execute({
			data: {
				pageIndex: 1,
				pageSize: 50,
			},
		});
		const res = data.value;
		console.log("查看大页面查询的数据 data.value ", JSON.stringify(res, null, 2));
		console.warn("大页面查询结果 = ", res?.data);
	});
});
