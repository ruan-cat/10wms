<script lang="ts" setup>
import ComponentsTable from "components/table/index.vue";
import { ElButton, ElMessage, ElMessageBox } from "element-plus";

import { onMounted, ref, useTemplateRef } from "vue";
import { cloneDeep, isEqual, isNil } from "lodash-es";
import ComponentsDialogPromise from "components/dialog-promise/index.vue";
import type { DialogPromiseProps } from "components/dialog-promise/types";
// 导入API
import {
	addAutoCoding,
	deleteAutoCoding,
	exportAutoCoding,
	listAutoCoding,
	updateAutoCoding,
} from "@/apis/auto-coding-gaogao/index";
import Pagination from "@/components/Pagination/index.vue";
import Delete from "@/components/table-title/table-icon/Delete.vue";
import Edit from "@/components/table-title/table-icon/Edit.vue";
import { Download, Plus, Upload, View } from "@element-plus/icons-vue";
definePage({
	meta: {
		menuType: "page",
		text: "自动编码",
		icon: "IconSetting",
	},
});

import { utils, writeFileXLSX } from "xlsx";

// 确保Element Plus的样式被导入
import "element-plus/dist/index.css";

// =============================表格部分=============================
interface TableData {
	/**
	 * 自动编码唯一ID
	 */
	id?: string;
	/**
	 * 编号类型
	 */
	snroTypeCode?: string;
	/**
	 * 组织机构
	 */
	snroOrg?: string;
	/**
	 * 前缀
	 */
	snroFindex?: string;
	/**
	 * 分隔符
	 */
	snroSplit?: string;
	/**
	 * 年位数
	 */
	snroYear?: string;
	/**
	 * 月位数
	 */
	snroMonth?: string;
	/**
	 * 日位数
	 */
	snroDay?: string;
	/**
	 * 序号位数
	 */
	snroSeri?: string;
	/**
	 * 示例号码
	 */
	snroExp?: string;
}

// 表格组件数据
const componentsTableProps = ref<SimpleDataTableProps<TableData>>({
	isIndex: true,
	isMultipleSelect: true,
	data: [],
	columns: [
		{ prop: "snroTypeCode", label: "编号类型" },
		{ prop: "snroOrg", label: "组织机构" },
		{ prop: "snroFindex", label: "前缀" },
		{ prop: "snroSplit", label: "分隔符" },
		{ prop: "snroYear", label: "年位数" },
		{ prop: "snroMonth", label: "月位数" },
		{ prop: "snroDay", label: "日位数" },
		{ prop: "snroSeri", label: "序号位数" },
		{ prop: "snroExp", label: "示例号码" },
		{ prop: "operation-bar", label: "操作" },
	],
});

// 当前分页参数
const currentPageData = ref({
	pageIndex: 1,
	pageSize: 10,
	pages: 0,
	total: 0,
});

function loadData() {
	listAutoCoding(
		{
			pageIndex: currentPageData.value.pageIndex,
			pageSize: currentPageData.value.pageSize,
		},
		(data: any) => {
			// 成功
			componentsTableProps.value.data = data.rows;
			currentPageData.value.pages = data.pages;
			currentPageData.value.total = data.total;
		},
		() => {
			// 失败
			ElMessage.error("系统参数数据加载失败");
		},
	);
}
onMounted(() => {
	loadData();
});
// =============================弹窗部分=============================
export interface OnConfirmParams<T> {
	resolve: (value: T) => void;
	reject: (reason?: any) => void;
}
export type OnConfirmFunction<T> = (params: OnConfirmParams<T>) => Promise<boolean>;

/** 空的表单 */
const emptyForm = {
	snroTypeCode: "",
	snroOrg: "",
	snroFindex: "",
	snroSplit: "",
	snroYear: "",
	snroMonth: "",
	snroDay: "",
	snroSeri: "",
	snroExp: "",
};

/** 弹窗类型 0 新增 1 编辑  2 删除 3 导出 */
const dialogType = ref<number>(0);

/** 表单对象 */
const form = ref<TableData>(cloneDeep(emptyForm));

/** 重设表单 */
function resetForm() {
	form.value = cloneDeep(emptyForm);
}

