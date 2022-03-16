// pages/fx/fx-detail/fx-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isshow:true,
        value: "",
        setList: [],
        list:[], //排序后
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '小梗正在加载中...',
          })
    },

    //获取查询记录
    getssList() {
        if (wx.getStorageSync('ssList')) {
            let list = wx.getStorageSync('ssList')
            list.reverse()
            if(list.length>0){
                 this.setData({
                     isshow:false,
                     list
                 })
            }
        
          
        } else {
            let list = []
            wx.setStorageSync('ssList', list)
        }
    },

    //搜索查询
    selectList(e) {

        let value = e.detail //搜索值
        if (value == "") {
            return wx.showToast({
                title: '请先输入内容',
                icon: 'error'
            })
        }
        

        let list = wx.getStorageSync('ssList')
        
        let idx = list.indexOf(value) //获得内容所在的index，没有内容的话就-1
        if (idx == -1) {
            list.push(value)
        } else {
            list.splice(idx, 1)
            list.push(value)
        }

        wx.setStorageSync('ssList', list)

        this.jake(value)
    },

    //删除存储记录
    delssList() {
     
        var that=this
        wx.showModal({
            title: '小梗提示',
            content: '是否清空历史记录？',
            success(res) {
                if (res.confirm) {
                    that.setData({
                        list:[],
                        isshow:true
                      })
                   wx.setStorageSync('ssList', [])
                
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })




    },

    //跳转
    jake(e){
        let value=''
        if(e.currentTarget){
           value=e.currentTarget.dataset.value
        }else{
            value=e
        }
        wx.navigateTo({
          url: '../fx-ss/fx-ss?value='+value,
        })
    },



    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    wx.hideLoading()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
     this.getssList()

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