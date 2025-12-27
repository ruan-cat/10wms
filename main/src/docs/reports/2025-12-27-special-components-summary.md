# 2025-12-27 特殊功能组件迁移总结

## 1. 迁移概述

本次完成了特殊功能组件的迁移和评估工作，包括 dinamic-table-form 组件迁移、打印功能示例创建，以及对其他组件的评估。

## 2. 迁移组件清单

|      组件名称      |                   源路径                    |                目标路径                 |  迁移策略  |  状态   |
| :----------------: | :-----------------------------------------: | :-------------------------------------: | :--------: | :-----: |
| dinamic-table-form | `origin/src/components/dinamic-table-form/` | `main/src/components/DinamicTableForm/` | 迁移并改进 | ✅ 完成 |
|      打印功能      |      `origin/src/views/sample/print/`       |     `main/src/views/sample/print/`      |  创建示例  | ✅ 完成 |
|     流程图组件     |       `origin/src/views/sample/flow/`       |                    -                    | Main 已有  | ⏭️ 跳过 |
|    富文本编辑器    |      `origin/src/views/sample/editor/`      |                    -                    | Main 已有  | ⏭️ 跳过 |
|     表单设计器     |            `origin/src/main.ts`             |                    -                    |   未使用   | ⏭️ 跳过 |

## 3. DinamicTableForm 组件迁移详情

### 3.1 组件特点

- 动态表格样式的表单组件
- 支持动态增删行
- 支持可编辑列配置
- 支持多选删除

### 3.2 迁移内容

**文件结构：**

```plain
main/src/components/DinamicTableForm/
├── index.vue        # 主组件
├── types.ts         # 类型定义
└── index.test.ts    # 单元测试
```

**核心功能：**

- ✅ 新增行：使用 `newRowData` 克隆默认数据
- ✅ 删除单行：根据索引删除指定行
- ✅ 删除选中行：批量删除多选的行
- ✅ 可编辑列：通过 `editable` 属性控制
- ✅ 双向绑定：支持 `v-model:data`

### 3.3 代码改进

#### 1. 修复 Props 直接修改问题

**原代码：**

```typescript
// eslint-disable-next-line vue/no-mutating-props
props.data.push(cloneDeep(props.newRowData));
```

**改进后：**

```typescript
// 使用 computed 实现双向绑定
const internalData = computed({
	get: () => props.data,
	set: (value) => {
		emit("update:data", value);
		emit("change-data", value);
	},
});

// 新增行时创建新数组
function addNewRow() {
	const newData = [...internalData.value, cloneDeep(props.newRowData)];
	internalData.value = newData;
}
```

#### 2. 修复列配置修改问题

**原代码：**

```typescript
// 直接修改 props.columns
props.columns.push({...});
```

**改进后：**

```typescript
// 使用 computed 计算属性
const columnsWithOperation = computed(() => {
	const cols = [...props.columns];
	cols.push({
		prop: "operation-bar" as any,
		label: "操作",
		width: 60,
		editable: true,
	} as Column);
	return cols;
});
```

#### 3. 改进单元格编辑

**原代码：**

```vue
<el-input v-model="row[prop]" />
```

**改进后：**

```vue
<el-input :model-value="row[prop]" @update:model-value="(value) => handleCellChange(row, prop, value)" />
```

**新增方法：**

```typescript
function handleCellChange(row: T, prop: keyof T, value: any) {
	const index = internalData.value.findIndex((item) => isEqual(item, row));
	if (index !== -1) {
		const newData = [...internalData.value];
		newData[index] = { ...newData[index], [prop]: value };
		internalData.value = newData;
	}
}
```

#### 4. 移除废弃方法

**移除的方法：**

- `toggleEdit()` - 标记为 @deprecated
- `handleSave()` - 标记为 @deprecated

#### 5. 改进类型定义

**类型改进：**

```typescript
// 添加 update:data 事件
export interface DinamicTableFormEmit<T extends object> {
	(e: "update:data", rows: T[]): void;
	(e: "change-data", rows: T[]): void; // 兼容旧版
}

// 改进 Props 类型
export type _OmitSimpleDataTableProps<T, Column> = Omit<SimpleDataTableProps<T, Column>, "columns" | "data">;
```

### 3.4 样式适配

完全使用 Pure-Admin 的 CSS 变量：

|       原始样式       |       Pure-Admin 变量        |  用途  |
| :------------------: | :--------------------------: | :----: |
|        `#fff`        |     `var(--el-bg-color)`     | 背景色 |
| `rgba(0, 0, 0, 0.1)` | `var(--el-box-shadow-light)` |  阴影  |

**适配效果：**

- ✅ 支持亮色主题
- ✅ 支持暗色主题
- ✅ 自动跟随系统主题切换