/** 表单是否填写过了？是否存在修改？ */
function hasChange() {
	return !isEqual(form.value, {
		snroTypeCode: "",
		snroOrg: "",
		snroFindex: "",
		snroSplit: "",
		snroYear: "",
		snroMonth: "",
		snroDay: "",
		snroSeri: "",
		snroExp: "",
	});
}
// 选中的行
const selectedRows: Ref<TableData[]> = ref([]);
const isViewMode = ref(false); // 默认不是查看模式
const dialogPromiseProps = ref<DialogPromiseProps<TableData>>({
	dialogProps: {
		// title: "编码规则录入",
		title: isViewMode.value ? "查看编码规则" : "编辑编码规则",
	},

	async onDialogClose({ reject, resolve }) {
		if (isViewMode.value) {
			// 查看模式下直接关闭弹框
			resetForm();
			isViewMode.value = false; // 编辑模式
			resolve(form.value);
			// 返回 true 表示弹框关闭成功
			return true;
		}
		if (hasChange()) {
			return await ElMessageBox.confirm("确定要关闭弹框么？你填写的内容尚未保存。", "关闭弹框", {
				confirmButtonText: "关闭",
				cancelButtonText: "取消",
				type: "warning",
				customClass: "custom-message-box",
			})
				.then(() => {
					// 关闭弹框前做手动做一次表单重设
					resetForm();
					isViewMode.value = false; // 编辑模式
					// 本次弹框没有产生有意义的数据 故返回 undefined
					reject(void 0);
					// 返回 true 表示弹框关闭成功
					return true;
				})
				.catch(
					// 返回 false 表示弹框不关闭 用户取消了关闭弹框
					() => false,
				);
		} else {
			// 用户没有做任何修改 也可以无条件的做一次表单重设
			resetForm();
			isViewMode.value = false; // 编辑模式
			// 可以将现在全部为空的数据 返回给父组件
			resolve(form.value);
			// 返回 true 表示弹框关闭成功
			return true;
		}
	},
});
// 提交逻辑
const onConfirm: OnConfirmFunction<any> = async ({ resolve, reject }) => {
	try {
		// 成功时调用 resolve
		resolve(form.value);
		console.log("ok form", form.value);

		// 根据窗口类型进行不同的操作
		if (dialogType.value === 0) {
			addAutoCoding(
				form.value,
				() => {
					// 成功逻辑
					ElMessage.success("新增成功");
					loadData();
				},
				() => {
					// 失败逻辑
					ElMessage.error("新增失败");
				},
			);
		} else if (dialogType.value === 1) {
			updateAutoCoding(
				form.value,
				() => {
					// 成功逻辑
					ElMessage.success("编辑成功");
					loadData();
				},
				() => {
					// 失败逻辑
					ElMessage.error("编辑失败");
				},
			);
			/**
				}  else if (dialogType.value === 2) {
			deleteAutoCoding(
				[form.value.id],
				() => {
					// 成功逻辑
					ElMessage.success("删除成功");
					loadData();
				},
				() => {
					// 失败逻辑
					ElMessage.error("删除失败");
				},
			);
			 */
		} else if (dialogType.value === 3) {
			exportAutoCoding(
				() => {
					// 成功逻辑
					ElMessage.success("导出成功");
				},
				() => {
					// 失败逻辑
					ElMessage.error("导出失败");
				},
			);
		}

		return true;
	} catch (error) {
		// 失败时调用 reject
		reject(error);
		return false;
	}
};
// 弹窗引用
const dialogRef = useTemplateRef("dialog");
// 打开弹窗
function openDialog() {
	if (!isNil(dialogRef.value)) {
		dialogRef.value.open().then((result) => {
			console.log("result", result);
		});
	}
}

// 录入逻辑（保持不变）
function handleAdd() {
	resetForm();
	isViewMode.value = false; // 编辑模式
	dialogType.value = 0;
	openDialog();
}

// 编辑
function handleEdit() {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning("请选择一条记录进行编辑");
		return;
	}
	form.value = {
		id: selectedRows.value[0].id ?? "",
		snroTypeCode: selectedRows.value[0].snroTypeCode ?? "",
		snroOrg: selectedRows.value[0].snroOrg ?? "",
		snroFindex: selectedRows.value[0].snroFindex ?? "",
		snroSplit: selectedRows.value[0].snroSplit ?? "",
		snroYear: selectedRows.value[0].snroYear ?? "",
		snroMonth: selectedRows.value[0].snroMonth ?? "",
		snroDay: selectedRows.value[0].snroDay ?? "",
		snroSeri: selectedRows.value[0].snroSeri ?? "",
		snroExp: selectedRows.value[0].snroExp ?? "",
	}; // 填充表单数据
	isViewMode.value = false; // 编辑模式
	dialogType.value = 1;
	openDialog(); // 打开弹窗
}

