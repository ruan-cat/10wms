<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import {
	getCustomerList,
	addCustomer,
	updateCustomer,
	deleteCustomer,
	updateCustomerStatus,
	exportCustomer,
	type CustomerInfo,
	type AddCustomerParams,
	type CustomerQueryParams,
} from "@/api/base-data/customer";

defineOptions({
	name: "BaseDataCustomer",
});

/** 加载状态 */
const loading = ref(false);

/** 表格数据 */
const tableData = ref<CustomerInfo[]>([]);

/** 总数 */
const total = ref(0);

/** 查询参数 */
const queryParams = reactive<CustomerQueryParams>({
	page: 1,
	size: 10,
	customerCode: "",
	customerName: "",
	status: undefined,
});

/** 对话框显示状态 */
const dialogVisible = ref(false);

/** 对话框标题 */
const dialogTitle = ref("");

/** 表单引用 */
const formRef = ref<FormInstance>();

/** 表单数据 */
const formData = ref<AddCustomerParams>({
	customerCode: "",
	customerName: "",
	customerType: "",
	contact: "",
	phone: "",
	email: "",
	address: "",
	creditLevel: "",
	status: 1,
	remark: "",
});

/** 当前编辑的客户ID */
const currentId = ref("");

/** 客户类型选项 */
const customerTypeOptions = [
	{ label: "企业客户", value: "enterprise" },
	{ label: "个人客户", value: "personal" },
	{ label: "政府机构", value: "government" },
	{ label: "其他", value: "other" },
];

/** 信用等级选项 */
const creditLevelOptions = [
	{ label: "AAA", value: "AAA" },
	{ label: "AA", value: "AA" },
	{ label: "A", value: "A" },
	{ label: "B", value: "B" },
	{ label: "C", value: "C" },
];

/** 表单验证规则 */
const formRules: FormRules = {
	customerCode: [{ required: true, message: "请输入客户编码", trigger: "blur" }],
	customerName: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
	phone: [
		{
			pattern: /^1[3-9]\d{9}$/,
			message: "请输入正确的手机号码",
			trigger: "blur",
		},
	],
	email: [
		{
			type: "email",
			message: "请输入正确的邮箱地址",
			trigger: "blur",
		},
	],
};

/** 加载客户列表 */
const loadData = async () => {
	loading.value = true;
	try {
		const result = await getCustomerList(queryParams);
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
		customerCode: "",
		customerName: "",
		status: undefined,
	});
	loadData();
};

/** 新增客户 */
const handleAdd = () => {
	dialogTitle.value = "新增客户";
	dialogVisible.value = true;
	currentId.value = "";
	formData.value = {
		customerCode: "",
		customerName: "",
		customerType: "",
		contact: "",
		phone: "",
		email: "",
		address: "",
		creditLevel: "",
		status: 1,
		remark: "",
	};
	formRef.value?.clearValidate();
};

/** 编辑客户 */
const handleEdit = (row: CustomerInfo) => {
	dialogTitle.value = "编辑客户";
	dialogVisible.value = true;
	currentId.value = row.id;
	formData.value = {
		customerCode: row.customerCode,
		customerName: row.customerName,
		customerType: row.customerType || "",
		contact: row.contact || "",
		phone: row.phone || "",
		email: row.email || "",
		address: row.address || "",
		creditLevel: row.creditLevel || "",
		status: row.status,
		remark: row.remark || "",
	};
	formRef.value?.clearValidate();
};

/** 删除客户 */
const handleDelete = (row: CustomerInfo) => {
	ElMessageBox.confirm(`确定要删除客户"${row.customerName}"吗？`, "提示", {
		type: "warning",
	})
		.then(async () => {
			await deleteCustomer(row.id);
			ElMessage.success("删除成功");
			loadData();
		})
		.catch(() => {});
};

/** 切换状态 */
const handleToggleStatus = async (row: CustomerInfo) => {
	const newStatus = row.status === 1 ? 0 : 1;
	const action = newStatus === 1 ? "启用" : "禁用";

	try {
		await updateCustomerStatus(row.id, newStatus);
		ElMessage.success(`${action}成功`);
		row.status = newStatus;
	} catch (error) {
		ElMessage.error(`${action}失败`);
	}
};

