# FlowChart 组件

基于 `@logicflow/core` 的流程图编辑器组件，支持 BPMN 流程图绘制。

## 安装依赖

```bash
pnpm add @logicflow/core @logicflow/extension
```

## 特性

- ✅ BPMN 流程图支持
- ✅ 拖拽式节点添加
- ✅ 流程图导入导出
- ✅ 丰富的节点类型（开始、结束、用户任务、系统任务、条件判断）
- ✅ 完整的 TypeScript 类型支持

## 基础用法

```vue
<template>
	<FlowChart ref="flowRef" height="600px" @node-click="handleNodeClick" @change="handleChange" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import FlowChart from "@/components/FlowChart/index.vue";

const flowRef = ref();

function handleNodeClick(data: any) {
	console.log("节点点击", data);
}

function handleChange(data: any) {
	console.log("流程图变化", data);
}
</script>
```

## API

### Props

|     参数      |     说明     |   类型    |  默认值   |
| :-----------: | :----------: | :-------: | :-------: |
|    height     |   画布高度   | `string`  | `"600px"` |
|     grid      | 是否显示网格 | `boolean` |  `true`   |
| stopZoomGraph | 是否禁止缩放 | `boolean` |  `false`  |
|  initialData  |   初始数据   |   `any`   |     -     |

### Events

|  事件名   |       说明       |    参数     |
| :-------: | :--------------: | :---------: |
| nodeClick |  节点点击时触发  | `data: any` |
| edgeClick |  连线点击时触发  | `data: any` |
|  change   | 流程图变化时触发 | `data: any` |

### Methods

|    方法名    |      说明      |     参数     | 返回值 |
| :----------: | :------------: | :----------: | :----: |
| getGraphData | 获取流程图数据 |      -       | `any`  |
| setGraphData | 设置流程图数据 | `data: any`  |   -    |
|  exportJson  | 导出 JSON 文件 |      -       |   -    |
|  importJson  | 导入 JSON 文件 | `file: File` |   -    |

## 迁移说明

从 Origin 项目迁移到 Pure-Admin：

- ✅ 保留完整功能
- ✅ 优化 UI 设计
- ✅ 封装常用方法
- ✅ 完整的 TypeScript 类型支持
