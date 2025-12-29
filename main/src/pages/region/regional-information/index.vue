<template>
	<div class="regional-information-container">
		<el-card shadow="never">
			<template #header>
				<div class="card-header">
					<span>区域信息配置</span>
					<div class="header-actions">
						<el-button type="primary" @click="handleAdd">新增</el-button>
						<el-button type="danger" @click="handleBatchDelete" :disabled="!selectedRows.length"> 批量删除 </el-button>
					</div>
				</div>
			</template>

			<el-form :inline="true" :model="searchForm" class="search-form">
				<el-form-item label="地区代码">
					<el-input v-model="searchForm.cityCode" placeholder="请输入地区代码" clearable />
				</el-form-item>
				<el-form-item label="地区名称">
					<el-input v-model="searchForm.cityName" placeholder="请输入地区名称" clearable />
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
			width="700px"
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
				<el-form-item label="地区代码" prop="cityCode">
					<el-input v-model="formData.cityCode" placeholder="请输入地区代码" />
				</el-form-item>
				<el-form-item label="地区名称" prop="cityName">
					<el-input v-model="formData.cityName" placeholder="请输入地区名称" />
				</el-form-item>
				<el-form-item label="地区助记码" prop="citySerc">
					<el-input v-model="formData.citySerc" placeholder="请输入地区助记码" />
				</el-form-item>
				<el-form-item label="城市类型" prop="cityType">
					<el-input v-model="formData.cityType" placeholder="请输入城市类型" />
				</el-form-item>
				<el-form-item label="片区信息" prop="bareaName">
					<el-input v-model="formData.bareaName" placeholder="请输入片区信息" />
				</el-form-item>
				<el-form-item label="大区信息" prop="areaName">
					<el-input v-model="formData.areaName" placeholder="请输入大区信息" />
				</el-form-item>
				<el-form-item label="状态" prop="cityDel">
					<el-select v-model="formData.cityDel" placeholder="请选择状态">
						<el-option label="启用" value="0" />
						<el-option label="停用" value="1" />
					</el-select>
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
import SimpleDataTable from "@/components/SimpleDataTable/index.vue";

/** 搜索表单 */
const searchForm = reactive({
	cityCode: "",
	cityName: "",
});

/** 表格数据 */
const tableData = ref([]);
const loading = ref(false);
const selectedRows = ref([]);

/** 表格列配置 */
const tableColumns = [
	{ type: "selection", width: 55 },
	{ type: "index", label: "序号", width: 60 },
	{ prop: "cityCode", label: "地区代码", minWidth: 120 },
	{ prop: "cityName", label: "地区名称", minWidth: 120 },
	{ prop: "citySerc", label: "地区助记码", minWidth: 120 },
	{ prop: "cityType", label: "城市类型", minWidth: 120 },
	{ prop: "bareaName", label: "片区信息", minWidth: 120 },
	{ prop: "areaName", label: "大区信息", minWidth: 120 },
	{ prop: "cityDel", label: "状态", minWidth: 100 },
	{ prop: "operation", label: "操作", width: 200, fixed: "right" },
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
	cityCode: "",
	cityName: "",
	citySerc: "",
	cityType: "",
	bareaName: "",
	areaName: "",
	cityDel: "0",
});

/** 表单验证规则 */
const formRules: FormRules = {
	cityCode: [{ required: true, message: "请输入地区代码", trigger: "blur" }],
	cityName: [{ required: true, message: "请输入地区名称", trigger: "blur" }],
	citySerc: [{ required: true, message: "请输入地区助记码", trigger: "blur" }],
	cityType: [{ required: true, message: "请输入城市类型", trigger: "blur" }],
	bareaName: [{ required: true, message: "请输入片区信息", trigger: "blur" }],
	areaName: [{ required: true, message: "请输入大区信息", trigger: "blur" }],
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
			url: "/api/region/regional-information/list",
			method: "post",
			data: params,
		}); if ((response as any).data) {
			tableData.value = (response as any).data.rows.map((item) => ({
				...item,
				cityDel: item.cityDel === "0" ? "启用" : "停用",
			}));
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
	searchForm.cityCode = "";
	searchForm.cityName = "";
	pagination.currentPage = 1;
	getList();
}

/** 新增 */
function handleAdd() {
	dialogTitle.value = "新增";
	Object.assign(formData, {
		id: "",
		cityCode: "",
		cityName: "",
		citySerc: "",
		cityType: "",
		bareaName: "",
		areaName: "",
		cityDel: "0",
	});
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: any) {
	dialogTitle.value = "编辑";
	Object.assign(formData, {
		...row,
		cityDel: row.cityDel === "启用" ? "0" : "1",
	});
	dialogVisible.value = true;
}

/** 查看 */
function handleView(row: any) {
	dialogTitle.value = "查看";
	Object.assign(formData, {
		...row,
		cityDel: row.cityDel === "启用" ? "0" : "1",
	});
	dialogVisible.value = true;
}

/** 提交表单 */
async function handleSubmit() {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (valid) {
			try {
				const url = formData.id ? "/api/region/regional-information/update" : "/api/region/regional-information/add";

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
			url: "/api/region/regional-information/delete",
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
			url: "/api/region/regional-information/delete",
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
function handlePageChange(page: number, size: number) {
	pagination.currentPage = page;
	pagination.pageSize = size;
	getList();
}

onMounted(() => {
	getList();
});
</script>

<style scoped lang="scss">
.regional-information-container {
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
