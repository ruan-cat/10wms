<script setup lang="ts">
import { Search, Refresh } from "@element-plus/icons-vue";

interface Props {
	/** 是否显示重置按钮 */
	showReset?: boolean;
	/** 是否显示查询按钮 */
	showSearch?: boolean;
	/** 查询按钮文本 */
	searchText?: string;
	/** 重置按钮文本 */
	resetText?: string;
	/** 是否加载中 */
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	showReset: true,
	showSearch: true,
	searchText: "查询",
	resetText: "重置",
	loading: false,
});

const emit = defineEmits<{
	search: [];
	reset: [];
}>();

/** 处理查询 */
function handleSearch() {
	emit("search");
}

/** 处理重置 */
function handleReset() {
	emit("reset");
}
</script>

<template>
	<el-card shadow="never" class="table-search">
		<el-form :inline="true">
			<!-- 搜索条件插槽 -->
			<slot />

			<!-- 操作按钮 -->
			<el-form-item>
				<el-button v-if="showSearch" type="primary" :icon="Search" :loading="loading" @click="handleSearch">
					{{ searchText }}
				</el-button>
				<el-button v-if="showReset" :icon="Refresh" @click="handleReset">
					{{ resetText }}
				</el-button>
				<!-- 额外按钮插槽 -->
				<slot name="extra" />
			</el-form-item>
		</el-form>
	</el-card>
</template>

<style lang="scss" scoped>
.table-search {
	margin-bottom: 16px;

	:deep(.el-form) {
		.el-form-item {
			margin-bottom: 0;
		}
	}
}
</style>