/** 提交表单 */
const handleSubmit = async () => {
	if (!formRef.value) return;

	await formRef.value.validate(async (valid) => {
		if (!valid) return;

		try {
			if (dialogTitle.value === "新增客户") {
				await addCustomer(formData.value);
				ElMessage.success("新增成功");
			} else {
				await updateCustomer({
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

/** 导出数据 */
const handleExport = async () => {
	try {
		const blob = await exportCustomer(queryParams);
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `客户数据_${new Date().getTime()}.xlsx`;
		link.click();
		window.URL.revokeObjectURL(url);
		ElMessage.success("导出成功");
	} catch (error) {
		ElMessage.error("导出失败");
	}
};

/** 导入数据 */
const handleImport = () => {
	ElMessage.info("导入功能开发中");
};

/** 页面加载时获取数据 */
onMounted(() => {
	loadData();
});
</script>

<template>
	<div class="customer-container">
		<!-- 搜索区域 -->
		<el-card shadow="never" class="search-card">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="客户编码">
					<el-input v-model="queryParams.customerCode" placeholder="请输入客户编码" clearable />
				</el-form-item>
				<el-form-item label="客户名称">
					<el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="0" />
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
				<el-button v-perms="['base:customer:add']" type="primary" @click="handleAdd">新增</el-button>
				<el-button v-perms="['base:customer:import']" @click="handleImport">导入</el-button>
				<el-button v-perms="['base:customer:export']" @click="handleExport">导出</el-button>
			</div>

			<!-- 表格 -->
			<el-table :data="tableData" :loading="loading" border stripe>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="customerCode" label="客户编码" min-width="120" />
				<el-table-column prop="customerName" label="客户名称" min-width="150" />
				<el-table-column prop="customerType" label="客户类型" min-width="100">
					<template #default="{ row }">
						<span v-if="row.customerType === 'enterprise'">企业客户</span>
						<span v-else-if="row.customerType === 'personal'">个人客户</span>
						<span v-else-if="row.customerType === 'government'">政府机构</span>
						<span v-else-if="row.customerType === 'other'">其他</span>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column prop="contact" label="联系人" min-width="100" />
				<el-table-column prop="phone" label="联系电话" min-width="120" />
				<el-table-column prop="email" label="邮箱" min-width="180" />
				<el-table-column prop="creditLevel" label="信用等级" min-width="100" align="center" />
				<el-table-column prop="status" label="状态" min-width="80" align="center">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? "启用" : "禁用" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="240" fixed="right" align="center">
					<template #default="{ row }">
						<el-button v-perms="['base:customer:edit']" link type="primary" @click="handleEdit(row)"> 编辑 </el-button>
						<el-button v-perms="['base:customer:status']" link type="primary" @click="handleToggleStatus(row)">
							{{ row.status === 1 ? "禁用" : "启用" }}
						</el-button>
						<el-button v-perms="['base:customer:delete']" link type="danger" @click="handleDelete(row)">
							删除
						</el-button>
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
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" :close-on-click-modal="false">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="客户编码" prop="customerCode">
							<el-input v-model="formData.customerCode" placeholder="请输入客户编码" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="formData.customerName" placeholder="请输入客户名称" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="客户类型" prop="customerType">
							<el-select v-model="formData.customerType" placeholder="请选择客户类型" style="width: 100%">
								<el-option
									v-for="item in customerTypeOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="信用等级" prop="creditLevel">
							<el-select v-model="formData.creditLevel" placeholder="请选择信用等级" style="width: 100%">
								<el-option
									v-for="item in creditLevelOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="联系人" prop="contact">
							<el-input v-model="formData.contact" placeholder="请输入联系人" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系电话" prop="phone">
							<el-input v-model="formData.phone" placeholder="请输入联系电话" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="formData.email" placeholder="请输入邮箱" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-radio-group v-model="formData.status">
								<el-radio :value="1">启用</el-radio>
								<el-radio :value="0">禁用</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="地址" prop="address">
					<el-input v-model="formData.address" placeholder="请输入地址" />
				</el-form-item>

				<el-form-item label="备注" prop="remark">
					<el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
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
.customer-container {
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
