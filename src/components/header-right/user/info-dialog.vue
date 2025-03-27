<!-- 
	用户信息弹框 
	显示用户信息，可修改用户信息
-->
<script lang="ts" setup>
import { ref, useTemplateRef, onMounted } from "vue";
import { type DialogPromiseProps } from "components/dialog-promise/types";
import { type BaseFormProps } from "components/base-form/index.vue";

/** 弹框组件配置 */
const dialogPromiseProps = ref<DialogPromiseProps<{}>>({
	dialogProps: {
		title: "个人信息",
		width: "30%",
	},
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
	labelWidth: "100px",
	formItems: [
		{
			type: "input",
			props: {
				label: "用户账号",
				prop: "username",
			},
		},
		{
			type: "input",
			props: {
				label: "姓名",
				prop: "name",
			},
		},
		{
			type: "input",
			props: {
				label: "手机号码",
				prop: "phone",
			},
		},
		{
			type: "input",
			props: {
				label: "邮箱",
				prop: "email",
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

onMounted(() => {
	// TODO: 对接获取用户信息的接口
});
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
</template>

<style lang="scss" scoped></style>
