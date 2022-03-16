// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloud1-3grz6s3abea04859'
    })
    this.getNavbar()
    this.getid()
  },

 //获得openid
 getid(){
  wx.cloud.callFunction({
    name: 'getOpenid',
    data: { }
  }).then(res=>{

    wx.setStorageSync('openid',res.result.openid) //保存用户唯一值
    this.getUser()
  })
 },


 getUser(){
  const db = wx.cloud.database()
  var that=this
  db.collection("user").where({
    _openid: wx.getStorageSync('openid'),
}).get().then(res => {
  console.log("用户数据",res);
  if(res.data.length>0){
      wx.setStorageSync('openid', res.data[0]._openid)
      that.globalData.userInfo=res.data[0]
      that.globalData.isLoing=true
    
  }else{
    that.globalData.userInfo=null
    that.globalData.isLoing=false
    wx.reLaunch({
      url:'/pages/login/login'
    })
      
  }

})

},


    // 获取导航栏信息自定义
    getNavbar() {
      //设置导航栏
      //获取菜单按钮的位置信息
      let menuButtonObject = wx.getMenuButtonBoundingClientRect();
      //获取系统信息
      wx.getSystemInfo({
        success: res => {
          //状态栏的高度
          let statusBarHeight = res.statusBarHeight,
            //胶囊按钮与顶部的距离
            navTop = menuButtonObject.top,
            navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
          this.globalData.navHeight = navHeight; //导航栏高度
          this.globalData.navTop = navTop; //胶囊按钮与顶部的距离
          this.globalData.jnheight = menuButtonObject.height; //胶囊的高度
          this.globalData.jnwidth = menuButtonObject.width; //胶囊的宽度
        },
        fail(err) {
          console.log(err);
        },
      })
    },
    
  globalData: {
    userInfo: null,
    isLoing:false
  }
})
