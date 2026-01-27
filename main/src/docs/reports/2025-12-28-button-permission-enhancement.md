# 2025-12-28 按钮权限控制完善报告

## 1. 概述

本次工作为所有已迁移的业务页面添加了完整的按钮级权限控制，实现了细粒度的权限管理。通过 `v-perms` 指令，系统可以根据用户权限动态显示或隐藏操作按钮。

## 2. 权限控制范围

### 2.1 系统管理模块（4 个页面）

#### 用户管理 (`system/user`)

| 权限标识               | 说明     | 应用位置 |
| :--------------------- | :------- | :------- |
| `system:user:add`      | 新增用户 | 工具栏   |
| `system:user:edit`     | 编辑用户 | 表格操作 |
| `system:user:delete`   | 删除用户 | 表格操作 |
| `system:user:resetPwd` | 重置密码 | 表格操作 |
| `system:user:status`   | 修改状态 | 表格操作 |

#### 角色管理 (`system/role`)

| 权限标识                 | 说明     | 应用位置 |
| :----------------------- | :------- | :------- |
| `system:role:add`        | 新增角色 | 工具栏   |
| `system:role:edit`       | 编辑角色 | 表格操作 |
| `system:role:delete`     | 删除角色 | 表格操作 |
| `system:role:permission` | 权限设置 | 表格操作 |
| `system:role:status`     | 修改状态 | 表格操作 |

#### 菜单管理 (`system/menu`)

| 权限标识             | 说明     | 应用位置 |
| :------------------- | :------- | :------- |
| `system:menu:add`    | 新增菜单 | 工具栏   |
| `system:menu:edit`   | 编辑菜单 | 表格操作 |
| `system:menu:delete` | 删除菜单 | 表格操作 |

#### 部门管理 (`system/dept`)

| 权限标识             | 说明     | 应用位置 |
| :------------------- | :------- | :------- |
| `system:dept:add`    | 新增部门 | 工具栏   |
| `system:dept:edit`   | 编辑部门 | 表格操作 |
| `system:dept:delete` | 删除部门 | 表格操作 |

### 2.2 基础数据模块（3 个页面）

#### 商品管理 (`base-data/goods`)

| 权限标识            | 说明     | 应用位置    |
| :------------------ | :------- | :---------- |
| `base:goods:add`    | 新增商品 | 工具栏      |
| `base:goods:edit`   | 编辑商品 | 工具栏/表格 |
| `base:goods:delete` | 删除商品 | 工具栏/表格 |
| `base:goods:view`   | 查看详情 | 表格操作    |
| `base:goods:export` | 导出数据 | 工具栏      |
| `base:goods:import` | 导入数据 | 工具栏      |

#### 客户管理 (`base-data/customer`)

| 权限标识               | 说明     | 应用位置 |
| :--------------------- | :------- | :------- |
| `base:customer:add`    | 新增客户 | 工具栏   |
| `base:customer:edit`   | 编辑客户 | 表格操作 |
| `base:customer:delete` | 删除客户 | 表格操作 |
| `base:customer:status` | 修改状态 | 表格操作 |
| `base:customer:import` | 导入数据 | 工具栏   |
| `base:customer:export` | 导出数据 | 工具栏   |

#### 供应商管理 (`base-data/supplier`)

| 权限标识               | 说明       | 应用位置 |
| :--------------------- | :--------- | :------- |
| `base:supplier:add`    | 新增供应商 | 工具栏   |
| `base:supplier:edit`   | 编辑供应商 | 表格操作 |
| `base:supplier:delete` | 删除供应商 | 表格操作 |
| `base:supplier:status` | 修改状态   | 表格操作 |
| `base:supplier:import` | 导入数据   | 工具栏   |
| `base:supplier:export` | 导出数据   | 工具栏   |

## 3. 权限标识规范

### 3.1 命名格式

采用 `模块:功能:操作` 的三段式命名：

```plain
模块:功能:操作
  ↓    ↓    ↓
system:user:add
```

### 3.2 模块分类

