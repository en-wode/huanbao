// pages/deviceStatus/deviceStatus.js
var bmap = require('../../utils/bmap-wx.min.js');
const Zan = require('../../dist/index');

const app = getApp();

Page(Object.assign({}, Zan.TopTips, Zan.Tab , {

  /**
   * 页面的初始数据
   */
  data: {
    weatherData: [],
    id: '',
    data: {},
    weiyu:{
      shuibeng1: '',
      shuibeng2: '',
      yalidianji: '',
      tingdian: '',
      fuqiu: '',
      shebmen: '',
      workstatus: ''
    },
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
    that.setData({
      id: options.equipid,
    }) 
    wx.setNavigationBarTitle({
      title: options.equipname + '号设备实况'
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
    }
    BMap.weather({
      fail: fail,
      success: success
    });

    app.socket().open();
    app.socket().on('connect', function () {
      that.showTopTips('刷新成功')
    });
    app.socket().on('disconnect', function () {
      console.log('断开');
    });
    // let name = 'res22' + options.equipid
    let name = 'online';
      app.socket().on(name, d => {
        console.log(d)
        if (d.equipmentId != that.data.id ) {
          return
        } else {
          if (d.keyboardStatus == 7) {
            that.setData({
              [`weiyu.workstatus`]: '自动'
            })
          } else if (d.keyboardStatus == 6) {
            that.setData({
              [`weiyu.workstatus`]: '手动'
            })
          } else {
            that.setData({
              [`weiyu.workstatus`]: '远程'
            })
          }
          if ((d.callThePolice & 1) == 0) {
            that.setData({
              [`weiyu.shuibeng2`]: '错误'
            })
          } else {
            that.setData({
              [`weiyu.shuibeng2`]: '正常'
            })
          }
          if ((d.callThePolice & 2) == 0) {
            that.setData({
              [`weiyu.shuibeng1`]: '错误'
            })
          } else {
            that.setData({
              [`weiyu.shuibeng1`]: '正常'
            })
          }
          if ((d.callThePolice & 4) == 0) {
            that.setData({
              [`weiyu.yalidianji`]: '错误'
            })
          } else {
            that.setData({
              [`weiyu.yalidianji`]: '正常'
            })
          }
          if ((d.callThePolice & 128) == 0) {
            that.setData({
              [`weiyu.tingdian`]: '停电'
            })
          } else {
            that.setData({
              [`weiyu.tingdian`]: '正常'
            })
          }
          if ((d.floatingBall & 1) == 0) {
            that.setData({
              [`weiyu.shebmen`]: '打开'
            })
          } else {
            that.setData({
              [`weiyu.shebmen`]: '关闭'
            })
          }
          if ((d.floatingBall & 4) == 0) {
            that.setData({
              [`weiyu.fuqiu`]: '上限'
            })
          } else if ((d.floatingBall & 2) == 0) {
            that.setData({
              [`weiyu.fuqiu`]: '下限'
            })
          } else {
            that.setData({
              [`weiyu.fuqiu`]: '非上下限'
            })
          }
          that.setData({
            data: d,
          });
        }
      
    })
    app.socket().emit('index', {
      equipmentId: options.equipid
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  getlv: function() {
    const that = this;
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: app.globalData.url + 'user/isWatch',
      method: 'GET',
      header: header,
      data: {
        userId: wx.getStorageSync('userId')
      },
      success: function (result) {
        if (result.data.code == 2000) {
          wx.navigateTo({
            url: '../index/index'
          })
        }
      },
      fail: function (res) {
        console.log(JSON.stringify(res));
      },
    })
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
      url: '../canvas/canvas?id=' + that.data.id
    });
  },

  monitor: function (options) {
    let that = this;
    let targetid = options.currentTarget.id;
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: app.globalData.url + 'user/isWatch',
      method: 'GET',
      header: header,
      data: {
        userId: wx.getStorageSync('userId'),
        equipmentId: that.data.id
      },
      success: function (result) {
        if (result.data.code == 2000) {
          wx.navigateTo({
            url: '../index/index'
          })
        }
        if (result.data.code == 0){
          that.showTopTips(result.data.msg)
        } else if (result.data.code == 1){
          wx.navigateTo({
            url: '../video/video?equipid=' + that.data.id + '&id=' + targetid
          });
        }
      },
      fail: function (res) {
        console.log(JSON.stringify(res));
      },
    })

  },
  showTopTips(data) {
    this.showZanTopTips(data);
  },
  onUnload: function () {
    app.socket().close();
  },
  onHide: function () {
    app.socket().close();
  }
}))