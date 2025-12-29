<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { IconifyIconOffline } from "@/components/ReIcon";

defineOptions({
	name: "WarehouseConfigOrderType",
});

/** 页面标题 */
const pageTitle = ref("订单类型");

/** 搜索表单 */
const searchForm = ref({
	typeName: "",
	typeCode: "",
});

/** 表格数据 */
const tableData = ref([]);

/** 表格加载状态 */
const loading = ref(false);

/** 分页配置 */
const pagination = ref({
	currentPage: 1,
	pageSize: 10,
	total: 0,
});

/** 对话框显示 */
const dialogVisible = ref(false);

/** 对话框标题 */
const dialogTitle = ref("");

/** 表单引用 */
const formRef = ref<FormInstance>();

/** 表单数据 */
const formData = reactive({
	id: undefined,
	typeCode: "",
	typeName: "",
	description: "",
	status: 1,
});

/** 表单验证规则 */
const formRules = reactive<FormRules>({
	typeCode: [{ required: true, message: "请输入订单类型编码", trigger: "blur" }],
	typeName: [{ required: true, message: "请输入订单类型名称", trigger: "blur" }],
});

/** 搜索 */
function handleSearch() {
	pagination.value.currentPage = 1;
	loadData();
}

/** 重置 */
function handleReset() {
	searchForm.value = {
		typeName: "",
		typeCode: "",
	};
	handleSearch();
}

/** 加载数据 */
async function loadData() {
	loading.value = true;
	try {
		// TODO: 调用 API 获取数据
		// const res = await getOrderTypeList({
		//   ...searchForm.value,
		//   pageIndex: pagination.value.currentPage,
		//   pageSize: pagination.value.pageSize
		// });
		// tableData.value = res.data.records;
		// pagination.value.total = res.data.total;
	} finally {
		loading.value = false;
	}
}

/** 新增 */
function handleAdd() {
	dialogTitle.value = "新增订单类型";
	resetForm();
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: any) {
	dialogTitle.value = "编辑订单类型";
	Object.assign(formData, row);
	dialogVisible.value = true;
}

/** 删除 */
async function handleDelete(row: any) {
	try {
		await ElMessageBox.confirm("确定要删除该订单类型吗？", "提示", {
			type: "warning",
		});
		// TODO: 调用删除 API
		// await deleteOrderType(row.id);
		ElMessage.success("删除成功");
		loadData();
	} catch (error) {
		// 用户取消删除
	}
}

/** 提交表单 */
async function handleSubmit() {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (valid) {
			try {
				if (formData.id) {
					// TODO: 调用更新 API
					// await updateOrderType(formData);
					ElMessage.success("更新成功");
				} else {
					// TODO: 调用新增 API
					// await addOrderType(formData);
					ElMessage.success("新增成功");
				}
				dialogVisible.value = false;
				loadData();
			} catch (error) {
				console.error(error);
			}
		}
	});
}

/** 重置表单 */
function resetForm() {
	formData.id = undefined;
	formData.typeCode = "";
	formData.typeName = "";
	formData.description = "";
	formData.status = 1;
	formRef.value?.clearValidate();
}

/** 页码改变 */
function handlePageChange(page: number) {
	pagination.value.currentPage = page;
	loadData();
}

/** 页大小改变 */
function handleSizeChange(size: number) {
	pagination.value.pageSize = size;
	pagination.value.currentPage = 1;
	loadData();
}

// 初始化加载数据
// loadData();
</script>

<template>
	<div class="order-type-container">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<el-form :model="searchForm" inline>
				<el-form-item label="类型编码">
					<el-input v-model="searchForm.typeCode" placeholder="请输入类型编码" clearable style="width: 200px" />
				</el-form-item>
				<el-form-item label="类型名称">
					<el-input v-model="searchForm.typeName" placeholder="请输入类型名称" clearable style="width: 200px" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">
						<template #icon>
							<IconifyIconOffline icon="ep:search" />
						</template>
						查询
					</el-button>
					<el-button @click="handleReset">
						<template #icon>
							<IconifyIconOffline icon="ep:refresh" />
						</template>
						重置
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 表格区域 -->
		<el-card shadow="never" class="table-card">
			<template #header>
				<div class="card-header">
					<span class="card-title">{{ pageTitle }}</span>
					<el-button type="primary" @click="handleAdd">
						<template #icon>
							<IconifyIconOffline icon="ep:plus" />
						</template>
						新增
					</el-button>
				</div>
			</template>

			<el-table :data="tableData" :loading="loading" border stripe style="width: 100%">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="typeCode" label="类型编码" min-width="120" />
				<el-table-column prop="typeName" label="类型名称" min-width="150" />
				<el-table-column prop="description" label="描述" min-width="200" />
				<el-table-column label="状态" width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? "启用" : "禁用" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" align="center" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" link @click="handleEdit(row)"> 编辑 </el-button>
						<el-button type="danger" size="small" link @click="handleDelete(row)"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-pagination
				v-model:current-page="pagination.currentPage"
				v-model:page-size="pagination.pageSize"
				:total="pagination.total"
				:page-sizes="[10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				background
				class="pagination"
				@size-change="handleSizeChange"
				@current-change="handlePageChange"
			/>
		</el-card>

		<!-- 新增/编辑对话框 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="600px"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-form-item label="类型编码" prop="typeCode">
					<el-input v-model="formData.typeCode" placeholder="请输入类型编码" clearable />
				</el-form-item>
				<el-form-item label="类型名称" prop="typeName">
					<el-input v-model="formData.typeName" placeholder="请输入类型名称" clearable />
				</el-form-item>
				<el-form-item label="描述">
					<el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入描述" />
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="formData.status">
						<el-radio :label="1">启用</el-radio>
						<el-radio :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.order-type-container {
	padding: 16px;

	.search-card {
		margin-bottom: 16px;
	}

	.table-card {
		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.card-title {
				font-size: 16px;
				font-weight: 500;
			}
		}

		.pagination {
			margin-top: 16px;
			justify-content: flex-end;
		}
	}
}
</style>
