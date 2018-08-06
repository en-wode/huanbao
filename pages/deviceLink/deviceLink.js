//判断是否是手机号码的方法  
function IsTel(s) {
  if (s != null) {
    var length = s.length;
    if (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(s)) {
      return true;
    } else {
      return false;
    }
  }
}
Page({
  data: {
    disabled: true,  //是否可用  
    opacity: 0.4,
    show: "",
    msg: ' ',
    userId: '' 
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      userId: options.userId
    })
  },
  //手机的输入框  
  phone: function (e) {
    var that = this
    if (e.detail.value) {
      that.setData({
        disabled: false,
        opacity: 1
      })
    } else {
      that.setData({
        disabled: true,
        opacity: 0.4
      })
    }
  },
  //提交按钮确认  
  sumit: function (e) {
    const that = this;
    console.log(e)
    if (e.detail.value.equipmentPassword.length == 0 || e.detail.value.equipmentName.length == 0) {
      that.setData({
        msg: '帐号密码不能为空',
      })
    } else {
      //提交  
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync("sessionid")//读取cookie
      };
      wx.request({
        url: app.globalData.url + 'equipment/matching',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        header: header,
        data: {
          equipmentName: e.detail.value.equipmentName,
          equipmentPassword: e.detail.value.equipmentPassword,
          userId : that.data.userId
        },
        success: function (res) {
          console.log(res);
          // success  
          if (res.data.code == 0) {
            wx.showModal({
              title: res.data.msg,
              showCancel: false
            })
          } else {
            that.setData({
              msg: '添加成功',
            })
            wx.navigateTo({
              url: '../deviceGroup/deviceGroup?deviceId=' + res.data.result.equipmentId
            })
          }
        }
      })
    }
  },
  code: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  }
})  