<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import {
	getInventoryCheckList,
	addInventoryCheck,
	updateInventoryCheck,
	deleteInventoryCheck,
	startInventoryCheck,
	completeInventoryCheck,
	auditInventoryCheck,
	generateDifferenceReport,
	type InventoryCheckInfo,
	type AddInventoryCheckParams,
	type InventoryCheckQueryParams,
	type InventoryCheckGoodsItem,
} from "@/api/inventory/check";

defineOptions({
	name: "InventoryCheck",
});

/** 加载状态 */
const loading = ref(false);

/** 表格数据 */
const tableData = ref<InventoryCheckInfo[]>([]);

/** 总数 */
const total = ref(0);

/** 查询参数 */
const queryParams = reactive<InventoryCheckQueryParams>({
	page: 1,
	size: 10,
	checkNo: "",
	checkType: undefined,
	status: undefined,
});

/** 对话框显示状态 */
const dialogVisible = ref(false);

/** 对话框标题 */
const dialogTitle = ref("");

/** 表单引用 */
const formRef = ref<FormInstance>();

/** 表单数据 */
const formData = ref<AddInventoryCheckParams>({
	checkType: 1,
	checkDate: "",
	checkScope: "",
	checker: "",
	goods: [],
	remark: "",
});

/** 当前编辑的盘点单ID */
const currentId = ref("");

/** 盘点类型选项 */
const checkTypeOptions = [
	{ label: "综合盘点", value: 1 },
	{ label: "移库盘点", value: 2 },
	{ label: "货架调整", value: 3 },
];

/** 状态选项 */
const statusOptions = [
	{ label: "待盘点", value: 0 },
	{ label: "盘点中", value: 1 },
	{ label: "已完成", value: 2 },
	{ label: "已审核", value: 3 },
];

/** 表单验证规则 */
const formRules: FormRules = {
	checkType: [{ required: true, message: "请选择盘点类型", trigger: "change" }],
	checkDate: [{ required: true, message: "请选择盘点日期", trigger: "change" }],
	checker: [{ required: true, message: "请输入盘点人", trigger: "blur" }],
};

/** 获取状态标签类型 */
const getStatusType = (status: number) => {
	const typeMap: Record<number, "info" | "warning" | "success" | "primary"> = {
		0: "info",
		1: "warning",
		2: "success",
		3: "primary",
	};
	return typeMap[status] || "info";
};

/** 获取状态文本 */
const getStatusText = (status: number) => {
	const textMap: Record<number, string> = {
		0: "待盘点",
		1: "盘点中",
		2: "已完成",
		3: "已审核",
	};
	return textMap[status] || "未知";
};

/** 获取盘点类型文本 */
const getCheckTypeText = (checkType: number) => {
	const textMap: Record<number, string> = {
		1: "综合盘点",
		2: "移库盘点",
		3: "货架调整",
	};
	return textMap[checkType] || "未知";
};

/** 加载盘点单列表 */
const loadData = async () => {
	loading.value = true;
	try {
		const result = await getInventoryCheckList(queryParams);
		tableData.value = result.list;
		total.value = result.total;
	} catch (error) {
		ElMessage.error("加载数据失败");
	} finally {
		loading.value = false;
	}
};

/** 搜索 */
const handleSearch = () => {
	queryParams.page = 1;
	loadData();
};

/** 重置搜索 */
const handleReset = () => {
	Object.assign(queryParams, {
		page: 1,
		size: 10,
		checkNo: "",
		checkType: undefined,
		status: undefined,
	});
	loadData();
};

/** 新增盘点单 */
const handleAdd = () => {
	dialogTitle.value = "新增盘点单";
	dialogVisible.value = true;
	currentId.value = "";
	formData.value = {
		checkType: 1,
		checkDate: "",
		checkScope: "",
		checker: "",
		goods: [],
		remark: "",
	};
	formRef.value?.clearValidate();
};

/** 编辑盘点单 */
const handleEdit = (row: InventoryCheckInfo) => {
	dialogTitle.value = "编辑盘点单";
	dialogVisible.value = true;
	currentId.value = row.id;
	formData.value = {
		checkType: row.checkType,
		checkDate: row.checkDate,
		checkScope: row.checkScope || "",
		checker: row.checker || "",
		goods: row.goods || [],
		remark: row.remark || "",
	};
	formRef.value?.clearValidate();
};

