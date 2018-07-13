// pages/dataChart/dataChart.js
var _wxcharts = require('../../utils/wxcharts')
var getDate = require('../../utils/getDate.js');  
const { Tab, extend } = require('../../dist/index');
const app = getApp()
var lineChart = null;
var startPos = null;
Page(extend({}, Tab, {

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    datalist: '',
    week: ['一', '二', '三', '四', '五', '六', '日'],
    month: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '24', '25', '26', '27', '28'],
    year: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    tab1: {
      list: [{
        id: 'week',
        title: '最近一周'
      }, {
        id: 'month',
        title: '最近一月'
      },  {
        id: 'year',
        title: '最近一年'
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
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function () {
    const that = this;
    var categories = [];
    var data = [];
    categories = that.data.check;
    data = that.data.hisdata;
    return {
      categories: categories,
      data: data
    }
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
        that.setData({
          hisdata: result.data.result.map(v => v[that.data.datalist]).slice(0, 4)
          // hisdata: result.data.result.map(v => v[that.data.datalist]).slice(0, 4)
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
    var Mday = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var date = new Date();
    var m
    var month1 = date.getMonth(); //Mday[month]
    console.log(that.data.month.length)
    console.log(Mday[month1])
    if (Mday[month1] > 28 && that.data.month.length < Mday[month1]) {
      for (var i = 29; i <= Mday[month1];i++){
        m = i.toString()
        that.data.month.push(m)
      }
    }

    console.log(that.data.month);
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    that.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    that.setData({
      check: that.data[selectedId],
      month: that.data.month
    });
    that.lineCanvas();
  },
  /**
  * @Explain：初始化静态图表
  */
  graphShow: function () {
    let that = this
    that.lineCanvas();
  },
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
  lineCanvas: function() {
    const that = this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData();
    lineChart = new _wxcharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: false,
      series: [{
        name: that.data.name,
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + that.data.unit;
        }
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: that.data.name,
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  }
}))