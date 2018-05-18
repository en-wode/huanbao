// pages/addDevice/addDevice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    device: []
  },
  /**
   * 事件处理函数
   */
  detail: function (event) {
    let devideId = event.currentTarget.id;
    wx.navigateTo({
      url: '../optionSelect/optionSelect?id=' + devideId
    })
  },
  addmore: function() {
    wx.navigateTo({
      url: '../deviceLink/deviceLink',
    })
  },
  onLoad: function (options) {
    const that = this;
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
        that.setData({
          device: result.data.result
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})