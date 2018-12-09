// pages/optionSelect/optionSelect.js
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    equipid: '',
    equipname: ''
  },
  onLoad: function (options) {
    this.setData({
      equipid: options.equipid,
      equipname: options.equipname
    })
    wx.setNavigationBarTitle({
      title: options.equipname + '号设备功能选择'
    })
  },
  //事件处理函数
  //功能跳转
  optionSelect: function (options) {
    let that = this;
    let targetid = options.currentTarget.id;
    switch (Number(targetid)) {
      case 1:
        if (that.data.equipid == 37) {
          wx.navigateTo({
            url: '../status3/status3?equipid=' + that.data.equipid + '&equipname=' + that.data.equipname
          });
        }else{
          wx.navigateTo({
            url: '../deviceStatus/deviceStatus?equipid=' + that.data.equipid + '&equipname=' + that.data.equipname
          });
        }
        break;
      case 2:
        wx.navigateTo({
          url: '../location/location?equipid=' + that.data.equipid + '&equipname=' + that.data.equipname
        });
        break;
      case 3:
        wx.navigateTo({
          url: '../model/model?equipid=' + that.data.equipid + '&equipname=' + that.data.equipname
        });
        break;
      case 4:
        wx.navigateTo({
          url: '../chartList/chartList?equipid=' + that.data.equipid + '&equipname=' + that.data.equipname
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
