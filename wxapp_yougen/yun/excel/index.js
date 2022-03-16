// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3grz6s3abea04859'
})
var xlsx = require('node-xlsx');
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    let fileID = event.fileID
    let user=event.user
    let date=event.date
    //1,通过fileID下载云存储里的excel文件
    const res = await cloud.downloadFile({
        fileID: fileID,
    })
    console.log('下载的文件',res);
    const file_xlsx = res.fileContent
    //2,解析excel文件里的数据
    var files = xlsx.parse(file_xlsx); //获取到所有sheets
    console.log('xlsx获得的',files);
   console.log('获得标题',files[0].data); 
   
  
   function addfile(i){
        db.collection("books").add({
            data:{
              user:user,
              date:date,
             title:files[0].data[i][0],
             jiesi:files[0].data[i][1],
             laiyuan:files[0].data[i][2],
             yujing:files[0].data[i][3],
             zaoju:files[0].data[i][4],
             status:0,
             num:0
            }
            }).then(res=>{
                i++
                if(i==files[0].data.length){
                    cloud.deleteFile({
                        fileList:[fileID],
                        success(res){
                            return  console.log(res,'删除文件')
                        },
                      })    
                }else{
                    addfile(i)
                }
            })
   }
   addfile(1)
   

}