### 3.5 使用示例

```vue
<template>
	<DinamicTableForm
		v-model:data="tableData"
		:new-row-data="newRowData"
		:columns="columns"
		@change-data="handleDataChange"
	/>
</template>

<script setup lang="ts">
import DinamicTableForm from "@/components/DinamicTableForm/index.vue";

interface RowData {
	name: string;
	age: number;
	address: string;
}

const newRowData: RowData = {
	name: "",
	age: 0,
	address: "",
};

const tableData = ref<RowData[]>([]);

const columns = [
	{ prop: "name", label: "姓名", editable: true },
	{ prop: "age", label: "年龄", editable: true },
	{ prop: "address", label: "地址", editable: false },
];

function handleDataChange(data: RowData[]) {
	console.log("数据变化:", data);
}
</script>
```

### 3.6 测试覆盖

创建了 35 个单元测试用例，覆盖：

- Props 和默认值
- 新增行功能
- 删除行功能
- 多选功能
- 可编辑列渲染
- 双向绑定
- 事件触发
- 样式主题

## 4. 打印功能迁移详情

### 4.1 功能特点

- 代码模式打印：通过代码创建打印模板
- 拖拽模板打印：使用 JSON 模板打印
- 支持多种打印元素：文本、条形码、二维码、长文本

### 4.2 迁移内容

**文件结构：**

```plain
main/src/views/sample/print/
└── index.vue    # 打印示例页面
```

**核心功能：**

- ✅ 代码模式打印
- ✅ 拖拽模板打印
- ✅ 打印元素支持：文本、条形码、二维码、长文本
- ✅ 错误处理

### 4.3 代码改进

#### 1. 添加错误处理

**改进后：**

```typescript
onMounted(async () => {
	disAutoConnect();
	hiprint.init();
	try {
		const req = await fetch("/template/test-print-tpl.json");
		tplJson = await req.json();
	} catch (error) {
		console.error("加载打印模板失败:", error);
	}
});
```

#### 2. 添加模板加载检查

**改进后：**

```typescript
function executeTplPrint() {
	if (!tplJson) {
		ElMessage.warning("打印模板尚未加载，请稍后再试");
		return;
	}
	const printTemplate = new hiprint.PrintTemplate({
		template: tplJson,
	});
	printTemplate.print({ tname: "我是标题" });
}
```

#### 3. 适配 Pure-Admin 布局

**使用 el-card 和 el-space：**

```vue
<el-card shadow="never">
  <template #header>
    <div class="card-header">
      <span>打印功能演示</span>
    </div>
  </template>

  <el-space :size="16" wrap>
    <el-button type="primary" @click="executeCodePrint">
      <IconifyIconOffline icon="ep:printer" />
      代码模式打印
    </el-button>
    <el-button type="success" @click="executeTplPrint">
      <IconifyIconOffline icon="ep:document" />
      拖拽模板打印
    </el-button>
  </el-space>

  <el-divider />

  <el-descriptions title="功能说明" :column="1" border>
    <!-- 功能说明 -->
  </el-descriptions>
</el-card>
```

### 4.4 使用说明

1. **准备打印模板**
   - 将打印模板 JSON 文件放在 `public/template/` 目录
   - 文件名：`test-print-tpl.json`

2. **代码模式打印**
   - 点击"代码模式打印"按钮
   - 通过代码创建打印模板并打印

3. **拖拽模板打印**
   - 点击"拖拽模板打印"按钮
   - 使用预定义的 JSON 模板打印

## 5. 其他组件评估结果

### 5.1 流程图组件

**评估结果：** ⏭️ Main 项目已有更完善的实现

**Main 项目已有内容：**

- `main/src/components/ReFlowChart/` - 完整的流程图组件
- `main/src/views/flow-chart/index.vue` - 示例页面
- 功能更完善：控制面板、节点面板、数据对话框

**结论：** 无需迁移

### 5.2 富文本编辑器

**评估结果：** ⏭️ Main 项目已有更完善的实现

**Main 项目已有内容：**

- `main/src/views/editor/components/EditorBase.vue` - 基础编辑器
- `main/src/views/editor/components/EditorUpload.vue` - 带上传功能
- `main/src/views/editor/components/EditorMulti.vue` - 多编辑器

**结论：** 无需迁移

### 5.3 表单设计器

**评估结果：** ⏭️ 未找到实际使用场景

**当前状态：**

- 在 `origin/src/main.ts` 中全局注册
- 未找到具体使用示例

**结论：** 暂不迁移，如需要可后续添加

## 6. 测试统计

