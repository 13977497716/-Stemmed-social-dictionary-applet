// pages/home/home-detail/home-detail.js
const app = getApp().globalData
const db = wx.cloud.database()
const moment = require('../../../utils/moment.min')
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        objs: null,
        plshow: true,

        zanlist: [], //该详情的赞内容
        pllist: [], //该详情的评论列表
        user: null, //个人信息,
        textarea: '',
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            id: options.id,
            user: app.userInfo,
 
        })

    },


    //获得详情数据(通过id查询一个数据)
    getlist() {
        db.collection('book').doc(this.data.id).get().then(res => {
            console.log(res);
            if (res.errMsg == "document.get:ok") {
                this.setData({
                    objs: res.data
                })
                this.uppmun()
                this.isZan_xq() //判断循环是否点赞
            } else {
                wx.showToast({
                    title: '小梗出了点问题~~',
                    icon: 'none'
                })
            }
        })


    },

    //获取点赞人员
    getZan_xq() {

        wx.cloud.callFunction({
            // 云函数名称
            name: 'getZan_xq',
            // 传给云函数的参数
            data: {
                id: this.data.id
            },
        }).then(res => {
            this.setData({
                zanlist: res.result.data
            })
            console.log("详情点赞信息", res.result.data);
        })
    },
    //获得评论人员
    getPl() {
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getPl',
            // 传给云函数的参数
            data: {
                id: this.data.id
            },
        }).then(res => {
            this.setData({
                pllist: res.result.data
            })
            wx.hideLoading()
            console.log("详情点赞信息", res.result.data);
        })
    },

    //判断该词语详情是否有点赞
    isZan_xq() {
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getZan',
            // 传给云函数的参数
            data: {
                id: wx.getStorageSync('openid')
            },
        }).then(res => {
            wx.hideLoading()
            console.log('点赞', res.result.data);
            let zanList = res.result.data
            let objs = this.data.objs

            zanList.forEach(x => {
                if (objs._id == x.bookid) {
                    objs.zan = 1
                }
            })

            this.setData({
                objs
            })
        })
    },
    //用户点赞
    onZan(e) {
        let islo=this.isLoing()
        if(islo != 1){
            return
        }

        let idx = e.currentTarget.dataset.index
        let key = e.currentTarget.dataset.key

        console.log('第几个', idx, '点赞还是取消' + key, "词语id：", this.data.objs._id);
        let objs = this.data.objs

        if (key == 0) {
            objs.zan = 1
            db.collection("zan").add({
                data: {
                    bookid: objs._id,
                    user: app.userInfo
                }
            }).then(res => {
                console.log('存储点赞', res)
             
                this.getZan_xq() //刷新点赞
            })
        } else {
            objs.zan = 0
            db.collection('zan').where({
                bookid: objs._id,
                _openid:wx.getStorageSync('openid')
            }).remove().then(res => {
                console.log(res);
             
                this.getZan_xq() //刷新点赞
            })
        }
        this.setData({
            objs

        })
    },




    //发表个人评论
    addPl() {
        if (this.data.textarea == "") {
            return Dialog.alert({
                title: '提示',
                message: '请输入发表的评论内容',
                theme: 'round-button',
            }).then(() => {
                // on close
            });
        }

          wx.showLoading({
            title: '正在发布..',
          })
        var now = moment().format('YYYY-MM-DD') // 当前日期
        wx.cloud.callFunction({
            // 云函数名称
            name: 'addPl',
            // 传给云函数的参数
            data: {
                bookid: this.data.id,
                pltext: this.data.textarea,
                user: this.data.user,
                date: now
            },
        }).then(res => {
            console.log(res);

            wx.showToast({
                title: '评论成功',
            })
            this.setData({
                plshow: true,
                textarea: ''
            })
            this.getPl()

        })
    },


    //评论显示
    pl(e) {
        let islo=this.isLoing()
        if(islo != 1){
            return
        }

        console.log(e);
        let idx = e.currentTarget.dataset.index
        if (idx == 0) {
            this.setData({
                plshow: false
            })
        } else {
            this.setData({
                plshow: true
            })
        }
    },
    aa() {
        console.log(111);
    },


    //增加该词语修改访问
    uppmun() {
        var that =this
        wx.cloud.callFunction({
            // 云函数名称
            name: 'uppBook',
            // 传给云函数的参数
            data: {
                id:that.data.id
            },
        })
        .then(res=>{
            console.log(res);
        })

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
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function () {

},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function () {
    this.getlist()
    this.getZan_xq()
    this.getPl()
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