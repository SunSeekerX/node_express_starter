/**
 * 应用程序入口
 * @author: SunSeekerX
 * @Date: 2021-07-16 16:34:03
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-08-02 16:05:30
 */

const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const internalIp = require('internal-ip')
const chalk = require('chalk')

const log = require('./utils/log')
const indexRouter = require('./routes/index')
const getEnv = require('./config/index')

const ipv4 = internalIp.v4.sync()

console.log(getEnv('port'))

const app = express()
const port = 3000

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.json({
    code: 404,
    message: 'NOT FOUND!',
  })
})

// Error handler
app.use((err, req, res, next) => {
  log.error(err)

  res.status(err.status || 500)
  res.json({
    code: 500,
    message: err.message,
  })
})

app.set('port', port)

app.listen(port, () => {
  console.log(
    `
    App running at:
      - Local:   ${chalk.green(`http://localhost:${port}`)}
      - Network: ${chalk.green(`http://${ipv4}:${port}/`)}`
  )
})
