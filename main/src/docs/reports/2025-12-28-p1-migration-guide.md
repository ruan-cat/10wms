# 2025-12-28 P1 高优先级页面迁移技术指南

## 1. 概述

本文档提供 P1 高优先级页面迁移的详细技术指南，包括每个页面的迁移步骤、依赖关系和注意事项。

## 2. 依赖关系分析

### 2.1 公共组件依赖

在开始迁移业务页面之前，需要先确保以下公共组件已迁移：

|    组件名称     |                    原路径                    |    目标路径    |   状态    |
| :-------------: | :------------------------------------------: | :------------: | :-------: |
| SimpleDataTable |              `components/table`              | 已存在于主项目 |  ✅ 完成  |
|  DialogPromise  |         `components/dialog-promise`          | 已存在于主项目 |  ✅ 完成  |
|   Pagination    |           `components/Pagination`            | 已存在于主项目 |  ✅ 完成  |
| BaseConfigTable | `views/base-config/components/BaseTable.vue` |    需要迁移    | ❌ 待迁移 |

**结论**：需要先迁移 `BaseConfigTable` 组件，因为产品类别页面依赖它。

## 3. 迁移任务详细说明

### 3.1 任务 39.1：基础配置模块（计量单位、产品类别）

#### 3.1.1 计量单位页面

**原路径**：`origin/src/views/base-config/measuring-unit/index.vue`  
**目标路径**：`main/src/pages/base-config/measuring-unit/index.vue`

**页面特点**：

- 使用 `ComponentsTable`（即 `SimpleDataTable`）
- 使用 `ComponentsDialogPromise`
- 使用 `Pagination` 组件
- 包含 CRUD 功能（新增、编辑、删除、查看）
- 包含 Excel 导入导出功能

**API 依赖**：

```typescript
import {
	addMeasurementUnit,
	deleteMeasurementUnit,
	exportMeasurementUnit,
	listMeasurementUnit,
	updateMeasurementUnit,
} from "@/apis/measuring-unit-gaogao/index";
```

**迁移步骤**：

1. **创建目标目录**

   ```bash
   mkdir -p main/src/pages/base-config/measuring-unit
   ```

2. **复制页面文件**

   ```bash
   cp origin/src/views/base-config/measuring-unit/index.vue main/src/pages/base-config/measuring-unit/index.vue
   ```

3. **修改导入路径**
   - 将 `components/table/index.vue` 改为 `@/components/SimpleDataTable/index.vue`
   - 将 `components/dialog-promise/index.vue` 改为 `@/components/DialogPromise/index.vue`
   - 将 `@/components/Pagination/index.vue` 保持不变（已存在）
   - 将 `@/apis/measuring-unit-gaogao/index` 改为 `@/api/base-config/measuring-unit`

4. **适配 API 调用**
   - 检查 API 文件是否存在：`main/src/api/base-config/measuring-unit.ts`
   - 如果不存在，需要创建并适配 API 调用方式
   - 将回调方式改为 Promise 方式

5. **移除 `definePage`**
   - Pure-Admin 不使用 `definePage`，路由通过路由配置文件管理

6. **测试功能**
   - 列表查询
   - 新增记录
   - 编辑记录
   - 删除记录
   - 分页功能

#### 3.1.2 产品类别页面

**原路径**：`origin/src/views/base-config/product-category/index.vue`  
**目标路径**：`main/src/pages/base-config/product-category/index.vue`

**页面特点**：

- 使用 `BaseConfigTable` 组件（**需要先迁移此组件**）
- 树形结构展示
- 支持展开/折叠
- 包含自定义列渲染（图标和缩进）

**依赖组件**：

- `BaseConfigTable`：`origin/src/views/base-config/components/BaseTable.vue`

**迁移步骤**：

1. **先迁移 BaseConfigTable 组件**

   ```bash
   mkdir -p main/src/components/BaseConfigTable
   cp origin/src/views/base-config/components/BaseTable.vue main/src/components/BaseConfigTable/index.vue
   ```

2. **适配 BaseConfigTable 组件**
   - 修改导入路径
   - 适配 Pure-Admin 的分页组件
   - 确保组件功能正常

3. **创建目标目录**

   ```bash
   mkdir -p main/src/pages/base-config/product-category
   ```

