<template>
	<div class="sidebar-type-example">
		<el-card header="侧边栏类型切换示例">
			<el-space direction="vertical" :size="20" style="width: 100%">
				<!-- 当前状态 -->
				<el-alert :title="`当前侧边栏: ${getSidebarTypeName(currentSidebarType)}`" type="info" :closable="false" />

				<!-- 切换按钮 -->
				<el-space>
					<el-button :type="isBusinessSidebar ? 'primary' : 'default'" @click="switchSidebarType('wmsBusinessPage')">
						主业务侧边栏
					</el-button>
					<el-button
						:type="isExampleSidebar ? 'primary' : 'default'"
						@click="switchSidebarType('pureAdminExamplePage')"
					>
						案例侧边栏
					</el-button>
				</el-space>

				<!-- 路由统计 -->
				<el-descriptions title="路由统计" :column="2" border>
					<el-descriptions-item label="业务路由数量">
						{{ businessRoutes.length }}
					</el-descriptions-item>
					<el-descriptions-item label="示例路由数量">
						{{ exampleRoutes.length }}
					</el-descriptions-item>
				</el-descriptions>

				<!-- 当前路由信息 -->
				<el-card header="当前路由信息">
					<el-descriptions :column="1" border>
						<el-descriptions-item label="路由路径">
							{{ route.path }}
						</el-descriptions-item>
						<el-descriptions-item label="路由名称">
							{{ route.meta?.title || route.name }}
						</el-descriptions-item>
						<el-descriptions-item label="侧边栏类型">
							{{ getSidebarTypeName(getSidebarTypeFromRoute(route)) }}
						</el-descriptions-item>
						<el-descriptions-item label="是否匹配当前侧边栏">
							<el-tag :type="isCurrentSidebarType(route) ? 'success' : 'warning'">
								{{ isCurrentSidebarType(route) ? "是" : "否" }}
							</el-tag>
						</el-descriptions-item>
					</el-descriptions>
				</el-card>
			</el-space>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useSidebarType } from "./index";
import { usePermissionStoreHook } from "@/store/modules/permission";

defineOptions({
	name: "SidebarTypeExample",
});

const route = useRoute();
const permissionStore = usePermissionStoreHook();

const {
	currentSidebarType,
	switchSidebarType,
	filterRoutesBySidebarType,
	getSidebarTypeFromRoute,
	isCurrentSidebarType,
	getSidebarTypeName,
	isBusinessSidebar,
	isExampleSidebar,
} = useSidebarType();

/** 业务路由 */
const businessRoutes = computed(() => {
	return filterRoutesBySidebarType(permissionStore.wholeMenus, "wmsBusinessPage");
});

/** 示例路由 */
const exampleRoutes = computed(() => {
	return filterRoutesBySidebarType(permissionStore.wholeMenus, "pureAdminExamplePage");
});
</script>

<style scoped lang="scss">
.sidebar-type-example {
	padding: 20px;
}
</style>
