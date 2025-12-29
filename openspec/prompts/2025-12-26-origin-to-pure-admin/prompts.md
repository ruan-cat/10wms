<!-- TODO: 未完成 -->

# origin-to-pure-admin 任务的长期复用提示词

/openspec:apply 执行 `origin-to-pure-admin` 任务

# 任务指令：执行 `origin-to-pure-admin` 迁移工程

## 第一阶段：前置准备与规范内化

在启动任何修改前，你必须按顺序深度阅读并理解以下文档，**并将其核心约束作为启动参数传递给所有子代理**：

1. **具体业务规格**：`openspec\changes\origin-to-pure-admin` 目录下的所有文件。
2. `CLAUDE.md` 文档。

---

## 第二阶段：动态任务编排与并行执行

### 1. 任务调度逻辑（主代理职责）

- **并发管理**：主动开启多个**后台运行**的子代理并行工作。
- **任务拆分准则**：
- **基准**：初始建议每个子代理负责 3~5 个相关联的业务路径。
- **动态调整**：若遇到文件超大或逻辑复杂路径，必须以“文件”为单位进行微粒度拆分，避免触发 400 错误或上下文超限。

- **状态同步（解决冲突）**：**仅由主代理**统一负责更新 `openspec\changes\origin-to-pure-admin\tasks.md`。子代理完成任务后向主代理汇报，主代理核实后立即更新，确保进度文件不发生写入冲突。

### 2. 执行约束（严禁行为）

- **禁止脚本化**：**严禁**编写 Python、TS、JS 或 Bash 脚本进行正则替换或批量删改。必须基于对代码逻辑的深度理解，手工完成语义化的改写。
- **连续运行**：除非遇到无法解决的逻辑死锁，否则请持续运行直至全部任务完成，无需中途询问。

---

## 第三阶段：思考模式 (Ultrathink Mode)

请全程开启深度推理模式，并在执行前按照以下逻辑进行思考：

1. **深度推理**：投入充足的 Token 进行推理，不要急于输出代码。
2. **依赖分析**：在指派子代理前，先分析业务路径之间的耦合关系，确保改写顺序合理。
3. **动态编排**：根据任务进度和子代理的反馈，实时调整后续任务的粒度。
4. **回复语言**：全程使用**中文**。

## 001 更新 kiro 文档和，删除掉主项目关于自动化路由的配置

1. 我需要你完成以下任务：
   - 更新文档： 按照以下要求体现的需求，更新 `openspec\changes\origin-to-pure-admin` 目录下面的迁移规范文档、任务进度文档等。和 kiro 的 `.kiro\specs\origin-to-pure-admin-migration` 文档、任务进度文档等。
   - 完成修改： 按照以下更改需求，完成更改。
2. 针对 main\src\router\index.ts 路由配置入口文件。
3. 删除掉路由配置对以下内容的使用。在主项目内，不使用自动路由相关的配置。
   - vue-router/auto
   - virtual:meta-layouts
   - @ruan-cat/utils/unplugin-vue-router
   - vite-plugin-vue-meta-layouts
4. 在 `main\src\views` 目录内，我无法区分出那些是 pure-admin 框架本身自带的东西，那些是我们的业务代码。请你更新调整文件和存储结构：
   - 从旧项目迁移的页面，应该存放在 `main\src\pages` 目录内。
   - 原来 `main\src\pages` 目录内多余的测试页面，应该删除掉。
   - 确保你按照 `https://github.com/pure-admin/pure-admin-doc/blob/master/docs/01.指南/01.指南/07.路由和菜单.md` 文档的要求，迁移旧项目的页面路由，并注册页面。

## 002 旧代码路由迁移不完整

1. origin\src\views
2. main\src\pages
3. 从旧代码内，很多已经有的页面，没有及时迁移过来，迁移不完整。
4. 请迁移这些旧代码，并设置好路由配置。确保这些代码在主项目内能够运行。
5. 请你及时更新 kiro 和 openspec 的对应规范和任务清单。

## 003 持续按照优先级完成旧项目路由的迁移

1. 阅读 kiro 的 .kiro\specs\origin-to-pure-admin-migration\tasks.md 任务清单，按照你设计的【补全缺失页面迁移 - P1 高优先级页面】任务，持续完成任务修改。
2. 完成 P1 任务后，就持续去完成后续优先级的页面迁移任务。并确保同步更新路由配置的 `main\src\router\modules` 路由定义模块。

## 004 重构路由模块的存储文件，更改路由识别读取的路径，新建全新的路由存储规范

