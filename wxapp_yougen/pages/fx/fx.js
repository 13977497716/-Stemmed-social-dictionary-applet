// pages/fx/fx.js
const app = getApp().globalData
Page({

    /**
     * 页面的初始数据
     */
    data: {
        height: app.navHeight,
        kuan: app.jnwidth,
        list:[],
        listTwo:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    //   获取有梗列表，并根据点击量来重新排序
    // getBook() {
    //     wx.showLoading({
    //         title: '小梗加载中...',
    //     })
    //     wx.cloud.callFunction({
    //             // 云函数名称
    //             name: 'getBooK',
    //             // 传给云函数的参数
    //             data: {},
    //         })
    //         .then(res => {
    //             if (res.result.errMsg == "collection.get:ok") {

    //                 let list = res.result.data
    //                 var max;
    //                 //遍历数组，默认arr中的某一个元素为最大值，进行逐一比较
    //                 for (let i = 0; i < list.length; i++) {
    //                     //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
    //                     for (let j = i; j < list.length; j++) {
    //                         if (list[i].num < list[j].num) {
    //                             //如果arr[j]大就把此时的值赋值给最大值变量max
    //                             max = list[j];
    //                             list[j] = list[i];
    //                             list[i] = max;
    //                         }
    //                     }
    //                 }
    //                 console.log('排序', list);
    //                 this.setData({
    //                     list
    //                 })
    //                 wx.hideLoading()
    //             } else {
    //                 wx.hideLoading()
    //                 wx.showToast({
    //                     title: '小梗出现了点小问题~',
    //                     icon: 'none'
    //                 })
    //             }
            
    //         })
          
    // },


  //   获取官方列表，并根据点击量来重新排序
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
            if (res.result.errMsg == "collection.get:ok") {

                let list = res.result.data
                var max;
                //遍历数组，默认arr中的某一个元素为最大值，进行逐一比较
                for (let i = 0; i < list.length; i++) {
                    //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
                    for (let j = i; j < list.length; j++) {
                        if (list[i].num < list[j].num) {
                            //如果arr[j]大就把此时的值赋值给最大值变量max
                            max = list[j];
                            list[j] = list[i];
                            list[i] = max;
                        }
                    }
                }
                console.log('排序', list);
                let lists=list.splice(0,10)
                this.setData({
                  listTwo:lists
                })
                wx.hideLoading()
            } else {
                wx.hideLoading()
                wx.showToast({
                    title: '小梗出现了点小问题~',
                    icon: 'none'
                })
            }
        
        })
      
},


    get_detail() {
        wx.navigateTo({
            url: './fx-detail/fx-detail',
        })
    },

      //跳转到详情页
      jake(e) {
        console.log(e);
        let id = e.currentTarget.dataset.id
                 wx.navigateTo({
                    url: '/pages/home/home-detailTwo/home-detailTwo?id=' + id,
                })

    },

    ssnr() {
        this.setData({
            show: true
        })
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
    //    this. getBook()
       this.getAdmin()
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