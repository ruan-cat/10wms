<script setup lang="ts">
import { ref } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";

defineOptions({
	name: "ReceivedUnsold",
});

/** 表格数据 */
const dataList = ref([]);
/** 加载状态 */
const loading = ref(true);
/** 分页配置 */
const pagination = ref<PaginationProps>({
	total: 0,
	pageSize: 10,
	currentPage: 1,
	background: true,
});

/** 表格列配置 */
const columns: TableColumnList = [
	{
		type: "selection",
		width: 55,
		align: "left",
		hide: ({ checkList }) => !checkList.includes("勾选列"),
	},
	{
		label: "序号",
		type: "index",
		width: 70,
		hide: ({ checkList }) => !checkList.includes("序号列"),
	},
	{
		label: "到货通知单号",
		prop: "noticeNumber",
		minWidth: 120,
	},
	{
		label: "客户订单号",
		prop: "clientOrderNumber",
		minWidth: 120,
	},
	{
		label: "商品编码",
		prop: "productCode",
		minWidth: 120,
	},
	{
		label: "商品名称",
		prop: "productName",
		minWidth: 150,
	},
	{
		label: "收货数量",
		prop: "receivedQuantity",
		minWidth: 100,
	},
	{
		label: "未上架数量",
		prop: "unshelfedQuantity",
		minWidth: 100,
	},
	{
		label: "收货日期",
		prop: "receiveDate",
		minWidth: 120,
	},
	{
		label: "货主",
		prop: "owner",
		minWidth: 120,
	},
	{
		label: "操作",
		fixed: "right",
		width: 150,
		slot: "operation",
	},
];

/** 加载表格数据 */
async function onSearch() {
	loading.value = true;
	try {
		const response = await http.requestCompat({
			url: "/api/daily-check/received-unsold/list",
			method: "post",
			data: {
				pageIndex: pagination.value.currentPage,
				pageSize: pagination.value.pageSize,
			},
		});

		dataList.value = (response as any).data?.list || [];
		pagination.value.total = (response as any).data?.total || 0;
	} catch (error) {
		message("获取数据失败", { type: "error" });
	} finally {
		loading.value = false;
	}
}

/** 分页变化 */
function handleSizeChange(val: number) {
	pagination.value.pageSize = val;
	onSearch();
}

function handleCurrentChange(val: number) {
	pagination.value.currentPage = val;
	onSearch();
}

/** 查看详情 */
function handleView(row: any) {
	message(`查看: ${row.noticeNumber}`, { type: "info" });
}

/** 上架 */
function handleShelf(row: any) {
	message(`上架: ${row.noticeNumber}`, { type: "info" });
}

/** 初始化 */
onMounted(() => {
	onSearch();
});
</script>

<template>
	<div class="main">
		<SimpleDataTable
			:data="dataList"
			:columns="columns"
			:loading="loading"
			:pagination="pagination"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		>
			<template #operation="{ row }">
				<el-button link type="primary" size="small" @click="handleView(row)"> 查看 </el-button>
				<el-button link type="success" size="small" @click="handleShelf(row)"> 上架 </el-button>
			</template>
		</SimpleDataTable>
	</div>
</template>
