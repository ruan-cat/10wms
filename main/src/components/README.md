# 组件迁移说明

本文档说明了从 Origin 项目迁移到 Pure-Admin 的组件情况。

## 已完成迁移的组件

### 1. 基础组件

|    组件名     | 状态 |            位置             |     说明     |
| :-----------: | :--: | :-------------------------: | :----------: |
| DialogPromise |  ✅  | `components/DialogPromise/` | 命令式对话框 |
|  TableSearch  |  ✅  |  `components/TableSearch/`  |   表格搜索   |
|  ExcelImport  |  ✅  |  `components/ExcelImport/`  |  Excel 导入  |

### 2. 特殊功能组件

|    组件名    | 状态 |            位置            |     说明     |
| :----------: | :--: | :------------------------: | :----------: |
| FormDesigner |  ✅  | `components/FormDesigner/` |  表单设计器  |
|  FlowChart   |  ✅  |  `components/FlowChart/`   | 流程图编辑器 |

## 待迁移组件

### 3. 打印功能

**依赖**：`vue-plugin-hiprint`

**迁移建议**：

- 保留 Origin 的实现
- 按需在具体业务页面中使用
- 需要时再进行封装

**使用方式**：

```bash
pnpm add vue-plugin-hiprint
```

### 4. 富文本编辑器

**依赖**：`@wangeditor/editor`

**迁移建议**：

- 保留 Origin 的实现
- 按需在具体业务页面中使用
- 需要时再进行封装

**使用方式**：

```bash
pnpm add @wangeditor/editor @wangeditor/editor-for-vue@next
```

### 5. 自定义业务组件

**组件**：`dinamic-table-form`

**迁移建议**：

- 根据实际业务需求决定是否迁移
- 可能需要重新设计和实现
- 建议先完成核心业务模块迁移

## 组件使用优先级

### 高优先级（已完成）

1. DialogPromise - 对话框
2. TableSearch - 搜索
3. ExcelImport - Excel 导入
4. FormDesigner - 表单设计器
5. FlowChart - 流程图

### 中优先级（按需迁移）

6. 打印功能 - 根据业务需求
7. 富文本编辑器 - 根据业务需求

### 低优先级（可选）

8. 自定义业务组件 - 根据实际使用情况

## 迁移原则

1. **优先使用 Pure-Admin 原生组件**
2. **保留 Origin 的特殊功能组件**
3. **按需迁移，避免过度封装**
4. **注重代码质量和可维护性**

## 注意事项

1. **依赖安装**：
   - 特殊功能组件需要安装对应的第三方库
   - 建议在 `package.json` 中明确标注依赖版本

2. **样式适配**：
   - 确保组件样式与 Pure-Admin 主题一致
   - 使用 CSS 变量进行主题适配

3. **类型定义**：
   - 所有组件都应有完整的 TypeScript 类型定义
   - 使用 JSDoc 注释说明组件用法

4. **文档完善**：
   - 每个组件都应有 README.md 文档
   - 包含使用示例和 API 说明
