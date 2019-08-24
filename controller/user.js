const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const login = async (username, password) => {
  username = escape(username)
  //生成加密密码
  password = genPassword(password)
  password = escape(password)
  const sql = `select userId, username, nickname, phone, avatar, resume, likes from users where username=${username} and password=${password} `
  const rows = await exec(sql)
  return rows[0] || {}
}
const register = async (userData = {}) => {
  username = escape(userData.username)
  const sql1 = `select username from users where username=${username} `
  const isExit = await exec(sql1)
  if(isExit.length !== 0){
    return {}
  }else{
    nickname = escape(userData.nickname) || ''
    phone = userData.phone || null
    //生成加密密码
    password = genPassword(userData.password)
    password = escape(password)
    const sql2 = `insert into users (username, password, phone, nickname) values (${username},${password},${phone},${nickname}) `
    const insertData = await exec(sql2)
    return {
      id: insertData.insertId
    }
  }
}

const update = async (userId, userData = {}) => {
  nickname = escape(userData.nickname) || ''
  phone = userData.phone || ""
  avatar = userData.avatar || ""
  resume = userData.resume || ""
  nickname = escape(userData.nickname) || ''
  phone = userData.phone || null
  const sql = `update users set phone='${phone}', nickname=${nickname}, avatar='${avatar}', resume='${resume}' where userId='${userId}' `
  const updatetData = await exec(sql)
  if(updatetData.affectedRows > 0) {
    return true
  }
  return false
}
const like = async (userData) => {
  userId = userData.userId
  blogId = userData.id
  const sql1 = `select likes from users where userId=${userId} `
  const likeData = await exec(sql1)
  const likeArr = likeData[0].likes
  if(likeArr.includes(blogId)){
    return false
  }else{
    const sql = `update users set likes=CONCAT(likes,',','${blogId}') where userId='${userId}' `
    const updatetData = await exec(sql)
    if(updatetData.affectedRows > 0) {
      return true
    }
    return false
  }
}

module.exports = {
  login,
  register,
  update,
  like
}