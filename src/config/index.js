/**
 * 获取变量配置
 * @author: SunSeekerX
 * @Date: 2021-08-02 15:40:13
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-08-17 16:49:11
 */

const fs = require('fs')
const path = require('path')
const jsYaml = require('js-yaml')

const log = require('../utils/log')

const envPath = process.env.NODE_ENV
const envConfig = jsYaml.load(fs.readFileSync(path.join(__dirname, `../../env.${envPath}.yaml`), 'utf8')) ?? {}
const defaultConfig = require('./default')

module.exports = (key) => {
  const emptyList = [null, undefined]
  const val = envConfig[key] || defaultConfig[key]

  if (emptyList.includes(val)) {
    log.error(`ENV: Cannot get the ${key} value!`)
    return null
  }
  return val
}
