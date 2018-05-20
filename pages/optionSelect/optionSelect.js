// pages/optionSelect/optionSelect.js
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    equipid: ''
  },
  onLoad: function (options) {
    this.setData({
      equipid: options.equipid
    })
  },
  //事件处理函数
  //功能跳转
  optionSelect: function (options) {
    let that = this;
    let targetid = options.currentTarget.id;
    switch (Number(targetid)) {
      case 1:
        wx.navigateTo({
          url: '../deviceStatus/deviceStatus?equipid=' + that.data.equipid
        });
        break;
      case 2:
        wx.navigateTo({
          url: '../location/location?equipid=' + that.data.equipid
        });
        break;
      case 3:
        wx.navigateTo({
          url: '../model/model?equipid=' + that.data.equipid
        });
        break;
      case 4:
        wx.navigateTo({
          url: '../chartList/chartList?equipid=' + that.data.equipid
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
