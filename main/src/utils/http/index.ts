import Axios, { type AxiosInstance, type AxiosRequestConfig, type CustomParamsSerializer } from "axios";
import type { PureHttpError, RequestMethods, PureHttpResponse, PureHttpRequestConfig } from "./types.d";
import { stringify } from "qs";
import NProgress from "../progress";
import { getToken, formatToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import type { Router } from "vue-router";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
	// 请求超时时间
	timeout: 10000,
	headers: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest",
	},
	// 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
	paramsSerializer: {
		serialize: stringify as unknown as CustomParamsSerializer,
	},
};

class PureHttp {
	constructor() {
		this.httpInterceptorsRequest();
		this.httpInterceptorsResponse();
	}

	/** `token`过期后，暂存待执行的请求 */
	private static requests = [];

	/** 防止重复刷新`token` */
	private static isRefreshing = false;

	/** 初始化配置对象 */
	private static initConfig: PureHttpRequestConfig = {};

	/** 保存当前`Axios`实例对象 */
	private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

	/** 重连原始请求 */
	private static retryOriginalRequest(config: PureHttpRequestConfig) {
		return new Promise((resolve) => {
			PureHttp.requests.push((token: string) => {
				config.headers["Authorization"] = formatToken(token);
				resolve(config);
			});
		});
	}

	/** 请求拦截 */
	private httpInterceptorsRequest(): void {
		PureHttp.axiosInstance.interceptors.request.use(
			async (config: PureHttpRequestConfig): Promise<any> => {
				// 开启进度条动画
				NProgress.start();
				// 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
				if (typeof config.beforeRequestCallback === "function") {
					config.beforeRequestCallback(config);
					return config;
				}
				if (PureHttp.initConfig.beforeRequestCallback) {
					PureHttp.initConfig.beforeRequestCallback(config);
					return config;
				}
				/** 请求白名单，放置一些不需要`token`的接口（通过设置请求白名单，防止`token`过期后再请求造成的死循环问题） */
				const whiteList = ["/refresh-token", "/login"];
				return whiteList.some((url) => config.url.endsWith(url))
					? config
					: new Promise((resolve) => {
							const data = getToken();
							if (data) {
								const now = new Date().getTime();
								const expired = parseInt(data.expires) - now <= 0;
								if (expired) {
									if (!PureHttp.isRefreshing) {
										PureHttp.isRefreshing = true;
										// token过期刷新
										useUserStoreHook()
											.handRefreshToken({ refreshToken: data.refreshToken })
											.then((res) => {
												const token = res.data.accessToken;
												config.headers["Authorization"] = formatToken(token);
												PureHttp.requests.forEach((cb) => cb(token));
												PureHttp.requests = [];
											})
											.finally(() => {
												PureHttp.isRefreshing = false;
											});
									}
									resolve(PureHttp.retryOriginalRequest(config));
								} else {
									config.headers["Authorization"] = formatToken(data.accessToken);
									resolve(config);
								}
							} else {
								resolve(config);
							}
						});
			},
			(error) => {
				return Promise.reject(error);
			},
		);
	}

	/** 响应拦截 */
	private httpInterceptorsResponse(): void {
		const instance = PureHttp.axiosInstance;
		instance.interceptors.response.use(
			(response: PureHttpResponse) => {
				const $config = response.config;
				// 关闭进度条动画
				NProgress.done();
				// 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
				if (typeof $config.beforeResponseCallback === "function") {
					$config.beforeResponseCallback(response);
					return response.data;
				}
				if (PureHttp.initConfig.beforeResponseCallback) {
					PureHttp.initConfig.beforeResponseCallback(response);
					return response.data;
				}
				return response.data;
			},
			(error: PureHttpError) => {
				const $error = error;
				$error.isCancelRequest = Axios.isCancel($error);
				// 关闭进度条动画
				NProgress.done();
				// 所有的响应异常 区分来源为取消请求/非取消请求
				return Promise.reject($error);
			},
		);
	}

