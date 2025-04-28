import type { ParamsBodyKey, UseAxiosOptionsJsonVO, ParamsQueryKey } from "composables/use-request";
import type { PageDTO } from "src/types/PageDTO";
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

/**
 * 图标列表数据模型
 */
export interface IconListModel {
	/**
	 * 图标后缀
	 */
	extend: string;

	/**
	 * 图标样式
	 */
	iconclas: string;

	/**
	 * 图标名称
	 */
	name: string;

	/**
	 * 图标类型
	 */
	type: number;

	/**
	 * 图标下载地址
	 */
	url: string;
}

/**
 * 图标查询参数
 */
export interface IconAllQueryParams {
	/**
	 * 图标名称
	 */
	name?: string;

	/**
	 * 查询页码
	 */
	pageIndex?: number;

	/**
	 * 查询条数
	 */
	pageSize?: number;
}

/**
 * 图标列表查询接口
 * @description
 * 查询系统中的图标列表
 *
 * 上传内容包含图片文件， 故需要增加 `upType: UpType.file` 配置。
 */
export function sysmanagerIconsAll<T = PageDTO<IconListModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, IconAllQueryParams>({
		url: "/sysmanager/icons/all",
		options,
		httpParamWay: "query",
		upType: UpType.file,
		config: {
			method: "GET",
			data: {
				name: undefined,
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}
