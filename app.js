const Koa = require('koa')
const app = new Koa()
// const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const koaBody = require('koa-body');
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')
const blog = require('./routes/blog')
const user = require('./routes/user')
const comment = require('./routes/comment')

const {REDIS_CONF} = require('./conf/db')

// error handler
onerror(app)

//上传文件
app.use(koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}));
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())
app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// 写访问日志
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境 / 测试环境
  app.use(morgan('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }));
}
// session配置
app.keys = ['WJol_8766#']
app.use(session({
  // 配置cookies
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24*60*60*1000
  },
  // 配置redis
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))
// routes
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(comment.routes(), comment.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
