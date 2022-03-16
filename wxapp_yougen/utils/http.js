//上传图片
const uploadImg = (tempFile) => {
    console.log("要上传图片的临时路径", tempFile)
    return new Promise((resolve, reject) => {
    let timestamp = (new Date()).valueOf()
    wx.cloud.uploadFile({
            cloudPath: +timestamp + '.png', //云存储的路径，开发者自定义
            filePath: tempFile, // 文件路径
        }).then(res => {
            console.log("上传成功", res)
            resolve(res.fileID)
        })
       
    })
}
//上传Excel文件（作为数据导入模板下载）
const uploadfile= (tempFile) => {
    console.log("要上传文件的临时路径", tempFile)
    return new Promise((resolve, reject) => {
    let timestamp = (new Date()).valueOf()
    wx.cloud.uploadFile({
            cloudPath: +timestamp + '.xls', //云存储的路径，开发者自定义
            filePath: tempFile, // 文件路径
        }).then(res => {
            console.log("上传成功xls", res)
            resolve(res.fileID)
        })
       
    })
}
exports.uploadfile = uploadfile;
exports.uploadImg = uploadImg;
