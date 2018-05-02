// pages/optionSelect/optionSelect.js
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    id: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数 
    this.setData({
      id: options.id
    }) 
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //事件处理函数
  //功能跳转
  optionSelect: function (options) {
    let that = this;
    let targetid = options.currentTarget.id;
    console.log(targetid)
    switch (Number(targetid)) {
      case 1:
        wx.navigateTo({
          url: '../deviceStatus/deviceStatus?id=' + that.data.id
        });
        break;
      case 2:
        wx.navigateTo({
          url: '../deviceDetail/deviceDetail?id=' + that.data.id
        });
        break;
      case 3:
        wx.navigateTo({
          url: '../waterShow/waterShow?id=' + that.data.id
        });
        break;
      case 4:
        wx.navigateTo({
          url: '../dataChart/dataChart?id=' + that.data.id
        });
        break;
    };
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
