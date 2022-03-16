// pages/mai/mai.js
const app = getApp().globalData
Page({

    /**
     * 页面的初始数据
     */
    data: {
        height: app.navHeight,
        isLogin: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     
    },

    //登录页
    dl() {
        wx.navigateTo({
            url: '../zhuche/zhuche',
        })
    },

// 获得用户信息
// getuser(){
//     wx.showLoading({
//         title: '正在加载中...',
//       })
//     wx.cloud.callFunction({
//         // 云函数名称
//         name: 'getmai',
//         // 传给云函数的参数
//         data: {
//             openid: wx.getStorageSync('openid')
//         },
//     }).then(res=>{
//         console.log(res.result.data[0]);
//         if(res.result.data.length>0){
//             this.setData({
//                 objs:res.result.data[0],
//                 isLogin: true
//             })
//         }
//         wx.hideLoading()
//     })
// },

    //跳转到官方
    jake(e) {
        let idx = e.currentTarget.dataset.index
        let islo=this.isLoing()
        if(islo != 1){
            return
        }
        
        if (idx == 0) {
            wx.navigateTo({
                url: '/pages/userbook/userbook',
            })
        } else if (idx == 1) {
            wx.navigateTo({
                url: '/pages/chang/chang',
            })
        } else if (idx == 2) {
            wx.navigateTo({
                url: '/pages/admin/admin',
            })
        } else {
            console.log(e);
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },


    clickNav(e) {
        let idx = parseInt(e.currentTarget.dataset.index)
        console.log(e);
        switch (idx) {
            case 0:
               wx.navigateTo({
                 url: '/pages/news/news',
               })
               break;
            case 1:
                wx.makePhoneCall({
                    phoneNumber: '19977406956',
                  })
                  break;
            case 2:
                wx.navigateTo({
                    url: '/pages/guanyu/guanyu',
                  })
                  break;
            default:
                break;
        }
    },


    // 判断是否注册
    isLoing(){
        if(app.isLoing==true){  
            return 1
        }else{
            wx.showModal({
                title: '提示',
                content: '你还未注册，是否前往注册？',
                success (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/zhuche/zhuche',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            return 0
        }
       },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // this.getuser()
        if (app.userInfo != null) {
            this.setData({
                objs: app.userInfo,
                isLogin: true
            })

        }

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