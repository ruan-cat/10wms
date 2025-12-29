<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import * as XLSX from "xlsx";

interface ExcelProps {
	/** 上传地址的 URL */
	uploadUrl?: string;
}

const props = withDefaults(defineProps<ExcelProps>(), {
	uploadUrl: "",
});

const excelData = ref([]);
const columns = ref([]);
const fileList = ref([]);
const uploadRef = ref();
/** 如果直接写fileList.length==0,当fileList为空数组时，上传成功后，excel-name-container元素中还会出现原有的文件序列，所以需要用ref来响应式地更新 */
const hasFile = ref(false);

/** 处理 Excel 文件解析 */
function handleExcel(file) {
	try {
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = e.target.result;
			const workbook = XLSX.read(data, { type: "array" });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(sheet);
			columns.value = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
			excelData.value = jsonData.splice(0, 50);
			hasFile.value = true;
		};
		reader.readAsArrayBuffer(file.raw);
	} catch (error) {
		ElMessage.error(`文件解析失败，请检查文件格式${error}`);
	}
}

/** 删除文件 */
function handleDelete(index) {
	ElMessageBox.confirm("您确认要删除该文件吗?")
		.then(() => {
			fileList.value.splice(index, 1);
			if (fileList.value.length == 0) {
				excelData.value = [];
				columns.value = [];
			} else {
				if (index - 1 < 0) {
					handleExcel(fileList.value[index]);
				} else {
					handleExcel(fileList.value[index - 1]);
				}
			}
		})
		.catch((e) => {
			ElMessage.error(`删除失败,原因：${e}`);
		});
}

/** 点击文件名切换预览 */
function handleClick(item) {
	handleExcel(item);
}

/** 提交上传 */
function handleSubmit() {
	uploadRef.value.submit();
}

/** 文件变化时解析 */
function handleFileChange(file) {
	if (!file || !file.raw) return;
	handleExcel(file);
}

/** 上传前验证 */
function handleUpload(file) {
	const validTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
	if (!validTypes.includes(file.type)) {
		ElMessage.error("请上传 xlsx 或 xls 格式的文件哦");
		return false;
	}
	return true;
}

/** 上传成功 */
function handleUploadSuccess(response, file, fileList) {
	ElMessage.success("文件上传成功");
	fileList.value = [];
	excelData.value = [];
	hasFile.value = false;
	uploadRef.value.getBoundingClientRect(); // 强制刷新页面
}

/** 上传失败 */
function handleUploadError(e, file) {
	ElMessage.error(`${file.name}上传失败,原因：${e}`);
	excelData.value = [];
	fileList.value = [];
	hasFile.value = false;
	uploadRef.value.getBoundingClientRect(); // 强制刷新页面
}
</script>

<template>
	<div class="excel-import">
		<div class="excel-header">
			<div class="show-excel-name">
				<el-upload
					ref="uploadRef"
					v-model:file-list="fileList"
					class="choose-excel"
					accept=".xlsx,.xls"
					:action="props.uploadUrl"
					:auto-upload="false"
					drag
					multiple
					:show-file-list="false"
					:before-upload="handleUpload"
					:on-success="handleUploadSuccess"
					:on-error="handleUploadError"
					:on-change="handleFileChange"
					>选择文件</el-upload
				>
				<el-button class="upload-button" @click="handleSubmit"><span>开始上传</span></el-button>
				<span v-if="hasFile == false" class="excel-name">暂无文件</span>
				<div v-else class="excel-name-container">
					<span v-for="(item, index) in fileList" :key="index" class="excel-name" @click="handleClick(item)">
						{{ item.name }}
						<div :key="index" class="x-button" @click.stop="handleDelete(index)">X</div>
					</span>
				</div>
			</div>
		</div>
		<div class="excel-body">
			<el-table :data="excelData" @change="handleFileChange">
				<el-table-column
					v-for="(column, index) in columns"
					:key="index"
					:label="column"
					:prop="column"
				></el-table-column>
			</el-table>
		</div>
		<span class="tip">仅选取前50条数据，以供预览</span>
	</div>
</template>

<style lang="scss" scoped>
.tip {
	margin-left: auto;
	margin-right: 2rem;
	margin-top: 2rem;
	font-size: 0.8rem;
	color: var(--el-text-color-secondary);
}

.excel-import {
	width: 100%;
	height: 500px;
	display: flex;
	flex-direction: column;
	border-radius: 15px;
	background: var(--el-fill-color-light);

	.excel-header {
		margin: 1rem;
		box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
		height: 70px;
		background: var(--el-fill-color);
		border-radius: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;

		.show-excel-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			width: auto;
			padding-right: 0.5rem;
			display: flex;
			min-height: 2.5rem;
			height: auto;
			margin: 1rem 0 1rem 1rem;
			border-radius: 0.25rem;
			border: 1px solid var(--el-color-primary);
			align-items: center;
			background: var(--el-color-primary-light-9);

			:deep(.el-button),
			.upload-button {
				margin-left: 1rem;
				height: 1.3rem;
				border-radius: 0;
				width: 4rem;
				font-size: 0.65rem;
				border: 1px solid var(--el-border-color);
				background-color: var(--el-bg-color);
				color: var(--el-text-color-primary);
			}

			.choose-excel {
				margin-left: 0.3rem;
				height: 1.3rem;
				width: 4rem;
				font-size: 0.7rem;
				line-height: 1.2rem;
				background: var(--el-fill-color-lighter);
				border-radius: 1px;
				border: 1px solid var(--el-border-color);

				:deep(.el-upload-dragger) {
					height: 1.2rem;
					color: var(--el-text-color-primary);
					padding: 0;
					border: 0;
					border-radius: 0;
					transition: 0.3s;

					@media (max-width: 768px) {
						font-size: 0.6rem;
					}
				}
			}

			.excel-name-container {
				display: flex;
				flex-direction: row;
				align-items: center;

				.excel-name {
					position: relative;

					.x-button {
						position: absolute;
						top: -5px;
						right: -5px;
						width: 0.7rem;
						height: 0.7rem;
						line-height: 0.6rem;
						font-size: 0.5rem;
						border-radius: 50%;
						background-color: var(--el-color-primary);
						color: var(--el-color-white);
						display: none;
						justify-content: center;
						align-items: center;
					}

					&:hover {
						border: 2px dashed var(--el-color-primary);
						cursor: pointer;

						.x-button {
							display: flex;
						}
					}
				}
			}

			.excel-name {
				user-select: none;
				font-size: 0.7rem;
				height: 1.3rem;
				line-height: 1.3rem;
				margin-left: 0.8rem;
				width: inherit;
			}
		}
	}

	.excel-body {
		overflow-y: scroll;
		overflow-x: scroll;
		margin: 0 1rem 1rem 1rem;
		box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
		height: 300px;
		background: var(--el-fill-color);

		:deep(.el-table) {
			overflow-x: none;
			min-height: 100%;
		}
	}
}

.el-button {
	display: flex;
	flex-direction: row;
}
</style>
