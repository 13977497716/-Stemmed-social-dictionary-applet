// pages/admin/add_admin/add_admin.js
//引入node-xlsx库文件 分析Excel文件
import {
  uploadfile
} from '../../../utils/http.js'
const app = getApp().globalData
const moment = require('../../../utils/moment.min')
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({

    /**
     * 页面的初始数据
     */
    data: {
       title:'',
       jiesi:'',
       laiyuan:'',
       zaoju:'',
       yujing:''
    },

   addAdmin(){
       
  if(this.data.title=="" || this.data.jiesi=="" ){
    return Dialog.alert({
        title: '提示',
        message: '发布的词或释义不能为空哦~',
        theme: 'round-button',
    }).then(() => {
        // on close
    });
  }

  
  Dialog.confirm({
    title: '温馨提示',
    message: '是否确定发布？',
  })
    .then(() => {
      // on confirm
      wx.showLoading({
        title: '正在发布中',
      })
        // 时间
        var now = moment().format('YYYY-MM-DD') // 当前日期
        wx.cloud.callFunction({
            // 云函数名称
            name: 'addAdmin',
            // 传给云函数的参数
            data: {
                user:app.userInfo,
                title:this.data.title,
                jiesi:this.data.jiesi,
                laiyuan:this.data.laiyuan,
                zaoju:this.data.zaoju,
                yujing:this.data.yujing,
                date:now
            },
        })
        .then(res=>{
            console.log(res);
               wx.showToast({
                 title: '发布成功',
               })
               this.setData({
                title:'',
                jiesi:'',
                laiyuan:'',
                zaoju:'',
                yujing:''
               })
               wx.hideLoading()
        })


    })
    .catch(() => {
      // on cancel
    });


 

   },

   //选择下载后的excle模板文件
   addAdminSum(){
    var that=this
    wx.chooseMessageFile({
      count: 10,
      type: 'file',
      success (res) {
         wx.showLoading({
           title: '正在批量发布中...',
         })
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        const path = res.tempFiles[0].path
        // console.log(path);
          uploadfile(path).then(res=>{
            
               that.jiexi(res)//将文件id传到解析方法进行添加模板添加
           })
      }
    })
   },

   //调用自己创建excel云函数解析excel，now是发布日期
   jiexi(fileID){
    var now = moment().format('YYYY-MM-DD') // 当前日期
     wx.cloud.callFunction({
       name:"excel",
       data:{
         fileID:fileID,
         user:app.userInfo,
         date:now
       },
       success:res=>{
         wx.hideLoading()
         console.log('解析并上传成功',res);
         wx.showToast({
           title: '导入发表成功',
           icon:'success',
         })
         
       },
        fail:err=>{
          console.log('解析失败',err);
        }
     })
   },


  //  下载文件模板（选择自己的云存储fileID）
  xiazai(){
    var  that=this
    let fileID="cloud://yougen-7ggncse0d1515054.796f-yougen-7ggncse0d1515054-1307947275/3231241.xlsx"

    wx.showLoading({
      title: '正在打开中...',
    })
 //第一步是获取存储在云端的文件
 wx.cloud.downloadFile({
  fileID: fileID,

  success(res) {
    console.log("成功回调之后的res对象", res)
    if (res.statusCode === 200) {
//第二步是将文件下载到本地缓存
      wx.saveFile({
        tempFilePath: res.tempFilePath,
        success(res) {
          console.log(res)
          wx.hideLoading()
          that.setData({
            savedFilePath: res.savedFilePath
          })

          // 第三步是打开下载好本地的文件
          wx.openDocument({
            filePath: res.savedFilePath,
            success: function (res) {
              console.log('打开文档成功')
                wx.hideLoading()
            },
            fail: function (err) {
              console.log(err)
            }
          })

        }
      })
    }
  }
})


  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})