import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Bundles are emitted straight into uwrouting/, which is the folder loaded as an
// unpacked extension. The filenames must keep matching manifest.json.
export default (env, argv) => {
  const isProduction = argv.mode !== 'development'

  return {
    target: 'web',
    entry: {
      content: './src/content.js',
      background: './src/background.js'
    },
    output: {
      path: path.resolve(__dirname, 'uwrouting'),
      filename: '[name].bundle.js'
    },
    // Extension pages forbid eval, so never use an eval-based devtool here.
    devtool: isProduction ? false : 'cheap-module-source-map',
    performance: { hints: false }
  }
}
