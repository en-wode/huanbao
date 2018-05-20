// pages/getlocation/getLocation.js
const Zan = require('../../dist/index');

var app = getApp()
Page(Object.assign({}, Zan.Field, {
  data: {
    map_width: 380,
    map_height: 380,
    questiontype: ['污水堵塞', '污水漫出', '设备报修', '设备保养'],
    questionlevel: ['紧急', '严重', '一般'],
    typeindex: 0,
    levelindex: 0,
    question: {
      title: '问题描述',
      placeholder: '6~12个字',
      inputType: 'text',
      componentId: 'question'
    },
    tel: {
      title: '联系方式',
      placeholder: '输入手机号',
      inputType: 'number',
      componentId: 'tel'
    },
  }
  //show current position
  , onLoad: function () {
    var that = this;
    // 获取定位，并把位置标示出来
    app.getLocationInfo(function (locationInfo) {
      console.log(locationInfo);
      that.setData({
        longitude: locationInfo.longitude
        , latitude: locationInfo.latitude
        , markers: [
          {
            id: 0
            , iconPath: "../../assets/images/ic_position.png"
            , longitude: locationInfo.longitude
            , latitude: locationInfo.latitude
            , width: 30
            , height: 30
          }
        ]
      })
    })

    //set the width and height
    // 动态设置map的宽和高
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          map_width: res.windowWidth / 1.2
          , map_height: res.windowWidth / 1.2
          // , controls: [{
          //   id: 1,
          //   iconPath: '../../assets/images/ic_location.png',
          //   position: {
          //     left: res.windowWidth / 2.4 - 8,
          //     top: res.windowWidth / 2.4 - 16,
          //     width: 26,
          //     height: 30
          //   },
          //   clickable: true
          // }]
        })
      }
    })

  },
  bindPickertype: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      typeindex: e.detail.value
    })
  },
  bindPickerlevel: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      levelindex: e.detail.value
    })
  },
  //获取中间点的经纬度，并mark出来
  getLngLat: function () {
    var that = this;
    this.mapCtx = wx.createMapContext("map4select");
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude
          , latitude: res.latitude
          , markers: [
            {
              id: 0
              , iconPath: "../../assets/images/ic_position.png"
              , longitude: res.longitude
              , latitude: res.latitude
              , width: 30
              , height: 30
            }
          ]
        })

      }
    })
  }
  , regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
    if (e.type == 'end') {
      // this.getLngLat()
    }
  }
  , markertap(e) {
    console.log(e)
  }
}))