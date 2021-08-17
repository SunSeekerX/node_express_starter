/**
 * 打包配置
 * @author: SunSeekerX
 * @Date: 2021-08-17 17:46:10
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-08-17 18:06:09
 */

import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/app.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
    exports: 'auto',
  },
  plugins: [commonjs(), json(), nodeResolve()],
}