1. 阅读 main\src\router\modules 目录的文件。现在我完全没办法去区分清楚，那些路由是 pure-admin 的，那些是旧项目迁移过来的，有意义的业务路由。现在遇到难点，无法区分 pure-admin 原生路由，和旧项目业务路由。
2. 设计新的目录层级： 我要求你在 `main\src\router\modules` 内，设计两层具有区分能力的目录。
   - pure-admin 目录。
   - business 目录。专门存放被迁移过来的，业务路由文件。
3. 更新路由读取能力： 及时更新 `main\src\router\index.ts` 文件读取路由的写法，确保能够分别的，区分地实现路由信息的读取。默认情况将全部的路由都读取到。包括 `pure-admin` 路由和 `business` 路由。
4. 更新全局文档，说明专业术语： 更新 `CLAUDE.md` 文档，说明项目有两款路由：
   - `pure-admin` 路由
   - `business` 路由
5. 更新 kiro.origin-to-pure-admin 的 spec 规格文件： 重点说明清楚使用了新的路由存储方案。
   - .kiro\specs\origin-to-pure-admin-migration\design.md
   - .kiro\specs\origin-to-pure-admin-migration\requirements.md
6. 更新 openspec.origin-to-pure-admin 的 spec 规格文件：
   - openspec\changes\origin-to-pure-admin\specs 增加一个新的规格，router，重点说明使用了新的路由存储方案。

## 005 设计入口，区分 `pure-admin` 路由和 `business` 路由，实现清晰的侧边栏

1. 阅读以下 url 图片：

![2025-12-29-10-54-00](https://gh-img-store.ruan-cat.com/01s-docs/10wms/2025-12-29-10-54-00.png)

2. 可以很清楚的得知，侧边栏的显示效果不好。`pure-admin` 路由和 `business` 路由全部混在一起了。阅读起来不方便。
3. 我希望你建立一个机制，实现主业务侧边栏，和案例侧边栏的区分。我希望通过特定的入口，点击以后就能够看到案例侧边栏。
   - `主业务侧边栏`： 即默认的 `business` 路由组成的页面。
   - `案例侧边栏`： 即默认的，来自 `pure-admin` 路由组成的页面。
4. `sidebarType` 侧边栏类型的取值： 我设计为联合类型的字符串。
   - `pureAdminExamplePage` 来自 pure-admin 提供的例子页面。
   - `wmsBusinessPage` wms 业务的页面。
5. 基于路由存储结构的约定式配置： 尽管我增加设计了 `meta.sidebarType` 这个**非必填**字段，但是这并不意味着你现在就要扫描全部的 `main\src\router\modules` 目录内的全部路由，并统一配置 `sidebarType` 字段。相反，我要求你基于 modules 路由存储的位置，默认区分 sidebarType 。
   - `pure-admin` 路由的默认取值为 `pureAdminExamplePage` 。
   - `business` 路由的默认取值为 `wmsBusinessPage` 。
6. 可以随时配置某款路由归属于那个侧边栏：
   - 我希望你基于现有的路由 `meta` 配置类型，增设一个 `sidebarType` 的字段。根据所配置的 `sidebarType` 字段的类型，来实现侧边栏数据的识别与加载。
   - 当我给一个路由的 `meta.sidebarType` 设置具体值时，那么该路由就归属于那个侧边栏。
7. 约定式与显性配置的优先级区分：
   - 默认按照约定式的路由来区分所归属的侧边栏。
   - 其次根据显性配置的 `meta.sidebarType` 来决定归属。因为我预期设计会有部分 `pure-admin` 路由会归属于主业务侧边栏。成为主业务的一部分。
8. 制作高内聚的 `main\src\composables` 的专项组合式 api 工具：我要求你在 `main\src\composables\use-sidebar-type` 目录内，新建一个组合式 api，来实现上述的全部功能，最后该组合式 api 会在需要的地方使用。我希望关于`主业务侧边栏`和`案例侧边栏`全部的业务处理逻辑，都在这个组合式 api 内实现。
9. `use-sidebar-type` 组合式工具要准备完善的文档：
   - 应该充分的阅读旧项目的 `origin\src\composables` 目录结构，模仿旧项目组合式工具的代码存储结构，也编写详细的文档、使用案例。
10. 适当修改侧边栏的逻辑： 我们增加了新的处理 `meta.sidebarType` 字段，允许你适当的修改侧边栏的逻辑，确保能够实现区分式的侧边栏。
11. 将上述路由机制和术语，更新到 `CLAUDE.md` 文档内：
    - 增加 `主业务侧边栏` 和 `案例侧边栏` 的术语说明。
    - 在 `CLAUDE.md` 文档内，增加对上述路由与侧边栏识别机制的说明。但是注意要缩减篇幅，避免 `CLAUDE.md` 文件太长。给其他 AI 大模型带来较大的 token 负担，仅仅需要说明必要的机制即可。
