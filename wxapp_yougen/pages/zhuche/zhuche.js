// pages/zhuche/zhuche.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avg:1,//性别
        name:'',
        phone:'',
        code:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },


    // 单选
    radioSelect(e){
        console.log(e);
        let idx= parseInt(e.detail.value)
       
        this.setData({
            avg:idx
        })
    },


    adduser(){
    if(!this.data.phone || !this.data.name || !this.data.avg){
        return wx.showToast({
          title: '请输入信息',
          icon:'error',
          duration:2000
        })
    }
        // this.codePd()
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
         console.log(res);
           this.setData({
               avatarUrl:res.userInfo.avatarUrl
           })

           this.zhuche()

          },
          fail:(err)=>{
              wx.showToast({
                title: '请先授权信息',
                icon:'error'
              })
          }
        })

    },


    // 注册接口
    zhuche(){

        let code=0
        if(this.data.phone==19977406956 || this.data.phone==18276423503 || this.data.phone==17776584970 || this.data.phone==18078087180 || this.data.phone==18648836810 ){
            code=1
        }else{
            code=0
        }

        var that =this
        db.collection("user").add({
            data: {
                phone: that.data.phone,
                avatarUrl: that.data.avatarUrl,
                name: that.data.name,
                avg:that.data.avg,
                code:code
            }
        }).then(res => {
            console.log(res);
            //成功
            if (res.errMsg == "collection.add:ok") {
                wx.showToast({
                    title: '注册成功！',
                })

                var app=getApp()
                app.getUser()

                setTimeout(function () {
                    wx.switchTab({
                        url: '/pages/home/home'
                    })
                }, 3000)
            }

        })
    },


    // 判断固定手机号
    // codePd(){
     
    // },
   


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