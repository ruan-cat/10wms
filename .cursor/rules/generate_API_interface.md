# 生成 API 文档

在本次对话中，你的任务是生成 API 请求接口。请根据 API 文档，你将根据我提供给你的关键词，生成接口。

在本次对话中，我们将按照指定的要求，逐步地，批量的，少量多次的生成接口和接口请求用例。

## 全部核心资料的上下文

请阅读以下文件夹内的全部文件，包括接口请求工具的文档，请求工具本身的实现方式。

@Folders src\composables\use-request

## MCP 上下文

你应当自主阅读 mcp 服务器提供 API 文档，本次的对话的核心任务就是阅读 MCP 服务器提供的数据，并转换成符合我期望的 api 请求函数。

## 工作范围

我会要求你修改、编辑或新建文件。你的文件修改范围仅限于以下目录：

`src\apis`

你只可以在 `src\apis` 内新建并修改文件。

## 文件后缀类型

你将生成 `*.ts` 和 `*.test.ts` 格式的文件。

- `*.ts` 即真实的接口请求。
- `*.test.ts` 即接口请求的测试套件。

## 交互方式

我会向你这样提问，如下例子：

1. 请根据 API 文档，生成 `获取XXX` 接口。
2. 生成 `删除***` 接口

## 新建文件夹时提醒我

在你想新建文件夹时，提醒我，并由我审核你的文件夹命名。

## api 接口代码，生成案例

如下例子所示：

```plain
/**
 * 编辑用户详情接口
 * @description
 * id必填，其他字段选填
 */
export function sysManagerModifyUserDetail<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RequiredPick<UserDetail, "id">>({
		url: "/sys-manager/modify/userdetail",
		options,
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				id: "",
			},
		},
	});
}
```

1. 最优先参考的案例在 `src\composables\use-request\tests` 目录内。事实上，你要着重模仿文件仅为以下三个例子：
   1. `src\composables\use-request\tests\body.example.ts`
   2. `src\composables\use-request\tests\path.example.ts`
   3. `src\composables\use-request\tests\query.example.ts`
2. 生成的 jsdoc 注释，不要包含任何 `@see` 字样。不需要增加额外的链接。
3. 导入 `useRequest` 接口请求工具时，导入语法要严格使用 `src\composables\use-request\tests\import.example.ts` 提供的例子来导入。我们导入时已经使用路径别名了。

## api 测试代码，生成案例

比如 `src\apis\sys-manager\modify.test.ts` 文件。

1. 导入的测试工具仅为以下的测试套件。我们用测试套件来完成测试。
   > `import { describe, it } from "vitest";`
2. 使用相对路径的方式导入要测试的函数。

## 边缘情况注意事项

1. 当目标接口的参数请求方式为 query 时，请不要添加多余的 params 参数。
2. 当接口请求的返回参数含有 PageDTO 时，请导入 PageDTO 类型，作为返回值的包装类。
