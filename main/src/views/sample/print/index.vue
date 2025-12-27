<script lang="ts" setup>
import { onMounted } from "vue";
import { disAutoConnect, hiprint } from "vue-plugin-hiprint";

defineOptions({
	name: "PrintSample",
});

/** 定义打印模板字符串对象 */
let tplJson: any;

/** 挂载的时候初始化打印对象 */
onMounted(async () => {
	// 取消自动连接直接打印客户端
	disAutoConnect();
	// 引入后使用示例
	hiprint.init();
	// 获取打印模板
	try {
		const req = await fetch("/template/test-print-tpl.json");
		tplJson = await req.json();
	} catch (error) {
		console.error("加载打印模板失败:", error);
	}
});

/** 代码模式打印 - 使用代码创建打印模板 */
function executeCodePrint() {
	const printTemplate = new hiprint.PrintTemplate();
	// 创建一个绘制面板
	const panel = printTemplate.addPrintPanel({
		width: 100,
		height: 130,
		paperFooter: 340,
		paperHeader: 10,
	});
	// 文本
	panel.addPrintText({
		options: {
			width: 140,
			height: 15,
			top: 20,
			left: 20,
			title: "测试标题文字",
			textAlign: "center",
		},
	});
	// 条形码
	panel.addPrintText({
		options: {
			width: 140,
			height: 35,
			top: 40,
			left: 20,
			title: "123456",
			textType: "barcode",
		},
	});
	// 二维码
	panel.addPrintText({
		options: {
			width: 35,
			height: 35,
			top: 40,
			left: 165,
			title: "123456",
			textType: "qrcode",
		},
	});
	// 长文本
	panel.addPrintLongText({
		options: {
			width: 180,
			height: 35,
			top: 90,
			left: 20,
			title: "( ಠ ಠ )：这是一个很长的文本(◔ д ◔)(◣_◢)",
		},
	});
	// 打印
	printTemplate.print({});
}

/** 拖拽模板打印 - 使用 JSON 模板打印 */
function executeTplPrint() {
	if (!tplJson) {
		ElMessage.warning("打印模板尚未加载，请稍后再试");
		return;
	}
	const printTemplate = new hiprint.PrintTemplate({
		template: tplJson,
	});
	printTemplate.print({ tname: "我是标题" });
}
</script>

<template>
	<el-card shadow="never">
		<template #header>
			<div class="card-header">
				<span>打印功能演示</span>
			</div>
		</template>

		<el-space :size="16" wrap>
			<el-button type="primary" @click="executeCodePrint">
				<IconifyIconOffline icon="ep:printer" />
				代码模式打印
			</el-button>
			<el-button type="success" @click="executeTplPrint">
				<IconifyIconOffline icon="ep:document" />
				拖拽模板打印
			</el-button>
		</el-space>

		<el-divider />

		<el-descriptions title="功能说明" :column="1" border>
			<el-descriptions-item label="代码模式打印">
				通过代码创建打印模板，支持文本、条形码、二维码、长文本等元素
			</el-descriptions-item>
			<el-descriptions-item label="拖拽模板打印">
				使用预定义的 JSON 模板进行打印，模板文件位于 public/template/ 目录
			</el-descriptions-item>
			<el-descriptions-item label="依赖库"> vue-plugin-hiprint - Vue 3 打印插件 </el-descriptions-item>
		</el-descriptions>
	</el-card>
</template>

<style lang="scss" scoped>
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
