# 特殊功能组件迁移评估

## 1. 组件概述

本次需要迁移/评估五个特殊功能组件：

|      组件名称      |                    位置                     |       功能描述       |                   依赖                    |   状态    |
| :----------------: | :-----------------------------------------: | :------------------: | :---------------------------------------: | :-------: |
|     表单设计器     |            `origin/src/main.ts`             | 全局注册的表单设计器 |          `@form-create/designer`          |  需评估   |
|     流程图组件     |       `origin/src/views/sample/flow/`       |     流程图编辑器     | `@logicflow/core`, `@logicflow/extension` | Main 已有 |
|      打印功能      |      `origin/src/views/sample/print/`       |     打印模板功能     |           `vue-plugin-hiprint`            |  需迁移   |
|    富文本编辑器    |      `origin/src/views/sample/editor/`      |      富文本编辑      |       `@wangeditor/editor-for-vue`        | Main 已有 |
| dinamic-table-form | `origin/src/components/dinamic-table-form/` |     动态表格表单     |                自定义组件                 |  需迁移   |

## 2. 组件详细分析

### 2.1 表单设计器（@form-create/designer）

**当前状态：**

- 在 `origin/src/main.ts` 中全局注册
- 未找到具体使用示例

**代码：**

```typescript
import FcDesigner from "@form-create/designer";
import ElementPlus from "element-plus";

app.use(ElementPlus).use(FcDesigner);
```

**迁移策略：** ⏭️ 暂不迁移

- 未找到实际使用场景
- 如果后续需要，可以在 `main/src/main.ts` 中全局注册
- 或者按需在特定页面中局部引入

**预期工作量：** 极低（如需要）

### 2.2 流程图组件（@logicflow）

**当前状态：**

- Origin 项目：`origin/src/views/sample/flow/index.vue`
- Main 项目：已有完整的 `ReFlowChart` 组件和示例页面

**Main 项目已有内容：**

```plain
main/src/components/ReFlowChart/
├── src/
│   ├── Control.vue          # 控制面板
│   ├── NodePanel.vue        # 节点面板
│   ├── DataDialog.vue       # 数据对话框
│   ├── config.ts            # 配置
│   └── adpterForTurbo.ts    # 数据适配器
└── index.ts

main/src/views/flow-chart/index.vue  # 示例页面
```

**迁移策略：** ✅ 无需迁移

- Main 项目已有完整实现
- 功能更完善（包含控制面板、节点面板、数据对话框）
- Origin 的示例相对简单

**预期工作量：** 无

### 2.3 打印功能（vue-plugin-hiprint）

**当前状态：**

- 在 `origin/src/views/sample/print/index.vue` 中使用
- 支持代码模式和拖拽模板两种打印方式

**核心功能：**

1. 代码模式打印：通过代码创建打印模板
2. 拖拽模板打印：使用 JSON 模板打印
3. 支持文本、条形码、二维码、长文本等元素

**代码示例：**

```typescript
import { disAutoConnect, hiprint } from "vue-plugin-hiprint";

// 初始化
hiprint.init();

// 创建打印模板
const printTemplate = new hiprint.PrintTemplate();
const panel = printTemplate.addPrintPanel({...});

// 添加打印元素
panel.addPrintText({...});
panel.addPrintLongText({...});

// 执行打印
printTemplate.print({});
```

**迁移策略：** ✅ 创建示例页面

- 在 Main 项目中创建打印示例页面
- 保留 Origin 的打印功能代码
- 适配 Pure-Admin 的页面布局

**预期工作量：** 低

### 2.4 富文本编辑器（@wangeditor/editor）

**当前状态：**

- Origin 项目：`origin/src/views/sample/editor/index.vue`
- Main 项目：已有多个编辑器组件

**Main 项目已有内容：**

```plain
main/src/views/editor/components/
├── EditorBase.vue      # 基础编辑器
├── EditorUpload.vue    # 带上传功能的编辑器
└── EditorMulti.vue     # 多编辑器
```