// 查看
function handleView() {
	if (selectedRows.value.length !== 1) {
		ElMessage.warning("请选择一条记录进行查看");
		return;
	}
	form.value = {
		id: selectedRows.value[0].id ?? "",
		snroTypeCode: selectedRows.value[0].snroTypeCode ?? "",
		snroOrg: selectedRows.value[0].snroOrg ?? "",
		snroFindex: selectedRows.value[0].snroFindex ?? "",
		snroSplit: selectedRows.value[0].snroSplit ?? "",
		snroYear: selectedRows.value[0].snroYear ?? "",
		snroMonth: selectedRows.value[0].snroMonth ?? "",
		snroDay: selectedRows.value[0].snroDay ?? "",
		snroSeri: selectedRows.value[0].snroSeri ?? "",
		snroExp: selectedRows.value[0].snroExp ?? "",
	}; // 填充表单数据
	isViewMode.value = true; // 查看模式
	dialogType.value = 2;
	openDialog(); // 打开弹窗
}

// 批量删除
function handleBatchDelete() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning("请至少选择一条记录进行删除");
		return;
	}
	form.value = {
		id: selectedRows.value[0].id ?? "",
		snroTypeCode: selectedRows.value[0].snroTypeCode ?? "",
		snroOrg: selectedRows.value[0].snroOrg ?? "",
		snroFindex: selectedRows.value[0].snroFindex ?? "",
		snroSplit: selectedRows.value[0].snroSplit ?? "",
		snroYear: selectedRows.value[0].snroYear ?? "",
		snroMonth: selectedRows.value[0].snroMonth ?? "",
		snroDay: selectedRows.value[0].snroDay ?? "",
		snroSeri: selectedRows.value[0].snroSeri ?? "",
		snroExp: selectedRows.value[0].snroExp ?? "",
	};
	ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			deleteAutoCoding(
				selectedRows.value.map((rows) => rows.id),
				() => {
					// 成功逻辑
					ElMessage.success("批量删除成功");
					loadData();
				},
				() => {
					// 失败逻辑
					ElMessage.error("批量删除失败");
				},
			);
		})
		.catch(() => {
			// 取消删除
		});
}
// 单行删除
function handleDelete(row: TableData) {
	ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(() => {
			// 调用删除接口
			deleteParameterType(
				[row.id], // 将当前行的 id 传给后端
				() => {
					ElMessage.success("删除成功");
					loadData(); // 重新加载数据
				},
				() => {
					ElMessage.error("删除失败");
				},
			);
		})
		.catch(() => {
			// 取消删除
		});
}

// 导出
const rows = ref([]);
// onMounted(async () => {
// 	/* Download from https://sheetjs.com/pres.numbers */
// 	const f = await fetch("https://sheetjs.com/pres.numbers");
// 	const ab = await f.arrayBuffer();
// 	/* parse workbook */
// 	const wb = read(ab);
// 	/* update data */
// 	rows.value = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
// });

/* get state data and export to XLSX */
function exportFile() {
	const ws = utils.json_to_sheet(rows.value);
	const wb = utils.book_new();
	utils.book_append_sheet(wb, ws, "Data");
	writeFileXLSX(wb, "SheetJSVueAoO.xlsx");
}

// ===========================分页组件部分=============================

function handlePageChange(data: any) {
	currentPageData.value.pageIndex = data.pageNum;
	currentPageData.value.pageSize = data.pageSize;
	loadData();
	console.log("页码变化：", data);
}
</script>