4. **复制页面文件**

   ```bash
   cp origin/src/views/base-config/product-category/index.vue main/src/pages/base-config/product-category/index.vue
   ```

5. **修改导入路径**
   - 将 `../components/BaseTable.vue` 改为 `@/components/BaseConfigTable/index.vue`

6. **移除 `definePage`**

7. **测试功能**
   - 树形结构展示
   - 展开/折叠功能
   - CRUD 功能

### 3.2 任务 39.2：基础数据模块（商品详情）

**原路径**：`origin/src/views/base-data/commodity-detail/`  
**目标路径**：`main/src/pages/base-data/goods-detail/`

**迁移步骤**：

1. **检查原始文件结构**

   ```bash
   ls -la origin/src/views/base-data/commodity-detail/
   ```

2. **创建目标目录**

   ```bash
   mkdir -p main/src/pages/base-data/goods-detail
   ```

3. **复制所有文件**

   ```bash
   cp -r origin/src/views/base-data/commodity-detail/* main/src/pages/base-data/goods-detail/
   ```

4. **适配导入路径和 API 调用**

5. **移除 `definePage`**

6. **测试功能**

### 3.3 任务 39.3：库存管理模块（综合库存查询）

**原路径**：`origin/src/views/inventory-management/comprehensive-inventory/`  
**目标路径**：`main/src/pages/inventory/comprehensive-inventory/`

**迁移步骤**：

1. **检查原始文件结构**

2. **创建目标目录**

   ```bash
   mkdir -p main/src/pages/inventory/comprehensive-inventory
   ```

3. **复制所有文件**

4. **适配导入路径和 API 调用**

5. **移除 `definePage`**

6. **测试功能**

### 3.4 任务 39.4：采购管理模块（批量收货、库存查询）

#### 3.4.1 批量收货

**原路径**：`origin/src/views/purchase-management/batch-receiving/`  
**目标路径**：`main/src/pages/purchase/batch-receiving/`

#### 3.4.2 库存查询

**原路径**：`origin/src/views/purchase-management/stock-inquiry/`  
**目标路径**：`main/src/pages/purchase/stock-inquiry/`

**迁移步骤**：（两个页面相同）

1. **检查原始文件结构**

2. **创建目标目录**

3. **复制所有文件**

4. **适配导入路径和 API 调用**

5. **移除 `definePage`**

6. **测试功能**

### 3.5 任务 39.5：系统管理模块（字典管理）

**原路径**：`origin/src/views/system-manage/dictionary/`  
**目标路径**：`main/src/pages/system/dictionary/`

**迁移步骤**：

1. **检查原始文件结构**

2. **创建目标目录**

   ```bash
   mkdir -p main/src/pages/system/dictionary
   ```

3. **复制所有文件**

4. **适配导入路径和 API 调用**

5. **移除 `definePage`**

6. **测试功能**

## 4. 通用迁移步骤

### 4.1 导入路径转换规则

|           原路径            |            目标路径            |
| :-------------------------: | :----------------------------: |
|     `components/table`      | `@/components/SimpleDataTable` |
| `components/dialog-promise` |  `@/components/DialogPromise`  |
|  `@/components/Pagination`  |   `@/components/Pagination`    |
|         `@/apis/*`          |           `@/api/*`            |

### 4.2 API 调用转换

**原始方式（回调）**：

```typescript
listMeasurementUnit(
	{ pageIndex: 1, pageSize: 10 },
	(data) => {
		// 成功回调
	},
	() => {
		// 失败回调
	},
);
```

**目标方式（Promise）**：

```typescript
try {
	const data = await http.request({
		url: "/api/measuring-unit/list",
		method: "post",
		data: { pageIndex: 1, pageSize: 10 },
	});
	// 处理成功
} catch (error) {
	// 处理失败
}
```

### 4.3 移除 `definePage`

删除以下代码：

```typescript
definePage({
	meta: {
		menuType: "page",
		text: "计量单位",
		icon: "IconSetting",
	},
});
```

路由配置将在路由文件中统一管理。

## 5. API 文件创建指南

如果 API 文件不存在，需要创建：

### 5.1 创建 API 文件

**文件路径**：`main/src/api/base-config/measuring-unit.ts`

**文件内容模板**：

