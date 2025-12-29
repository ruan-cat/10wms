<script setup lang="tsx">
import { ref } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";

defineOptions({
	name: "ReceivedUnlistedStock",
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
		label: "托盘",
		prop: "pallet",
		minWidth: 100,
	},
	{
		label: "储位",
		prop: "location",
		minWidth: 100,
	},
	{
		label: "货主",
		prop: "owner",
		minWidth: 120,
	},
	{
		label: "是否已上架",
		prop: "isShelfed",
		minWidth: 100,
		cellRenderer: ({ row }) => (
			<el-tag type={row.isShelfed ? "success" : "warning"}>{row.isShelfed ? "是" : "否"}</el-tag>
		),
	},
	{
		label: "操作",
		fixed: "right",
		width: 180,
		slot: "operation",
	},
];

/** 加载表格数据 */
async function onSearch() {
	loading.value = true;
	try {
		const response = await http.requestCompat({
			url: "/api/purchase/received-unlisted-stock/list",
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

/** 编辑 */
function handleEdit(row: any) {
	message(`编辑: ${row.noticeNumber}`, { type: "info" });
}

/** 删除 */
function handleDelete(row: any) {
	message(`删除: ${row.noticeNumber}`, { type: "info" });
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
				<el-button link type="primary" size="small" @click="handleEdit(row)"> 编辑 </el-button>
				<el-button link type="danger" size="small" @click="handleDelete(row)"> 删除 </el-button>
			</template>
		</SimpleDataTable>
	</div>
</template>
