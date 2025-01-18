module.exports = {
  apps: [
    {
      script: 'src/app.js',
      watch: false,
      min_uptime: '60s',
      max_restarts: 3,
      time: true,
      error_file: './logs/err.log',
      out_file: './logs/app.log',

      // 开发环境
      env: {
        name: 'node_express_starter_dev',
        NODE_ENV: 'development',
        APP_ENV: 'development',
        TZ: 'Asia/Shanghai',
      },

      // 测试环境
      env_test: {
        name: 'node_express_starter_test',
        NODE_ENV: 'test',
        APP_ENV: 'test',
        TZ: 'Asia/Shanghai',
      },

      // 生产环境
      env_production: {
        name: 'node_express_starter_prod',
        NODE_ENV: 'production',
        APP_ENV: 'production',
        TZ: 'Asia/Shanghai',
      },
    },
  ],
}
