// pages/home/home.js
const app = getApp().globalData
const db = wx.cloud.database()
const moment = require('../../utils/moment.min')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        height: app.navHeight,
        //list用户列表
        list: [],
        //listTwo官方列表
        listTwo: [],
        tabshow: 0, //导航切换

        ci: '', //发布的词语
        citext: '', //发布的词语解释
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    // 用户发表词语
    addbtn() {
        if (this.data.ci == "" || this.data.citext == "") {
            return Dialog.alert({
                title: '提示',
                message: '请输入发布的内容词语',
                theme: 'round-button',
            }).then(() => {
                // on close
            });
        }

        var that = this
        // 时间
        var now = moment().format('YYYY-MM-DD') // 当前日期

        db.collection("book").add({
            data: {
                openid: wx.getStorageSync('openid'),
                user: app.userInfo, //用户数据 
                bookname: that.data.ci, //词名
                booktext: that.data.citext, //词解释
                date: now, //时间
                zan: 0, //是否点赞了
                num: 0, //点赞数量
            }
        }).then(res => {
            console.log(res);
            if (res.errMsg == "collection.add:ok") {
                wx.showToast({
                    title: '发布成功',

                })
                this.setData({
                    show: false,
                    ci: '',
                    citext: ''
                })
                this.getBook()
            }

        })

    },

    //查询用户book列表
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
                    let arr = res.result.data
                    arr.reverse();
                    this.setData({
                        list: arr
                    })
                    this.getZan() //判断循环是否点赞
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '小梗出现了点小问题~',
                        icon: 'none'
                    })
                }
                console.log('book:', res.result) // 3
            })
            .catch(console.error)
    },

    //用户点赞
    onZan(e) {
        let islo=this.isLoing()
        if(islo != 1){
            return
        }
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



    //---------------------官方----------------//
    //获得官方的列表
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
                let arr = res.result.data
                arr.reverse();
                if (res.result.errMsg == "collection.get:ok") {
                    this.setData({
                        listTwo: arr
                    })
                    this.getChang()
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '小梗出现了点小问题~',
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
        let islo=this.isLoing()
        if(islo != 1){
            return
        }

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


    tab(e) {
        console.log(e);
        let idx = e.currentTarget.dataset.index
        if (idx == 0) {
            this.setData({
                tabshow: 0
            })

        } else {
            this.setData({
                tabshow: 1
            })

        }
    },

    //跳转到有梗详情页
    jake(e) {
        console.log(e);
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: './home-detail/home-detail?id=' + id,
        })
    },

    //跳到官方详情页
    admin_detail(e) {
        console.log(e);
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: './home-detailTwo/home-detailTwo?id=' + id,
        })
    },

    //显示
    showPopup() {
        if(app.isLoing !=true){
             return wx.showModal({
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
              
              
             
        }
        this.setData({
            show: true
        })
    },
    onClose() {
        this.setData({
            show: false
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
        this.getBook()
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
})