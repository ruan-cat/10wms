import { http } from "@/utils/http";

/**
 * 登录接口参数
 */
export interface LoginParams {
	/** 用户名 */
	username: string;
	/** 密码 */
	password: string;
	/** 验证码（可选） */
	captcha?: string;
}

/**
 * 登录接口响应
 */
export interface LoginResult {
	/** 访问令牌 */
	token: string;
	/** 刷新令牌（可选） */
	refreshToken?: string;
	/** 用户信息 */
	userInfo: {
		/** 用户ID */
		id: string;
		/** 用户名 */
		username: string;
		/** 真实姓名 */
		realname: string;
		/** 邮箱 */
		email?: string;
		/** 手机号 */
		mobilePhone?: string;
	};
}

/**
 * 登录接口
 * @description 用户登录认证
 * @param data 登录参数
 * @returns Promise<LoginResult>
 */
export function login(data: LoginParams) {
	return http.request<LoginResult>("post", "/login/auth-login", { data });
}

/**
 * 登出接口
 * @description 用户登出
 */
export function logout() {
	return http.request<void>("post", "/login/logout");
}

/**
 * 刷新令牌接口
 * @description 使用刷新令牌获取新的访问令牌
 * @param refreshToken 刷新令牌
 */
export function refreshToken(refreshToken: string) {
	return http.request<{ token: string }>("post", "/login/refresh-token", {
		data: { refreshToken },
	});
}
