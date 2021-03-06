const router = require('koa-router')()
const {login, register, update, like} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
  const {username, password} = ctx.request.body
  const data = await login(username, password)
  if(data.username){
    ctx.session.username = data.username
    ctx.session.nickname = data.nickname
    ctx.session.userId = data.userId
    ctx.body = new SuccessModel(data,'登录成功')
    return
  }
  ctx.body = new ErrorModel('登录失败')
})
router.post('/logout', async function (ctx, next) {
    ctx.session.username = null
    ctx.session.nickname = null
    ctx.session.userId = null
    ctx.body = new SuccessModel('退出登录')
    return
})
router.post('/register', async function (ctx, next) {
  const data = await register(ctx.request.body)
  if(data.id){
    ctx.body = new SuccessModel(data,'注册成功')
    return
  }
  ctx.body = new ErrorModel('注册失败')
})
router.post('/updateUser', async function (ctx, next) {
  const data = await update(ctx.query.userId,ctx.request.body)
  if(data){
    ctx.body = new SuccessModel(data,'修改成功')
    return
  }
  ctx.body = new ErrorModel('修改失败')
})


module.exports = router