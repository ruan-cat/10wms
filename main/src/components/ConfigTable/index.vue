<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, reactive, computed } from "vue";
import { ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { IconifyIconOffline } from "@/components/ReIcon";

/** 表格列配置 */
export interface TableColumn {
	prop: string;
	label: string;
	width?: number | string;
	minWidth?: number | string;
	align?: "left" | "center" | "right";
}

/** 表单字段配置 */
export interface FormField {
	prop: string;
	label: string;
	type?: "input" | "textarea" | "number" | "select";
	placeholder?: string;
	options?: Array<{ label: string; value: any }>;
	rules?: any[];
}

interface Props {
	/** 表格标题 */
	title?: string;
	/** 表格列配置 */
	columns: TableColumn[];
	/** 表单字段配置 */
	formFields: FormField[];
	/** 表格数据 */
	data?: T[];
	/** 是否显示操作列 */
	showOperation?: boolean;
	/** 是否显示新增按钮 */
	showAdd?: boolean;
	/** 是否显示编辑按钮 */
	showEdit?: boolean;
	/** 是否显示删除按钮 */
	showDelete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	title: "",
	data: () => [],
	showOperation: true,
	showAdd: true,
	showEdit: true,
	showDelete: true,
});

const emit = defineEmits<{
	add: [data: T];
	edit: [data: T];
	delete: [data: T];
}>();

/** 对话框显示 */
const dialogVisible = ref(false);

/** 对话框标题 */
const dialogTitle = ref("");

/** 对话框类型 */
const dialogType = ref<"add" | "edit">("add");

/** 表单引用 */
const formRef = ref<FormInstance>();

/** 表单数据 */
const formData = ref<T>({} as T);

/** 表单验证规则 */
const formRules = computed<FormRules>(() => {
	const rules: FormRules = {};
	props.formFields.forEach((field) => {
		if (field.rules) {
			rules[field.prop] = field.rules;
		} else {
			rules[field.prop] = [
				{
					required: true,
					message: `请${field.type === "select" ? "选择" : "输入"}${field.label}`,
					trigger: field.type === "select" ? "change" : "blur",
				},
			];
		}
	});
	return rules;
});

/** 新增 */
function handleAdd() {
	dialogTitle.value = "新增";
	dialogType.value = "add";
	formData.value = {} as T;
	dialogVisible.value = true;
}

/** 编辑 */
function handleEdit(row: T) {
	dialogTitle.value = "编辑";
	dialogType.value = "edit";
	formData.value = { ...row };
	dialogVisible.value = true;
}

/** 删除 */
async function handleDelete(row: T) {
	try {
		await ElMessageBox.confirm("确定要删除该记录吗？", "提示", {
			type: "warning",
		});
		emit("delete", row);
	} catch (error) {
		// 用户取消删除
	}
}

/** 提交表单 */
async function handleSubmit() {
	if (!formRef.value) return;

	await formRef.value.validate((valid) => {
		if (valid) {
			if (dialogType.value === "add") {
				emit("add", formData.value);
			} else {
				emit("edit", formData.value);
			}
			dialogVisible.value = false;
		}
	});
}

/** 重置表单 */
function resetForm() {
	formData.value = {} as T;
	formRef.value?.clearValidate();
}
</script>

<template>
	<div class="config-table-container">
		<!-- 标题和操作按钮 -->
		<div v-if="title || showAdd" class="header">
			<h3 v-if="title" class="title">{{ title }}</h3>
			<el-button v-if="showAdd" type="primary" @click="handleAdd">
				<template #icon>
					<IconifyIconOffline icon="ep:plus" />
				</template>
				新增
			</el-button>
		</div>

		<!-- 表格 -->
		<el-table :data="data" border stripe style="width: 100%">
			<el-table-column type="index" label="序号" width="60" align="center" />
			<el-table-column
				v-for="column in columns"
				:key="column.prop"
				:prop="column.prop"
				:label="column.label"
				:width="column.width"
				:min-width="column.minWidth"
				:align="column.align || 'left'"
			/>
			<el-table-column
				v-if="showOperation && (showEdit || showDelete)"
				label="操作"
				width="180"
				align="center"
				fixed="right"
			>
				<template #default="{ row }">
					<el-button v-if="showEdit" type="primary" size="small" link @click="handleEdit(row)"> 编辑 </el-button>
					<el-button v-if="showDelete" type="danger" size="small" link @click="handleDelete(row)"> 删除 </el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 新增/编辑对话框 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="600px"
			:close-on-click-modal="false"
			destroy-on-close
			@closed="resetForm"
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
				<el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
					<!-- 下拉选择 -->
					<template v-if="field.type === 'select'">
						<el-select
							v-model="formData[field.prop]"
							:placeholder="field.placeholder || `请选择${field.label}`"
							style="width: 100%"
						>
							<el-option
								v-for="option in field.options"
								:key="option.value"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>
					</template>

					<!-- 数字输入 -->
					<template v-else-if="field.type === 'number'">
						<el-input-number
							v-model="formData[field.prop]"
							:placeholder="field.placeholder || `请输入${field.label}`"
							style="width: 100%"
						/>
					</template>

					<!-- 多行文本 -->
					<template v-else-if="field.type === 'textarea'">
						<el-input
							v-model="formData[field.prop]"
							type="textarea"
							:rows="3"
							:placeholder="field.placeholder || `请输入${field.label}`"
						/>
					</template>

					<!-- 普通输入 -->
					<template v-else>
						<el-input v-model="formData[field.prop]" :placeholder="field.placeholder || `请输入${field.label}`" />
					</template>
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
.config-table-container {
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;

		.title {
			font-size: 18px;
			font-weight: 500;
			margin: 0;
		}
	}
}
</style>
