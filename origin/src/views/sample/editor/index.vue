<script lang="ts" setup>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ElMessage } from "element-plus";
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

definePage({
	meta: {
		menuType: "page",
		isSample: true,
		text: "富文本框演示",
		icon: "IconSetting",
	},
});
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const mode = "default"; // 或 'simple'
// 内容HTML
const valueHtml = ref(`<p>你好，富文本编辑器</p>`);
// 模拟ajax异步获取内容
onMounted(() => {
	setTimeout(() => {
		valueHtml.value = `<p>模拟异步设置内容</p>`;
	}, 1500);
});
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor == null) return;
	editor.destroy();
});
// 组件相关配置
const toolbarConfig = {};
const editorConfig = {
	placeholder: "请输入内容...",
	MENU_CONF: {
		// 配置图片上传服务器
		uploadImage: {
			// 服务端地址
			server: "http://localhost:8090/file/editor-upload-image",
			// 文件上传对应的表单名称，默认值：wangeditor-uploaded-image
			fieldName: "file",
			// 单个文件上传失败
			onFailed(file, res) {
				ElMessage.error("图片上传失败");
			},
			// 上传错误，或者触发 timeout 超时
			onError(file, err, res) {
				ElMessage.error("图片上传失败");
			},
			// 自定义插入图片
			customInsert(res, insertFn) {
				// 服务端的返回结果
				if (res.code === 10000) insertFn(res.data.url, res.data.alt, res.data.href);
				else ElMessage.error("图片上传失败");
			},
		},
	},
};
// 编辑器创建回调
function handleCreated(editor) {
	editorRef.value = editor; // 记录 editor 实例，重要！
}
// 编辑器内容发生变化
function handleChange(editor) {
	console.log(editor.getHtml());
	console.log(editor.getText());
}
</script>

<template>
	<div style="border: 1px solid #ccc">
		<Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :default-config="toolbarConfig" :mode="mode" />
		<Editor
			v-model="valueHtml"
			style="height: 500px; overflow-y: hidden"
			:default-config="editorConfig"
			:mode="mode"
			@on-created="handleCreated"
			@on-change="handleChange"
		/>
	</div>
</template>
