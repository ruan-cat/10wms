import { it } from "vitest";
import { sysmanagerIconsAdd } from "./icons";

it("图标录入接口测试", async () => {
	const { execute, data, isLoading, isFinished } = sysmanagerIconsAdd({
		onSuccess(data) {
			console.log("图标录入成功", data);
		},
	});

	// 调用接口
	await execute({
		data: {
			file: undefined, // 在实际应用中应该使用文件上传控件获取的文件
			iconclas: "default",
			name: "测试图标",
			type: 1, // 1系统图标/2菜单图标/3桌面图标
		},
	});

	console.log("图标录入响应数据:", data.value);
});
