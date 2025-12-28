<script lang="ts" setup>
import { ref } from "vue";
import SimpleDataTable from "@/components/Table/index.vue";
import type { SimpleDataTableColumn } from "@/components/Table/types";

definePage({
	meta: {
		menuType: "page",
		title: "消息中心",
		icon: "ep:message",
	},
});

/** 表格数据类型 */
interface MessageCenterRow {
	esType: string;
	esTitle: string;
	esSender: string;
	esReceiver: string;
	esContent: string;
	createDate: string;
	esSendtime: string;
	esStatus: string;
	remark: string;
}

/** 表格数据 */
const tableData = ref<MessageCenterRow[]>([
	{
		esType: "系统提醒",
		esTitle: "收货通知",
		esSender: "admin",
		esReceiver: "admin",
		esContent: "刘阳蔬菜批发部客户的出货订单CK20200116-0008将于出货，请准备出货。",
		createDate: "2023-10-01",
		esSendtime: "2023-10-01 10:00:00",
		esStatus: "发送成功",
		remark: "发送成功",
	},
	{
		esType: "系统提醒",
		esTitle: "收货通知",
		esSender: "admin",
		esReceiver: "admin",
		esContent: "刘阳蔬菜批发部客户的出货订单CK20200116-0008将于出货，请准备出货。",
		createDate: "2023-10-01",
		esSendtime: "2023-10-01 10:00:00",
		esStatus: "发送成功",
		remark: "发送成功",
	},
]);

/** 表格列配置 */
const tableColumns = ref<SimpleDataTableColumn<MessageCenterRow>[]>([
	{ prop: "esType", label: "消息类型", width: 90 },
	{ prop: "esTitle", label: "消息标题", width: 100 },
	{ prop: "esSender", label: "发送人", width: 80 },
	{ prop: "esReceiver", label: "接收人", width: 80 },
	{ prop: "esContent", label: "内容", minWidth: 300 },
	{ prop: "createDate", label: "创建日期", width: 120 },
	{ prop: "esSendtime", label: "发送时间", width: 160 },
	{ prop: "esStatus", label: "发送状态", width: 100 },
	{ prop: "remark", label: "备注", width: 100 },
]);

/** 分页配置 */
const pagination = ref({
	total: 2,
	currentPage: 1,
	pageSize: 10,
});

/** 搜索表单 */
const searchForm = ref({
	messageType: "",
	messageTitle: "",
	sendStatus: "",
});

/** 对话框显示 */
const dialogVisible = ref(false);
/** 当前编辑行 */
const currentRow = ref<MessageCenterRow | null>(null);

/** 处理查询 */
function handleSearch() {
	console.log("查询", searchForm.value);
}

/** 处理重置 */
function handleReset() {
	searchForm.value = {
		messageType: "",
		messageTitle: "",
		sendStatus: "",
	};
}

/** 处理消息修正 */
function handleEdit() {
	console.log("消息修正");
}

/** 处理分页变化 */
function handlePageChange(page: { currentPage: number; pageSize: number }) {
	pagination.value.currentPage = page.currentPage;
	pagination.value.pageSize = page.pageSize;
	console.log("分页变化", page);
}

/** 确定编辑 */
function handleConfirm() {
	dialogVisible.value = false;
}
</script>

<template>
	<div class="message-center-container">
		<el-card shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-bold">消息发送列表</span>
				</div>
			</template>

			<!-- 搜索区域 -->
			<el-form :inline="true" :model="searchForm" class="search-form">
				<el-form-item label="消息类型">
					<el-select v-model="searchForm.messageType" placeholder="请选择" clearable>
						<el-option label="短信提醒" value="短信提醒" />
						<el-option label="邮件提醒" value="邮件提醒" />
						<el-option label="系统提醒" value="系统提醒" />
					</el-select>
				</el-form-item>
				<el-form-item label="消息标题">
					<el-input v-model="searchForm.messageTitle" placeholder="请输入消息标题" clearable />
				</el-form-item>
				<el-form-item label="发送状态">
					<el-select v-model="searchForm.sendStatus" placeholder="请选择" clearable>
						<el-option label="未发送" value="未发送" />
						<el-option label="发送成功" value="发送成功" />
						<el-option label="发送失败" value="发送失败" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>

			<!-- 操作按钮 -->
			<div class="toolbar">
				<el-button @click="handleEdit">消息修正</el-button>
			</div>

			<!-- 表格 -->
			<SimpleDataTable
				:data="tableData"
				:columns="tableColumns"
				:pagination="pagination"
				is-index
				is-multiple-select
				@page-change="handlePageChange"
			/>
		</el-card>

		<!-- 编辑对话框 -->
		<el-dialog v-model="dialogVisible" title="编辑" width="40%" draggable>
			<el-form v-if="currentRow" label-width="100px">
				<el-form-item label="消息标题">
					<el-input v-model="currentRow.esTitle" />
				</el-form-item>
				<el-form-item label="消息类型">
					<el-select v-model="currentRow.esType" placeholder="请选择">
						<el-option label="短信提醒" value="短信提醒" />
						<el-option label="邮件提醒" value="邮件提醒" />
						<el-option label="系统提醒" value="系统提醒" />
					</el-select>
				</el-form-item>
				<el-form-item label="接收人">
					<el-input v-model="currentRow.esReceiver" />
				</el-form-item>
				<el-form-item label="内容">
					<el-input v-model="currentRow.esContent" type="textarea" :rows="4" />
				</el-form-item>
				<el-form-item label="发送状态">
					<el-select v-model="currentRow.esStatus" placeholder="请选择">
						<el-option label="发送成功" value="发送成功" />
						<el-option label="发送失败" value="发送失败" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="primary" @click="handleConfirm">确定</el-button>
				<el-button @click="dialogVisible = false">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.message-center-container {
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
}
</style>
