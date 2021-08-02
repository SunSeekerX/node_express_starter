/* eslint-disable prefer-rest-params */
/* eslint-disable no-console */
/**
 * 日志工具
 * @author: SunSeekerX
 * @Date: 2021-08-02 15:55:43
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-08-02 16:22:59
 */

const chalk = require('chalk')
const { name } = require('../../package.json')

module.exports = {
  log(...args) {
    console.log(chalk.bold(chalk.gray(name)), args)
  },

  warn(...args) {
    console.warn(chalk.bold(chalk.yellow(name)), args)
  },

  error() {
    console.error(chalk.red(`[${name}(Error)]: `), ...arguments)
  },
}
