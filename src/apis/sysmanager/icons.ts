import type { ParamsBodyKey, UseAxiosOptionsJsonVO } from "composables/use-request";
import { useRequest } from "composables/use-request";

/**
 * 图标录入数据模型
 */
export interface IconAddModel {
	/**
	 * 图标文件
	 */
	file?: File;

	/**
	 * 图标样式
	 */
	iconclas: string;

	/**
	 * 图标名称
	 */
	name: string;

	/**
	 * 图标类型: 1系统图标/2菜单图标/3桌面图标
	 */
	type: number;
}

/**
 * 图标录入接口
 */
export function sysmanagerIconsAdd<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, IconAddModel>({
		url: "/sysmanager/icons/add",
		options,
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				file: undefined,
				iconclas: "default",
				name: "",
				type: 1,
			},
		},
	});
}
