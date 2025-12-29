<script setup lang="tsx">
import { ref } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";

defineOptions({
	name: "RFID",
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

/** 对话框状态 */
const dialogVisible = ref(false);
const dialogTitle = ref("新增RFID");
const formData = ref({
	rfidCode: "",
	productCode: "",
	productName: "",
	batchNumber: "",
	quantity: 0,
	location: "",
	status: "",
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
		label: "RFID编码",
		prop: "rfidCode",
		minWidth: 150,
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
		label: "批次号",
		prop: "batchNumber",
		minWidth: 120,
	},
	{
		label: "数量",
		prop: "quantity",
		minWidth: 100,
	},
	{
		label: "储位",
		prop: "location",
		minWidth: 100,
	},
	{
		label: "状态",
		prop: "status",
		minWidth: 100,
		cellRenderer: ({ row }) => {
			const statusMap = {
				在库: "success",
				出库: "warning",
				报废: "danger",
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
		const response = await http.request({
			url: "/api/base-data/rfid/list",
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

/** 新增 */
function handleAdd() {
	dialogTitle.value = "新增RFID";
	formData.value = {
		rfidCode: "",
		productCode: "",
		productName: "",
		batchNumber: "",
		quantity: 0,
		location: "",
		status: "",
	};
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: any) {
	dialogTitle.value = "编辑RFID";
	formData.value = { ...row };
	dialogVisible.value = true;
}

/** 查看 */
function handleView(row: any) {
	message(`查看: ${row.rfidCode}`, { type: "info" });
}

/** 删除 */
function handleDelete(row: any) {
	message(`删除: ${row.rfidCode}`, { type: "info" });
}

/** 保存 */
function handleSave() {
	dialogVisible.value = false;
	message("保存成功", { type: "success" });
	onSearch();
}

/** 初始化 */
onMounted(() => {
	onSearch();
});
</script>

<template>
	<div class="main">
		<div class="mb-4">
			<el-button type="primary" @click="handleAdd">
				<template #icon>
					<IconifyIconOffline icon="ep:plus" />
				</template>
				新增
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
			</template>
		</SimpleDataTable>

		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
			<el-form :model="formData" label-width="100px">
				<el-form-item label="RFID编码">
					<el-input v-model="formData.rfidCode" placeholder="请输入RFID编码" />
				</el-form-item>
				<el-form-item label="商品编码">
					<el-input v-model="formData.productCode" placeholder="请输入商品编码" />
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="formData.productName" placeholder="请输入商品名称" />
				</el-form-item>
				<el-form-item label="批次号">
					<el-input v-model="formData.batchNumber" placeholder="请输入批次号" />
				</el-form-item>
				<el-form-item label="数量">
					<el-input-number v-model="formData.quantity" :min="0" />
				</el-form-item>
				<el-form-item label="储位">
					<el-input v-model="formData.location" placeholder="请输入储位" />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="formData.status" placeholder="请选择状态">
						<el-option label="在库" value="在库" />
						<el-option label="出库" value="出库" />
						<el-option label="报废" value="报废" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSave">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>
