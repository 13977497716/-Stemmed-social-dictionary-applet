// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3grz6s3abea04859'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    // 传用户id查询用户已收藏的
    if(event.id){
     
        db.collection("books").where({

            _id: event.id
      }).get()  
      
    }else{
        return db.collection("books").get()
    }
}