<script setup lang="ts">
import { ref } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";

defineOptions({
	name: "Language",
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
const dialogTitle = ref("新增语言");
const formData = ref({
	languageCode: "",
	languageName: "",
	languageKey: "",
	languageValue: "",
	module: "",
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
		label: "语言代码",
		prop: "languageCode",
		minWidth: 120,
	},
	{
		label: "语言名称",
		prop: "languageName",
		minWidth: 120,
	},
	{
		label: "键名",
		prop: "languageKey",
		minWidth: 150,
	},
	{
		label: "键值",
		prop: "languageValue",
		minWidth: 200,
	},
	{
		label: "所属模块",
		prop: "module",
		minWidth: 120,
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
			url: "/api/system/language/list",
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
	dialogTitle.value = "新增语言";
	formData.value = {
		languageCode: "",
		languageName: "",
		languageKey: "",
		languageValue: "",
		module: "",
	};
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: any) {
	dialogTitle.value = "编辑语言";
	formData.value = { ...row };
	dialogVisible.value = true;
}

/** 查看 */
function handleView(row: any) {
	message(`查看: ${row.languageName}`, { type: "info" });
}

/** 删除 */
function handleDelete(row: any) {
	message(`删除: ${row.languageName}`, { type: "info" });
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
				<el-form-item label="语言代码">
					<el-input v-model="formData.languageCode" placeholder="请输入语言代码，如：zh-CN" />
				</el-form-item>
				<el-form-item label="语言名称">
					<el-input v-model="formData.languageName" placeholder="请输入语言名称，如：简体中文" />
				</el-form-item>
				<el-form-item label="键名">
					<el-input v-model="formData.languageKey" placeholder="请输入键名" />
				</el-form-item>
				<el-form-item label="键值">
					<el-input v-model="formData.languageValue" placeholder="请输入键值" />
				</el-form-item>
				<el-form-item label="所属模块">
					<el-input v-model="formData.module" placeholder="请输入所属模块" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSave">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>
