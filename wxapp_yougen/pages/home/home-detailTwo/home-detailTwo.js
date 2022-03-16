// pages/home/home-detailTwo/home-detailTwo.js
const app = getApp().globalData
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id
        })
        console.log(options.id);
    },

    //获得官方详情
    getlist() {
        db.collection('books').doc(this.data.id).get().then(res => {
            console.log(res);
            if (res.errMsg == "document.get:ok") {
                this.setData({
                    objs: res.data
                })
                this.uppmun()
                this.getChang() //判断循环是否收藏
            } else {
                wx.showToast({
                    title: '小梗出了点问题~~',
                    icon: 'none'
                })
            }
        })


    },


    //获取收藏表
    getChang() {
        db.collection("chang").where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            console.log('收藏文章', res);

            let changList = res.data
            let objs = this.data.objs
            changList.forEach(e => {
                if (e.booksid == objs._id) {
                    objs.status = 1
                }
            });

            this.setData({
                objs
            })
            wx.hideLoading()
            console.log("我的收藏：", objs);
        })
    },



    //用户收藏官方
    serChang(e) {
        let idx = e.currentTarget.dataset.index
        let key = e.currentTarget.dataset.key //判断是收藏还是不收藏按钮
        let id = e.currentTarget.dataset.id
        console.log('第几个', idx, '点赞还是取消' + key, id);
        let objs = this.data.objs

        if (key == 0) { //收藏
            objs.status = 1
            db.collection("chang").add({
                data: {
                    booksid: id,
                    user: app.userInfo
                }
            }).then(res => {
                console.log('添加收藏', res)
            })
        } else {
            objs.status = 0
            db.collection('chang').where({
                booksid: id,
                _openid: wx.getStorageSync('openid')
            }).remove().then(res => {
                console.log('删除收藏', res);

            })
        }
        this.setData({
            objs
        })
    },

    uppmun() {
      var that =this
        wx.cloud.callFunction({
            // 云函数名称
            name: 'uppBooks',
            // 传给云函数的参数
            data: {
                id:that.data.id
            },
        })
        .then(res=>{
            console.log(res);
        })

    },

    //增加该词语修改访问


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getlist()

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