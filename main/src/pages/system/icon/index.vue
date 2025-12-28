<script setup lang="ts">
import { ref } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";

defineOptions({
	name: "Icon",
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
		label: "图标名称",
		prop: "iconName",
		minWidth: 150,
	},
	{
		label: "图标代码",
		prop: "iconCode",
		minWidth: 150,
	},
	{
		label: "图标预览",
		prop: "iconPreview",
		minWidth: 100,
		cellRenderer: ({ row }) => <IconifyIconOffline icon={row.iconCode} width='24' height='24' />,
	},
	{
		label: "分类",
		prop: "category",
		minWidth: 100,
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
		const response = await http.request({
			url: "/api/system/icon/list",
			method: "post",
			data: {
				pageIndex: pagination.value.currentPage,
				pageSize: pagination.value.pageSize,
			},
		});

		dataList.value = response.data?.list || [];
		pagination.value.total = response.data?.total || 0;
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
	message(`查看: ${row.iconName}`, { type: "info" });
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
			</template>
		</SimpleDataTable>
	</div>
</template>
