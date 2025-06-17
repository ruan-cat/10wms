/**
 * 获取出货未上架查询参数
 * @description
 * 查询出货未上架商品的筛选条件
 */
export interface GetNoUpGoodsParams {
	/**
	 * 储位
	 */
	bin_id?: string;
	/**
	 * 客户编码
	 */
	cus_code?: string;
	/**
	 * 商品编码
	 */
	goods_id?: string;
	/**
	 * 查询页码
	 */
	pageIndex?: number;
	/**
	 * 查询条数
	 */
	pageSize?: number;
	/**
	 * 商品名称
	 */
	shp_ming_cheng?: string;
	/**
	 * 托盘
	 */
	tin_id?: string;
	/**
	 * 客户名称
	 */
	zhong_wen_qch?: string;
}

/**
 * 收货未上架-返回数据
 */
export interface NoUpGoodsDTO {
	/**
	 * 储位
	 */
	bin_id: string;
	/**
	 * 保质期
	 */
	bzhi_qi: string;
	/**
	 * 收货日期
	 */
	create_date: string;
	/**
	 * 客户编码
	 */
	cus_code: string;
	/**
	 * 商品编码
	 */
	goods_id: string;
	/**
	 * 库存状态
	 */
	kucunsta: string;
	/**
	 * 生产日期
	 */
	pro_data: string;
	/**
	 * 数量
	 */
	qm_ok_quat: string;
	/**
	 * 商品单位
	 */
	shl_dan_wei: string;
	/**
	 * 商品名称
	 */
	shp_ming_cheng: string;
	/**
	 * 托盘
	 */
	tin_id: string;
	/**
	 * 客户名称
	 */
	zhong_wen_qch: string;
}

/**
 * 获取出货未上架
 * @description
 * 查询出货未上架的商品列表
 */
export function getNoUpGoods<T = NoUpGoodsDTO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetNoUpGoodsParams>({
		url: "/daycheck/no-up/get-no-up-goods",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}
