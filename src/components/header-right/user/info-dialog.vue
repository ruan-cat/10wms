<!-- 
	用户信息弹框 
	显示用户信息，可修改用户信息
-->
<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";
import { type DialogPromiseProps } from "components/dialog-promise/types";
import { type BaseFormProps } from "components/base-form/index.vue";

/** 弹框组件配置 */
const dialogPromiseProps = ref<DialogPromiseProps<{}>>({
	async onDialogClose({ reject, resolve }) {
		resolve({});
		return true;
	},
});

/** 弹框组件实例 */
const dialogRef = useTemplateRef("dialogRef");

/**
 * 用户信息
 * @description
 * TODO: 临时写的 不清楚后端是那个接口
 */
interface UserInfo {
	username: string;
	name: string;
	phone: string;
	email: string;
}

const form = ref<UserInfo>({
	username: "admin",
	name: "管理员",
	phone: "",
	email: "",
});

/** 表单配置 */
const baseFormProps = ref<BaseFormProps<UserInfo>>({
	form: form.value,
	formItems: [
		{
			type: "input",
			props: {
				label: "年龄",
				prop: "age",
				placeholder: "请输入年龄",
				maxlength: 10,
				responsive: { md: 12, lg: 8 },
			},
		},
	],
});

/** 表单组件实例 */
const baseFormRef = useTemplateRef("baseFormRef");

const handleSubmit = () => {
	// 这里可以添加保存逻辑
	// alert("个人信息已保存！");
	// handleClose();
};

const handleUpdateVisible = (value: boolean) => {
	// emit("update:visible", value);
};
</script>

<template>
	<ComponentsDialogPromise :="dialogPromiseProps" ref="dialogRef">
		<template #default>
			<ComponentsBaseForm :="baseFormProps" ref="baseFormRef"></ComponentsBaseForm>
		</template>

		<template #footer="{ reject, resolve }">
			<ElButton type="info" @click="dialogPromiseProps.onDialogClose({ reject, resolve })"> 关闭 </ElButton>
		</template>
	</ComponentsDialogPromise>
	<el-dialog title="个人信息" width="30%" :before-close="handleClose" @update:model-value="handleUpdateVisible">
		<el-form :model="form" label-width="100px">
			<el-form-item label="用户账号">
				<el-input v-model="form.username" disabled />
			</el-form-item>
			<el-form-item label="姓名">
				<el-input v-model="form.name" />
			</el-form-item>
			<el-form-item label="手机号码">
				<el-input v-model="form.phone" />
			</el-form-item>
			<el-form-item label="邮箱">
				<el-input v-model="form.email" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="handleClose">关闭</el-button>
			<el-button type="primary" @click="handleSubmit">保存</el-button>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
.el-form-item {
	margin-bottom: 20px;
}
</style>
