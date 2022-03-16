// pages/fx/fx-ss/fx-ss.js
const app = getApp().globalData
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: '', //穿过来的值
        list: '', //查询到的列表
        isshow: '', //空信息提示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            value: options.value
        })
        console.log(this.data.value);
    },


    //----------------有梗---------------

    //查询有梗
    selectBook() {
        wx.showLoading({
            title: '小梗正在查询中...',
        })
        db.collection("book").where({
            bookname: db.RegExp({
                regexp: this.data.value,
                options: 'i'
            })
        }).get().then(res => {
          
       
            this.setData({
                list: res.data,
              
            })
            this.getZan()


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

    //获取点赞表
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





    // -------------官方-------------------
    //查询官方
    selectBooks() {
        wx.showLoading({
            title: '小梗正在查询中...',
        })
        db.collection("books").where({
            title: db.RegExp({
                regexp: this.data.value,
                options: 'i'
            })
        }).get().then(res => {
              
            if(res.data.length>0){
                this.setData({
                    isshow:false
                })
            }else{
                this.setData({
                    isshow:true
                })
            }
            this.setData({
                listTwo: res.data,

            })
            this.getChang()
            console.log(this.data.list);

        })
    },

    //获取收藏表
    getChang() {
        db.collection("chang").where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            console.log('收藏文章', res);

            let changList = res.data
            let listTwo = this.data.listTwo
            this.data.listTwo.forEach((e, i) => {
                changList.forEach(x => {
                    if (e._id == x.booksid) {

                        listTwo[i].status = 1
                    }
                })
            });

            this.setData({
                listTwo
            })
            wx.hideLoading()
            console.log("我的收藏：", listTwo);
        })
    },



    //用户收藏官方
    serChang(e) {
        let idx = e.currentTarget.dataset.index
        let key = e.currentTarget.dataset.key //判断是收藏还是不收藏按钮
        let id = e.currentTarget.dataset.id
        console.log('第几个', idx, '点赞还是取消' + key, id);
        let listTwo = this.data.listTwo

        if (key == 0) { //收藏
            listTwo[idx].status = 1
            db.collection("chang").add({
                data: {
                    booksid: id,
                    user: app.userInfo
                }
            }).then(res => {
                console.log('添加收藏', res)
            })
        } else {
            listTwo[idx].status = 0
            db.collection('chang').where({
                booksid: id,
                _openid:wx.getStorageSync('openid')
            }).remove().then(res => {
                console.log('删除收藏', res);

            })
        }
        this.setData({
            listTwo
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

      //跳到官方详情页
  admin_detail(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
        url: '/pages/home/home-detailTwo/home-detailTwo?id=' + id,
    })
},

    // 点击标签判断是否有数据
    click(e){
        console.log(e);
        let idx=e.detail.index
        if(idx==0){
            if(this.data.listTwo.length>0){
                this.setData({
                    isshow:false
                })
            }else{
                this.setData({
                    isshow:true
                })
            }
        }else{
            if(this.data.list.length>0){
                this.setData({
                    isshow:false
                })
            }else{
                this.setData({
                    isshow:true
                })
            }
        }
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
        this.selectBook()
        this.selectBooks()
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