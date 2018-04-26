var bmap = require('../../utils/bmap-wx.min.js');
Page({
  data: {
    weatherData: '',
    furweather: ''
  },
  onLoad: function () {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'Kt4HeTotWl6bEOTK5aQv7ZhjdxWGuBQU'
    });
    var fail = function (data) {
      console.log('fail!!!!')
    };
    var success = function (data) {
      console.log(data);
      var weatherData = data.currentWeather[0];
      weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
      var weather = data.originalData;
      that.setData({
        weatherData: weatherData,
        furweather: weather
      });
    }
    BMap.weather({
      fail: fail,
      success: success
    });
  }
})