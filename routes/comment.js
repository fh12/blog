const router = require('koa-router')()
const {getComment, addComment, delComment} = require('../controller/comment')
const {SuccessModel, ErrorModel} = require('../model/resModel')

//登录验证的中间件
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/comment')

router.get('/list', async function(ctx, next) {
  const blogId = ctx.query.blogId || ''

  if(ctx.session.username == null){
    ctx.body = new ErrorModel('未登录')
    return
  }
  
  const listData = await getComment(blogId)
  ctx.body = new SuccessModel({
    commentList: listData.data,
    count: listData.count
  })
})

router.post('/add', loginCheck, async function(ctx, next){
  const body = ctx.request.body
  body.nickname = ctx.session.nickname
  const data = await addComment(body)
  if(data.commentId){
    ctx.body = new SuccessModel(data)
  } else {
    ctx.body = new ErrorModel('评论失败')
  }
})

router.post('/del', loginCheck, async function(ctx, next){
  const author = ctx.session.username
  const val = await delComment(ctx.query.id, author)
  if(val){
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('删除评论失败')
  }
})

module.exports = router
