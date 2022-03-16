// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3grz6s3abea04859'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return   db.collection("books").add({
        data:{
          user:event.user,
          date:event.date,
         title:event.title,
         jiesi:event.jiesi,
         laiyuan:event.laiyuan,
         zaoju:event.zaoju,
         yujing:event.yujing,
         status:0,
         num:0
        }
        })
}