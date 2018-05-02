//app.js
var util = require('utils/util')
App({
  onLaunch: function () {
    // 展示本地存储能力
    const that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res.authSetting['scope.userInfo']);
        var authSetting = res.authSetting;
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.getUserInfo();
          } else {
            // 没有授权的提醒
            if (util.isEmptyObject(authSetting)) {
              console.log('首次授权');
            } else {
              wx.showModal({
                title: '用户未授权',
                content: '此功能需要微信授权，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function success(res) {
                        that.getUserInfo();
                      }
                    });
                  }
                }
              })
            }
          }
        }
    });
    that.userLogin();
  },
  getUserInfo: function () {
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo;
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },
  userLogin: function () {
    // 登录
    const that = this;
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://192.168.0.115:7001/user/wxLoginByCode',
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {
              code: res.code
            },
            success: function (result) {
              console.log(result);
              if (result.data.code == 1) {
                wx.getUserInfo({
                  success: function (res) {
                    var userInfo = Object.assign({}, result.data.result.data, res.userInfo);
                    console.log(userInfo);
                    wx.request({
                      url: 'http://192.168.0.115:7001/user/addUserOrUpdate',
                      method: 'POST',
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      data: {
                        userInfo: userInfo
                      },
                      success: function (res) {
                        console.log('注册')
                      }
                    })
                  }
                })
              } else if (result.code == 0) {
                console.log('用户信息不全')
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})