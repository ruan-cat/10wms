<template>
	<el-dropdown trigger="click" @command="handleCommand">
		<span class="sidebar-type-switcher">
			<IconifyIconOnline icon="ep:menu" />
			<span class="sidebar-type-name">{{ getSidebarTypeName(currentSidebarType) }}</span>
			<IconifyIconOnline icon="ep:arrow-down" />
		</span>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item command="wmsBusinessPage" :class="{ active: isBusinessSidebar }">
					<IconifyIconOnline icon="ep:briefcase" />
					<span>主业务侧边栏</span>
				</el-dropdown-item>
				<el-dropdown-item command="pureAdminExamplePage" :class="{ active: isExampleSidebar }">
					<IconifyIconOnline icon="ep:document" />
					<span>案例侧边栏</span>
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { useSidebarType } from "@/composables/use-sidebar-type";
import { IconifyIconOnline } from "@/components/ReIcon";

defineOptions({
	name: "SidebarTypeSwitcher",
});

const { currentSidebarType, switchSidebarType, getSidebarTypeName, isBusinessSidebar, isExampleSidebar } =
	useSidebarType();

/** 处理下拉菜单命令 */
function handleCommand(command: SidebarType) {
	switchSidebarType(command);
	// 刷新页面以重新加载侧边栏
	window.location.reload();
}
</script>

<style scoped lang="scss">
.sidebar-type-switcher {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 8px 12px;
	cursor: pointer;
	border-radius: 4px;
	transition: all 0.3s;

	&:hover {
		background-color: var(--el-fill-color-light);
	}

	.sidebar-type-name {
		font-size: 14px;
		color: var(--el-text-color-primary);
	}
}

:deep(.el-dropdown-menu__item) {
	display: flex;
	align-items: center;
	gap: 8px;

	&.active {
		color: var(--el-color-primary);
		background-color: var(--el-color-primary-light-9);
	}
}
</style>
