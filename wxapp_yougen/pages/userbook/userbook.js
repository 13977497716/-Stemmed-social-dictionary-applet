// pages/userbook/userbook.js
const db = wx.cloud.database()
const app = getApp().globalData
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isshow: true
    },

    // 查询我的有梗列表
    getUserbook() {
        wx.showLoading({
            title: '小梗加载中...',
        })
        db.collection("book").where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {

            console.log('我的发表', res.data);

            if (res.data.length > 0) {
                this.setData({
                    isshow: false
                })
            }
            this.setData({
                list: res.data
            })

            this.getZan()

        })
    },


    getZan() {
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getZan',
            // 传给云函数的参数
            data: {
                id: wx.getStorageSync('openid')
            },
        }).then(res => {

            console.log('点赞', res.result.data);
            let zanList = res.result.data
            let list = this.data.list
            list.forEach((e, i) => {
                zanList.forEach(x => {
                    if (e._id == x.bookid) {
                        list[i].zan = 1
                    }
                })
            })
            this.setData({
                list
            })
            wx.hideLoading()
        })
    },

//用户点赞
onZan(e) {
    let idx = e.currentTarget.dataset.index
    let key = e.currentTarget.dataset.key
    let item = e.currentTarget.dataset.item
    console.log('第几个', idx, '点赞还是取消' + key, item);
    let list = this.data.list

    if (key == 0) {
        list[idx].zan = 1
        db.collection("zan").add({
            data: {
                bookid: item._id,
                user: app.userInfo
            }
        }).then(res => {
            console.log('存储点赞', res)
          
        })
    } else {
        list[idx].zan = 0
        db.collection('zan').where({
            bookid: item._id,
            _openid:wx.getStorageSync('openid')
        }).remove().then(res => {
            console.log(res);
         
        })
    }
    this.setData({
        list,

    })
},



    //跳转到详情页
    jake(e) {
        console.log(e);
        let id = e.currentTarget.dataset.id
                 wx.navigateTo({
                    url: '/pages/home/home-detail/home-detail?id=' + id,
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
        this.getUserbook()
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