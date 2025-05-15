# 项目改造路线图

列举改造计划。

## 自动化路由

使用 [unplugin-vue-router](https://uvr.esm.is/) 实现自动化路由，仅仅对新增的业务代码，实现页面组件的路由导航。

### 安装依赖

```bash
pnpm -F=@ruan-cat-10wms/main i -D unplugin-vue-router vite-plugin-vue-meta-layouts
```

### 配置自动导入插件需要的类型

- https://uvr.esm.is/introduction.html#auto-imports

### 配置布局组件

你好，我需要改造本项目，使其可以对接布局插件。请为我规划合适的改造计划。

## view 目录下的特定组件也被认定为自动导入的全局组件

## 自己封装的组件归属在特定的目录内，避免冲突

## 补全组件自动导入的别名配置

## 补全 vite 插件

## 测试全局 vitest 测试套件

## 导入封装好的接口请求工具
