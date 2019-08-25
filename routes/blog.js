const router = require('koa-router')()
const fs = require('fs')
const {getList, getDetail, newBlog, updateBlog, delBlog, likeBlog, favorBlog, getFavorList} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

//登录验证的中间件
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')
// 博客列表
router.get('/list', async function(ctx, next) {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keywords || ''

  if(ctx.query.isadmin){
    if(ctx.session.username == null){
      ctx.body = new ErrorModel('未登录')
      return
    }
    // 强制查询自己的博客
    author = ctx.session.username
  }
  
  const listData = await getList(author, keyword)
  ctx.body = new SuccessModel(listData)
})
//博客详情
router.get('/detail', async function(ctx, next){
  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(data)
})
// 新增一篇博客
router.post('/new', loginCheck, async function(ctx, next){
  const body = ctx.request.body
  body.author = ctx.session.username
  body.authorNickname = ctx.session.nickname
  const data = await newBlog(body)
  ctx.body = new SuccessModel(data)
})
// 上传博客图片
router.post('/upload', async function(ctx, next){
 // 上传单个文件
 const file = ctx.request.files.file; // 获取上传文件
 // 创建可读流
 const reader = fs.createReadStream(file.path);
 let filePath = `/home/wwwroot/default/upload/${file.name}`;
 // 创建可写流
 const upStream = fs.createWriteStream(filePath);
 // 可读流通过管道写入可写流
 reader.pipe(upStream);
//  return ctx.body = "上传成功！";
 return ctx.body = new SuccessModel({
   imgurl: `http://176.122.153.101/upload/${file.name}`
 })
})
// 博客更新
router.post('/update', loginCheck, async function(ctx, next){
  const val = await updateBlog(ctx.query.id, ctx.request.body)
  if(val){
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('更新博客失败')
  }
})
// 博客删除
router.post('/del', loginCheck, async function(ctx, next){
  const author = ctx.session.username
  const val = await delBlog(ctx.query.id, author)
  if(val){
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('删除博客失败')
  }
})
//点赞
router.post('/like', loginCheck, async function(ctx, next){
  const data = await likeBlog(ctx.request.body)
  if(data){
    ctx.body = new SuccessModel('点赞成功')
  }else{
    ctx.body = new ErrorModel('点赞失败')
  }
})
//收藏
router.post('/favor', loginCheck, async function(ctx, next){
  const data = await favorBlog(ctx.request.body)
  if(data){
    ctx.body = new SuccessModel('收藏成功')
  }else{
    ctx.body = new ErrorModel('收藏失败')
  }
})

// 获取收藏列表
router.get('/favorList', loginCheck, async function(ctx, next){
  // 强制查询自己的收藏
  userId = ctx.session.userId
  const listData = await getFavorList(userId)
  ctx.body = new SuccessModel(listData)
})
module.exports = router
