import { http, customHttp, UpType } from "@/utils/http";

/** 测试 API 接口 */
export const testApi = {
	/**
	 * 测试 GET 请求
	 */
	testGet: (params?: Record<string, any>) => {
		return http.get("/api/test/get", { params });
	},

	/**
	 * 测试 POST 请求 (JSON)
	 */
	testPostJson: (data: Record<string, any>) => {
		return customHttp.post("/api/test/post", {
			data,
			upType: UpType.JSON,
		} as any);
	},

	/**
	 * 测试 POST 请求 (FORM)
	 */
	testPostForm: (data: Record<string, any>) => {
		return customHttp.post("/api/test/post-form", {
			data,
			upType: UpType.FORM,
		} as any);
	},

	/**
	 * 测试 PUT 请求
	 */
	testPut: (id: string, data: Record<string, any>) => {
		return http.request("put", `/api/test/${id}`, { data });
	},

	/**
	 * 测试 DELETE 请求
	 */
	testDelete: (id: string) => {
		return http.request("delete", `/api/test/${id}`);
	},

	/**
	 * 测试文件上传
	 */
	testUploadFile: (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		return customHttp.post("/api/test/upload", {
			data: formData,
			upType: UpType.FILE,
		} as any);
	},

	/**
	 * 测试错误处理
	 */
	testError: () => {
		return http.get("/api/test/error");
	},

	/**
	 * 测试 401 未授权
	 */
	testUnauthorized: () => {
		return http.get("/api/test/unauthorized");
	},

	/**
	 * 测试 403 权限不足
	 */
	testForbidden: () => {
		return http.get("/api/test/forbidden");
	},

	/**
	 * 测试 404 未找到
	 */
	testNotFound: () => {
		return http.get("/api/test/not-found");
	},
};
