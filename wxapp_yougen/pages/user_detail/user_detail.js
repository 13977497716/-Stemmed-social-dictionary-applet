// pages/user_detail/user_detail.js
const app = getApp().globalData
const db = wx.cloud.database()
import {
    uploadImg
} from '../../utils/http.js'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uppShow: false, //修改框
        //模拟数据
        pickerList: ['男', '女'],
        imager: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    //头像上传到服务器
    chooseImg() {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                console.log("选择成功", res);

                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths

                //调用uploadImg(tempFile)函数，实现图片上传功能
                uploadImg(tempFilePaths[0]).then(res => {
                    console.log('imgid', res);
                    that.upptoux(res)

                })
            }
        })
    },

    //头像更新数据库
    upptoux(value) {
        wx.cloud.callFunction({
            // 云函数名称
            name: 'uppmai',
            // 传给云函数的参数
            data: {
                openid: wx.getStorageSync('openid'),
                name: 'avatarUrl',
                value: value
            },
        }).then(res => {
            console.log(res);

            this.getuser()

        })
    },

    //下拉
    bindPickerChange(e) {
        console.log(e.detail.value);
        let value_idx = parseInt(e.detail.value)
        let idx = value_idx + 1
        wx.cloud.callFunction({
            // 云函数名称
            name: 'uppmai',
            // 传给云函数的参数
            data: {
                openid: wx.getStorageSync('openid'),
                name: 'avg',
                value: idx
            },
        }).then(res => {
            console.log(res);
            wx.showToast({
                title: '更新成功!',
            })
            this.getuser()
        })
    },

    //跳出弹窗修改
    skip(e) {
        // console.log(e);
        let key = e.currentTarget.dataset.key //修改的字段名
        let value = e.currentTarget.dataset.value //修改的字段对应的值

        if (key == 'phone') {
            Notify({
                type: 'warning',
                message: '请谨慎修改手机号'
            });
        }



        this.setData({
            uppShow: true,
            key,
            value
        })
    },
    del() {
        this.setData({
            uppShow: false
        })
    },
    // 修改文本input
    uppinput(e) {
        console.log(e.detail.value);
        this.setData({
            value: e.detail.value
        })
    },


    /*保存修改*/
    submit() {


        let key = this.data.key
        let value = this.data.value
        console.log(key, '：', value)
        wx.cloud.callFunction({
            // 云函数名称
            name: 'uppmai',
            // 传给云函数的参数
            data: {
                openid: wx.getStorageSync('openid'),
                name: key,
                value: value
            },
        }).then(res => {
            console.log(res);
            wx.showToast({
                title: '更新成功!',
            })
            this.getuser()
            this.setData({
                uppShow: false
            })
        })
    },


    // 获得用户信息
    getuser() {
        wx.showLoading({
            title: '正在更新中...',
        })
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getmai',
            // 传给云函数的参数
            data: {
                openid: wx.getStorageSync('openid')
            },
        }).then(res => {
            if (res.result.data.length > 0) {
                this.setData({
                    objs: res.result.data[0],
                    isLogin: true
                })
                app.userInfo = res.result.data[0]
                this.uppZanchang()
            }
            wx.hideLoading()
        })
    },

    //    更新点赞和评论
    uppZanchang() {
        var tath = this
        //评论

        wx.cloud.callFunction({
            // 云函数名称
            name: 'upppl',
            // 传给云函数的参数
            data: {
                openid: wx.getStorageSync('openid'),
                user: tath.data.objs
            },
        }).then(res => {
            //点赞
            wx.cloud.callFunction({
                // 云函数名称
                name: 'uppzan',
                // 传给云函数的参数
                data: {
                    openid: wx.getStorageSync('openid'),
                    user: tath.data.objs
                },
            }).then(res => {
                //有梗
                db.collection("book").where({
                    _openid: wx.getStorageSync('openid')
                }).update({
                    data: {
                        user: tath.data.objs
                    }
                }).then(res => {
                    //官方
                    db.collection("books").where({
                        _openid: wx.getStorageSync('openid')
                    }).update({
                        data: {
                            user: tath.data.objs
                        }
                    }).then(res => {
 

                    })


                })

            })

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
        this.getuser()
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