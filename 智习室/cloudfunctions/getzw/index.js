// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-5gpw94u719cc406f'
})
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("tsgzw").get()
}