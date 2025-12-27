<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Upload, Delete } from "@element-plus/icons-vue";
import * as XLSX from "xlsx";
import type { UploadFile, UploadInstance, UploadRawFile } from "element-plus";

interface Props {
	/** 上传地址 */
	uploadUrl?: string;
	/** 最大预览行数 */
	maxPreviewRows?: number;
	/** 是否自动上传 */
	autoUpload?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	uploadUrl: "",
	maxPreviewRows: 50,
	autoUpload: false,
});

const emit = defineEmits<{
	success: [data: any[]];
	error: [error: any];
}>();

const excelData = ref<any[]>([]);
const columns = ref<string[]>([]);
const fileList = ref<UploadFile[]>([]);
const uploadRef = ref<UploadInstance>();
const hasFile = ref(false);

/** 处理 Excel 文件解析 */
function handleExcel(file: UploadFile) {
	try {
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = e.target?.result;
			const workbook = XLSX.read(data, { type: "array" });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(sheet);
			columns.value = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
			excelData.value = jsonData.slice(0, props.maxPreviewRows);
			hasFile.value = true;
		};
		reader.readAsArrayBuffer(file.raw as Blob);
	} catch (error) {
		ElMessage.error(`文件解析失败，请检查文件格式：${error}`);
	}
}

/** 删除文件 */
async function handleDelete(index: number) {
	try {
		await ElMessageBox.confirm("您确认要删除该文件吗?", "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning",
		});

		fileList.value.splice(index, 1);

		if (fileList.value.length === 0) {
			excelData.value = [];
			columns.value = [];
			hasFile.value = false;
		} else {
			const nextIndex = index - 1 < 0 ? index : index - 1;
			handleExcel(fileList.value[nextIndex]);
		}
	} catch (error) {
		// 用户取消删除
	}
}

/** 点击文件名预览 */
function handleClick(item: UploadFile) {
	handleExcel(item);
}

/** 提交上传 */
function handleSubmit() {
	if (!fileList.value.length) {
		ElMessage.warning("请先选择文件");
		return;
	}
	uploadRef.value?.submit();
}

/** 文件改变时 */
function handleFileChange(file: UploadFile) {
	if (!file || !file.raw) return;
	handleExcel(file);
}

/** 上传前验证 */
function handleBeforeUpload(file: UploadRawFile) {
	const validTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
	if (!validTypes.includes(file.type)) {
		ElMessage.error("请上传 xlsx 或 xls 格式的文件");
		return false;
	}
	return true;
}

/** 上传成功 */
function handleUploadSuccess(response: any, file: UploadFile, files: UploadFile[]) {
	ElMessage.success("文件上传成功");
	emit("success", excelData.value);
	// 清空数据
	fileList.value = [];
	excelData.value = [];
	columns.value = [];
	hasFile.value = false;
}

/** 上传失败 */
function handleUploadError(error: any, file: UploadFile) {
	ElMessage.error(`${file.name} 上传失败：${error}`);
	emit("error", error);
	// 清空数据
	excelData.value = [];
	fileList.value = [];
	columns.value = [];
	hasFile.value = false;
}
</script>

<template>
	<div class="excel-import">
		<!-- 头部操作区 -->
		<el-card shadow="never" class="excel-header">
			<div class="operation-area">
				<el-upload
					ref="uploadRef"
					v-model:file-list="fileList"
					class="upload-demo"
					accept=".xlsx,.xls"
					:action="uploadUrl"
					:auto-upload="autoUpload"
					drag
					multiple
					:show-file-list="false"
					:before-upload="handleBeforeUpload"
					:on-success="handleUploadSuccess"
					:on-error="handleUploadError"
					:on-change="handleFileChange"
				>
					<el-icon class="el-icon--upload"><Upload /></el-icon>
					<div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
					<template #tip>
						<div class="el-upload__tip">支持 xlsx/xls 格式文件</div>
					</template>
				</el-upload>

				<el-button v-if="!autoUpload" type="primary" :disabled="!hasFile" @click="handleSubmit"> 开始上传 </el-button>
			</div>

			<!-- 文件列表 -->
			<div v-if="hasFile" class="file-list">
				<div v-for="(item, index) in fileList" :key="index" class="file-item" @click="handleClick(item)">
					<span class="file-name">{{ item.name }}</span>
					<el-icon class="delete-icon" @click.stop="handleDelete(index)">
						<Delete />
					</el-icon>
				</div>
			</div>
			<div v-else class="no-file">暂无文件</div>
		</el-card>

		<!-- 数据预览区 -->
		<el-card shadow="never" class="excel-body">
			<template #header>
				<div class="card-header">
					<span>数据预览</span>
					<span v-if="excelData.length" class="tip"> 仅显示前 {{ maxPreviewRows }} 条数据 </span>
				</div>
			</template>

			<el-table :data="excelData" border stripe max-height="400" style="width: 100%">
				<el-table-column
					v-for="(column, index) in columns"
					:key="index"
					:label="column"
					:prop="column"
					min-width="120"
				/>
			</el-table>

			<el-empty v-if="!excelData.length" description="暂无数据" />
		</el-card>
	</div>
</template>

<style lang="scss" scoped>
.excel-import {
	.excel-header {
		margin-bottom: 16px;

		.operation-area {
			display: flex;
			align-items: center;
			gap: 16px;
			margin-bottom: 16px;

			.upload-demo {
				flex: 1;
			}
		}

		.file-list {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;

			.file-item {
				display: flex;
				align-items: center;
				padding: 8px 12px;
				background-color: var(--el-fill-color-light);
				border-radius: 4px;
				cursor: pointer;
				transition: all 0.3s;

				&:hover {
					background-color: var(--el-fill-color);
					border: 1px dashed var(--el-color-primary);

					.delete-icon {
						opacity: 1;
					}
				}

				.file-name {
					font-size: 14px;
					margin-right: 8px;
				}

				.delete-icon {
					opacity: 0;
					cursor: pointer;
					transition: opacity 0.3s;
					color: var(--el-color-danger);

					&:hover {
						color: var(--el-color-danger-light-3);
					}
				}
			}
		}

		.no-file {
			text-align: center;
			color: var(--el-text-color-secondary);
			padding: 16px 0;
		}
	}

	.excel-body {
		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.tip {
				font-size: 12px;
				color: var(--el-text-color-secondary);
			}
		}
	}
}
</style>
