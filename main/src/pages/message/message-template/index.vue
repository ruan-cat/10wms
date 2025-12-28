<script lang="ts" setup>
import { ref } from "vue";
import { Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import SimpleDataTable from "@/components/Table/index.vue";
import type { SimpleDataTableColumn } from "@/components/Table/types";
import type { FormInstance, FormRules } from "element-plus";

definePage({
	meta: {
		menuType: "page",
		title: "消息模板",
		icon: "ep:message",
	},
});

/** 表格数据类型 */
interface MessageTemplateRow {
	templateName: string;
	type: string;
	templateContent: string;
}

/** 表格数据 */
const tableData = ref<MessageTemplateRow[]>([
	{
		templateName: "收货通知模板",
		type: "邮件提醒模板",
		templateContent: "您的订单已收货，请及时查看。",
	},
	{
		templateName: "发货通知模板",
		type: "短信提醒模板",
		templateContent: "您的订单已发货，请注意查收。",
	},
]);

/** 表格列配置 */
const tableColumns = ref<SimpleDataTableColumn<MessageTemplateRow>[]>([
	{ prop: "templateName", label: "模板名称", width: 150 },
	{ prop: "type", label: "模板类型", width: 150 },
	{ prop: "templateContent", label: "模板内容", minWidth: 300 },
	{ prop: "operation", label: "操作", width: 120 },
]);

/** 分页配置 */
const pagination = ref({
	total: 2,
	currentPage: 1,
	pageSize: 10,
});

/** 搜索表单 */
const searchForm = ref({
	templateName: "",
	type: "",
});

/** 对话框显示 */
const dialogVisible = ref(false);
/** 对话框标题 */
const dialogTitle = ref("");
/** 表单引用 */
const formRef = ref<FormInstance>();
/** 当前编辑行 */
const currentRow = ref<MessageTemplateRow>({
	templateName: "",
	type: "",
	templateContent: "",
});

/** 表单验证规则 */
const rules: FormRules = {
	templateName: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
	type: [{ required: true, message: "请选择模板类型", trigger: "change" }],
};

/** 处理查询 */
function handleSearch() {
	console.log("查询", searchForm.value);
}

/** 处理重置 */
function handleReset() {
	searchForm.value = {
		templateName: "",
		type: "",
	};
}

/** 处理录入 */
function handleAdd() {
	dialogTitle.value = "录入";
	currentRow.value = {
		templateName: "",
		type: "",
		templateContent: "",
	};
	dialogVisible.value = true;
}

/** 处理编辑 */
function handleEdit(row: MessageTemplateRow) {
	dialogTitle.value = "编辑";
	currentRow.value = { ...row };
	dialogVisible.value = true;
}

/** 处理查看 */
function handleView(row: MessageTemplateRow) {
	dialogTitle.value = "查看";
	currentRow.value = { ...row };
	dialogVisible.value = true;
}

/** 处理删除 */
function handleDelete(row: MessageTemplateRow) {
	ElMessage.success("删除成功");
	console.log("删除", row);
}

/** 处理批量删除 */
function handleBatchDelete() {
	ElMessage.success("批量删除成功");
}

/** 处理分页变化 */
function handlePageChange(page: { currentPage: number; pageSize: number }) {
	pagination.value.currentPage = page.currentPage;
	pagination.value.pageSize = page.pageSize;
	console.log("分页变化", page);
}

/** 确定提交 */
async function handleConfirm() {
	if (!formRef.value) return;

	await formRef.value.validate((valid) => {
		if (valid) {
			if (dialogTitle.value === "录入") {
				ElMessage.success("添加成功");
			} else if (dialogTitle.value === "编辑") {
				ElMessage.success("修改成功");
			}
			dialogVisible.value = false;
		} else {
			ElMessage.warning("请重新填写");
		}
	});
}
</script>

<template>
	<div class="message-template-container">
		<el-card shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-bold">消息模板表</span>
				</div>
			</template>

			<!-- 搜索区域 -->
			<el-form :inline="true" :model="searchForm" class="search-form">
				<el-form-item label="模板名称">
					<el-input v-model="searchForm.templateName" placeholder="请输入模板名称" clearable />
				</el-form-item>
				<el-form-item label="模板类型">
					<el-select v-model="searchForm.type" placeholder="请选择" clearable>
						<el-option label="短信提醒模板" value="短信提醒模板" />
						<el-option label="邮件提醒模板" value="邮件提醒模板" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>

			<!-- 操作按钮 -->
			<div class="toolbar">
				<el-button type="primary" @click="handleAdd">录入</el-button>
				<el-button>编辑</el-button>
				<el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
				<el-button>查看</el-button>
			</div>

			<!-- 表格 -->
			<SimpleDataTable
				:data="tableData"
				:columns="tableColumns"
				:pagination="pagination"
				:height="500"
				is-index
				is-multiple-select
				@page-change="handlePageChange"
			>
				<template #bodyCell="{ row, prop }">
					<div v-if="prop === 'operation'" class="operation-buttons">
						<el-popconfirm
							title="确定要删除该数据吗？"
							confirm-button-text="确定"
							cancel-button-text="取消"
							@confirm="handleDelete(row)"
						>
							<template #reference>
								<el-button type="success" size="small" :icon="Delete">删除</el-button>
							</template>
						</el-popconfirm>
					</div>
				</template>
			</SimpleDataTable>
		</el-card>

		<!-- 编辑对话框 -->
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%" draggable destroy-on-close>
			<el-form ref="formRef" :model="currentRow" :rules="rules" label-width="100px" :disabled="dialogTitle === '查看'">
				<el-form-item label="模板类型" prop="type">
					<el-select v-model="currentRow.type" placeholder="请选择">
						<el-option label="邮件提醒模板" value="邮件提醒模板" />
						<el-option label="短信提醒模板" value="短信提醒模板" />
					</el-select>
				</el-form-item>
				<el-form-item label="模板名称" prop="templateName">
					<el-input v-model="currentRow.templateName" />
				</el-form-item>
				<el-form-item label="模板内容">
					<el-input v-model="currentRow.templateContent" type="textarea" :rows="4" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button v-if="dialogTitle !== '查看'" type="primary" @click="handleConfirm">确定</el-button>
				<el-button @click="dialogVisible = false">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.message-template-container {
	padding: 16px;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.search-form {
		margin-bottom: 16px;
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
