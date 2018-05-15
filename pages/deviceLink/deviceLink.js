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
    if (e.detail.value.equipmentPassword.length == 0) {
      wx.showModal({
        title: '密码不得为空',
        showCancel: false
      })
    } else {
      //提交  
      console.log(e.detail.value)
      wx.request({
        url: 'http://192.168.0.115:7001/equipment/matching',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        // header: {}, // 设置请求的 header  
        data: {
          equipmentName: e.detail.value.equipmentName,
          equipmentPassword: e.detail.value.equipmentPassword,
          userId : '1'
        },
        success: function (res) {
          console.log(res);
          // success  
          if (res.data.code == 0) {
            wx.showModal({
              title: '设备添加失败',
              showCancel: false
            })
          } else {
            wx.navigateTo({
              url: '../addDevice/addDevice'
            })
          }
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
  code: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  }
})  