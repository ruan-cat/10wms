<script setup lang="tsx">
import { ref } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";

defineOptions({
	name: "ReceivingRegister",
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

/** 搜索表单 */
const searchForm = ref({
	noticeNumber: "",
	clientOrderNumber: "",
	productCode: "",
	productName: "",
	pallet: "",
	location: "",
	owner: "",
	isShelfed: "",
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
		label: "验收人",
		prop: "acceptor",
		minWidth: 100,
	},
	{
		label: "收货日期",
		prop: "receiveDate",
		minWidth: 120,
	},
	{
		label: "到货通知单",
		prop: "noticeNumber",
		minWidth: 120,
	},
	{
		label: "商品编码",
		prop: "productCode",
		minWidth: 120,
	},
	{
		label: "客户订单号",
		prop: "clientOrderNumber",
		minWidth: 120,
	},
	{
		label: "运输号码",
		prop: "transportNumber",
		minWidth: 120,
	},
	{
		label: "运输公司",
		prop: "transportCompany",
		minWidth: 120,
	},
	{
		label: "供应商编号",
		prop: "supplierCode",
		minWidth: 120,
	},
	{
		label: "供应商名称",
		prop: "supplierName",
		minWidth: 150,
	},
	{
		label: "订单类型",
		prop: "orderType",
		minWidth: 100,
	},
	{
		label: "备注",
		prop: "remark",
		minWidth: 150,
	},
	{
		label: "单据状态",
		prop: "status",
		minWidth: 100,
		cellRenderer: ({ row }) => {
			const statusMap = {
				已处理: "success",
				处理中: "warning",
				未处理: "info",
				已完成: "success",
			};
			return <el-tag type={statusMap[row.status] || "info"}>{row.status}</el-tag>;
		},
	},
	{
		label: "操作",
		fixed: "right",
		width: 200,
		slot: "operation",
	},
];

/** 加载表格数据 */
async function onSearch() {
	loading.value = true;
	try {
		const response = await http.requestCompat({
			url: "/api/purchase/receiving-register/list",
			method: "post",
			data: {
				...searchForm.value,
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

/** 重置搜索 */
function resetSearch() {
	searchForm.value = {
		noticeNumber: "",
		clientOrderNumber: "",
		productCode: "",
		productName: "",
		pallet: "",
		location: "",
		owner: "",
		isShelfed: "",
	};
	onSearch();
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

/** 录入 */
function handleAdd() {
	message("录入功能", { type: "info" });
}

/** 编辑 */
function handleEdit(row: any) {
	message(`编辑: ${row.noticeNumber}`, { type: "info" });
}

/** 查看 */
function handleView(row: any) {
	message(`查看: ${row.noticeNumber}`, { type: "info" });
}

/** 删除 */
function handleDelete(row: any) {
	message(`删除: ${row.noticeNumber}`, { type: "info" });
}

/** 上架 */
function handleShelf(row: any) {
	message(`上架: ${row.noticeNumber}`, { type: "info" });
}

/** 导入 */
function handleImport() {
	message("导入功能", { type: "info" });
}

/** 导出 */
function handleExport() {
	message("导出功能", { type: "info" });
}

/** 模板下载 */
function handleDownloadTemplate() {
	message("模板下载功能", { type: "info" });
}

/** 初始化 */
onMounted(() => {
	onSearch();
});
</script>

<template>
	<div class="main">
		<el-form :model="searchForm" :inline="true">
			<el-form-item label="到货通知单号">
				<el-input v-model="searchForm.noticeNumber" placeholder="请输入" clearable />
			</el-form-item>
			<el-form-item label="客户订单号">
				<el-input v-model="searchForm.clientOrderNumber" placeholder="请输入" clearable />
			</el-form-item>
			<el-form-item label="商品编码">
				<el-input v-model="searchForm.productCode" placeholder="请输入" clearable />
			</el-form-item>
			<el-form-item label="商品名称">
				<el-input v-model="searchForm.productName" placeholder="请输入" clearable />
			</el-form-item>
			<el-form-item label="托盘">
				<el-input v-model="searchForm.pallet" placeholder="请输入" clearable />
			</el-form-item>
			<el-form-item label="储位">
				<el-input v-model="searchForm.location" placeholder="请输入" clearable />
			</el-form-item>
			<el-form-item label="货主">
				<el-input v-model="searchForm.owner" placeholder="请输入" clearable />
			</el-form-item>
			<el-form-item label="是否已上架">
				<el-select v-model="searchForm.isShelfed" placeholder="请选择" clearable>
					<el-option label="是" value="1" />
					<el-option label="否" value="0" />
					<el-option label="初始" value="2" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSearch">
					<template #icon>
						<IconifyIconOffline icon="ep:search" />
					</template>
					搜索
				</el-button>
				<el-button @click="resetSearch">
					<template #icon>
						<IconifyIconOffline icon="ep:refresh" />
					</template>
					重置
				</el-button>
			</el-form-item>
		</el-form>

		<div class="mb-4">
			<el-button type="primary" @click="handleAdd">
				<template #icon>
					<IconifyIconOffline icon="ep:plus" />
				</template>
				录入
			</el-button>
			<el-button @click="handleImport">
				<template #icon>
					<IconifyIconOffline icon="ep:upload" />
				</template>
				导入
			</el-button>
			<el-button @click="handleExport">
				<template #icon>
					<IconifyIconOffline icon="ep:download" />
				</template>
				导出
			</el-button>
			<el-button @click="handleDownloadTemplate">
				<template #icon>
					<IconifyIconOffline icon="ep:document" />
				</template>
				模板下载
			</el-button>
		</div>

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
				<el-button link type="success" size="small" @click="handleShelf(row)"> 上架 </el-button>
			</template>
		</SimpleDataTable>
	</div>
</template>
