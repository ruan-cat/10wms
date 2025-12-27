<script setup lang="ts">
import { ref } from "vue";
import ConfigTable from "@/components/ConfigTable/index.vue";
import type { TableColumn, FormField } from "@/components/ConfigTable/index.vue";

defineOptions({
	name: "PersonnelConfigAcademicCode",
});

/** 学历代码数据类型 */
interface AcademicCodeItem {
	id?: number;
	code: string;
	name: string;
	description?: string;
}

/** 表格列配置 */
const columns: TableColumn[] = [
	{ prop: "code", label: "学历代码", width: 150 },
	{ prop: "name", label: "学历名称", width: 200 },
	{ prop: "description", label: "描述", minWidth: 200 },
];

/** 表单字段配置 */
const formFields: FormField[] = [
	{
		prop: "code",
		label: "学历代码",
		type: "input",
		rules: [{ required: true, message: "请输入学历代码", trigger: "blur" }],
	},
	{
		prop: "name",
		label: "学历名称",
		type: "input",
		rules: [{ required: true, message: "请输入学历名称", trigger: "blur" }],
	},
	{
		prop: "description",
		label: "描述",
		type: "textarea",
	},
];

/** 表格数据 */
const tableData = ref<AcademicCodeItem[]>([
	{
		id: 1,
		code: "AC001",
		name: "小学",
		description: "小学学历",
	},
	{
		id: 2,
		code: "AC002",
		name: "初中",
		description: "初中学历",
	},
	{
		id: 3,
		code: "AC003",
		name: "高中",
		description: "高中学历",
	},
	{
		id: 4,
		code: "AC004",
		name: "中专",
		description: "中等专业学校学历",
	},
	{
		id: 5,
		code: "AC005",
		name: "大专",
		description: "大学专科学历",
	},
	{
		id: 6,
		code: "AC006",
		name: "本科",
		description: "大学本科学历",
	},
	{
		id: 7,
		code: "AC007",
		name: "硕士",
		description: "硕士研究生学历",
	},
	{
		id: 8,
		code: "AC008",
		name: "博士",
		description: "博士研究生学历",
	},
]);

/** 新增 */
function handleAdd(data: AcademicCodeItem) {
	// TODO: 调用 API 新增
	// await addAcademicCode(data);
	const newItem = {
		...data,
		id: Date.now(),
	};
	tableData.value.push(newItem);
	ElMessage.success("新增成功");
}

/** 编辑 */
function handleEdit(data: AcademicCodeItem) {
	// TODO: 调用 API 更新
	// await updateAcademicCode(data);
	const index = tableData.value.findIndex((item) => item.id === data.id);
	if (index !== -1) {
		tableData.value[index] = data;
		ElMessage.success("更新成功");
	}
}

/** 删除 */
function handleDelete(data: AcademicCodeItem) {
	// TODO: 调用 API 删除
	// await deleteAcademicCode(data.id);
	const index = tableData.value.findIndex((item) => item.id === data.id);
	if (index !== -1) {
		tableData.value.splice(index, 1);
		ElMessage.success("删除成功");
	}
}
</script>

<template>
	<div class="academic-code-container">
		<el-card shadow="never">
			<ConfigTable
				title="学历代码配置"
				:columns="columns"
				:form-fields="formFields"
				:data="tableData"
				@add="handleAdd"
				@edit="handleEdit"
				@delete="handleDelete"
			/>
		</el-card>
	</div>
</template>

<style lang="scss" scoped>
.academic-code-container {
	padding: 16px;
}
</style>
