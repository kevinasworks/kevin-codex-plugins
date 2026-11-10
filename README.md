# Kevin's Codex Plugins

Kevin 的 Codex 自定义插件市场。Codex 从 [市场清单](.agents/plugins/marketplace.json) 读取可按需安装的插件。

## 插件

| 插件 | 版本 | 功能 |
| --- | --- | --- |
| [codex-anydoc](plugins/codex-anydoc/codex/README.md) | 0.2.1 | 将本地文档离线转换成 Markdown |

## 添加市场和安装

添加 GitHub 上的市场并安装：

```sh
codex plugin marketplace add kevinasworks/kevin-codex-plugins
codex plugin list --marketplace kevin-codex-plugins --available
codex plugin add codex-anydoc@kevin-codex-plugins
```

也可以在 Codex 桌面端的插件目录选择 **Kevin's Codex Plugins**，再安装所需插件。

当前 AnyDoc 随包提供 macOS Apple 芯片（arm64）的原生依赖，需要 Node.js 20 或更新版本。若已有本地检出，可在仓库根目录运行 `codex plugin marketplace add .` 添加本地市场。

通过 GitHub 添加的市场可用 `codex plugin marketplace upgrade kevin-codex-plugins` 刷新。

## 接入插件

将插件放入 `plugins/`，在市场清单的 `plugins` 数组新增一项，使用 `local` 来源指向包含 `plugin.json` 的目录。插件及其第三方组件的许可文件应放在该目录内，以便随插件安装。

## 许可证

市场自身采用 [MIT 许可证](LICENSE)。已登记插件的许可证与第三方声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
