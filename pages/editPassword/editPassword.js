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
      },
      password: {
        title: '密码',
        placeholder: '请输入密码',
      },
      newpassword: {
        title: '新密码',
        placeholder: '请输入新密码',
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

}))