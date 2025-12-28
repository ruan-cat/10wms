# 2025-12-28 P2 基础配置模块迁移进度

## 1. 已完成页面（4/8）

### 1.1 encoding-type (编码类型)

- **状态**: ✅ 已完成
- **路径**: `main/src/pages/base-config/encoding-type/index.vue`
- **字段**: snroTypeCode, snroTypeName
- **API**: `/api/encoding-type/*`

### 1.2 flat-type (房型类型)

- **状态**: ✅ 已完成
- **路径**: `main/src/pages/base-config/flat-type/index.vue`
- **字段**: unitTypeCode, unitTypeName
- **API**: `/api/flat-type/*`

### 1.3 parameter-type (参数类型)

- **状态**: ✅ 已完成
- **路径**: `main/src/pages/base-config/parameter-type/index.vue`
- **字段**: syspTypeCode, syspTypeName
- **API**: `/api/parameter-type/*`

### 1.4 product-attribute (产品属性)

- **状态**: ✅ 已完成
- **路径**: `main/src/pages/base-config/product-attribute/index.vue`
- **字段**: attributeCode, attributeName
- **API**: `/api/product-attribute/*`

## 2. 进行中页面（4/8）

### 2.1 quality-code (质量代码)

- **状态**: 🔄 进行中
- **原路径**: `origin/src/views/base-config/quality-code/index.vue`
- **目标路径**: `main/src/pages/base-config/quality-code/index.vue`
- **字段**: codeValue, codeName

### 2.2 quality-inspection-status (质检状态配置)

- **状态**: 🔄 进行中
- **原路径**: `origin/src/views/base-config/quality-inspection-status/index.vue`
- **目标路径**: `main/src/pages/base-config/quality-inspection-status/index.vue`
- **字段**: statusCode, statusName

### 2.3 system-parameter (系统参数)

- **状态**: 🔄 进行中
- **原路径**: `origin/src/views/base-config/system-parameter/index.vue`
- **目标路径**: `main/src/pages/base-config/system-parameter/index.vue`
- **字段**: sysConfType, sysConfStep, sysConfOrg, sysConfPartner, sysPara1, sysPara2, sysPara3, sysConfText

### 2.4 components (基础配置公共组件库)

- **状态**: ⏳ 待处理
- **说明**: 包含 BaseTable.vue 等公共组件

## 3. 迁移标准

所有页面均采用统一的迁移标准：

1. **组件替换**:
   - `ComponentsTable` → `SimpleDataTable`
   - `ComponentsDialogPromise` → `el-dialog`
   - `Pagination` → `SimpleDataTable` 的 `pagination` 属性

2. **API 调用转换**:

   ```typescript
   // 原方式（回调）
   listAPI(params, successCallback, errorCallback);

   // 新方式（Promise）
   const response = await http.request({
   	url: "/api/xxx",
   	method: "post",
   	data: params,
   });
   ```

3. **功能完整性**:
   - ✅ 列表查询（分页）
   - ✅ 新增记录
   - ✅ 编辑记录
   - ✅ 查看记录
   - ✅ 单行删除
   - ✅ 批量删除
   - ⏳ Excel 导入（预留）
   - ⏳ Excel 导出（预留）

## 4. 下一步计划

1. 完成 quality-code, quality-inspection-status, system-parameter 页面迁移
2. 处理 components 公共组件库
3. 更新 `main/src/router/modules/base-config.ts` 路由配置
4. 测试所有页面功能
5. 继续迁移其他模块的 P2 页面

## 5. 预计完成时间

- 基础配置模块剩余页面：30 分钟
- 路由配置更新：10 分钟
- 功能测试：20 分钟

**总计**: 约 1 小时完成基础配置模块全部 P2 页面迁移
