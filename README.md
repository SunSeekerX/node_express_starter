# node-express-starter

> 在线访问测试：[https://express.yoouu.cn/](https://express.yoouu.cn/)

## 📌 简介

NodeJS Express api 项目启动模板。集成常用依赖，以及提交代码格式化、代码校验等。

- `chalk` 彩色控制台打印
- `cookie-parser` cookie 解析
- `cors` 允许跨域访问
- `internal-ip` 获取内网 ip
- `morgan` 请求日志中间件

## 📌 快速上手

**克隆项目**

```shell
git clone https://github.com/SunSeekerX/node-express-starter.git
```

**进入项目目录**

```shell
cd node-express-starter
```

**安装依赖**

```shell
yarn
# or npm
npm i
```

**启动运行**

```shell
yarn serve
# or npm
npm run serve
```

## 📌 部署

### Docker

**构建镜像**

> 请确保构建环境已经安装了 docker！

```shell
yarn build:docker
```

**查看镜像**

```shell
docker images
```

```
REPOSITORY             TAG       IMAGE ID       CREATED         SIZE
node-express-starter   latest    5961aa33df6f   3 minutes ago   152MB
```

**运行镜像**

> `/Users/ssx/code/nodejs/node-express-starter/env.production.yaml` 为你的配置文件路径。

```shell
docker run -d -p 3000:3000 --name=node-express-starter -v /Users/ssx/code/nodejs/node-express-starter/env.production.yaml:/app/env.production.yaml --restart=always node-express-starter
```

### pm2

```
pm2 start ecosystem.config.js --env production
```
