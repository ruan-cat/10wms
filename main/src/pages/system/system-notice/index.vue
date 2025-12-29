<script setup lang="tsx">
import { ref } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";

defineOptions({
	name: "SystemNotice",
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
const dialogTitle = ref("新增公告");
const formData = ref({
	noticeTitle: "",
	noticeContent: "",
	noticeType: "公告",
	noticeLevel: "全员",
	noticeTerm: "",
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
		label: "通知标题",
		prop: "noticeTitle",
		minWidth: 200,
	},
	{
		label: "类型名称",
		prop: "noticeType",
		minWidth: 100,
		cellRenderer: ({ row }) => {
			const typeMap = {
				通知: "info",
				公告: "success",
			};
			return <el-tag type={typeMap[row.noticeType] || "info"}>{row.noticeType}</el-tag>;
		},
	},
	{
		label: "授权级别",
		prop: "noticeLevel",
		minWidth: 100,
	},
	{
		label: "阅读期限",
		prop: "noticeTerm",
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
			url: "/api/system/notice/list",
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
	dialogTitle.value = "新增公告";
	formData.value = {
		noticeTitle: "",
		noticeContent: "",
		noticeType: "公告",
		noticeLevel: "全员",
		noticeTerm: "",
	};
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: any) {
	dialogTitle.value = "编辑公告";
	formData.value = { ...row };
	dialogVisible.value = true;
}

/** 查看 */
function handleView(row: any) {
	message(`查看: ${row.noticeTitle}`, { type: "info" });
}

/** 删除 */
function handleDelete(row: any) {
	message(`删除: ${row.noticeTitle}`, { type: "info" });
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
				录入
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
				<el-form-item label="标题">
					<el-input v-model="formData.noticeTitle" placeholder="请输入标题" />
				</el-form-item>
				<el-form-item label="内容">
					<el-input v-model="formData.noticeContent" type="textarea" :rows="4" placeholder="请输入内容" />
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="formData.noticeType">
						<el-radio value="通知">通知</el-radio>
						<el-radio value="公告">公告</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="授权级别">
					<el-radio-group v-model="formData.noticeLevel">
						<el-radio value="全员">全员</el-radio>
						<el-radio value="角色授权">角色授权</el-radio>
						<el-radio value="用户授权">用户授权</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="阅读期限">
					<el-date-picker v-model="formData.noticeTerm" type="date" placeholder="请选择阅读期限" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSave">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>
