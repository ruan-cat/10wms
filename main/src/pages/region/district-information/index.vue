<template>
	<div class="district-information-container">
		<el-card shadow="never">
			<template #header>
				<div class="card-header">
					<span>区县信息配置</span>
					<div class="header-actions">
						<el-button type="primary" @click="handleAdd">新增</el-button>
						<el-button type="danger" @click="handleBatchDelete" :disabled="!selectedRows.length"> 批量删除 </el-button>
					</div>
				</div>
			</template>

			<el-form :inline="true" :model="searchForm" class="search-form">
				<el-form-item label="片区代码">
					<el-input v-model="searchForm.regionCode" placeholder="请输入片区代码" clearable />
				</el-form-item>
				<el-form-item label="片区名称">
					<el-input v-model="searchForm.regionName" placeholder="请输入片区名称" clearable />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>

			<SimpleDataTable
				:data="tableData"
				:columns="tableColumns"
				:loading="loading"
				is-index
				is-multiple-select
				:pagination="pagination"
				@selection-change="handleSelectionChange"
				@page-change="handlePageChange"
			>
				<template #operation="{ row }">
					<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
					<el-button type="primary" link @click="handleView(row)">查看</el-button>
					<el-popconfirm title="确定要删除吗？" @confirm="handleDelete(row)">
						<template #reference>
							<el-button type="danger" link>删除</el-button>
						</template>
					</el-popconfirm>
				</template>
			</SimpleDataTable>
		</el-card>

		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="600px"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<el-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				label-width="120px"
				:disabled="dialogTitle === '查看'"
			>
				<el-form-item label="片区代码" prop="regionCode">
					<el-input v-model="formData.regionCode" placeholder="请输入片区代码" />
				</el-form-item>
				<el-form-item label="片区名称" prop="regionName">
					<el-input v-model="formData.regionName" placeholder="请输入片区名称" />
				</el-form-item>
				<el-form-item label="回单时限" prop="regionRdata">
					<el-input v-model="formData.regionRdata" placeholder="请输入回单时限" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button v-if="dialogTitle !== '查看'" type="primary" @click="handleSubmit"> 确定 </el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { http } from "@/utils/http";
import SimpleDataTable from "@/components/Table/index.vue";

/** 搜索表单 */
const searchForm = reactive({
	regionCode: "",
	regionName: "",
});

/** 表格数据 */
const tableData = ref([]);
const loading = ref(false);
const selectedRows = ref([]);

/** 表格列配置 */
const tableColumns = [
	{ prop: "regionCode", label: "片区代码", minWidth: 150 },
	{ prop: "regionName", label: "片区名称", minWidth: 150 },
	{ prop: "regionRdata", label: "回单时限", minWidth: 150 },
	{ prop: "operation", label: "操作", width: 200, fixed: "right" as const },
];

/** 分页配置 */
const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0,
});

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref<FormInstance>();
const formData = reactive({
	id: "",
	regionCode: "",
	regionName: "",
	regionRdata: "",
});

/** 表单验证规则 */
const formRules: FormRules = {
	regionCode: [{ required: true, message: "请输入片区代码", trigger: "blur" }],
	regionName: [{ required: true, message: "请输入片区名称", trigger: "blur" }],
	regionRdata: [{ required: true, message: "请输入回单时限", trigger: "blur" }],
};

/** 获取列表数据 */
async function getList() {
	loading.value = true;
	try {
		const params = {
			page: pagination.currentPage,
			size: pagination.pageSize,
			...searchForm,
		};
		const response = await http.requestCompat({
			url: "/api/region/district-information/list",
			method: "post",
			data: params,
		});
		if ((response as any).data) {
			tableData.value = (response as any).data.rows;
			pagination.total = (response as any).data.total;
		}
	} catch (error) {
		ElMessage.error("获取数据失败");
	} finally {
		loading.value = false;
	}
}

/** 搜索 */
function handleSearch() {
	pagination.currentPage = 1;
	getList();
}

/** 重置 */
function handleReset() {
	searchForm.regionCode = "";
	searchForm.regionName = "";
	pagination.currentPage = 1;
	getList();
}

/** 新增 */
function handleAdd() {
	dialogTitle.value = "新增";
	Object.assign(formData, {
		id: "",
		regionCode: "",
		regionName: "",
		regionRdata: "",
	});
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: any) {
	dialogTitle.value = "编辑";
	Object.assign(formData, row);
	dialogVisible.value = true;
}

/** 查看 */
function handleView(row: any) {
	dialogTitle.value = "查看";
	Object.assign(formData, row);
	dialogVisible.value = true;
}

/** 提交表单 */
async function handleSubmit() {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (valid) {
			try {
				const url = formData.id ? "/api/region/district-information/update" : "/api/region/district-information/add";

				await http.requestCompat({
					url,
					method: "post",
					data: formData,
				});

				ElMessage.success(formData.id ? "修改成功" : "新增成功");
				dialogVisible.value = false;
				getList();
			} catch (error) {
				ElMessage.error("操作失败");
			}
		}
	});
}

/** 删除 */
async function handleDelete(row: any) {
	try {
		await http.requestCompat({
			url: "/api/region/district-information/delete",
			method: "post",
			data: { id: row.id },
		});

		ElMessage.success("删除成功");
		getList();
	} catch (error) {
		ElMessage.error("删除失败");
	}
}

/** 批量删除 */
async function handleBatchDelete() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning("请选择要删除的数据");
		return;
	}

	try {
		await ElMessageBox.confirm("确定要删除选中的数据吗？", "提示", {
			type: "warning",
		});

		const ids = selectedRows.value.map((row: any) => row.id).join(",");
		await http.requestCompat({
			url: "/api/region/district-information/delete",
			method: "post",
			data: { ids },
		});

		ElMessage.success("删除成功");
		getList();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error("删除失败");
		}
	}
}

/** 选择变化 */
function handleSelectionChange(selection: any[]) {
	selectedRows.value = selection;
}

/** 分页变化 */
function handlePageChange({ currentPage, pageSize }: { currentPage: number; pageSize: number }) {
	pagination.currentPage = currentPage;
	pagination.pageSize = pageSize;
	getList();
}

onMounted(() => {
	getList();
});
</script>

<style scoped lang="scss">
.district-information-container {
	padding: 20px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-actions {
	display: flex;
	gap: 10px;
}

.search-form {
	margin-bottom: 20px;
}
</style>
