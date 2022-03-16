// pages/chang/chang.js
const db = wx.cloud.database()
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isshow:true,//判断是否有数据
        booksList:[],//官方文章
        list:[],//我的收藏
    },

    //获得官方的列表
    getAdmin() {
        wx.showLoading({
          title: '小梗正在加载中',
        })
        wx.cloud.callFunction({
                // 云函数名称
                name: 'getAdmin',
                // 传给云函数的参数
                data: {},
            })
            .then(res => {
                console.log("官方文章列表：", res);
                this.setData({
                    booksList:res.result.data
                })
                this.getchangUser()

            })
    },

    // 获得本人收藏的书id
    // --------  查询自己的收藏书的id ------
    getchangUser() {
    
        db.collection("chang").where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            console.log('收藏文章', res);
            if(res.data.length>0){
                console.log(111111111);
                this.setData({
                    isshow:false
                })
            }
            let changList=res.data 
            let list=[]
            this.data.booksList.forEach(e => {
                 changList.forEach(x=>{
                     if(e._id == x.booksid){
                         e.status=1   //改变为状态
                        list.push(e)
                     }
                 })
            });
            this.setData({
                list
            })
             wx.hideLoading()
            console.log("我的收藏：",list);
            

        })

    },

  // 点击取消时，获得当前list的index和词语的id，用index删除当前List，并调用删除收藏表chang为词语id和用户openid
  delChang(e){
    let idx = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    console.log(idx,id);

    Dialog.confirm({
        title: '提示',
        message: '是否取消收藏？',
      })
        .then(() => {
         let list=this.data.list
         list.splice(idx,1)
         this.setData({
             list
         })
          if(list.length<1){
              this.setData({
                  isshow:true
              })
          }   

         wx.cloud.callFunction({
            // 云函数名称
            name: 'delChang',
            // 传给云函数的参数
            data: {
                openid:wx.getStorageSync('openid'),
                booksid:id
            },
        })
        .then(res=>{
          console.log(res);
            
        })



        })
        .catch(() => {
          // on cancel
        });


  },

      //跳到官方详情页
      admin_detail(e) {
        console.log(e);
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/home/home-detailTwo/home-detailTwo?id=' + id,
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