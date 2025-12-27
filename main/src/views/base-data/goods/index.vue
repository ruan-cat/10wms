<template>
	<div class="goods-management">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<el-form :model="searchForm" :inline="true">
				<el-form-item label="商品编码">
					<el-input v-model="searchForm.goodsCode" placeholder="请输入商品编码" clearable />
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="searchForm.goodsName" placeholder="请输入商品名称" clearable />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
					<el-button :icon="Refresh" @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 操作按钮区域 -->
		<el-card shadow="never" class="toolbar-card">
			<el-button v-perms="['base:goods:add']" type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			<el-button v-perms="['base:goods:edit']" type="success" :icon="Edit" @click="handleEdit" :disabled="!selectedRow">
				编辑
			</el-button>
			<el-button
				v-perms="['base:goods:delete']"
				type="danger"
				:icon="Delete"
				@click="handleDelete"
				:disabled="!selectedRow"
			>
				删除
			</el-button>
			<el-button v-perms="['base:goods:export']" type="info" :icon="Download" @click="handleExport">导出</el-button>
			<el-button v-perms="['base:goods:import']" type="warning" :icon="Upload" @click="handleImport">导入</el-button>
		</el-card>

		<!-- 表格区域 -->
		<el-card shadow="never">
			<el-table
				v-loading="loading"
				:data="tableData"
				border
				stripe
				highlight-current-row
				@current-change="handleCurrentChange"
				style="width: 100%"
			>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="goodsCode" label="商品编码" min-width="120" />
				<el-table-column prop="goodsName" label="商品名称" min-width="150" />
				<el-table-column prop="specification" label="规格型号" min-width="120" />
				<el-table-column prop="unit" label="计量单位" width="100" align="center" />
				<el-table-column prop="costPrice" label="成本价" width="100" align="right">
					<template #default="{ row }">
						<span>{{ row.costPrice ? `¥${row.costPrice.toFixed(2)}` : "-" }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="salePrice" label="销售价" width="100" align="right">
					<template #default="{ row }">
						<span>{{ row.salePrice ? `¥${row.salePrice.toFixed(2)}` : "-" }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="stockQuantity" label="库存数量" width="100" align="right" />
				<el-table-column prop="status" label="状态" width="80" align="center">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? "启用" : "禁用" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" align="center" fixed="right">
					<template #default="{ row }">
						<el-button v-perms="['base:goods:edit']" type="primary" size="small" link @click="handleEdit(row)">
							编辑
						</el-button>
						<el-button v-perms="['base:goods:delete']" type="danger" size="small" link @click="handleDelete(row)">
							删除
						</el-button>
						<el-button v-perms="['base:goods:view']" type="info" size="small" link @click="handleView(row)">
							详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-pagination
				v-model:current-page="pagination.page"
				v-model:page-size="pagination.size"
				:total="pagination.total"
				:page-sizes="[10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handlePageSizeChange"
				@current-change="handlePageChange"
				style="margin-top: 20px; justify-content: flex-end"
			/>
		</el-card>

		<!-- 新增/编辑对话框 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="700px"
			:close-on-click-modal="false"
			@close="handleDialogClose"
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="商品编码" prop="goodsCode">
							<el-input v-model="formData.goodsCode" placeholder="请输入商品编码" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="商品名称" prop="goodsName">
							<el-input v-model="formData.goodsName" placeholder="请输入商品名称" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="规格型号" prop="specification">
							<el-input v-model="formData.specification" placeholder="请输入规格型号" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="计量单位" prop="unit">
							<el-input v-model="formData.unit" placeholder="请输入计量单位" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="条形码" prop="barcode">
							<el-input v-model="formData.barcode" placeholder="请输入条形码" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="安全库存" prop="safetyStock">
							<el-input-number v-model="formData.safetyStock" :min="0" placeholder="请输入安全库存" class="w-full" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="成本价" prop="costPrice">
							<el-input-number
								v-model="formData.costPrice"
								:min="0"
								:precision="2"
								placeholder="请输入成本价"
								class="w-full"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="销售价" prop="salePrice">
							<el-input-number
								v-model="formData.salePrice"
								:min="0"
								:precision="2"
								placeholder="请输入销售价"
								class="w-full"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="状态" prop="status">
					<el-radio-group v-model="formData.status">
						<el-radio :value="1">启用</el-radio>
						<el-radio :value="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, Download, Upload } from "@element-plus/icons-vue";
import {
	getGoodsList,
	addGoods,
	updateGoods,
	deleteGoods,
	exportGoods,
	type GoodsQueryParams,
} from "@/api/base-data/goods";

defineOptions({
	name: "BaseDataGoods",
});

/** 搜索表单 */
const searchForm = reactive<GoodsQueryParams>({
	goodsCode: "",
	goodsName: "",
	status: undefined,
	page: 1,
	size: 10,
});

/** 表格数据 */
const tableData = ref([]);
const loading = ref(false);
const selectedRow = ref(null);

/** 分页 */
const pagination = reactive({
	page: 1,
	size: 10,
	total: 0,
});

/** 对话框 */
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const submitLoading = ref(false);

/** 表单 */
const formRef = ref<FormInstance>();
const formData = reactive({
	id: "",
	goodsCode: "",
	goodsName: "",
	specification: "",
	unit: "",
	barcode: "",
	costPrice: undefined,
	salePrice: undefined,
	safetyStock: 0,
	status: 1,
	remark: "",
});

/** 表单验证规则 */
const formRules: FormRules = {
	goodsCode: [{ required: true, message: "请输入商品编码", trigger: "blur" }],
	goodsName: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
	unit: [{ required: true, message: "请输入计量单位", trigger: "blur" }],
};

/** 获取商品列表 */
const fetchGoodsList = async () => {
	loading.value = true;
	try {
		const params = {
			...searchForm,
			page: pagination.page,
			size: pagination.size,
		};
		const result = await getGoodsList(params);
		tableData.value = result.list;
		pagination.total = result.total;
	} catch (error) {
		ElMessage.error("获取商品列表失败");
	} finally {
		loading.value = false;
	}
};

/** 搜索 */
const handleSearch = () => {
	pagination.page = 1;
	fetchGoodsList();
};

/** 重置搜索 */
const handleReset = () => {
	searchForm.goodsCode = "";
	searchForm.goodsName = "";
	searchForm.status = undefined;
	pagination.page = 1;
	fetchGoodsList();
};

/** 表格行选中 */
const handleCurrentChange = (row: any) => {
	selectedRow.value = row;
};

/** 分页大小改变 */
const handlePageSizeChange = (size: number) => {
	pagination.size = size;
	fetchGoodsList();
};

/** 分页页码改变 */
const handlePageChange = (page: number) => {
	pagination.page = page;
	fetchGoodsList();
};

/** 新增 */
const handleAdd = () => {
	isEdit.value = false;
	dialogTitle.value = "新增商品";
	resetFormData();
	dialogVisible.value = true;
};

/** 编辑 */
const handleEdit = (row?: any) => {
	const editRow = row || selectedRow.value;
	if (!editRow) {
		ElMessage.warning("请选择要编辑的商品");
		return;
	}
	isEdit.value = true;
	dialogTitle.value = "编辑商品";
	Object.assign(formData, editRow);
	dialogVisible.value = true;
};

/** 删除 */
const handleDelete = async (row?: any) => {
	const deleteRow = row || selectedRow.value;
	if (!deleteRow) {
		ElMessage.warning("请选择要删除的商品");
		return;
	}

	try {
		await ElMessageBox.confirm("确定要删除该商品吗？", "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		});

		await deleteGoods(deleteRow.id);
		ElMessage.success("删除成功");
		fetchGoodsList();
	} catch (error) {
		if (error !== "cancel") {
			ElMessage.error("删除失败");
		}
	}
};

/** 查看详情 */
const handleView = (row: any) => {
	ElMessage.info("查看详情功能开发中");
};

/** 提交表单 */
const handleSubmit = async () => {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (!valid) return;

		submitLoading.value = true;
		try {
			if (isEdit.value) {
				await updateGoods(formData);
				ElMessage.success("编辑成功");
			} else {
				await addGoods(formData);
				ElMessage.success("新增成功");
			}
			dialogVisible.value = false;
			fetchGoodsList();
		} catch (error) {
			ElMessage.error(isEdit.value ? "编辑失败" : "新增失败");
		} finally {
			submitLoading.value = false;
		}
	});
};

/** 导出 */
const handleExport = async () => {
	try {
		await exportGoods(searchForm);
		ElMessage.success("导出成功");
	} catch (error) {
		ElMessage.error("导出失败");
	}
};

/** 导入 */
const handleImport = () => {
	ElMessage.info("导入功能开发中");
};

/** 重置表单数据 */
const resetFormData = () => {
	formData.id = "";
	formData.goodsCode = "";
	formData.goodsName = "";
	formData.specification = "";
	formData.unit = "";
	formData.barcode = "";
	formData.costPrice = undefined;
	formData.salePrice = undefined;
	formData.safetyStock = 0;
	formData.status = 1;
	formData.remark = "";
};

/** 对话框关闭 */
const handleDialogClose = () => {
	formRef.value?.resetFields();
	resetFormData();
};

onMounted(() => {
	fetchGoodsList();
});
</script>

<style scoped lang="scss">
.goods-management {
	padding: 20px;

	.search-card,
	.toolbar-card {
		margin-bottom: 20px;
	}
}
</style>
