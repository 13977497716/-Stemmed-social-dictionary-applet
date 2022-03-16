// pages/admin/upp_admin/upp_admin.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        key: 0, //是操作官方还是用户
    },

    isshow(e) {

        let key = e.currentTarget.dataset.key
        this.setData({
            show: true,
            key //是操作官方还是用户
        })
        if (key == 0) { //查询官方
            this.getAdmin()
        } else { //查询用户
            this.getBook()
        }
    },



    //查询官方
    getAdmin() {
        wx.showLoading({
            title: '小梗加载中...',
        })
        wx.cloud.callFunction({
                // 云函数名称
                name: 'getAdmin',
                // 传给云函数的参数
                data: {},
            })
            .then(res => {
                console.log('官方', res);
                if (res.result.errMsg == "collection.get:ok") {
                    let list = res.result.data
                    list = list.reverse()
                    this.setData({
                        list
                    })

                } else {
                    wx.showToast({
                        title: '小梗出现了点小问题~',
                        icon: 'none'
                    })
                }

                wx.hideLoading()
            })
    },
    //查询用户
    getBook() {
        wx.showLoading({
            title: '小梗加载中...',
        })
        wx.cloud.callFunction({
                // 云函数名称
                name: 'getBooK',
                // 传给云函数的参数
                data: {},
            })
            .then(res => {

                if (res.result.errMsg == "collection.get:ok") {
                    let list = res.result.data
                    list = list.reverse()
                    this.setData({
                        list
                    })

                } else {
                    wx.showToast({
                        title: '小梗出现了点小问题~',
                        icon: 'none'
                    })
                }
                console.log('用户:', res) // 3
                wx.hideLoading()
            })
            .catch(console.error)
    },

    //删除
    del(e) {
        wx.showLoading({
            title: '正在处理中..',
        })
        var id = e.currentTarget.dataset.id
        console.log(id);
        if (this.data.key == 0) {
            console.log(id);
            wx.cloud.callFunction({
                    name: 'delAdmin',
                    data: {
                        id: id
                    },
                })
                .then(res => {
                    console.log('删除官方', res);
                    this.getAdmin()
                    wx.showToast({
                        title: '删除成功！',
                    })
                })

        } else {
            wx.cloud.callFunction({
                    name: 'delbook',
                    data: {
                        id: id
                    },
                })
                .then(res => {
                    console.log('删除有梗', res);
                    this.getBook()
                    wx.showToast({
                        title: '删除成功！',
                    })
                })
        }
    },



    // ----------------------------------
    onClose() {
        this.setData({
            show: false
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