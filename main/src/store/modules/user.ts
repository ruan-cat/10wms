import { defineStore } from "pinia";
import { type userType, store, router, resetRouter, routerArrays, storageLocal } from "../utils";
import { type UserResult, type RefreshTokenResult, getLogin, refreshTokenApi } from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

/** 菜单项接口 */
export interface MenuItem {
	id: string;
	parentId: string | null;
	name: string;
	path: string;
	component?: string;
	icon?: string;
	order: number;
	type: "menu" | "button";
	permission?: string;
	children?: MenuItem[];
}

/** 用户信息接口 */
export interface UserInfo {
	id: string;
	username: string;
	name: string;
	email: string;
	phone?: string;
	avatar?: string;
	roles: string[];
	permissions: string[];
	deptId?: string;
	deptName?: string;
}

/** 扩展的用户状态类型 */
interface ExtendedUserType extends userType {
	/** 用户信息 */
	userInfo: UserInfo | null;
	/** 菜单数据 */
	menus: MenuItem[];
	/** 是否已加载初始化数据 */
	isLoaded: boolean;
}

export const useUserStore = defineStore("pure-user", {
	state: (): ExtendedUserType => ({
		// 头像
		avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
		// 用户名
		username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
		// 昵称
		nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
		// 页面级别权限
		roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
		// 按钮级别权限
		permissions: storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
		// 前端生成的验证码（按实际需求替换）
		verifyCode: "",
		// 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
		currentPage: 0,
		// 是否勾选了登录页的免登录
		isRemembered: false,
		// 登录页的免登录存储几天，默认7天
		loginDay: 7,
		// 用户信息（Origin 兼容）
		userInfo: storageLocal().getItem<UserInfo>("userInfo") ?? null,
		// 菜单数据（Origin 兼容）
		menus: storageLocal().getItem<MenuItem[]>("menus") ?? [],
		// 是否已加载初始化数据（Origin 兼容）
		isLoaded: storageLocal().getItem<boolean>("isLoaded") ?? false,
	}),
	actions: {
		/** 存储头像 */
		SET_AVATAR(avatar: string) {
			this.avatar = avatar;
		},
		/** 存储用户名 */
		SET_USERNAME(username: string) {
			this.username = username;
		},
		/** 存储昵称 */
		SET_NICKNAME(nickname: string) {
			this.nickname = nickname;
		},
		/** 存储角色 */
		SET_ROLES(roles: Array<string>) {
			this.roles = roles;
		},
		/** 存储按钮级别权限 */
		SET_PERMS(permissions: Array<string>) {
			this.permissions = permissions;
		},
		/** 存储前端生成的验证码 */
		SET_VERIFYCODE(verifyCode: string) {
			this.verifyCode = verifyCode;
		},
		/** 存储登录页面显示哪个组件 */
		SET_CURRENTPAGE(value: number) {
			this.currentPage = value;
		},
		/** 存储是否勾选了登录页的免登录 */
		SET_ISREMEMBERED(bool: boolean) {
			this.isRemembered = bool;
		},
		/** 设置登录页的免登录存储几天 */
		SET_LOGINDAY(value: number) {
			this.loginDay = Number(value);
		},
		/** 登入 */
		async loginByUsername(data) {
			return new Promise<UserResult>((resolve, reject) => {
				getLogin(data)
					.then((data) => {
						if (data?.success) setToken(data.data);
						resolve(data);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		/** 前端登出（不调用接口） */
		logOut() {
			this.username = "";
			this.roles = [];
			this.permissions = [];
			this.userInfo = null;
			this.menus = [];
			this.isLoaded = false;
			removeToken();
			storageLocal().removeItem("userInfo");
			storageLocal().removeItem("menus");
			storageLocal().removeItem("isLoaded");
			useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
			resetRouter();
			router.push("/login");
		},
		/** 刷新`token` */
		async handRefreshToken(data) {
			return new Promise<RefreshTokenResult>((resolve, reject) => {
				refreshTokenApi(data)
					.then((data) => {
						if (data) {
							setToken(data.data);
							resolve(data);
						}
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		/** 加载用户信息（Origin 兼容） */
		async loadUser() {
			try {
				// TODO: 调用实际的 API
				// const response = await http.get("/login/current-user");
				// this.userInfo = response.data;
				// storageLocal().setItem("userInfo", this.userInfo);

				// 临时实现：从 token 数据中提取用户信息
				const tokenData = storageLocal().getItem<DataInfo<number>>(userKey);
				if (tokenData) {
					this.userInfo = {
						id: String(tokenData.id || ""),
						username: tokenData.username || "",
						name: tokenData.nickname || "",
						email: "",
						avatar: tokenData.avatar || "",
						roles: tokenData.roles || [],
						permissions: tokenData.permissions || [],
					};
					storageLocal().setItem("userInfo", this.userInfo);
				}
			} catch (error) {
				console.error("加载用户信息失败:", error);
				throw error;
			}
		},
		/** 加载菜单（Origin 兼容） */
		async loadMenus() {
			try {
				// TODO: 调用实际的 API
				// const response = await http.get("/login/get-menus");
				// this.menus = response.data;
				// storageLocal().setItem("menus", this.menus);

				// 临时实现：返回空菜单
				this.menus = [];
				storageLocal().setItem("menus", this.menus);
			} catch (error) {
				console.error("加载菜单失败:", error);
				throw error;
			}
		},
		/** 设置加载状态（Origin 兼容） */
		setLoaded(loaded: boolean) {
			this.isLoaded = loaded;
			storageLocal().setItem("isLoaded", loaded);
		},
		/** 获取 Token（Origin 兼容） */
		getToken() {
			const tokenData = storageLocal().getItem<DataInfo<number>>(userKey);
			return tokenData?.accessToken || null;
		},
		/** 获取用户信息（Origin 兼容） */
		getUser() {
			return this.userInfo;
		},
		/** 获取菜单（Origin 兼容） */
		getMenus() {
			return this.menus;
		},
	},
});

export function useUserStoreHook() {
	return useUserStore(store);
}
