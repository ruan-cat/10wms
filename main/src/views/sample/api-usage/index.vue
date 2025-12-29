<template>
	<el-card class="box-card">
		<template #header>
			<div class="card-header">
				<span>API 使用示例</span>
			</div>
		</template>

		<el-tabs v-model="activeTab">
			<!-- 商品管理示例 -->
			<el-tab-pane label="商品管理" name="goods">
				<el-space direction="vertical" :size="20" style="width: 100%">
					<el-button type="primary" @click="handleGetGoodsList">获取商品列表</el-button>
					<el-button type="success" @click="handleAddGoods">添加商品</el-button>
					<el-button type="warning" @click="handleUpdateGoods">更新商品</el-button>
					<el-button type="danger" @click="handleDeleteGoods">删除商品</el-button>

					<el-divider />

					<div v-if="goodsData">
						<h4>商品列表数据：</h4>
						<pre>{{ JSON.stringify(goodsData, null, 2) }}</pre>
					</div>
				</el-space>
			</el-tab-pane>

			<!-- 用户管理示例 -->
			<el-tab-pane label="用户管理" name="user">
				<el-space direction="vertical" :size="20" style="width: 100%">
					<el-button type="primary" @click="handleGetUserList">获取用户列表</el-button>
					<el-button type="success" @click="handleAddUser">添加用户</el-button>
					<el-button type="warning" @click="handleUpdateUser">更新用户</el-button>
					<el-button type="danger" @click="handleDeleteUser">删除用户</el-button>

					<el-divider />

					<div v-if="userData">
						<h4>用户列表数据：</h4>
						<pre>{{ JSON.stringify(userData, null, 2) }}</pre>
					</div>
				</el-space>
			</el-tab-pane>

			<!-- 部门管理示例 -->
			<el-tab-pane label="部门管理" name="dept">
				<el-space direction="vertical" :size="20" style="width: 100%">
					<el-button type="primary" @click="handleGetDeptTree">获取部门树</el-button>
					<el-button type="success" @click="handleAddDept">添加部门</el-button>

					<el-divider />

					<div v-if="deptData">
						<h4>部门树数据：</h4>
						<pre>{{ JSON.stringify(deptData, null, 2) }}</pre>
					</div>
				</el-space>
			</el-tab-pane>

			<!-- 角色管理示例 -->
			<el-tab-pane label="角色管理" name="role">
				<el-space direction="vertical" :size="20" style="width: 100%">
					<el-button type="primary" @click="handleGetRoleList">获取角色列表</el-button>
					<el-button type="success" @click="handleAddRole">添加角色</el-button>

					<el-divider />

					<div v-if="roleData">
						<h4>角色列表数据：</h4>
						<pre>{{ JSON.stringify(roleData, null, 2) }}</pre>
					</div>
				</el-space>
			</el-tab-pane>
		</el-tabs>
	</el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getGoodsList, addGoods, updateGoods, deleteGoods } from "@/api/base-data/goods";
import { getUserList, addUser, updateUser, deleteUser } from "@/api/system/user";
import { getDeptTree, addDept } from "@/api/system/dept";
import { getRoleList, addRole } from "@/api/system/role";

defineOptions({
	name: "ApiUsageSample",
});

const activeTab = ref("goods");
const goodsData = ref<any>(null);
const userData = ref<any>(null);
const deptData = ref<any>(null);
const roleData = ref<any>(null);

/** 获取商品列表 */
const handleGetGoodsList = async () => {
	try {
		const result = await getGoodsList({
			page: 1,
			size: 10,
		});
		goodsData.value = result;
		ElMessage.success("获取商品列表成功");
	} catch (error) {
		ElMessage.error("获取商品列表失败");
		console.error(error);
	}
};

/** 添加商品 */
const handleAddGoods = async () => {
	try {
		const result = await addGoods({
			goodsCode: "G001",
			goodsName: "测试商品",
			unit: "件",
			status: 1,
		});
		ElMessage.success(`添加商品成功，ID: ${result}`);
	} catch (error) {
		ElMessage.error("添加商品失败");
		console.error(error);
	}
};

/** 更新商品 */
const handleUpdateGoods = async () => {
	try {
		await updateGoods({
			id: "1",
			goodsCode: "G001",
			goodsName: "更新后的商品",
			unit: "件",
			status: 1,
		});
		ElMessage.success("更新商品成功");
	} catch (error) {
		ElMessage.error("更新商品失败");
		console.error(error);
	}
};

/** 删除商品 */
const handleDeleteGoods = async () => {
	try {
		await deleteGoods("1");
		ElMessage.success("删除商品成功");
	} catch (error) {
		ElMessage.error("删除商品失败");
		console.error(error);
	}
};

/** 获取用户列表 */
const handleGetUserList = async () => {
	try {
		const result = await getUserList({
			page: 1,
			size: 10,
		});
		userData.value = result;
		ElMessage.success("获取用户列表成功");
	} catch (error) {
		ElMessage.error("获取用户列表失败");
		console.error(error);
	}
};

/** 添加用户 */
const handleAddUser = async () => {
	try {
		const result = await addUser({
			username: "testuser",
			password: "123456",
			realname: "测试用户",
			email: "test@example.com",
			departmentIds: [],
			roleIds: [],
		});
		ElMessage.success(`添加用户成功，ID: ${result}`);
	} catch (error) {
		ElMessage.error("添加用户失败");
		console.error(error);
	}
};

/** 更新用户 */
const handleUpdateUser = async () => {
	try {
		await updateUser("test-user-id", {
			username: "testuser",
			realname: "更新后的用户",
			email: "test@example.com",
		});
		ElMessage.success("更新用户成功");
	} catch (error) {
		ElMessage.error("更新用户失败");
		console.error(error);
	}
};

/** 删除用户 */
const handleDeleteUser = async () => {
	try {
		await deleteUser("1");
		ElMessage.success("删除用户成功");
	} catch (error) {
		ElMessage.error("删除用户失败");
		console.error(error);
	}
};

/** 获取部门树 */
const handleGetDeptTree = async () => {
	try {
		const result = await getDeptTree();
		deptData.value = result;
		ElMessage.success("获取部门树成功");
	} catch (error) {
		ElMessage.error("获取部门树失败");
		console.error(error);
	}
};

/** 添加部门 */
const handleAddDept = async () => {
	try {
		const result = await addDept({
			deptName: "测试部门",
			deptCode: "D001",
			parentId: "0",
			status: 1,
		});
		ElMessage.success(`添加部门成功，ID: ${result}`);
	} catch (error) {
		ElMessage.error("添加部门失败");
		console.error(error);
	}
};

/** 获取角色列表 */
const handleGetRoleList = async () => {
	try {
		const result = await getRoleList({
			page: 1,
			size: 10,
		});
		roleData.value = result;
		ElMessage.success("获取角色列表成功");
	} catch (error) {
		ElMessage.error("获取角色列表失败");
		console.error(error);
	}
};

/** 添加角色 */
const handleAddRole = async () => {
	try {
		const result = await addRole({
			roleName: "测试角色",
			roleCode: "test_role",
			description: "这是一个测试角色",
			status: 1,
		});
		ElMessage.success(`添加角色成功，ID: ${result}`);
	} catch (error) {
		ElMessage.error("添加角色失败");
		console.error(error);
	}
};
</script>

<style scoped>
.box-card {
	margin: 20px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

pre {
	background-color: var(--el-fill-color-light);
	padding: 10px;
	border-radius: 4px;
	overflow-x: auto;
	max-height: 400px;
}
</style>