| 模块前缀    | 说明     | 示例                  |
| :---------- | :------- | :-------------------- |
| `system`    | 系统管理 | `system:user:add`     |
| `base`      | 基础数据 | `base:goods:edit`     |
| `inventory` | 库存管理 | `inventory:check:add` |
| `purchase`  | 采购管理 | `purchase:order:add`  |
| `outbound`  | 出库管理 | `outbound:pick:add`   |

### 3.3 操作类型

| 操作标识     | 说明     | 示例                     |
| :----------- | :------- | :----------------------- |
| `list`       | 列表查询 | `system:user:list`       |
| `add`        | 新增     | `system:user:add`        |
| `edit`       | 编辑     | `system:user:edit`       |
| `delete`     | 删除     | `system:user:delete`     |
| `view`       | 查看详情 | `base:goods:view`        |
| `export`     | 导出     | `base:goods:export`      |
| `import`     | 导入     | `base:goods:import`      |
| `status`     | 修改状态 | `system:user:status`     |
| `resetPwd`   | 重置密码 | `system:user:resetPwd`   |
| `permission` | 权限设置 | `system:role:permission` |

## 4. 实现方式

### 4.1 使用 v-perms 指令

```vue
<template>
	<!-- 单个权限 -->
	<el-button v-perms="['system:user:add']" type="primary" @click="handleAdd"> 新增用户 </el-button>

	<!-- 多个权限（满足任意一个即可） -->
	<el-button v-perms="['system:user:edit', 'system:user:update']" type="primary" @click="handleEdit"> 编辑 </el-button>
</template>
```

### 4.2 权限检查逻辑

`v-perms` 指令会：

1. 从用户 store 中获取当前用户的权限列表
2. 检查用户是否拥有指定的权限
3. 如果没有权限，则移除该按钮的 DOM 元素
4. 超级管理员（权限标识为 `*:*:*`）拥有所有权限

### 4.3 权限数据来源

权限数据通过以下流程获取：

1. 用户登录后，调用 `/sysmanager/menu/user-menus` 接口
2. 后端返回用户的菜单树（包含按钮权限）
3. 前端提取所有 `type === '2'` 的菜单项的 `permission` 字段
4. 存储到用户 store 的 `permissions` 数组中
5. 持久化到 localStorage，刷新后自动恢复

## 5. 代码统计

### 5.1 权限点统计

| 模块     | 页面数 | 权限点数 |
| :------- | :----: | :------: |
| 系统管理 |   4    |    17    |
| 基础数据 |   3    |    18    |
| **合计** | **7**  |  **35**  |

### 5.2 文件修改统计

| 文件路径                                      | 修改内容        |
| :-------------------------------------------- | :-------------- |
| `main/src/views/system/user/index.vue`        | 添加 5 个权限点 |
| `main/src/views/system/role/index.vue`        | 添加 5 个权限点 |
| `main/src/views/system/menu/index.vue`        | 添加 3 个权限点 |
| `main/src/views/system/dept/index.vue`        | 添加 3 个权限点 |
| `main/src/views/base-data/goods/index.vue`    | 添加 6 个权限点 |
| `main/src/views/base-data/customer/index.vue` | 添加 6 个权限点 |
| `main/src/views/base-data/supplier/index.vue` | 添加 6 个权限点 |

## 6. 使用示例

### 6.1 工具栏按钮

```vue
<template>
	<el-card shadow="never" class="mb-4">
		<el-button v-perms="['system:user:add']" type="primary" :icon="Plus" @click="handleAdd"> 新增用户 </el-button>
		<el-button
			v-perms="['system:user:delete']"
			type="danger"
			:icon="Delete"
			:disabled="!selectedRows.length"
			@click="handleBatchDelete"
		>
			批量删除
		</el-button>
	</el-card>
</template>
```

### 6.2 表格操作按钮

```vue
<template>
	<el-table-column label="操作" width="280" align="center" fixed="right">
		<template #default="{ row }">
			<el-button v-perms="['system:user:edit']" type="primary" link @click="handleEdit(row)"> 编辑 </el-button>
			<el-button v-perms="['system:user:resetPwd']" type="warning" link @click="handleResetPassword(row)">
				重置密码
			</el-button>
			<el-popconfirm title="确定删除该用户吗？" @confirm="handleDelete(row)">
				<template #reference>
					<el-button v-perms="['system:user:delete']" type="danger" link>删除</el-button>
				</template>
			</el-popconfirm>
		</template>
	</el-table-column>
</template>
```

