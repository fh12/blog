const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const login = async (username, password) => {
  username = escape(username)
  //生成加密密码
  password = genPassword(password)
  password = escape(password)
  const sql = `select userId, username, nickname, phone from users where username=${username} and password=${password} `
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

module.exports = {
  login,
  register
}