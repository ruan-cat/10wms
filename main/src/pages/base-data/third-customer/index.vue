<script setup lang="ts">
import { ref } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";

defineOptions({
	name: "ThirdCustomer",
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
const dialogTitle = ref("新增第三方客户");
const formData = ref({
	customerCode: "",
	customerName: "",
	contactPerson: "",
	contactPhone: "",
	address: "",
	email: "",
	remark: "",
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
		label: "客户编码",
		prop: "customerCode",
		minWidth: 120,
	},
	{
		label: "客户名称",
		prop: "customerName",
		minWidth: 150,
	},
	{
		label: "联系人",
		prop: "contactPerson",
		minWidth: 100,
	},
	{
		label: "联系电话",
		prop: "contactPhone",
		minWidth: 120,
	},
	{
		label: "地址",
		prop: "address",
		minWidth: 200,
	},
	{
		label: "邮箱",
		prop: "email",
		minWidth: 150,
	},
	{
		label: "备注",
		prop: "remark",
		minWidth: 150,
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
			url: "/api/base-data/third-customer/list",
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

/** 新增 */
function handleAdd() {
	dialogTitle.value = "新增第三方客户";
	formData.value = {
		customerCode: "",
		customerName: "",
		contactPerson: "",
		contactPhone: "",
		address: "",
		email: "",
		remark: "",
	};
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: any) {
	dialogTitle.value = "编辑第三方客户";
	formData.value = { ...row };
	dialogVisible.value = true;
}

/** 查看 */
function handleView(row: any) {
	message(`查看: ${row.customerName}`, { type: "info" });
}

/** 删除 */
function handleDelete(row: any) {
	message(`删除: ${row.customerName}`, { type: "info" });
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
				<el-form-item label="客户编码">
					<el-input v-model="formData.customerCode" placeholder="请输入客户编码" />
				</el-form-item>
				<el-form-item label="客户名称">
					<el-input v-model="formData.customerName" placeholder="请输入客户名称" />
				</el-form-item>
				<el-form-item label="联系人">
					<el-input v-model="formData.contactPerson" placeholder="请输入联系人" />
				</el-form-item>
				<el-form-item label="联系电话">
					<el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
				</el-form-item>
				<el-form-item label="地址">
					<el-input v-model="formData.address" placeholder="请输入地址" />
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="formData.email" placeholder="请输入邮箱" />
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSave">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>
