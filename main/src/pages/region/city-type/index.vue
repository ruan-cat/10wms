<script lang="ts" setup>
import { ref } from "vue";
import SimpleDataTable from "@/components/Table/index.vue";
import type { SimpleDataTableColumn } from "@/components/Table/types";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";

definePage({
	meta: {
		menuType: "page",
		title: "城市分类",
		icon: "ep:location",
	},
});

/** 表格数据类型 */
interface CityTypeRow {
	id: number;
	city_type_code: string;
	city_type_name: string;
}

/** 表格数据 */
const tableData = ref<CityTypeRow[]>([
	{ id: 1, city_type_code: "1", city_type_name: "一线城市" },
	{ id: 2, city_type_code: "2", city_type_name: "二线城市" },
]);

/** 表格列配置 */
const tableColumns = ref<SimpleDataTableColumn<CityTypeRow>[]>([
	{ prop: "city_type_code", label: "城市类型代码", width: 200 },
	{ prop: "city_type_name", label: "城市类型名称", width: 200 },
	{ prop: "operation", label: "操作", width: 200 },
]);

/** 分页配置 */
const pagination = ref({
	total: 2,
	currentPage: 1,
	pageSize: 10,
});

/** 对话框显示 */
const dialogVisible = ref(false);
/** 对话框标题 */
const dialogTitle = ref("");
/** 表单引用 */
const formRef = ref<FormInstance>();
/** 当前编辑行 */
const currentRow = ref<CityTypeRow>({
	id: 0,
	city_type_code: "",
	city_type_name: "",
});

/** 表单验证规则 */
const rules: FormRules = {
	city_type_code: [{ required: true, message: "请输入城市类型代码", trigger: "blur" }],
	city_type_name: [{ required: true, message: "请输入城市类型名称", trigger: "blur" }],
};

/** 处理录入 */
function handleAdd() {
	dialogTitle.value = "录入";
	currentRow.value = {
		id: 0,
		city_type_code: "",
		city_type_name: "",
	};
	dialogVisible.value = true;
}

/** 处理编辑 */
function handleEdit(row: CityTypeRow) {
	dialogTitle.value = "编辑";
	currentRow.value = { ...row };
	dialogVisible.value = true;
}

/** 处理删除 */
function handleDelete(row: CityTypeRow) {
	ElMessage.success("删除成功");
	console.log("删除", row);
}

/** 处理分页变化 */
function handlePageChange(page: { currentPage: number; pageSize: number }) {
	pagination.value.currentPage = page.currentPage;
	pagination.value.pageSize = page.pageSize;
}

/** 确定提交 */
async function handleConfirm() {
	if (!formRef.value) return;

	await formRef.value.validate((valid) => {
		if (valid) {
			if (dialogTitle.value === "录入") {
				ElMessage.success("添加成功");
			} else {
				ElMessage.success("修改成功");
			}
			dialogVisible.value = false;
		}
	});
}
</script>

<template>
	<div class="city-type-container">
		<el-card shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-bold">城市分类</span>
				</div>
			</template>

			<!-- 操作按钮 -->
			<div class="toolbar">
				<el-button type="primary" @click="handleAdd">录入</el-button>
			</div>

			<!-- 表格 -->
			<SimpleDataTable
				:data="tableData"
				:columns="tableColumns"
				:pagination="pagination"
				is-index
				@page-change="handlePageChange"
			>
				<template #bodyCell="{ row, prop }">
					<div v-if="prop === 'operation'" class="operation-buttons">
						<el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
					</div>
				</template>
			</SimpleDataTable>
		</el-card>

		<!-- 编辑对话框 -->
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" draggable destroy-on-close>
			<el-form ref="formRef" :model="currentRow" :rules="rules" label-width="120px">
				<el-form-item label="城市类型代码" prop="city_type_code">
					<el-input v-model="currentRow.city_type_code" />
				</el-form-item>
				<el-form-item label="城市类型名称" prop="city_type_name">
					<el-input v-model="currentRow.city_type_name" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="primary" @click="handleConfirm">确定</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.city-type-container {
	padding: 16px;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.toolbar {
		margin-bottom: 16px;
	}

	.operation-buttons {
		display: flex;
		gap: 8px;
	}
}
</style>
