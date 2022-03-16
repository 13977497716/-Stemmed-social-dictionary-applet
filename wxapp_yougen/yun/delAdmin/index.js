// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-3grz6s3abea04859'
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var id=event.id
   
        try {
          return await db.collection('books').where({
            _id: id
          }).remove().then(res=>{
              db.collection('chang').where({
                booksid:id
              }).remove()
          })
        } catch(e) {
          console.error(e)
        }
      
}