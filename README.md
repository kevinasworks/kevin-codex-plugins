# Kevin's Codex Plugins

Codex 自定义插件市场的本地骨架。

- `.agents/plugins/marketplace.json` 是市场入口，当前插件列表为空。
- `plugins/` 存放后续接入的插件包。添加插件时，在 `plugins/<插件名>/` 放入插件包，并在市场清单的 `plugins` 数组登记对应目录。

在仓库根目录运行 `codex plugin marketplace add .` 可添加本地市场。

## 许可证

本市场仓库自身采用 [MIT 许可证](LICENSE)。后续接入插件时，在插件目录保留该插件及其随包分发的第三方组件的许可文件。
