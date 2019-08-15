const router = require('koa-router')()
const fs = require('fs')
const {getList, getDetail, newBlog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

//登录验证的中间件
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async function(ctx, next) {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''

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

router.get('/detail', async function(ctx, next){
  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function(ctx, next){
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await newBlog(body)
  ctx.body = new SuccessModel(data)
})

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

router.post('/update', loginCheck, async function(ctx, next){
  const val = await updateBlog(ctx.query.id, ctx.request.body)
  if(val){
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('更新博客失败')
  }
})
router.post('/del', loginCheck, async function(ctx, next){
  const author = ctx.session.username
  const val = await delBlog(ctx.query.id, author)
  if(val){
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('删除博客失败')
  }
})

module.exports = router
