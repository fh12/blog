const {exec} = require('../db/mysql')


const getComment = async (blogId) => {
  // 查询评论
  const sql = `select * from comments where blogId='${blogId}' order by createtime; `
  // 查询总条数
  const sql2 = `select count(0) as count from comments where blogId='${blogId}' `
  // 返回promise
  const data = await exec(sql)
  const count = await exec(sql2)
  // 封装json
  return {
    data,
    count: count[0].count
  }
}

const addComment = async (blogData = {}) =>{
  console.log(blogData)
  const userId = blogData.userId
  const nickname = blogData.nickname || null
  const comment = blogData.comment
  const blogId = blogData.blogId
  const createtime = Date.now()
  
  const sql = `insert into comments (userId, nickname, comment, blogId, createtime) values ('${userId}','${nickname}','${comment}','${blogId}','${createtime}')`
  const insertData = await exec(sql)
  return {
    commentId: insertData.insertId
  }
}

const delComment = async (commentId) =>{
  const sql = `delete from comments where commentId='${commentId}' `
  const delData = await exec(sql)
  if(delData.affectedRows > 0) {
    return true
  }
  return false
}
module.exports = {
  getComment,
  addComment,
  delComment
}