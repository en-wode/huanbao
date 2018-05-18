// pages/deviceGroup/deviceGroup.js
const Zan = require('../../dist/index');
const app = getApp()

Page(Object.assign({}, Zan.Dialog, Zan.Switch, Zan.Toast, {
  data: {
    device: {
      equipmentId: '',
      drains: true,
      sluiceGate: false,
      sluiceGateWidth: 0,
      sluiceGateHeight: 0,
      drainsWidth: 0,
      drainsHeight: 0,
      cod:0,
      ss: 0,
      garbageSensor: true,
      rainGauge: false,
      waterPump1: false,
      flowmeter1: false,
      waterPump2: false,
      flowmeter2: false,
      waterPump3: false,
      flowmeter3: false
    },
    devices: {
      equipmentId: '',
      drains: 1,
      sluiceGate: 0,
      sluiceGateWidth: 0,
      sluiceGateHeight: 0,
      drainsWidth: 0,
      drainsHeight: 0,
      cod: 0,
      ss: 0,
      garbageSensor: 1,
      rainGauge: 0,
      waterPump1: 0,
      flowmeter1: 0,
      waterPump2: 0,
      flowmeter2: 0,
      waterPump3: 0,
      flowmeter3: 0,
      latitude: 0,
      longitude: 0
    }
  },
  bindKeyInput: function (e) {
    console.log(e);
    this.setData({
      [`device.${e.currentTarget.id}`]: e.detail.value
    })
    this.setData({
      [`devices.${e.currentTarget.id}`]: e.detail.value
    })
  },
  checkboxChange: function (e) {
    const that = this;
    var val = e.currentTarget.id
    var mark = 0
    if (that.data.device[val]) {
      mark = 0
    } else {
      mark = 1
    }
    that.setData({
      [`device.${val}`]: !that.data.device[val]
    })
    that.setData({
      [`devices.${val}`]: mark
    })
  },
  // bindKeyInput: function (e) {
  //   this.setData({
  //     inputValue: e.detail.value
  //   })
  // },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      [`device.equipmentId`]: options.deviceId
    })
    that.setData({
      [`devices.equipmentId`]: options.deviceId
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          [`device.latitude`]: res.latitude,
          [`device.longitude`]: res.longitude,
        })
      }
    })
    // that.getdata();
  },
  save() {
    const that = this;
    that.showZanDialog({
      title: '设备管理操作',
      content: '请确保参数正确,将影响后续产品使用',
      showCancel: true
    }).then(() => {
      that.getdata();
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
  },
  handleZanSwitchChange(e) {
    var componentId = e.componentId;
    console.log(e)
    var marks = 0
    if (e.checked) {
      marks = 1
    } else {
      marks = 0
    }
    // 同步开关
    this.setData({
      [`device.${componentId}`]: e.checked
    });
    this.setData({
      [`devices.${componentId}`]: marks
    });
  },
  getdata: function () {
    const that = this;
    console.log(that.data.device)
    console.log(that.data.devices.drains)
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: 'http://192.168.0.115:7001/equipmentPort/addEquipmentPort',
      method: 'POST',
      header: header,
      data: {
        device: that.data.devices
      },
      success: function (result) {
        console.log(result);
      }
    })
  }
}));