//index.js
//获取应用实例
const app = getApp()
const Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Field,{
  data: {
    message: '',
    base: {
      name: {
        title: '帐号',
        placeholder: '请输入帐号',
        componentId: 'name'
      },
      password: {
        title: '密码',
        placeholder: '请输入密码',
        inputType: 'password',
        componentId: 'password'
      }
    },
    motto: '一体化智能截污井',
    tip: '欢迎使用蓝翔机电一体化智能截污井',
    usname: '',
    uspassword: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {
    var userName = wx.getStorageSync('userName');
    var userPassword = wx.getStorageSync('userPassword');
      if (userName) {
        this.setData({ usname: userName });
      }
      if (userPassword) {
        this.setData({ uspassword: userPassword });
      }
  },
  editpassword: function () {
    wx.navigateTo({
      url: '../editPassword/editPassword'
    })
  },
  formSubmit: function (event) {
    const that = this;
    if (!event.detail.value.name || !event.detail.value.password || event.detail.value.name =='liuzong') {
      that.setData({
        message: '请输入帐号密码'
      })
    }else{
      wx.request({
        url: app.globalData.url + 'user/login',
        method: 'POST',
        data: {
          name: event.detail.value.name,
          password: event.detail.value.password
        },
        success: function (result) {
          if (result.header["set-cookie"]){
            wx.setStorage({
              key: "sessionid",
              data: result.header["set-cookie"]
            })
          } else {
            wx.setStorage({
              key: "sessionid",
              data: result.header["Set-Cookie"]
            })
          }
          wx.setStorageSync("userId", result.data.result.userId)
          wx.setStorageSync("userName", event.detail.value.name);
          wx.setStorageSync("userPassword", event.detail.value.password);
          if (result.data.code == 1) {
            that.setData({
              message: '登录成功'
            })
            wx.navigateTo({
              url: '../addDevice/addDevice?id=' + result.data.result.userId
            })
          } else {
            that.setData({
              message: '帐号或密码错误'
            })
          }
        },
        fail: function (res) {
          console.log(JSON.stringify(res));
        },
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
    app.userLogin();
  },
  getUserInfosc: function() {
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = res.userInfo;
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.userLogin();
      }
    })
  },
  globalData: {
    userInfo: null
  }
}))
