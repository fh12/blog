const {exec} = require('../db/mysql')


const getList = async (author, keyword) => {
  let sql = `select id, title, imgurl, createtime from blogs where 1=1 `
  if(author) {
    sql += `and author='${author}' `
  }
  if(keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`
  // 返回promise
  return await exec(sql)
}

const getDetail = async (id) => {
  const sql = `select * from blogs where id='${id}'`
  const rows = await exec(sql)
  return rows[0]
}

const newBlog = async (blogData = {}) =>{
  const title = blogData.title
  const imgurl = blogData.imgurl || null
  const content = blogData.content
  const author = blogData.author
  const authorNickname = blogData.authorNickname
  const authorAvatar = blogData.authorAvatar
  const createtime = Date.now()
  const sql = `insert into blogs (title, content, createtime, author, imgurl, authorAvatar, authorNickname) values ('${title}','${content}',${createtime},'${author}','${imgurl}','${authorAvatar}','${authorNickname}')`
  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}

const updateBlog = async (id, blogData = {}) =>{
  const title = blogData.title
  const content = blogData.content
  const sql = `update blogs set title='${title}', content='${content}' where id=${id}`
  const updatetData = await exec(sql)
  if(updatetData.affectedRows > 0) {
    return true
  }
  return false
}

const delBlog = async (id, author) =>{
  const sql = `delete from blogs where id='${id}' and author='${author}'`
  const delData = await exec(sql)
  if(delData.affectedRows > 0) {
    return true
  }
  return false
}

const likeBlog = async (userData) => {
  userId = userData.userId
  id = userData.id
  const sql1 = `select likes from blogs where id=${id} `
  const likeData = await exec(sql1)
  const likeArr = likeData[0].likes
  if(likeArr.includes(userId)){
    return false
  }else{
    const sql = `update blogs set likes=CONCAT(likes,',','${userId}'),likeCount=likeCount+1  where id=${id} `
    const updatetData = await exec(sql)
    if(updatetData.affectedRows > 0) {
      return true
    }
    return false
  }
}
const favorBlog = async (userData) => {
  userId = userData.userId
  id = userData.id
  const sql1 = `select favor from blogs where id=${id} `
  const favorData = await exec(sql1)
  const favorArr = favorData[0].favor
  if(favorArr.includes(userId)){
    return false
  }else{
    const sql = `update blogs set favor=CONCAT(favor,',','${userId}') where id=${id} `
    const updatetData = await exec(sql)
    if(updatetData.affectedRows > 0) {
      return true
    }
    return false
  }
}
const getFavorList = async (userId) => {
  const sql = `select id, title, imgurl, author from blogs where find_in_set('${userId}',favor) `
  return await exec(sql)
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
  likeBlog,
  favorBlog,
  getFavorList
}