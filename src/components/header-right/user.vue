<!-- 
	用户组件 即顶部导航栏内最右侧的用户按钮
-->
<script lang="ts" setup>
import { ref, computed, watch } from "vue";

import avatarImage from "@/assets/layoutIcon/avatar2.png";

const userStore = useUserStore();
</script>

<template>
	<el-dropdown trigger="click">
		<span style="color: white" class="move">
			<!-- 根据用户是否登录显示不同的图片 -->
			<img
				v-if="userStore.getUser !== null"
				:src="avatarImage"
				alt="欢迎用户"
				style="width: 32px; height: 32px; vertical-align: middle; border-radius: 50%"
			/>

			<img
				v-else
				:src="guestImage"
				alt="欢迎游客"
				style="width: 32px; height: 32px; vertical-align: middle; border-radius: 50%"
			/>
			{{ userInfo }}
		</span>

		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item :icon="User" @click="userInfoDialogVisible = true">个人信息</el-dropdown-item>
				<el-dropdown-item :icon="Setting" @click="showSystemMessageDialog"> 系统消息 </el-dropdown-item>
				<el-dropdown-item :icon="Setting" @click="showHomeStyleDialog"> 首页风格 </el-dropdown-item>
				<el-dropdown-item :icon="Setting" @click="handleClearCache">消除缓存</el-dropdown-item>
				<el-dropdown-item :icon="SwitchButton" @click="changePasswordDialogVisible = true">修改密码</el-dropdown-item>
				<el-dropdown-item :icon="SwitchButton" @click="handleLogout">注销</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<style lang="scss" scoped>
.user-root {
}
</style>
