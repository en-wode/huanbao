// pages/deviceStatus/deviceStatus.js
var bmap = require('../../utils/bmap-wx.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weatherData: [],
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    }) 
    var BMap = new bmap.BMapWX({
      ak: 'Kt4HeTotWl6bEOTK5aQv7ZhjdxWGuBQU'
    });
    var fail = function (data) {
      console.log('fail!!!!')
    };
    var success = function (data) {
      var weatherData = data.originalData.results[0].weather_data;
      // weatherData = '城市：' + weatherData.currentCity + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n';
      // var weather = data.originalData;
      console.log(weatherData);
      that.setData({
        weatherData: weatherData,
      });
    }
    BMap.weather({
      fail: fail,
      success: success
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  sliderchange: function (val) {
    console.log(val)
  },
  monitor: function (options) {
    let that = this;
    let targetid = options.currentTarget.id;
    console.log(targetid)
    switch (Number(targetid)) {
      case 1:
        wx.navigateTo({
          url: '../video/video?id=' + that.data.id
        });
        break;
      case 2:
        wx.navigateTo({
          url: '../video/video?id=' + that.data.id
        });
        break;
    };
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