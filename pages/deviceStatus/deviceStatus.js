// pages/deviceStatus/deviceStatus.js
var bmap = require('../../utils/bmap-wx.min.js');
const Zan = require('../../dist/index');
const io = require('../../utils/socket/weapp.socket.io.js')
const socket = io('http://192.168.0.115:7001')
const app = getApp()

Page(Object.assign({}, Zan.TopTips, Zan.Tab , {

  /**
   * 页面的初始数据
   */
  data: {
    weatherData: [],
    id: '',
    data: {},
    tab1: {
      list: [{
        id: 'shuju',
        title: '数据显示'
      }, {
        id: 'moni',
        title: '设备模拟'
      }],
      selectedId: 'shuju'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.equipid)
    that.setData({
      id: options.equipid
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
      weatherData[0].date = weatherData[0].date.slice(0,2)
      that.setData({
        weatherData: weatherData,
      });
      console.log(weatherData)
    }
    BMap.weather({
      fail: fail,
      success: success
    });
    socket.on('connect', function () {
      console.log('connected')
    });
    let name = 'res' + options.equipid
    socket.on(name, d => {
      that.setData({
        data: d,
      });
      console.log('received news: ', d)
    })
    socket.emit('index', {
      equipmentId: '22'
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
  },
  simulation: function () {
    let that = this;
    wx.navigateTo({
      url: '../simulation/simulation?id=' + that.data.id
    });
  },

  monitor: function (options) {
    let that = this;
    let targetid = options.currentTarget.id;
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
  devicestatus: function () {
    const that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    console.log(that.data.id);
    wx.request({
      url: 'http://192.168.0.115:7001/equipmentArameters/getByEquipmentId',
      method: 'GET',
      header: header,
      data: {
        equipmentId: that.data.id
      },
      success: function (result) {
        if (result.data.code == 1) {
          that.showTopTips('刷新成功')
          that.setData({
            data: result.data.result,
          });
          console.log(result.data.result);
        } else {
          that.showTopTips(result.data.msg)
        }
      }
    })
  },
  showTopTips(data) {
    this.showZanTopTips(data);
  }
}))