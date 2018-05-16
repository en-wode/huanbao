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
    console.log(1);
    console.log(wx.getStorageSync("sessionid"));
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: 'http://192.168.0.115:7001/equipment/list',
      method: 'GET',
      header: header,
      data: {
        userId: 1
      },
      success: function (result) {
        if (result.data.code == 2000) {
          console.log('false')
        }
        console.log(result);
      }
    })
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
          url: '../model/model?id=' + that.data.id
        });
        break;
      case 4:
        wx.navigateTo({
          url: '../chartList/chartList?id=' + that.data.id
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
