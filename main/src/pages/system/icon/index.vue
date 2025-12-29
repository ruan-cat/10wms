<script setup lang="tsx">
import { ref, onMounted } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import { IconifyIconOffline } from "@/components/ReIcon";
import type { SimpleDataTableColumn } from "@/components/Table/types";
import SimpleDataTable from "@/components/Table/index.vue";

defineOptions({
	name: "Icon",
});

/** 表格数据 */
const dataList = ref([]);
/** 加载状态 */
const loading = ref(true);
/** 分页配置 */
const pagination = ref({
	total: 0,
	pageSize: 10,
	currentPage: 1,
});

/** 表格列配置 */
const columns: SimpleDataTableColumn[] = [
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
	},
	{
		label: "分类",
		prop: "category",
		minWidth: 100,
	},
	{
		label: "操作",
		fixed: "right" as const,
		width: 150,
		slot: "operation",
	},
];

/** 加载表格数据 */
async function onSearch() {
	loading.value = true;
	try {
		const response = await http.requestCompat({
			url: "/api/system/icon/list",
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
function handlePageChange({ currentPage, pageSize }: { currentPage: number; pageSize: number }) {
	pagination.value.currentPage = currentPage;
	pagination.value.pageSize = pageSize;
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
			is-index
			:pagination="pagination"
			@page-change="handlePageChange"
		>
			<template #operation="{ row }">
				<el-button link type="primary" size="small" @click="handleView(row)"> 查看 </el-button>
			</template>
		</SimpleDataTable>
	</div>
</template>
