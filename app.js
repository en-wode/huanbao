//app.js
var util = require('utils/util')
const io = require('utils/socket/weapp.socket.io.js');
// const socket = io('ws://192.168.0.115:7001');
// const socket = io('http://47.98.162.168');
const socket = io('https://www.webxi.cn/');
App({
  onLaunch1: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
  },
  getLocationInfo: function (cb) {
    var that = this;
    if (this.globalData.locationInfo) {
      cb(this.globalData.locationInfo)
    } else {
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          that.globalData.locationInfo = res;
          cb(that.globalData.locationInfo)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    openId: null,
    locationInfo: null,
    // url: 'http://192.168.0.115:7001/'
    url: 'https://www.webxi.cn/'
  },
  header: {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': wx.getStorageSync("sessionid")//读取cookie
  },
  socket(){
    return socket;
  }
})