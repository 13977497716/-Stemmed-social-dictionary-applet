// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3grz6s3abea04859'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    return await db.collection('book').doc(event.id)
    .update({
        data: {
            // B 用户自增一
            num: _.inc(1)
        }
    })
}