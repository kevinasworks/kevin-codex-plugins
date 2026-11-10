# codex-anydoc

基于 [Firecrawl AnyDoc](https://github.com/firecrawl/anydoc) 的 Codex 插件，通过本地 MCP 将办公文档、电子书、CSV 和文本型 PDF 转换为 Markdown。

- 插件名 `codex-anydoc`
- 当前版本 `0.2.1`
- AnyDoc 运行时 `@firecrawl/anydoc@0.2.4`
- 项目许可证 MIT

## 与 Firecrawl AnyDoc 的关系

Firecrawl AnyDoc 提供原生解析能力。`codex-anydoc` 提供 MCP 接入层，并复用 `dsh-anydoc@0.2.1` 的转换、批量处理和自检逻辑。安装包附带预编译原生绑定和第三方许可。

## 三个 MCP 工具

| 工具 | 作用 |
| --- | --- |
| `anydoc_convert` | 转换一个文件，写入完整 Markdown 并返回预览 |
| `anydoc_batch_convert` | 转换文件列表或目录，目录默认不递归 |
| `anydoc_capabilities` | 检查原生绑定和运行环境，可用 `selfTest: true` 执行 CSV 转换自检 |

## 安装

### 通过 GitHub marketplace 安装与升级

添加 GitHub 的 `anydoc` 市场，Codex 会从该分支安装完整插件。

```sh
codex plugin marketplace add https://github.com/kevinasworks/codex-anydoc.git --ref anydoc
codex plugin add codex-anydoc@anydoc
```

已有 `codex-anydoc@anydoc` 的用户可以刷新市场并开启新会话。

```sh
codex plugin marketplace upgrade anydoc
```

### 在同一仓库发布其他插件

`anydoc` 是正式市场的内部名称，界面显示为 **Kevin’s Codex Plugins**。在 `anydoc` 分支的 `plugins/<插件名>/` 放入可安装的完整插件，并在根目录的 `.agents/plugins/marketplace.json` 中给它增加一条记录。来源使用 `source: "local"` 和对应的 `./plugins/<插件名>` 路径。保持市场内部名称和已有插件名称，原安装 ID 就能继续使用。

AnyDoc 发布工作流只替换 `plugins/codex-anydoc/` 和该插件的市场条目。用户刷新一次市场，就能看到新增插件并按需安装。

### 从 GitHub Release 安装

下载并解压 [发布附件](https://github.com/kevinasworks/codex-anydoc/releases/latest)中的 `codex-anydoc-0.2.1.tgz`。安装 Node.js 20 或更新版本，然后注册解压目录下的 MCP 服务。将示例路径替换为 `package/server.mjs` 的实际绝对路径。

```sh
codex mcp add codex-anydoc -- node "/绝对路径/package/server.mjs"
```

开启新会话即可使用。附件已包含 Apple Silicon macOS 和 Windows x64 的运行依赖，解压后可以离线转换。

### 从本地目录安装

准备 Node.js 20 或更新版本，并确保 Codex 启动环境的 PATH 能找到 `node`。在仓库根目录执行：

```sh
npm ci --prefix codex --ignore-scripts
codex plugin marketplace add .
codex plugin add codex-anydoc@anydoc-local
codex mcp list
```

列表中应出现已启用的 `codex-anydoc`。桌面端重启后也可在插件目录选择 **AnyDoc Local** 并安装 **codex-anydoc**。依赖要先在当前机器安装，Codex 会把插件及依赖复制到安装缓存。更新后先在源目录重新安装依赖，再通过 Codex 重新安装此插件，并开启新会话。

## 使用示例

在 Codex 中提供文档的**绝对路径**。默认将 Markdown 写入用户目录下的 `anydoc-output`，也可指定绝对路径 `outputDir`。同名 Markdown 会使用新文件名。扫描版 PDF 需要 OCR。

## 平台支持

下表对应本地开发版本的打包和验证范围。已发布的 0.2.1 安装包包含 macOS arm64 和 Windows x64 两种绑定。

| 平台 | 架构 / libc | 验证状态 |
| --- | --- | --- |
| macOS Apple 芯片 | arm64 | 已实测 |
| macOS Intel | x64 | 已实测（Rosetta 下运行 x64 Node.js） |
| Windows | x64 | 绑定已纳入打包与 CI，运行待验证 |
| Linux | x64 / glibc | 绑定已纳入打包与 CI，运行待验证 |
| Linux | arm64 / glibc | 绑定已纳入打包与 CI，运行待验证 |
| Linux | x64 / musl | 绑定已纳入打包与 CI，运行待验证 |
| Linux | arm64 / musl | 绑定已纳入打包与 CI，运行待验证 |

平台范围以 Firecrawl AnyDoc 0.2.4 的原生绑定为准。Windows ARM64 原生进程没有对应绑定。不同平台上的 Codex 宿主可用性以各自的版本为准。

## 兼容性

| 环境 | 状态 | 验证范围 |
| --- | --- | --- |
| Codex `0.167.0-alpha.3.2` | 已验证 CLI 和桌面后端 | 用两版本地测试包验证原位升级，升级后新会话可转换文档 |

Node.js 下限为 20。使用 marketplace 安装时还需要 Codex 的插件管理命令。桌面插件页的升级入口尚未验收。

## 构建与发布

在仓库根目录执行 `bash codex/scripts/pack.sh /绝对路径/输出目录`。脚本在临时目录安装锁定的依赖、收集锁文件中七种原生绑定，并输出一个可直接解包运行的 tarball。解包到空目录后，用 `node codex/scripts/check-package.mjs /解包目录/package` 验证真实 MCP 握手和 CSV 自检。

准备正式版本时同步更新 `package.json`、`package-lock.json` 和 `plugin.json` 的版本。MCP 报告 Codex 插件自身的版本，底层 DSH 依赖继续由 lockfile 固定。`codex-vX.Y.Z` 标签对应独立的手动发布工作流。工作流默认在七种目标环境验证同一个包。显式开启 `publish` 后，才会更新 GitHub Release 和市场分支。GitHub Release 的附件也可供手动下载。

## 许可证

项目采用 MIT License。第三方依赖、版权声明和 AnyDoc 原始许可证分别见 [LICENSE](LICENSE)、[第三方声明](THIRD_PARTY_NOTICES.md) 和 [AnyDoc 许可证](licenses/anydoc-LICENSE.txt)。
