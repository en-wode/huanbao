// pages/dataChart/dataChart.js
var _wxcharts = require('../../utils/wxcharts')
var getDate = require('../../utils/getDate.js');  
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
    check: ['一', '二', '三', '四', '五', '六', '日'],
    hisdata: [],
    name: '',
    unit: '',
    max: '',
    min: '',
    dates: '2018-04-12',
    endDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var danwei = '';
    var nameshow = '';
    if (options.datalist == 'ss' || options.datalist == 'cod'){
      danwei = 'mg/L'
    } else if (options.datalist == 'rainfall'){
      danwei = 'ml/h'
    } else if (options.datalist == 'totalDischargeOfSewage'){
      danwei = 'm³'
    } else if (options.datalist == 'waterLevelInWell' || options.datalist == 'riveRaterLevel'){
      danwei = 'm'
    }
    if (options.datalist == 'ss' || options.datalist == 'cod') {
      nameshow = options.datalist
    } else if (options.datalist == 'rainfall') {
      nameshow = '雨量'
    } else if (options.datalist == 'totalDischargeOfSewage') {
      nameshow = '污水总流量'
    } else if (options.datalist == 'waterLevelInWell') {
      nameshow = '井内水位'
    } else if (options.datalist == 'riveRaterLevel'){
      nameshow = '河道水位'
    }
    that.setData({
      id: options.id,
      datalist: options.datalist,
      unit: danwei,
      name: nameshow
    }) 
    wx.setNavigationBarTitle({
      title: options.name + '号历史记录'
    })
    that.getdata()
    //获取今年时间
    var time = getDate.formatTime(new Date());  
    that.setData({
      endDate: time
    }) 
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
  },
  getdata: function () {
    var that = this;
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: app.globalData.url + 'equipmentArametersHistory/getByEquipmentId',
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
        console.log(that.data.datalist)
        console.log(result.data.result.map(v => v[that.data.datalist]).slice(0, 4))
        that.setData({
          hisdata: result.data.result.map(v => v[that.data.datalist]).slice(0, 4)
        })
        that.graphShow()
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
    const that = this;
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    that.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    console.log(that.data[selectedId])
    that.setData({
      check: that.data[selectedId]
    });
    that.lineShow();
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
    const that = this
    console.log(that.data.check)
    console.log(that.data.hisdata)
    let line = {
      canvasId: 'lineGraph',
      type: 'line',
      categories: that.data.check,//周 月 年
      series: [{
        name: that.data.name,
        data: that.data.hisdata,
        format: function (val) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        title: that.data.name + '(' + that.data.unit + ')',
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