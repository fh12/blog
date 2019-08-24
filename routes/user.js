const router = require('koa-router')()
const {login, register, update, like} = require('../controller/user')
const {likeBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
  const {username, password} = ctx.request.body
  const data = await login(username, password)
  if(data.username){
    ctx.session.username = data.username
    ctx.session.nickname = data.nickname
    ctx.body = new SuccessModel(data,'登录成功')
    return
  }
  ctx.body = new ErrorModel('登录失败')
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
//点赞
router.post('/like', async function(ctx, next){
  const data = await like(ctx.request.body)
  if(data){
    const updateBlog = await likeBlog(ctx.request.body)
    if(updateBlog){
      ctx.body = new SuccessModel('点赞成功')
    }else{
      ctx.body = new ErrorModel('点赞失败')
    }
  }else{
    ctx.body = new ErrorModel('点赞失败')
  }
  
})


module.exports = router