import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const require = createRequire(import.meta.url)
const manifestPath = require.resolve('dsh-anydoc/package.json')
const { version } = require('./plugin.json')
const library = pathToFileURL(path.join(path.dirname(manifestPath), 'lib') + path.sep)
const { Engine } = await import(new URL('engine.js', library))
const { resolveConfig } = await import(new URL('config.js', library))
const { createService } = await import(new URL('service.js', library))

const logger = {
  warn: message => console.error(message),
  info: () => {},
}
const config = resolveConfig({
  outputRoot: path.join(os.homedir(), 'anydoc-output'),
}, logger)
const engine = new Engine({ config, logger })
const service = createService({
  config, engine, logger, pluginVersion: version,
  resolveBaseDir: () => process.cwd(),
})
const server = new McpServer({ name: 'codex-anydoc', version })
const absolutePath = z.string().refine(value => path.isAbsolute(value), 'Use an absolute path')
const outputOptions = {
  outputDir: absolutePath.optional().describe('Defaults to ~/anydoc-output'),
  exportAssets: z.boolean().optional(),
}

function register(name, description, inputSchema, handler) {
  server.registerTool(name, { description, inputSchema }, async (args, { signal }) => {
    const result = await handler(args, { signal })
    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
      isError: !result.success,
    }
  })
}

register('anydoc_convert', 'Convert one local document to Markdown. Writes a new file and returns a preview.', {
  sourcePath: absolutePath,
  ...outputOptions,
}, service.convert)

register('anydoc_batch_convert', 'Convert local documents to Markdown. Supply absolute paths or a directory. Files are not overwritten.', {
  paths: z.array(absolutePath).min(1).max(config.batchMaxFiles).optional(),
  directory: absolutePath.optional(),
  recursive: z.boolean().optional().describe('Defaults to false'),
  ...outputOptions,
}, service.batch)

register('anydoc_capabilities', 'Check local AnyDoc support and optionally convert a temporary CSV sample.', {
  selfTest: z.boolean().optional(),
}, service.capabilities)

server.server.onclose = () => engine.dispose()
process.stdin.once('end', () => engine.dispose())
await server.connect(new StdioServerTransport())
