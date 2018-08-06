// pages/addDevice/addDevice.js
const Zan = require('../../dist/index');
var bmap = require('../../utils/bmap-wx.min.js');

var app = getApp()

Page(Object.assign({}, Zan.TopTips, Zan.Dialog, Zan.Toast,{
  data: {
    device: [],
    delBtnWidth: 180,//删除按钮宽度单位（rpx）
    userId: '',
    showView: true,
    showStyle: 'width: 100%',
    work: 0,
    piliang: '批量操作',
    condition: '在线',
    conditionStyle: 'color: #7CCD7C',
    equipmentsId: [],
    pattern: '',
    weather: []
  },

  onLoad: function (options) {
    const that = this;
    // 页面初始化 options为页面跳转所带来的参数
    that.initEleWidth();
    that.setData({
      userId: options.id
    })
    var list = 0
    console.log(1)
    wx.getStorage({
      key: 'sessionid',
      success: function (res) {
        var header = {
          'content-type': 'application/json',
          'cookie': res.data//读取cookie
        };
        wx.request({
          url: app.globalData.url + 'equipment/list',
          method: 'GET',
          header: header,
          data: {
            userId: options.id
          },
          success: function (result) {
            console.log(result)
            if (result.data.code == 0 && result.data.msg == 2000) {
              wx.navigateTo({
                url: '../index/index'
              })
            }
            var success = function (data) {
              var weatherData = data.originalData.results[0].weather_data;
              weatherData[0].date = weatherData[0].date.slice(0, 2)
              that.data.weather[list] = data.currentWeather[0].weatherDesc
              that.setData({
                [`weather[${list}]`]: that.data.weather[list],
              })
              list++
              weather()
            }
            weather()
            function weather(){
              if (list >= result.data.result.length){
                return
              } else {
                if (result.data.result[list].addressX != null) {
                  var location = result.data.result[list].addressY + ',' + result.data.result[list].addressX
                  BMap.weather({
                    location: location,
                    fail: fail,
                    success: success
                  });
                } else {
                  that.setData({
                    [`weather[${list}]`]: '暂无',
                  })
                  list++
                  weather()
                }
              }
            }
            for (var index in result.data.result) {
              
              if (result.data.result[index].isConnection == 1) {
                result.data.result[index].isConnection = '在线'
                result.data.result[index].conditionStyle = 'color: #7CCD7C'
              } else {
                result.data.result[index].conditionStyle = 'color: #858585'
                result.data.result[index].isConnection = '离线'
              }
              if (result.data.result[index].pattern == '0') {
                if (result.data.result[index].nowPattern == 1) {
                  result.data.result[index].pattern = "自动值守(晴天截流)"
                } else if (result.data.result[index].nowPattern == 2){
                  result.data.result[index].pattern = "自动值守(初雨限流)"
                } else if (result.data.result[index].nowPattern == 3) {
                  result.data.result[index].pattern = "自动值守(暴雨排涝)"
                } else if (result.data.result[index].nowPattern == 4) {
                  result.data.result[index].pattern = "自动值守(防倒灌)"
                }
              } else if (result.data.result[index].pattern == '1') {
                result.data.result[index].pattern = "晴天截流"
              } else if (result.data.result[index].pattern == '2') {
                result.data.result[index].pattern = "初雨限流"
              } else if (result.data.result[index].pattern == '3') {
                result.data.result[index].pattern = "暴雨排涝"
              } else if (result.data.result[index].pattern == '4') {
                result.data.result[index].pattern = "防倒灌"
              }
            }
            that.setData({
              device: result.data.result,
            })
          }
        })
      }
    })
    var BMap = new bmap.BMapWX({
      ak: 'Kt4HeTotWl6bEOTK5aQv7ZhjdxWGuBQU',
    });
    var fail = function (data) {
      console.log('fail!!!!')
    };
    
  },
  // 批量操作
  checkboxChange: function (e) {
    this.setData({
      equipmentsId: e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      pattern: e.detail.value
    })
  },
  save: function () {
    const that = this
    that.showZanDialog({
      title: '模式修改',
      content: '请确认是否保存操作',
      showCancel: true
    }).then(() => {
      that.setdata();
    }).catch(() => {
    });
    
  },
  setdata: function () {
    const that = this
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: app.globalData.url + 'equipmentPort/changePatternOfEquipments',
      method: 'POST',
      header: header,
      data: {
        userId: wx.getStorageSync('userId'),
        equipmentsId: that.data.equipmentsId,
        pattern: that.data.pattern
      },
      success: function (result) {
        if (result.data.code == 0 && result.data.msg == 2000) {
          wx.navigateTo({
            url: '../index/index'
          })
        } else if (result.data.code == 1) {
          that.showZanToast('保存成功');
        } else {
          that.showZanToast(result.data.msg);
        }
      }
    })
  },
  // 批量操作end
  piliang: function () {
    const that = this
    var txtStyle
    if (that.data.showView) {
      txtStyle = "width: 90%";
      that.data.piliang = '取消'
    } else {
      that.data.piliang = '批量操作'
      txtStyle = "width: 100%";
    }
    that.setData({
      showView: !that.data.showView,
      showStyle: txtStyle,
      piliang: that.data.piliang
    })
  },
  model: function (e) {
    this.setData({
      work: e.currentTarget.id,
    })
  },
  touchS: function (e) {

    if (e.touches.length == 1) {

      this.setData({

        //设置触摸起始点水平方向位置

        startX: e.touches[0].clientX

      });

    }

  },
  touchM: function (e) {

    if (e.touches.length == 1) {

      //手指移动时水平方向位置

      var moveX = e.touches[0].clientX;

      //手指起始点位置与移动期间的差值

      var disX = this.data.startX - moveX;

      var delBtnWidth = this.data.delBtnWidth;

      var txtStyle = "";

      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";

      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }

      }

      //获取手指触摸的是哪一项

      var index = e.currentTarget.dataset.index;

      var list = this.data.device;

      list[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({

        device: list

      });

    }

  },



  touchE: function (e) {

    if (e.changedTouches.length == 1) {

      //手指移动结束后水平位置

      var endX = e.changedTouches[0].clientX;

      //触摸开始与结束，手指移动的距离

      var disX = this.data.startX - endX;

      var delBtnWidth = this.data.delBtnWidth;

      //如果距离小于删除按钮的1/2，不显示删除按钮

      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";

      //获取手指触摸的是哪一项

      var index = e.currentTarget.dataset.index;

      var list = this.data.device;

      list[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({
        device: list
      });

    }

  },

  //获取元素自适应后的实际宽度

  getEleWidth: function (w) {
    var real = 0;
    try {

      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }

  },

  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  //点击删除按钮事件

  delItem: function (e) {
    //获取列表中要删除项的下标
    const that = this;

    var index = e.currentTarget.dataset.index;
    var userEquipmentId = that.data.device[index].userEquipment
    var list = that.data.device;

    //移除列表中下标为index的项

    list.splice(index, 1);

    //更新列表的状态

    that.setData({

      device: list

    });
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: app.globalData.url + 'equipment/delete',
      method: 'POST',
      header: header,
      data: {
        userEquipmentId: userEquipmentId
      },
      success: function (result) {
        that.showTopTips(result.data.msg)
      }
    })
  },
  detail: function (event) {
    const that = this;
    let devideId = event.currentTarget.id;
    let devideName = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../optionSelect/optionSelect?equipid=' + devideId + '&equipname=' + devideName
    })
  },
  showTopTips(data) {
    this.showZanTopTips(data);
  },
  message: function () {
    wx.navigateTo({
      url: '../message/message',
    })
  }
}))