/** 删除盘点单 */
const handleDelete = (row: InventoryCheckInfo) => {
	ElMessageBox.confirm(`确定要删除盘点单"${row.checkNo}"吗？`, "提示", {
		type: "warning",
	})
		.then(async () => {
			await deleteInventoryCheck(row.id);
			ElMessage.success("删除成功");
			loadData();
		})
		.catch(() => {});
};

/** 开始盘点 */
const handleStart = async (row: InventoryCheckInfo) => {
	try {
		await startInventoryCheck(row.id);
		ElMessage.success("开始盘点成功");
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
};

/** 完成盘点 */
const handleComplete = async (row: InventoryCheckInfo) => {
	try {
		await completeInventoryCheck(row.id);
		ElMessage.success("完成盘点成功");
		loadData();
	} catch (error) {
		ElMessage.error("操作失败");
	}
};

/** 审核盘点单 */
const handleAudit = (row: InventoryCheckInfo) => {
	ElMessageBox.confirm("确定要审核通过该盘点单吗？", "提示", {
		type: "warning",
	})
		.then(async () => {
			await auditInventoryCheck(row.id, true);
			ElMessage.success("审核成功");
			loadData();
		})
		.catch(() => {});
};

/** 生成差异报告 */
const handleGenerateReport = async (row: InventoryCheckInfo) => {
	try {
		const blob = await generateDifferenceReport(row.id);
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `盘点差异报告_${row.checkNo}_${new Date().getTime()}.xlsx`;
		link.click();
		window.URL.revokeObjectURL(url);
		ElMessage.success("导出成功");
	} catch (error) {
		ElMessage.error("导出失败");
	}
};

/** 添加商品明细 */
const handleAddGoods = () => {
	formData.value.goods.push({
		goodsId: "",
		goodsCode: "",
		goodsName: "",
		specification: "",
		unit: "",
		batchNo: "",
		palletNo: "",
		location: "",
		bookQuantity: 0,
		actualQuantity: 0,
		differenceQuantity: 0,
		differenceReason: "",
		remark: "",
	});
};

/** 删除商品明细 */
const handleDeleteGoods = (index: number) => {
	formData.value.goods.splice(index, 1);
};

/** 计算盈亏数量 */
const calculateDifference = (item: InventoryCheckGoodsItem) => {
	if (item.actualQuantity !== undefined) {
		item.differenceQuantity = item.actualQuantity - item.bookQuantity;
	}
};

/** 提交表单 */
const handleSubmit = async () => {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (!valid) return;

		if (formData.value.goods.length === 0) {
			ElMessage.warning("请至少添加一条商品明细");
			return;
		}

		try {
			if (dialogTitle.value === "新增盘点单") {
				await addInventoryCheck(formData.value);
				ElMessage.success("新增成功");
			} else {
				await updateInventoryCheck({
					...formData.value,
					id: currentId.value,
				});
				ElMessage.success("更新成功");
			}

			dialogVisible.value = false;
			loadData();
		} catch (error) {
			ElMessage.error("操作失败");
		}
	});
};

/** 页面加载时获取数据 */
onMounted(() => {
	loadData();
});
</script>