**迁移策略：** ✅ 无需迁移

- Main 项目已有完整实现
- 功能更丰富（基础、上传、多编辑器）
- Origin 的示例相对简单

**预期工作量：** 无

### 2.5 dinamic-table-form 组件

**组件特点：**

- 动态表格样式的表单组件
- 支持动态增删行
- 支持可编辑列配置
- 支持多选删除

**核心功能：**

1. 新增行：使用 `newRowData` 作为默认数据
2. 删除单行：删除指定索引的行
3. 删除选中行：批量删除多选的行
4. 可编辑列：通过 `editable` 属性控制

**Props 接口：**

```typescript
interface DinamicTableFormProps<T> {
	newRowData: T; // 新行默认数据
	data: T[]; // 表格数据
	columns: EditableTableColumn<T>[]; // 列配置
	isIndex?: boolean; // 是否显示序号
	isMultipleSelect?: boolean; // 是否支持多选
}
```

**列配置：**

```typescript
type EditableTableColumn<T> = CommonTableColumn<T> & {
	editable: boolean; // 是否可编辑
	requirred?: boolean; // 是否必填
};
```

**迁移策略：** ✅ 迁移并改进

- 复制组件到 `main/src/components/DinamicTableForm/`
- 修复导入路径
- 适配 Pure-Admin 样式
- 改进类型定义
- 移除 `@deprecated` 的方法

**预期工作量：** 中

## 3. 迁移计划

### 3.1 任务优先级

|        任务        | 优先级 |           原因           |
| :----------------: | :----: | :----------------------: |
| dinamic-table-form |   P0   | 自定义业务组件，需要迁移 |
|    打印功能示例    |   P1   |     创建示例页面即可     |
|     流程图组件     |   P2   |   Main 已有，无需迁移    |
|    富文本编辑器    |   P2   |   Main 已有，无需迁移    |
|     表单设计器     |   P3   |     未使用，暂不迁移     |

### 3.2 dinamic-table-form 迁移步骤

1. **创建组件目录**

   ```plain
   main/src/components/DinamicTableForm/
   ├── index.vue
   ├── types.ts
   └── index.test.ts
   ```

2. **修复导入路径**

   ```typescript
   // 原代码
   import ComponentsTable from "components/table/index.vue";

   // 改进后
   import ComponentsTable from "@/components/Table/index.vue";
   ```

3. **适配样式**
   - 使用 Pure-Admin 的 CSS 变量
   - 适配亮色/暗色主题

4. **改进代码**
   - 移除 `@deprecated` 的方法（`toggleEdit`、`handleSave`）
   - 改进类型定义
   - 添加 JSDoc 注释

5. **编写测试**
   - 测试新增行功能
   - 测试删除行功能
   - 测试多选功能
   - 测试可编辑列

### 3.3 打印功能迁移步骤

1. **创建示例页面**

   ```plain
   main/src/views/sample/print/index.vue
   ```

2. **复制打印代码**
   - 保留 Origin 的打印逻辑
   - 适配 Pure-Admin 的页面布局

3. **添加路由**
   - 在路由配置中添加打印示例页面

## 4. 样式适配要点

### 4.1 dinamic-table-form 样式适配

|       原始样式       |       Pure-Admin 变量        |   说明   |
| :------------------: | :--------------------------: | :------: |
|        `#fff`        |     `var(--el-bg-color)`     |  背景色  |
| `rgba(0, 0, 0, 0.1)` | `var(--el-box-shadow-light)` |   阴影   |
|      硬编码圆角      |             保留             | 8px 圆角 |

### 4.2 打印页面样式适配

- 使用 Pure-Admin 的按钮样式
- 适配页面布局
- 确保打印预览正常显示

## 5. 依赖关系

### 5.1 dinamic-table-form 依赖

