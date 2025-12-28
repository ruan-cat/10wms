<template>
	<div class="stock-management">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<el-form :model="searchForm" :inline="true">
				<el-form-item label="商品编码">
					<el-input v-model="searchForm.goodsCode" placeholder="请输入商品编码" clearable />
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="searchForm.goodsName" placeholder="请输入商品名称" clearable />
				</el-form-item>
				<el-form-item label="储位">
					<el-input v-model="searchForm.location" placeholder="请输入储位" clearable />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
						<el-option label="正常" :value="0" />
						<el-option label="预警" :value="1" />
						<el-option label="过期" :value="2" />
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
			<el-button type="primary" :icon="Operation" @click="handleAdjust" :disabled="!selectedRow">库存调整</el-button>
			<el-button type="success" :icon="Sort" @click="handleTransfer" :disabled="!selectedRow">库存转移</el-button>
			<el-button type="warning" :icon="Warning" @click="handleWarning">库存预警</el-button>
			<el-button type="info" :icon="Download" @click="handleExport">导出</el-button>
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
				<el-table-column prop="batchNo" label="批次号" min-width="120" />
				<el-table-column prop="location" label="储位" width="100" align="center" />
				<el-table-column prop="quantity" label="库存数量" width="100" align="right">
					<template #default="{ row }">
						<span :class="{ 'text-red-500': row.quantity < (row.safetyStock || 0) }">
							{{ row.quantity }}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="availableQuantity" label="可用数量" width="100" align="right" />
				<el-table-column prop="lockedQuantity" label="锁定数量" width="100" align="right" />
				<el-table-column prop="productionDate" label="生产日期" width="110" align="center" />
				<el-table-column prop="expiryDate" label="到期日期" width="110" align="center" />
				<el-table-column prop="status" label="状态" width="80" align="center">
					<template #default="{ row }">
						<el-tag :type="row.status === 0 ? 'success' : row.status === 1 ? 'warning' : 'danger'">
							{{ row.status === 0 ? "正常" : row.status === 1 ? "预警" : "过期" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150" align="center" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" link @click="handleAdjust(row)">调整</el-button>
						<el-button type="success" size="small" link @click="handleTransfer(row)">转移</el-button>
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

		<!-- 库存调整对话框 -->
		<el-dialog v-model="adjustVisible" title="库存调整" width="500px" :close-on-click-modal="false">
			<el-form ref="adjustFormRef" :model="adjustForm" :rules="adjustRules" label-width="100px">
				<el-form-item label="商品名称">
					<el-input :value="selectedRow?.goodsName" disabled />
				</el-form-item>
				<el-form-item label="当前库存">
					<el-input :value="selectedRow?.quantity" disabled />
				</el-form-item>
				<el-form-item label="调整类型" prop="adjustType">
					<el-radio-group v-model="adjustForm.adjustType">
						<el-radio :value="1">增加</el-radio>
						<el-radio :value="2">减少</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="调整数量" prop="quantity">
					<el-input-number v-model="adjustForm.quantity" :min="1" placeholder="请输入调整数量" class="w-full" />
				</el-form-item>
				<el-form-item label="调整原因" prop="reason">
					<el-input v-model="adjustForm.reason" type="textarea" :rows="3" placeholder="请输入调整原因" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="adjustVisible = false">取消</el-button>
				<el-button type="primary" @click="handleAdjustSubmit" :loading="submitLoading">确定</el-button>
			</template>
		</el-dialog>

		<!-- 库存转移对话框 -->
		<el-dialog v-model="transferVisible" title="库存转移" width="500px" :close-on-click-modal="false">
			<el-form ref="transferFormRef" :model="transferForm" :rules="transferRules" label-width="100px">
				<el-form-item label="商品名称">
					<el-input :value="selectedRow?.goodsName" disabled />
				</el-form-item>
				<el-form-item label="当前储位">
					<el-input :value="selectedRow?.location" disabled />
				</el-form-item>
				<el-form-item label="可用数量">
					<el-input :value="selectedRow?.availableQuantity" disabled />
				</el-form-item>
				<el-form-item label="目标储位" prop="targetLocation">
					<el-input v-model="transferForm.targetLocation" placeholder="请输入目标储位" />
				</el-form-item>
				<el-form-item label="转移数量" prop="quantity">
					<el-input-number
						v-model="transferForm.quantity"
						:min="1"
						:max="selectedRow?.availableQuantity || 0"
						placeholder="请输入转移数量"
						class="w-full"
					/>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="transferForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="transferVisible = false">取消</el-button>
				<el-button type="primary" @click="handleTransferSubmit" :loading="submitLoading">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Search, Refresh, Operation, Sort, Warning, Download } from "@element-plus/icons-vue";
import { getStockList, adjustStock, transferStock, exportStock, type StockQueryParams } from "@/api/inventory/stock";

defineOptions({
	name: "InventoryStock",
});

/** 搜索表单 */
const searchForm = reactive<StockQueryParams>({
	goodsCode: "",
	goodsName: "",
	location: "",
	status: undefined,
	page: 1,
	size: 10,
});

/** 表格数据 */
const tableData = ref([]);
const loading = ref(false);
const selectedRow = ref<any>(null);

/** 分页 */
const pagination = reactive({
	page: 1,
	size: 10,
	total: 0,
});

/** 库存调整对话框 */
const adjustVisible = ref(false);
const adjustFormRef = ref<FormInstance>();
const adjustForm = reactive({
	stockId: "",
	adjustType: 1,
	quantity: 1,
	reason: "",
});

const adjustRules: FormRules = {
	adjustType: [{ required: true, message: "请选择调整类型", trigger: "change" }],
	quantity: [{ required: true, message: "请输入调整数量", trigger: "blur" }],
	reason: [{ required: true, message: "请输入调整原因", trigger: "blur" }],
};

/** 库存转移对话框 */
const transferVisible = ref(false);
const transferFormRef = ref<FormInstance>();
const transferForm = reactive({
	sourceStockId: "",
	targetLocation: "",
	quantity: 1,
	remark: "",
});

const transferRules: FormRules = {
	targetLocation: [{ required: true, message: "请输入目标储位", trigger: "blur" }],
	quantity: [{ required: true, message: "请输入转移数量", trigger: "blur" }],
};

const submitLoading = ref(false);

/** 获取库存列表 */
const fetchStockList = async () => {
	loading.value = true;
	try {
		const params = {
			...searchForm,
			page: pagination.page,
			size: pagination.size,
		};
		const result = await getStockList(params);
		tableData.value = result.list;
		pagination.total = result.total;
	} catch (error) {
		ElMessage.error("获取库存列表失败");
	} finally {
		loading.value = false;
	}
};

/** 搜索 */
const handleSearch = () => {
	pagination.page = 1;
	fetchStockList();
};

/** 重置搜索 */
const handleReset = () => {
	searchForm.goodsCode = "";
	searchForm.goodsName = "";
	searchForm.location = "";
	searchForm.status = undefined;
	pagination.page = 1;
	fetchStockList();
};

/** 表格行选中 */
const handleCurrentChange = (row: any) => {
	selectedRow.value = row;
};

/** 分页大小改变 */
const handlePageSizeChange = (size: number) => {
	pagination.size = size;
	fetchStockList();
};

/** 分页页码改变 */
const handlePageChange = (page: number) => {
	pagination.page = page;
	fetchStockList();
};

/** 库存调整 */
const handleAdjust = (row?: any) => {
	const adjustRow = row || selectedRow.value;
	if (!adjustRow) {
		ElMessage.warning("请选择要调整的库存");
		return;
	}
	adjustForm.stockId = adjustRow.id;
	adjustForm.adjustType = 1;
	adjustForm.quantity = 1;
	adjustForm.reason = "";
	adjustVisible.value = true;
};

/** 提交库存调整 */
const handleAdjustSubmit = async () => {
	if (!adjustFormRef.value) return;

	await adjustFormRef.value.validate(async (valid) => {
		if (!valid) return;

		submitLoading.value = true;
		try {
			await adjustStock(adjustForm);
			ElMessage.success("库存调整成功");
			adjustVisible.value = false;
			fetchStockList();
		} catch (error) {
			ElMessage.error("库存调整失败");
		} finally {
			submitLoading.value = false;
		}
	});
};

/** 库存转移 */
const handleTransfer = (row?: any) => {
	const transferRow = row || selectedRow.value;
	if (!transferRow) {
		ElMessage.warning("请选择要转移的库存");
		return;
	}
	transferForm.sourceStockId = transferRow.id;
	transferForm.targetLocation = "";
	transferForm.quantity = 1;
	transferForm.remark = "";
	transferVisible.value = true;
};

/** 提交库存转移 */
const handleTransferSubmit = async () => {
	if (!transferFormRef.value) return;

	await transferFormRef.value.validate(async (valid) => {
		if (!valid) return;

		submitLoading.value = true;
		try {
			await transferStock(transferForm);
			ElMessage.success("库存转移成功");
			transferVisible.value = false;
			fetchStockList();
		} catch (error) {
			ElMessage.error("库存转移失败");
		} finally {
			submitLoading.value = false;
		}
	});
};

/** 库存预警 */
const handleWarning = () => {
	ElMessage.info("库存预警功能开发中");
};

/** 导出 */
const handleExport = async () => {
	try {
		await exportStock(searchForm);
		ElMessage.success("导出成功");
	} catch (error) {
		ElMessage.error("导出失败");
	}
};

onMounted(() => {
	fetchStockList();
});
</script>

<style scoped lang="scss">
.stock-management {
	padding: 20px;

	.search-card,
	.toolbar-card {
		margin-bottom: 20px;
	}
}
</style>