<template>
	<div class="check-container">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="盘点单号">
					<el-input v-model="queryParams.checkNo" placeholder="请输入盘点单号" clearable />
				</el-form-item>
				<el-form-item label="盘点类型">
					<el-select v-model="queryParams.checkType" placeholder="请选择盘点类型" clearable>
						<el-option v-for="item in checkTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 表格区域 -->
		<el-card shadow="never" class="table-card">
			<!-- 工具栏 -->
			<div class="toolbar">
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</div>

			<!-- 表格 -->
			<el-table :data="tableData" :loading="loading" border stripe>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="checkNo" label="盘点单号" min-width="150" />
				<el-table-column prop="checkType" label="盘点类型" min-width="100">
					<template #default="{ row }">
						{{ getCheckTypeText(row.checkType) }}
					</template>
				</el-table-column>
				<el-table-column prop="checkDate" label="盘点日期" min-width="120" />
				<el-table-column prop="checkScope" label="盘点范围" min-width="120" />
				<el-table-column prop="checker" label="盘点人" min-width="100" />
				<el-table-column prop="status" label="状态" min-width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="getStatusType(row.status)">
							{{ getStatusText(row.status) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="160" />
				<el-table-column label="操作" width="300" fixed="right" align="center">
					<template #default="{ row }">
						<el-button v-if="row.status === 0" link type="primary" @click="handleEdit(row)">编辑</el-button>
						<el-button v-if="row.status === 0" link type="primary" @click="handleStart(row)">开始盘点</el-button>
						<el-button v-if="row.status === 1" link type="success" @click="handleComplete(row)">完成盘点</el-button>
						<el-button v-if="row.status === 2" link type="warning" @click="handleAudit(row)">审核</el-button>
						<el-button v-if="row.status >= 2" link type="primary" @click="handleGenerateReport(row)">
							差异报告
						</el-button>
						<el-button v-if="row.status === 0" link type="danger" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<el-pagination
				v-model:current-page="queryParams.page"
				v-model:page-size="queryParams.size"
				:total="total"
				:page-sizes="[10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				@current-change="loadData"
				@size-change="loadData"
			/>
		</el-card>

		<!-- 新增/编辑对话框 -->
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="1200px" :close-on-click-modal="false">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="盘点类型" prop="checkType">
							<el-select v-model="formData.checkType" placeholder="请选择盘点类型" style="width: 100%">
								<el-option v-for="item in checkTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="盘点日期" prop="checkDate">
							<el-date-picker
								v-model="formData.checkDate"
								type="date"
								placeholder="请选择盘点日期"
								style="width: 100%"
								value-format="YYYY-MM-DD"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="盘点人" prop="checker">
							<el-input v-model="formData.checker" placeholder="请输入盘点人" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="盘点范围" prop="checkScope">
							<el-input v-model="formData.checkScope" placeholder="请输入盘点范围" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="formData.remark" placeholder="请输入备注" />
						</el-form-item>
					</el-col>
				</el-row>

				<!-- 商品明细 -->
				<el-form-item label="商品明细">
					<div style="width: 100%">
						<el-button type="primary" size="small" @click="handleAddGoods">添加商品</el-button>
						<el-table :data="formData.goods" border stripe style="margin-top: 10px">
							<el-table-column type="index" label="序号" width="60" align="center" />
							<el-table-column prop="goodsCode" label="商品编码" min-width="120">
								<template #default="{ row }">
									<el-input v-model="row.goodsCode" placeholder="商品编码" size="small" />
								</template>
							</el-table-column>
							<el-table-column prop="goodsName" label="商品名称" min-width="150">
								<template #default="{ row }">
									<el-input v-model="row.goodsName" placeholder="商品名称" size="small" />
								</template>
							</el-table-column>
							<el-table-column prop="location" label="储位" min-width="100">
								<template #default="{ row }">
									<el-input v-model="row.location" placeholder="储位" size="small" />
								</template>
							</el-table-column>
							<el-table-column prop="bookQuantity" label="账面数量" min-width="100">
								<template #default="{ row }">
									<el-input-number v-model="row.bookQuantity" :min="0" size="small" style="width: 100%" />
								</template>
							</el-table-column>
							<el-table-column prop="actualQuantity" label="实盘数量" min-width="100">
								<template #default="{ row }">
									<el-input-number
										v-model="row.actualQuantity"
										:min="0"
										size="small"
										style="width: 100%"
										@change="calculateDifference(row)"
									/>
								</template>
							</el-table-column>
							<el-table-column prop="differenceQuantity" label="盈亏数量" min-width="100">
								<template #default="{ row }">
									<span
										:style="{ color: row.differenceQuantity > 0 ? 'green' : row.differenceQuantity < 0 ? 'red' : '' }"
									>
										{{ row.differenceQuantity || 0 }}
									</span>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="80" align="center">
								<template #default="{ $index }">
									<el-button link type="danger" size="small" @click="handleDeleteGoods($index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped lang="scss">
.check-container {
	padding: 16px;

	.search-card {
		margin-bottom: 16px;
	}

	.toolbar {
		margin-bottom: 16px;
	}

	.el-pagination {
		margin-top: 16px;
		justify-content: flex-end;
	}
}
</style>
