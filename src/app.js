import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { readFile } from 'fs/promises'
import multer from 'multer'
import useragent from 'express-useragent'
import acceptLanguage from 'accept-language'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

// 配置 dotenv
dotenv.config({
  path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const port = process.env.PORT || 3000

// 配置 Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test API Documentation',
      version: '1.0.0',
      description: 'A simple test API documentation',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        Response: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            code: {
              type: 'integer',
              example: 200,
            },
            msg: {
              type: 'string',
              example: 'Success!',
            },
            data: {
              type: 'object',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            code: {
              type: 'integer',
              example: 400,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/*.js'], // 指向 API 路由文件
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// 配置支持的语言
acceptLanguage.languages(['en-US', 'en', 'zh-CN', 'zh', 'ja', 'ko'])

// 读取 package.json
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)))
const { version } = packageJson

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制 5MB
  },
})

const app = express()

// 中间件
app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(join(__dirname, 'public')))
app.use(useragent.express())

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 获取语言环境信息
const getLocaleInfo = (req) => {
  const acceptLanguageHeader = req.get('accept-language') || ''
  const preferredLanguage = acceptLanguage.get(acceptLanguageHeader)

  return {
    acceptLanguage: acceptLanguageHeader,
    preferredLanguage,
    browserLanguage: req.headers['accept-language'],
    timezone: req.headers['x-timezone'] || Intl.DateTimeFormat().resolvedOptions().timeZone,
    date: new Date().toLocaleString(preferredLanguage || 'en-US', {
      timeZone: req.headers['x-timezone'] || Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
    systemLocales: Intl.DateTimeFormat().resolvedOptions(),
  }
}

// 请求信息格式化
const formatRequestInfo = (req) => ({
  timestamp: new Date().getTime(),
  version,
  request: {
    method: req.method,
    url: req.url,
    path: req.path,
    protocol: req.protocol,
    host: req.get('host'),
    originalUrl: req.originalUrl,
  },
  client: {
    ip: req.ip,
    ips: req.ips,
    userAgent: {
      raw: req.headers['user-agent'],
      browser: req.useragent.browser,
      version: req.useragent.version,
      os: req.useragent.os,
      platform: req.useragent.platform,
      isMobile: req.useragent.isMobile,
      isDesktop: req.useragent.isDesktop,
      isBot: req.useragent.isBot,
    },
  },
  locale: getLocaleInfo(req),
  headers: req.headers,
  params: req.params,
  query: req.query,
  body: req.body,
  cookies: req.cookies,
})

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     description: Upload a single file with additional request information
 *     tags: [Files]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: header
 *         name: accept-language
 *         schema:
 *           type: string
 *         description: Preferred language
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *         description: Client timezone
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// app.post('/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({
//       success: false,
//       code: 400,
//       msg: 'No file uploaded',
//     })
//   }

//   res.json({
//     success: true,
//     code: 200,
//     msg: 'File uploaded successfully',
//     data: {
//       file: {
//         originalname: req.file.originalname,
//         filename: req.file.filename,
//         size: req.file.size,
//         mimetype: req.file.mimetype,
//         path: req.file.path,
//       },
//       ...formatRequestInfo(req),
//     },
//   })
// })

/**
 * @swagger
 * /{path}:
 *   get:
 *     summary: Get request information
 *     description: Returns detailed information about the request
 *     tags: [Info]
 *     parameters:
 *       - in: path
 *         name: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Any path
 *       - in: header
 *         name: accept-language
 *         schema:
 *           type: string
 *         description: Preferred language
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *         description: Client timezone
 *     responses:
 *       200:
 *         description: Request information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */
app.all('*', (req, res) => {
  res.json({
    success: true,
    code: 200,
    msg: 'Success!',
    data: formatRequestInfo(req),
  })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 404,
    message: 'NOT FOUND!',
  })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error(err)

  res.status(err.status || 500).json({
    success: false,
    code: err.status || 500,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 创建 uploads 目录
import { mkdir } from 'fs/promises'
try {
  await mkdir('uploads', { recursive: true })
} catch (err) {
  console.error('Error creating uploads directory:', err)
}

// 启动服务器
app.listen(port, () => {
  console.log(`
    ${chalk.blue('🚀 Server is running!')}
    
    ${chalk.green('URLs:')}
    ${chalk.cyan('Local:')}      http://localhost:${port}
    ${chalk.cyan('Upload:')}     http://localhost:${port}/upload
    ${chalk.cyan('API Docs:')}   http://localhost:${port}/api-docs
    
    ${chalk.green('Environment:')}
    ${chalk.cyan('Mode:')}       ${process.env.NODE_ENV || 'development'}
    ${chalk.cyan('Port:')}       ${port}
    ${chalk.cyan('Locale:')}     ${Intl.DateTimeFormat().resolvedOptions().locale}
    ${chalk.cyan('Timezone:')}   ${Intl.DateTimeFormat().resolvedOptions().timeZone}
    
    ${chalk.yellow('Press CTRL-C to stop')}
  `)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Performing graceful shutdown...')
  process.exit(0)
})
