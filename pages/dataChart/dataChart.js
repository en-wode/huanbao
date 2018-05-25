// pages/dataChart/dataChart.js
var _wxcharts = require('../../utils/wxcharts')
const { Tab, extend } = require('../../dist/index');
const app = getApp()

Page(extend({}, Tab, {

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    datalist: '',
    week: ['一', '二', '三', '四', '五', '六', '日'],
    month: ['5', '10', '15', '20', '25', '30'],
    year: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    tab1: {
      list: [{
        id: 'week',
        title: '周'
      }, {
        id: 'month',
        title: '月'
      },  {
        id: 'year',
        title: '年'
      }],
      selectedId: 'week'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      id: options.id,
      datalist: options.datalist
    }) 
    that.getdata()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
    this.graphShow()
  },
  getdata: function () {
    var that = this;
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: 'http://47.98.162.168/equipmentArametersHistory/getByEquipmentId',
      method: 'GET',
      header: header,
      data: {
        equipmentId: that.data.id,
        title: that.data.datalist,
      },
      success: function (result) {
        if (result.data.msg == 2000 && result.data.code == 0) {
          wx.navigateTo({
            url: '../index/index'
          })
        }
        console.log(result)
      }
    })
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
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
  },
  /**
  * @Explain：初始化静态图表
  */
  graphShow: function () {
    let that = this
    that.lineShow();
  },

  // pieShow: function () {
  //   let pie = {
  //     canvasId: 'pieGraph',
  //     type: 'pie',
  //     series: [{
  //       name: 'cat1',
  //       data: 50,
  //     }, {
  //       name: 'cat2',
  //       data: 30,
  //     }, {
  //       name: 'cat3',
  //       data: 1,
  //     }, {
  //       name: 'cat4',
  //       data: 1,
  //     }, {
  //       name: 'cat5',
  //       data: 46,
  //     }],
  //     width: 360,
  //     height: 300,
  //     dataLabel: true
  //   }
  //   new _wxcharts(pie)
  // },

  // barShow: function () {
  //   let bar = {
  //     canvasId: 'barGraph',
  //     type: 'column',
  //     categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
  //     series: [{
  //       name: '成交量1',
  //       data: [15, 20, 45, 37, 4, 80]
  //     }, {
  //       name: '成交量2',
  //       data: [70, 40, 65, 100, 34, 18]
  //     }],
  //     yAxis: {
  //       format: function (val) {
  //         return val + '万';
  //       }
  //     },
  //     width: 320,
  //     height: 200
  //   }
  //   new _wxcharts(bar)
  // },

  lineShow: function () {
    let line = {
      canvasId: 'lineGraph',
      type: 'line',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: '成交量1',
        data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8],
        format: function (val) {
          return val.toFixed(2) + 'm³/h';
        }
      }, {
        name: '成交量2',
        data: [0.30, 0.37, 0.65, 0.78, 0.69, 0.94],
        format: function (val) {
          return val.toFixed(2) + 'm³/h';
        }
      }],
      yAxis: {
        title: '流量 (m³/h)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: 320,
      height: 200
    }
    new _wxcharts(line)
  },
  // areaShow: function () {
  //   let area = {
  //     canvasId: 'areaGraph',
  //     type: 'area',
  //     categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2017'],
  //     series: [{
  //       name: '成交量1',
  //       data: [70, 40, 65, 100, 34, 18],
  //       format: function (val) {
  //         return val.toFixed(2) + '万';
  //       }
  //     }, {
  //       name: '成交量2',
  //       data: [15, 20, 45, 37, 4, 80],
  //       format: function (val) {
  //         return val.toFixed(2) + '万';
  //       }
  //     }],
  //     yAxis: {
  //       format: function (val) {
  //         return val + '万';
  //       }
  //     },
  //     width: 320,
  //     height: 200
  //   }
  //   new _wxcharts(area)
  // }
}))