//index.js
//获取应用实例
const app = getApp()
const Zan = require('../../dist/index');
// const io = require('../../utils/socket/weapp.socket.io.js')

// const socket = io('http://192.168.0.115:7001')
Page(Object.assign({}, Zan.Field,{
  data: {
    base: {
      name: {
        focus: true,
        title: '帐号',
        placeholder: '请输入帐号',
      },
      password: {
        title: '密码',
        placeholder: '请输入密码',
      }
    },
    motto: '一体化智能截污井',
    tip: '本产品需微信授权登录，请点击上方按钮进行授权',
    name: '',
    password: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  adddevice:function() {
    const that = this;
    if (that.data.hasUserInfo) {
      wx.navigateTo({
        url: '../addDevice/addDevice'
      })
    } else {
      wx.showModal({
        title: '用户未授权',
        content: '此功能需要微信授权，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: function success(res) {
                that.getUserInfosc();
              }
            });
          }
        }
      })
    }
  },
  onLoad: function () {
    var userName = wx.getStorageSync('userName');
      var userPassword = wx.getStorageSync('userPassword');
      console.log(userName);
      console.log(userPassword);
      if (userName) {
         this.setData({ userName: userName });
      }
      if (userPassword) {
         this.setData({ userPassword: userPassword });
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
  formSubmit: function () {
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
