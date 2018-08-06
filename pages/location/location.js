// pages/location/location.js
const Zan = require('../../dist/index');
var header = {
  'content-type': 'application/json',
  'cookie': wx.getStorageSync("sessionid")//读取cookie
};
var app = getApp()
Page(Object.assign({}, Zan.Field,{
  data: {
    id: '',
    map_width: 380,
    map_height: 380,
    questiontype: ['污水堵塞', '污水漫出', '设备报修', '设备保养'],
    questionlevel: ['紧急', '严重', '一般'],
    typeindex: 0,
    levelindex: 0,
    tel: '',
    question: '',
    questionwt: {
      title: '问题描述',
      placeholder: '6~12个字',
      inputType: 'text',
      componentId: 'question'
    },
    telwt: {
      title: '联系方式',
      placeholder: '输入手机号',
      inputType: 'number',
      componentId: 'tel'
    },
    equipdetail: {

    }
  }
  //show current position
  , onLoad: function (options) {
    const that = this;
    that.setData({
      id: options.equipid
    }) 
    wx.setNavigationBarTitle({
      title: options.equipname + '号设备报修'
    })
    that.getData();
    // 获取定位，并把位置标示出来


    //set the width and height
    // 动态设置map的宽和高
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          map_width: res.windowWidth/1.2
          , map_height: res.windowWidth/1.2
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
  handleZanFieldChange : function(event){
    this.setData({
      [`${event.currentTarget.dataset.componentId}`]: event.detail.value
    })
  },
  bindPickertype: function (e) {
    this.setData({
      typeindex: e.detail.value
    })
  },
  bindPickerlevel: function (e) {
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
  },
  getlocat: function () {
    const that = this;
    app.getLocationInfo(function (locationInfo) {
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
      that.showtt(locationInfo.longitude, locationInfo.latitude);
    })
  },
  showtt(addressY1, addressX1){
    const that = this;
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.showModal({
      title: '提示',
      content: '您将为当前设备设置地址',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + 'equipment/update',
            method: 'POST',
            header: header,
            data: {
              equipmentId: that.data.id,
              addressX: addressX1, 
              addressY: addressY1
            },
            success: function (result) {
              if(result.data.code == 1) {
                wx.showToast({
                  title: '设置成功',
                  icon: 'success',
                  duration: 2000,
                })
              } else {
                wx.showToast({
                  title: '设置失败',
                  duration: 2000,
                })
              }
            }
          })
        }
      }
    })
  },
  getData: function () {
    const that = this;
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
        if (!result.data.result.addressX || !result.data.result.addressY){
          that.getlocat();
        } else {
          that.setData({
            longitude: result.data.result.addressY
            , latitude: result.data.result.addressX
            , markers: [
              {
                id: 0
                , iconPath: "../../assets/images/ic_position.png"
                , longitude: result.data.result.addressY
                , latitude: result.data.result.addressX
                , width: 30
                , height: 30
              }
            ]
          })
        }
      }
    });

    wx.request({
      url: app.globalData.url + 'questionType/getQuestionType',
      method: 'GET',
      header: header,
      success: function (result) {
        if (result.data.msg == 2000 && result.data.code == 0) {
          wx.navigateTo({
            url: '../index/index'
          })
        }
        that.setData({
          questiontype: result.data.result.map(v => v.type)
        })
      }
    })
    wx.request({
      url: app.globalData.url + 'questionLevel/getQuestionLevel',
      method: 'GET',
      header: header,
      success: function (result) {
        that.setData({
          questionlevel: result.data.result.map(v => v.type)
        })
      }
    })
  },
  submit(){
    const that = this
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: app.globalData.url + 'equipmentMaintenance/addQuestion',
      method: 'POST',
      header: header,
      data: {
        equipmentId: that.data.id,
        questionTypeId: that.data.typeindex + 1,
        questionLevelId: that.data.levelindex + 1,
        questionDescribe: that.data.question,
        tel: that.data.tel
      },
      success: function (result) {
        if (result.data.code == 1){
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
          })
        } else{
          wx.showToast({
            title: '提交失败',
            duration: 2000,
          })
        }
      }
    })
  }
}))