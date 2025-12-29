<script setup lang="ts">
import { ref } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";

defineOptions({
	name: "Category",
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
const dialogTitle = ref("新增分类");
const formData = ref({
	categoryName: "",
	categoryCode: "",
	icon: "",
	parentId: "",
	sort: 0,
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
		label: "类型名称",
		prop: "categoryName",
		minWidth: 150,
	},
	{
		label: "类型编码",
		prop: "categoryCode",
		minWidth: 120,
	},
	{
		label: "图标",
		prop: "icon",
		minWidth: 100,
	},
	{
		label: "所属上级",
		prop: "parentName",
		minWidth: 150,
	},
	{
		label: "排序",
		prop: "sort",
		minWidth: 80,
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
			url: "/api/system/category/list",
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
	dialogTitle.value = "新增分类";
	formData.value = {
		categoryName: "",
		categoryCode: "",
		icon: "",
		parentId: "",
		sort: 0,
	};
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: any) {
	dialogTitle.value = "编辑分类";
	formData.value = { ...row };
	dialogVisible.value = true;
}

/** 查看 */
function handleView(row: any) {
	message(`查看: ${row.categoryName}`, { type: "info" });
}

/** 删除 */
function handleDelete(row: any) {
	message(`删除: ${row.categoryName}`, { type: "info" });
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
				<el-form-item label="类型名称">
					<el-input v-model="formData.categoryName" placeholder="请输入类型名称" />
				</el-form-item>
				<el-form-item label="类型编码">
					<el-input v-model="formData.categoryCode" placeholder="请输入类型编码" />
				</el-form-item>
				<el-form-item label="图标">
					<el-input v-model="formData.icon" placeholder="请输入图标" />
				</el-form-item>
				<el-form-item label="所属上级">
					<el-input v-model="formData.parentId" placeholder="请选择所属上级" />
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="formData.sort" :min="0" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSave">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>
