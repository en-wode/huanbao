// pages/deviceStatus/deviceStatus.js
var bmap = require('../../utils/bmap-wx.min.js');
const Zan = require('../../dist/index');

const app = getApp();

Page(Object.assign({}, Zan.TopTips, Zan.Tab, {

  /**
   * 页面的初始数据
   */
  data: {
    equipid: '',
    weatherData: [],
    id: '',
    data: {},
    weiyu: {
      shuibeng1: '',
      shuibeng2: '',
      yalidianji: '',
      tingdian: '',
      fuqiu: '',
      shebmen: '',
      workstatus: '',
    },
    yanding: null,
    paishui: 0,
    jiewu: 0,
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
      equipid: options.equipid,
    })
    wx.setNavigationBarTitle({
      title: options.equipname + '号设备实况'
    })
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: app.globalData.url + 'equipment/getById',
      method: 'GET',
      header: header,
      data: {
        equipmentId: that.data.id
      },
      success: function (result) {
        if (result.data.msg == 2000 && result.data.code == 0) {
          wx.navigateTo({
            url: '../index/index'
          })
        }
        if (!result.data.result.addressX || !result.data.result.addressY) {
          BMap.weather({
            fail: fail,
            success: success
          });
        } else {
          var location = result.data.result.addressY + ',' + result.data.result.addressX
          BMap.weather({
            location: location,
            fail: fail,
            success: success
          });
        }
      }
    });
    var BMap = new bmap.BMapWX({
      ak: 'Kt4HeTotWl6bEOTK5aQv7ZhjdxWGuBQU'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var weatherData = data.originalData.results[0].weather_data;
      weatherData[0].date = weatherData[0].date.slice(0, 2)
      that.setData({
        weatherData: weatherData,
      });
    }
    app.globalData.time = setInterval(function(){
      wx.request({
        url: app.globalData.url + 'io/getData',
        method: 'GET',
        header: header,
        data: {
          equipmentId: that.data.id
        },
        success: function (d) {
          d = d.data.result
          that.setData({
            yanding: ((d.inletPipeHeight + d.sewerageSluice) / 1000 + (d.bottomHoleHeight - 10000) / 100).toFixed(2)
          })
          console.log(d)
          if (d.equipmentId != that.data.id) {
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
                [`weiyu.shebmen`]: '无'
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
              paishui: (d.sluiceOpeningDegree / d.sewerageSluice * 100).toFixed(2),
              jiewu: (d.sluiceSluiceOpeningDegree / d.sluiceHeight * 100).toFixed(2)
            })
            if (d.waterLevelOfSewagePipe === '???') {
              d.waterLevelOfSewagePipe = '未检测'
            }
            that.setData({
              data: d,
            });
          }
        }
      })
    }, 2000)

    // app.socket().emit('index', {
    //   equipmentId: options.equipid
    // })
    // app.socket().open();

    // app.socket().on('connect', function () {
    //   that.showTopTips('刷新成功');
    // });
    // let name = 'online' + options.equipid;
    // app.socket().on(name, d => {
    //   console.log(d)
    //   that.setData({
    //     yanding: ((d.inletPipeHeight + d.sewerageSluice) / 1000 + (d.bottomHoleHeight - 10000) / 100).toFixed(2)
    //   })
    //   console.log(that.data.yanding)
    //   if (d.equipmentId != that.data.id) {
    //     return
    //   } else {
    //     if (d.keyboardStatus == 7) {
    //       that.setData({
    //         [`weiyu.workstatus`]: '自动'
    //       })
    //     } else if (d.keyboardStatus == 6) {
    //       that.setData({
    //         [`weiyu.workstatus`]: '手动'
    //       })
    //     } else {
    //       that.setData({
    //         [`weiyu.workstatus`]: '远程'
    //       })
    //     }
    //     if ((d.callThePolice & 1) == 0) {
    //       that.setData({
    //         [`weiyu.shuibeng2`]: '错误'
    //       })
    //     } else {
    //       that.setData({
    //         [`weiyu.shuibeng2`]: '正常'
    //       })
    //     }
    //     if ((d.callThePolice & 2) == 0) {
    //       that.setData({
    //         [`weiyu.shuibeng1`]: '错误'
    //       })
    //     } else {
    //       that.setData({
    //         [`weiyu.shuibeng1`]: '正常'
    //       })
    //     }
    //     if ((d.callThePolice & 4) == 0) {
    //       that.setData({
    //         [`weiyu.yalidianji`]: '错误'
    //       })
    //     } else {
    //       that.setData({
    //         [`weiyu.yalidianji`]: '正常'
    //       })
    //     }
    //     if ((d.callThePolice & 128) == 0) {
    //       that.setData({
    //         [`weiyu.tingdian`]: '停电'
    //       })
    //     } else {
    //       that.setData({
    //         [`weiyu.tingdian`]: '正常'
    //       })
    //     }
    //     if ((d.floatingBall & 1) == 0) {
    //       that.setData({
    //         [`weiyu.shebmen`]: '打开'
    //       })
    //     } else {
    //       that.setData({
    //         [`weiyu.shebmen`]: '无'
    //       })
    //     }
    //     if ((d.floatingBall & 4) == 0) {
    //       that.setData({
    //         [`weiyu.fuqiu`]: '上限'
    //       })
    //     } else if ((d.floatingBall & 2) == 0) {
    //       that.setData({
    //         [`weiyu.fuqiu`]: '下限'
    //       })
    //     } else {
    //       that.setData({
    //         [`weiyu.fuqiu`]: '非上下限'
    //       })
    //     }
    //     that.setData({
    //       paishui: (d.sluiceOpeningDegree / d.sewerageSluice * 100).toFixed(2),
    //       jiewu: (d.sluiceSluiceOpeningDegree / d.sluiceHeight * 100).toFixed(2)
    //     })
    //     if (d.waterLevelOfSewagePipe === '???') {
    //       d.waterLevelOfSewagePipe = '未检测'
    //     }
    //     that.setData({
    //       data: d,
    //     });
    //   }

    // })
    // app.socket().on('disconnect', function () {
    //   console.log('断开');
    // });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getlv: function () {
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
      url: '../canvas/canvas?id=' + that.data.id + '&equipid=' + that.data.equipid
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
        equipmentId: that.data.id,
        where: targetid
      },
      success: function (result) {
        if (result.data.code == 2000) {
          wx.navigateTo({
            url: '../index/index'
          })
        }
        if (result.data.code == 0) {
          that.showTopTips(result.data.msg)
        } else if (result.data.code == 1) {
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
    clearInterval(app.globalData.time)
    // app.socket().close();
  },
  onHide: function () {
    // clearInterval(app.globalData.time)
    // app.socket().close();
  }
}))