```json
{
	"lodash-es": "^4.x",
	"element-plus": "^2.x"
}
```

**内部依赖：**

- `@/components/Table` - 表格组件

### 5.2 打印功能依赖

```json
{
	"vue-plugin-hiprint": "^0.x"
}
```

## 6. 测试策略

### 6.1 dinamic-table-form 测试

**单元测试：**

- 测试 Props 接口
- 测试新增行逻辑
- 测试删除行逻辑
- 测试多选逻辑
- 测试可编辑列渲染

**集成测试：**

- 测试与 Table 组件的集成
- 测试数据变化事件

### 6.2 打印功能测试

**功能测试：**

- 测试代码模式打印
- 测试拖拽模板打印
- 测试打印元素渲染

## 7. 风险评估

|               风险项               | 风险等级 |         缓解措施          |
| :--------------------------------: | :------: | :-----------------------: |
| dinamic-table-form 依赖 Table 组件 |    中    | 确保 Table 组件已正确迁移 |
|        打印功能浏览器兼容性        |    中    |      测试主流浏览器       |
|          表单设计器未使用          |    低    |  暂不迁移，需要时再处理   |

## 8. 迁移注意事项

### 8.1 dinamic-table-form

1. **Props 直接修改问题**

   ```typescript
   // 原代码有 eslint-disable 注释
   // eslint-disable-next-line vue/no-mutating-props
   props.data.push(cloneDeep(props.newRowData));
   ```

   **改进方案：**
   - 使用 `v-model:data` 双向绑定
   - 通过 emit 事件通知父组件更新

2. **操作栏列配置**

   ```typescript
   // 原代码直接修改 props.columns
   props.columns.push({...});
   ```

   **改进方案：**
   - 使用 computed 计算属性
   - 不直接修改 props

3. **类型定义改进**
   - 移除 `@vue-ignore` 注释
   - 使用更精确的类型定义

### 8.2 打印功能

1. **模板文件路径**

   ```typescript
   // 原代码使用 public 目录
   const req = await fetch("/template/test-print-tpl.json");
   ```

   **注意：**
   - 确保模板文件在 Main 项目的 public 目录中
   - 或者改为从 API 获取

2. **打印客户端连接**

   ```typescript
   // 取消自动连接
   disAutoConnect();
   ```

   **说明：**
   - 这是为了避免自动连接打印客户端
   - 在实际使用时可能需要调整

## 9. 后续优化方向

### 9.1 dinamic-table-form

- [ ] 支持更多表单项类型（下拉框、日期选择器等）
- [ ] 支持表单验证
- [ ] 支持行内编辑和查看模式切换
- [ ] 支持拖拽排序
- [ ] 支持导入导出

### 9.2 打印功能

- [ ] 创建打印模板管理页面
- [ ] 支持在线设计打印模板
- [ ] 支持打印预览
- [ ] 支持批量打印

### 9.3 表单设计器

- [ ] 评估是否需要表单设计器功能
- [ ] 如需要，创建表单设计器页面
- [ ] 集成 @form-create/designer

## 10. 总结

### 10.1 迁移范围

- ✅ dinamic-table-form：需要迁移
- ✅ 打印功能：创建示例页面
- ⏭️ 流程图：Main 已有，无需迁移
- ⏭️ 富文本编辑器：Main 已有，无需迁移
- ⏭️ 表单设计器：未使用，暂不迁移

### 10.2 预期工作量

- dinamic-table-form 迁移：2-3 小时
- 打印功能示例：1 小时
- 总计：3-4 小时

### 10.3 关键改进

1. **dinamic-table-form**：
   - 修复 Props 直接修改问题
   - 改进类型定义
   - 适配 Pure-Admin 样式

2. **打印功能**：
   - 创建示例页面
   - 适配页面布局

3. **其他组件**：
   - 确认 Main 项目已有更完善的实现
   - 无需重复迁移
