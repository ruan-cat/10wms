<script lang="ts" setup>
import { ref } from "vue";
import SimpleDataTable from "@/components/Table/index.vue";
import type { SimpleDataTableColumn } from "@/components/Table/types";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";

definePage({
	meta: {
		menuType: "page",
		title: "学历代码",
		icon: "ep:user",
	},
});

/** 表格数据类型 */
interface AcademicCodeRow {
	id: number;
	statusCode: string;
	statusName: string;
}

/** 表格数据 */
const tableData = ref<AcademicCodeRow[]>([
	{ id: 1, statusCode: "AC001", statusName: "小学" },
	{ id: 2, statusCode: "AC002", statusName: "初中" },
	{ id: 3, statusCode: "AC003", statusName: "高中" },
	{ id: 4, statusCode: "AC004", statusName: "大专" },
	{ id: 5, statusCode: "AC005", statusName: "本科" },
	{ id: 6, statusCode: "AC006", statusName: "硕士" },
]);

/** 表格列配置 */
const tableColumns = ref<SimpleDataTableColumn<AcademicCodeRow>[]>([
	{ prop: "statusCode", label: "学历代码", width: 200 },
	{ prop: "statusName", label: "学历名称", width: 200 },
	{ prop: "operation", label: "操作", width: 200 },
]);

/** 分页配置 */
const pagination = ref({
	total: 6,
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
const currentRow = ref<AcademicCodeRow>({
	id: 0,
	statusCode: "",
	statusName: "",
});

/** 表单验证规则 */
const rules: FormRules = {
	statusCode: [{ required: true, message: "请输入学历代码", trigger: "blur" }],
	statusName: [{ required: true, message: "请输入学历名称", trigger: "blur" }],
};

/** 处理录入 */
function handleAdd() {
	dialogTitle.value = "录入";
	currentRow.value = {
		id: 0,
		statusCode: "",
		statusName: "",
	};
	dialogVisible.value = true;
}

/** 处理编辑 */
function handleEdit(row: AcademicCodeRow) {
	dialogTitle.value = "编辑";
	currentRow.value = { ...row };
	dialogVisible.value = true;
}

/** 处理删除 */
function handleDelete(row: AcademicCodeRow) {
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
	<div class="academic-code-container">
		<el-card shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-bold">学历代码配置</span>
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
				<el-form-item label="学历代码" prop="statusCode">
					<el-input v-model="currentRow.statusCode" />
				</el-form-item>
				<el-form-item label="学历名称" prop="statusName">
					<el-input v-model="currentRow.statusName" />
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
.academic-code-container {
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