	/** 通用请求工具函数 */
	public request<T>(
		method: RequestMethods,
		url: string,
		param?: AxiosRequestConfig,
		axiosConfig?: PureHttpRequestConfig,
	): Promise<T> {
		const config = {
			method,
			url,
			...param,
			...axiosConfig,
		} as PureHttpRequestConfig;

		// 单独处理自定义请求/响应回调
		return new Promise((resolve, reject) => {
			PureHttp.axiosInstance
				.request(config)
				.then((response: undefined) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	/** 单独抽离的`post`工具函数 */
	public post<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: PureHttpRequestConfig): Promise<T> {
		return this.request<T>("post", url, params, config);
	}

	/** 单独抽离的`get`工具函数 */
	public get<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: PureHttpRequestConfig): Promise<T> {
		return this.request<T>("get", url, params, config);
	}

	/** 兼容旧版本的单参数请求方法 */
	public requestCompat<T>(config: AxiosRequestConfig & { method?: RequestMethods }): Promise<T> {
		const { method = "get", url, ...rest } = config;
		return this.request<T>(method, url as string, rest);
	}
}

export const http = new PureHttp();

/** HTTP 状态码枚举 */
export enum HttpCode {
	/** 暂未登录或TOKEN已经过期 */
	UNAUTHORIZED = 401,
	/** 没有相关权限 */
	FORBIDDEN = 403,
	/** 访问页面未找到 */
	NOT_FOUND = 404,
	/** 服务器错误 */
	SERVER_ERROR = 9994,
	/** 上传参数异常 */
	PARAMS_INVALID = 9995,
	/** ContentType错误 */
	CONTENT_TYPE_ERR = 9996,
	/** 功能尚未实现 */
	API_UN_IMPL = 9997,
	/** 服务器繁忙 */
	SERVER_BUSY = 9998,
	/** 操作失败 */
	FAIL = 9999,
	/** 操作成功 */
	SUCCESS = 10000,
}

/** 数据上传类型枚举 */
export enum UpType {
	/** 表单类型 */
	FORM = 0,
	/** JSON类型 */
	JSON = 1,
	/** 文件类型 */
	FILE = 3,
	/** 文件流类型 */
	STREAM = 4,
}

/**
 * 自定义 HTTP 类，适配 Origin 项目的拦截器逻辑
 */
class CustomHttp extends PureHttp {
	private router: Router | null = null;

	/**
	 * 设置路由实例
	 */
	setRouter(router: Router) {
		this.router = router;
	}

	/**
	 * 请求前回调
	 */
	beforeRequestCallback(config: PureHttpRequestConfig) {
		// 添加 token
		const userStore = useUserStoreHook();
		const tokenData = getToken();

		if (tokenData?.accessToken) {
			config.headers["Authorization"] = formatToken(tokenData.accessToken);
		}

		// 处理 Content-Type
		const upType = (config as any).upType;
		if (upType === UpType.JSON) {
			config.headers["Content-Type"] = "application/json;charset=UTF-8";
		} else if (upType === UpType.FILE) {
			config.headers["Content-Type"] = "multipart/form-data";
		} else if (upType === UpType.STREAM) {
			config.headers["Content-Type"] = "application/octet-stream";
		} else if (upType === UpType.FORM) {
			config.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
			if (config.data) {
				config.data = stringify(config.data, { arrayFormat: "repeat" });
			}
		}

		return config;
	}

	/**
	 * 响应后回调
	 */
	beforeResponseCallback(response: PureHttpResponse) {
		const { data, status } = response;

		// HTTP 响应状态码正常
		if (status === 200) {
			if ("code" in data) {
				const userStore = useUserStoreHook();

				switch (data.code) {
					case HttpCode.SUCCESS:
						// 操作成功，返回数据
						return data;

					case HttpCode.FORBIDDEN:
						// 权限不足
						ElMessage.error("权限不够，请联系管理员");
						throw new Error(data.message || "权限不足");

					case HttpCode.UNAUTHORIZED:
						// 判断是否是 token 过期
						if (typeof data.data === "string" && data.data.includes("Jwt expired at")) {
							// Token 过期，刷新 token
							userStore
								.handRefreshToken({ refreshToken: getToken()?.refreshToken })
								.then(() => {
									// 刷新成功后跳转到首页
									if (this.router) {
										this.router.push("/home");
									}
								})
								.catch(() => {
									// 刷新失败，跳转到登录页
									if (this.router) {
										this.router.push("/login");
									}
								});
						} else {
							// 未登录或登录失效
							if (this.router) {
								this.router.push("/login");
							}
							// 清除用户数据
							userStore.logOut();
						}
						throw new Error(data.message || "未授权");

					case HttpCode.NOT_FOUND:
						ElMessage.warning(data.message || "404访问页面不存在");
						throw new Error(data.message || "404");

					case HttpCode.CONTENT_TYPE_ERR:
					case HttpCode.PARAMS_INVALID:
						ElMessage.warning(data.message || "请求参数或请求头错误");
						throw new Error(data.message || "参数错误");

					default:
						// 其他错误
						if (data.message) {
							ElMessage.error(data.message);
						}
						throw new Error(data.message || "操作失败");
				}
			}
			return data;
		} else if (status === 404) {
			ElMessage.warning("404访问页面不存在");
			throw new Error("404");
		} else {
			throw new Error(`HTTP ${status}`);
		}
	}
}

export const customHttp = new CustomHttp();