```typescript
import { http } from "@/utils/http";

/** 计量单位列表查询 */
export function listMeasurementUnit(data: any) {
	return http.request({
		url: "/api/measuring-unit/list",
		method: "post",
		data,
	});
}

/** 新增计量单位 */
export function addMeasurementUnit(data: any) {
	return http.request({
		url: "/api/measuring-unit/add",
		method: "post",
		data,
	});
}

/** 更新计量单位 */
export function updateMeasurementUnit(data: any) {
	return http.request({
		url: "/api/measuring-unit/update",
		method: "post",
		data,
	});
}

/** 删除计量单位 */
export function deleteMeasurementUnit(ids: string[]) {
	return http.request({
		url: "/api/measuring-unit/delete",
		method: "post",
		data: { ids },
	});
}

/** 导出计量单位 */
export function exportMeasurementUnit() {
	return http.request({
		url: "/api/measuring-unit/export",
		method: "get",
		responseType: "blob",
	});
}
```

## 6. 路由配置

完成所有页面迁移后，需要更新路由配置。

### 6.1 更新 base-config.ts

**文件路径**：`main/src/router/modules/base-config.ts`

**需要添加的路由**：

```typescript
{
	path: "/base-config/measuring-unit",
	name: "MeasuringUnit",
	component: () => import("@/pages/base-config/measuring-unit/index.vue"),
	meta: {
		title: "计量单位",
	},
},
{
	path: "/base-config/product-category",
	name: "ProductCategory",
	component: () => import("@/pages/base-config/product-category/index.vue"),
	meta: {
		title: "产品类别",
	},
}
```

### 6.2 创建其他模块路由

需要创建或更新以下路由文件：

- `main/src/router/modules/base-data.ts`（添加商品详情）
- `main/src/router/modules/inventory.ts`（添加综合库存查询）
- `main/src/router/modules/purchase.ts`（添加批量收货、库存查询）
- `main/src/router/modules/system.ts`（添加字典管理）

## 7. 测试清单

每个页面迁移完成后，必须测试以下功能：

- [ ] 页面能够正常渲染
- [ ] 列表数据能够正常加载
- [ ] 分页功能正常
- [ ] 搜索功能正常
- [ ] 新增功能正常
- [ ] 编辑功能正常
- [ ] 删除功能正常
- [ ] 批量删除功能正常（如果有）
- [ ] 导入功能正常（如果有）
- [ ] 导出功能正常（如果有）
- [ ] 样式显示正常
- [ ] 响应式布局正常

## 8. 常见问题和解决方案

### 8.1 组件找不到

**问题**：`Cannot find module '@/components/XXX'`

**解决方案**：

1. 检查组件是否已迁移到主项目
2. 检查导入路径是否正确
3. 检查组件文件名是否正确（注意大小写）

### 8.2 API 调用失败

**问题**：API 调用返回 404 或其他错误

**解决方案**：

1. 检查 API 路径是否正确
2. 检查后端服务是否正常运行
3. 检查请求参数格式是否正确
4. 使用浏览器开发者工具查看网络请求

### 8.3 样式显示异常

**问题**：页面样式显示不正常

**解决方案**：

1. 检查是否正确导入了 Element Plus 样式
2. 检查 Tailwind CSS 类是否正确
3. 检查 scoped 样式是否影响了全局样式
4. 使用浏览器开发者工具检查元素样式

## 9. 完成标准

所有 P1 页面迁移完成的标准：

1. **文件迁移完成**
   - [ ] 所有页面文件已复制到目标目录
   - [ ] 所有依赖组件已迁移

2. **代码适配完成**
   - [ ] 所有导入路径已更新
   - [ ] 所有 API 调用已适配
   - [ ] 所有 `definePage` 已移除

3. **路由配置完成**
   - [ ] 所有路由配置已创建
   - [ ] 路由可以正常访问

4. **功能测试通过**
   - [ ] 所有功能测试清单已完成
   - [ ] 无明显 Bug

5. **文档更新完成**
   - [ ] 迁移报告已生成
   - [ ] 问题和解决方案已记录

## 10. 下一步

完成 P1 迁移后：

1. 生成 P1 迁移总结报告
2. 更新迁移进度
3. 开始 P2 页面迁移

---

**文档版本**：1.0  
**创建时间**：2025-12-28  
**作者**：Kiro AI Assistant
