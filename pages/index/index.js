//index.js
//获取应用实例
const app = getApp()
const Zan = require('../../dist/index');
// const io = require('../../utils/socket/weapp.socket.io.js')

// const socket = io('http://192.168.0.115:7001')
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
    tip: '欢迎使用蓝翔环保一体化智能截污井',
    usname: '',
    uspassword: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {
    var userName = wx.getStorageSync('userName');
    var userPassword = wx.getStorageSync('userPassword');
      console.log(userName);
      console.log(userPassword);
      if (userName) {
        this.setData({ usname: userName });
      }
      if (userPassword) {
        this.setData({ uspassword: userPassword });
      }
    // socket.emit('index', '123456');
    // socket.on('res', msg => {
    //   console.log('res from server: %s!', msg);
    // });
  },
  editpassword: function () {
    wx.navigateTo({
      url: '../editPassword/editPassword'
    })
  },
  formSubmit: function (event) {
    wx.navigateTo({
      url: '../addDevice/addDevice'
    })
    return
    console.log(event.detail.value);
    const that = this;
    if (!event.detail.value.name || !event.detail.value.password) {
      that.setData({
        message: '请输入帐号密码'
      })
    }else{
      wx.request({
        url: 'http://192.168.0.115:7001/user/login',
        method: 'POST',
        data: {
          name: event.detail.value.name,
          password: event.detail.value.password
        },
        success: function (result) {
          wx.setStorageSync("sessionid", result.header["set-cookie"])
          wx.setStorageSync("userName", event.detail.value.name);
          wx.setStorageSync("userPassword", event.detail.value.password);
          if (result.data.code == 1) {
            that.data.message = '登录成功';
            wx.navigateTo({
              url: '../addDevice/addDevice'
            })
          } else {
            that.setData({
              message: '帐号或密码错误'
            })
          }
        },
      })
    }
    console.log()
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
