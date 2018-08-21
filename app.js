//app.js
var util = require('utils/util')
const io = require('utils/socket/weapp.socket.io.js');
// const socket = io('ws://192.168.0.109:7001');
// const socket = io('https://www.lxwater.cn/');

App({
  onLaunch: function () {  
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx1a41365dfd8db183&secret=735495c8678fc2a2473406ea36cb2784&js_code=' + res.code +'&grant_type=authorization_code',
            data: {
              code: res.code
            },
            success: function(result){
              console.log(result)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });

  },
  getLocationInfo: function (cb) {
    var that = this;
    if (this.globalData.locationInfo) {
      cb(this.globalData.locationInfo)
    } else {
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          console.log(res)
          that.globalData.locationInfo = res;
          cb(that.globalData.locationInfo)
        },
        fail: function (err) {
          console.log(err)
          // fail
        },
        complete: function () {
          console.log('complete')
          // complete
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    openId: null,
    locationInfo: null,
    time: null,
    cvtime: null,
    // url: 'http://192.168.0.109:7001/',
    url: 'https://www.lxwater.cn/'
  },
  header: {
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': wx.getStorageSync("sessionid")//读取cookie
  },
  // socket(){
  //   return socket;
  // }
})