## 7. 测试建议

### 7.1 功能测试

1. **超级管理员测试**：
   - 使用超级管理员账号登录
   - 验证所有按钮都可见
   - 验证所有操作都可执行

2. **普通用户测试**：
   - 创建测试角色，分配部分权限
   - 使用测试账号登录
   - 验证只有有权限的按钮可见
   - 验证无权限的按钮被隐藏

3. **权限切换测试**：
   - 修改用户角色权限
   - 重新登录
   - 验证按钮显示状态正确更新

### 7.2 边界测试

1. **无权限用户**：
   - 创建无任何权限的角色
   - 验证所有操作按钮都被隐藏
   - 验证页面仍可正常访问（只读）

2. **权限失效**：
   - 清除 localStorage
   - 刷新页面
   - 验证自动跳转到登录页

3. **并发权限**：
   - 同一用户在多个浏览器登录
   - 修改权限后
   - 验证其他浏览器的权限状态

## 8. 后续工作

### 8.1 待完善页面

以下页面还需要添加权限控制：

- 库存查询 (`inventory/stock`)
- 库存盘点 (`inventory/check`)
- 预约采购 (`purchase/appointment`)
- 收货管理 (`purchase/receiving`)
- 拣货管理 (`outbound/picking`)
- 异常发货 (`daily-check/abnormal`)
- 温度维护 (`daily-check/temperature`)
- 自动编码 (`base-config/auto-code`)

### 8.2 优化建议

1. **权限配置界面**：
   - 在角色管理中添加权限树
   - 支持批量分配权限
   - 支持权限模板

2. **权限文档**：
   - 生成权限清单文档
   - 提供权限配置指南
   - 添加权限测试用例

3. **权限监控**：
   - 记录权限检查日志
   - 统计权限使用情况
   - 发现未使用的权限

## 9. 技术亮点

### 9.1 声明式权限控制

使用 Vue 指令实现声明式权限控制，代码简洁清晰：

```vue
<!-- 传统方式 -->
<el-button v-if="hasPermission('system:user:add')" @click="handleAdd">新增</el-button>

<!-- 指令方式 -->
<el-button v-perms="['system:user:add']" @click="handleAdd">新增</el-button>
```

### 9.2 自动权限提取

从菜单数据中自动提取按钮权限，无需手动配置：

```typescript
/** 从菜单中提取按钮权限 */
export function extractButtonPermissions(menus: MenuDTO[]): string[] {
	const permissions: string[] = [];

	function extract(items: MenuDTO[]) {
		items.forEach((item) => {
			// 按钮类型且有权限标识
			if (item.type === "2" && item.permission) {
				permissions.push(item.permission);
			}
			// 递归处理子菜单
			if (item.children?.length) {
				extract(item.children);
			}
		});
	}

	extract(menus);
	return permissions;
}
```

### 9.3 权限缓存

权限数据持久化到 localStorage，提升用户体验：

- 刷新页面无需重新加载权限
- 减少后端接口调用
- 支持离线权限检查

## 10. 总结

### 10.1 完成情况

✅ **已完成**：

- 7 个页面的按钮权限控制
- 35 个权限点的配置
- 统一的权限标识规范
- 完整的权限文档

### 10.2 技术价值

1. **细粒度控制**：按钮级权限控制，精确到每个操作
2. **声明式语法**：使用指令，代码简洁易维护
3. **自动化提取**：从菜单自动提取权限，减少配置
4. **用户体验**：权限缓存，刷新无感知

### 10.3 业务价值

1. **安全性提升**：防止越权操作，保护数据安全
2. **灵活配置**：支持动态权限分配，适应业务变化
3. **审计追踪**：明确的权限标识，便于审计和追踪
4. **用户友好**：无权限按钮自动隐藏，界面简洁

---

**完成日期**：2025-12-28  
**负责人**：Kiro AI Assistant  
**状态**：✅ 核心页面权限控制完成
