// pages/editPassword/editPassword.js
const Zan = require('../../dist/index');

Page(Object.assign({}, Zan.Field,{

  /**
   * 页面的初始数据
   */
  data: {
    base: {
      name: {
        focus: true,
        title: '帐号',
        placeholder: '请输入帐号',
        componentId: 'name'
      },
      password: {
        title: '密码',
        placeholder: '请输入密码',
        componentId: 'password'
      },
      newpassword: {
        title: '新密码',
        placeholder: '请输入新密码',
        componentId: 'newpassword'
      },
      newpassword1: {
        title: '新密码',
        placeholder: '请输入新密码',
        componentId: 'newpassword1'
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  formSubmit: function (event) {
    console.log(event);
    wx.request({
      url: 'http://192.168.0.115:7001/user/modifyPassword',
      method: 'POST',
      data: {
        name: event.detail.value.name,
        oldPassword: event.detail.value.password,
        newPassword1: event.detail.value.newpassword,
        newPassword2: event.detail.value.newpassword1,
      },
      success: function(result) {
        console.log(result);
      }
    })
  }
}))