|       组件       | 测试用例数 |               覆盖内容                |
| :--------------: | :--------: | :-----------------------------------: |
| DinamicTableForm |     35     | Props、增删行、多选、编辑、事件、主题 |
|     打印功能     |     0      |          示例页面，无需测试           |
|     **总计**     |   **35**   |             **全面覆盖**              |

## 7. 依赖关系

### 7.1 DinamicTableForm 依赖

```json
{
	"lodash-es": "^4.x",
	"element-plus": "^2.x"
}
```

**内部依赖：**

- `@/components/Table` - 表格组件

### 7.2 打印功能依赖

```json
{
	"vue-plugin-hiprint": "^0.x"
}
```

## 8. 迁移注意事项

### 8.1 DinamicTableForm 使用建议

1. **必需的 Props**

   ```typescript
   <DinamicTableForm
     v-model:data="tableData"
     :new-row-data="newRowData"
     :columns="columns"
   />
   ```

2. **列配置**

   ```typescript
   const columns = [
   	{ prop: "name", label: "姓名", editable: true },
   	{ prop: "age", label: "年龄", editable: true, requirred: true },
   	{ prop: "address", label: "地址", editable: false },
   ];
   ```

3. **新行数据**

   ```typescript
   // 提供完整的字段，但值为空
   const newRowData = {
   	name: "",
   	age: 0,
   	address: "",
   };
   ```

4. **数据变化监听**

   ```typescript
   // 方式1：使用 v-model
   <DinamicTableForm v-model:data="tableData" />

   // 方式2：监听事件
   <DinamicTableForm @change-data="handleDataChange" />
   ```

### 8.2 打印功能使用建议

1. **模板文件位置**
   - 放在 `public/template/` 目录
   - 确保文件可以通过 HTTP 访问

2. **打印客户端**
   - 使用 `disAutoConnect()` 取消自动连接
   - 如需连接打印客户端，移除该调用

3. **错误处理**
   - 模板加载失败时会在控制台输出错误
   - 模板未加载时点击打印会提示用户

## 9. 兼容性说明

### 9.1 浏览器兼容性

|       功能       | Chrome | Firefox | Safari | Edge |
| :--------------: | :----: | :-----: | :----: | :--: |
| DinamicTableForm |   ✅   |   ✅    |   ✅   |  ✅  |
|     打印功能     |   ✅   |   ✅    |   ⚠️   |  ✅  |

**注意：** Safari 的打印功能可能需要额外配置

### 9.2 主题兼容性

|       组件       | 亮色主题 | 暗色主题 | 自定义主题 |
| :--------------: | :------: | :------: | :--------: |
| DinamicTableForm |    ✅    |    ✅    |     ✅     |
|     打印功能     |    ✅    |    ✅    |     ✅     |

## 10. 后续优化方向

### 10.1 DinamicTableForm

- [ ] 支持更多表单项类型（下拉框、日期选择器、开关等）
- [ ] 支持表单验证（必填、格式验证等）
- [ ] 支持行内编辑和查看模式切换
- [ ] 支持拖拽排序
- [ ] 支持导入导出（Excel、CSV）
- [ ] 支持单元格合并
- [ ] 支持自定义渲染函数

### 10.2 打印功能

- [ ] 创建打印模板管理页面
- [ ] 支持在线设计打印模板（拖拽设计器）
- [ ] 支持打印预览
- [ ] 支持批量打印
- [ ] 支持打印历史记录
- [ ] 支持打印模板导入导出

### 10.3 表单设计器

- [ ] 评估是否需要表单设计器功能
- [ ] 如需要，创建表单设计器页面
- [ ] 集成 @form-create/designer
- [ ] 支持表单模板管理

## 11. 总结

### 11.1 迁移成果

- ✅ 成功迁移 1 个业务组件（DinamicTableForm）
- ✅ 创建 1 个示例页面（打印功能）
- ✅ 创建 35 个单元测试用例
- ✅ 完成样式主题适配
- ✅ 修复多个代码问题
- ✅ 提升类型安全性

### 11.2 关键改进

1. **DinamicTableForm**：
   - 修复 Props 直接修改问题
   - 支持 v-model 双向绑定
   - 改进单元格编辑逻辑
   - 移除废弃方法
   - 完善类型定义

2. **打印功能**：
   - 添加错误处理
   - 适配 Pure-Admin 布局
   - 改进用户体验

3. **其他组件**：
   - 确认 Main 项目已有更完善的实现
   - 避免重复迁移

### 11.3 质量保证

- 所有组件都有完整的类型定义
- 所有组件都支持亮色/暗色主题
- DinamicTableForm 有完整的单元测试覆盖
- 代码符合 Pure-Admin 规范

### 11.4 下一步工作

任务 10 已完成，可以继续执行后续任务：

- 任务 11：Checkpoint - 公共组件验证
- 任务 12：API 层迁移

