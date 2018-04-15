// pages/dataChart/dataChart.js
var _wxcharts = require('../../utils/wxcharts')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
    this.graphShow()
  },
  /**
     * @Explain：获取设备信息
     */
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  * @Explain：初始化静态图表
  */
  graphShow: function () {
    let that = this
    that.pieShow();
  },

  pieShow: function () {
    let pie = {
      canvasId: 'pieGraph',
      type: 'pie',
      series: [{
        name: 'cat1',
        data: 50,
      }, {
        name: 'cat2',
        data: 30,
      }, {
        name: 'cat3',
        data: 1,
      }, {
        name: 'cat4',
        data: 1,
      }, {
        name: 'cat5',
        data: 46,
      }],
      width: 360,
      height: 300,
      dataLabel: true
    }
    new _wxcharts(pie)
  }
})