<template>
	<section class="menu-page.example-root">
		<!-- 这是实现具体业务的地方 请编写你的组件 -->
		<!-- ===============弹窗部分============== -->
		<div class="button-group">
			<ElButton type="primary" @click="handleAdd">
				<el-icon><Plus /></el-icon>录入</ElButton
			>
			<ElButton type="primary" @click="handleEdit">
				<el-icon><Edit /></el-icon>编辑</ElButton
			>
			<ElButton type="danger" @click="handleBatchDelete">
				<el-icon><Delete /></el-icon>批量删除</ElButton
			>
			<ElButton type="success" @click="handleView">
				<el-icon><View /></el-icon>查看</ElButton
			>
			<ElButton @click="handleAdd">
				<el-icon><Upload /></el-icon>Excel模板导入
			</ElButton>
			<ElButton @click="exportFile">
				<el-icon><Download /></el-icon>Excel导出
			</ElButton>
		</div>
		<!-- 表单内容 -->
		<ComponentsDialogPromise :="dialogPromiseProps" ref="dialog">
			<template #default>
				<ElForm :model="form" label-position="right" label-width="150px">
					<h2>表单信息管理</h2>
					<ElFormItem prop="snroTypeCode" label="编号类型：">
						<ElInput v-model="form.snroTypeCode" :readonly="isViewMode" />
					</ElFormItem>
					<ElFormItem prop="snroOrg" label="组织机构：">
						<ElInput v-model="form.snroOrg" :readonly="isViewMode" />
					</ElFormItem>
					<ElFormItem prop="snroFindex" label="前缀：">
						<ElInput v-model="form.snroFindex" :readonly="isViewMode" />
					</ElFormItem>
					<ElFormItem prop="snroSplit" label="分隔符：">
						<ElInput v-model="form.snroSplit" :readonly="isViewMode" />
					</ElFormItem>
					<ElFormItem prop="snroYear" label="年位数：">
						<ElInput v-model="form.snroYear" :readonly="isViewMode" />
					</ElFormItem>
					<ElFormItem prop="snroMonth" label="月位数：">
						<ElInput v-model="form.snroMonth" :readonly="isViewMode" />
					</ElFormItem>
					<ElFormItem prop="snroDay" label="日位数：">
						<ElInput v-model="form.snroDay" :readonly="isViewMode" />
					</ElFormItem>
					<ElFormItem prop="snroSeri" label="序号位数：">
						<ElInput v-model="form.snroSeri" :readonly="isViewMode" />
					</ElFormItem>
					<ElFormItem prop="snroExp" label="示例号码：">
						<ElInput v-model="form.snroExp" :readonly="isViewMode" />
					</ElFormItem>
				</ElForm>
			</template>
			<template #footer="{ reject, resolve }">
				<ElButton type="info" @click="dialogPromiseProps.onDialogClose({ reject, resolve })"> 关闭 </ElButton>
				<ElButton type="primary" @click="onConfirm({ reject, resolve })" v-if="!isViewMode"> 确认 </ElButton>
			</template>
		</ComponentsDialogPromise>

		<!-- ===============表格部分============== -->
		<ComponentsTable :="componentsTableProps" @selection-change="selectedRows = $event">
			<template #bodyCell="{ prop }">
				<template v-if="prop === 'operation-bar'">
					<ElButton type="danger" @click="() => handleDelete(row)">删除</ElButton>
				</template>
			</template>
		</ComponentsTable>
		<!-- ==================分页组件部分================= -->
		<div class="demo-section">
			<Pagination
				:page-total="currentPageData.total"
				:page-sizes="[10, 20, 50, 100]"
				:pager-count="currentPageData.pages"
				:current-page="currentPageData.pageIndex"
				:page-size="currentPageData.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				@page-func="handlePageChange"
			/>
		</div>
	</section>
</template>

<style lang="scss" scoped>
// .menu-page.example-root {
// 	// 这是实现具体业务的地方 请编写你的组件样式
// }
.custom-message-box .el-message-box__content {
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	text-align: center !important;
}
.custom-message-box .el-message-box__status {
	color: #e6a23c !important; // 警告图标颜色
	font-size: 24px !important; // 图标大小
	margin-right: 10px !important;
}
.custom-message-box .el-message-box__message {
	margin: 0 !important;
	font-size: 16px !important;
	color: #606266 !important;
}
.custom-message-box .el-message-box__btns {
	.el-button {
		margin: 0 10px !important;
	}
}
.button-group {
	margin: 20px 5px;
}
.el-input {
	width: 200px; /* 调整输入框宽度 */
}
h2 {
	color: brown;
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 10px;
}

// 分页组件样式
.demo-section {
	// position: fixed;
	// bottom: 0;
	// left: 0;
	margin-bottom: 30px;
	padding: 20px;
	border: 1px solid #eee;
	border-radius: 8px;
}
</style>
