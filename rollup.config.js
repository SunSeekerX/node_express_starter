import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fileSize from 'rollup-plugin-filesize'

export default {
  input: 'src/app.js',
  output: {
    file: 'dist/src/app.js',
    format: 'cjs',
    exports: 'auto',
  },
  plugins: [
    commonjs({
      dynamicRequireTargets: ['node_modules/default-gateway/darwin.js', 'node_modules/default-gateway/linux.js'],
    }),
    json(),
    nodeResolve({
      preferBuiltins: true,
    }),
    fileSize(),
  ],
}
