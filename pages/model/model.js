// pages/model/model.js
const Zan = require('../../dist/index');
const app = getApp()

Page(Object.assign({}, Zan.Dialog, Zan.Field, Zan.Toast, Zan.Select,{
  data: {
    equipid: '',
    base: {
      drainageOverflowHeight: 0,
      InterceptingL0imitflowHeight: 0,
      rainGauge: {
        title: '大雨雨量(单位：mL/h)',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'rainGauge'
      },
      sunnyToRain: {
        title: '晴转雨时间(单位：秒)',
        placeholder: '请输入数值',
        componentId: 'sunnyToRain',
        value: ''
      },
      vigilance: {
        title: '警戒水位(单位：m)',
        placeholder: '请输入数值',
        inputType: 'text',
        componentId: 'vigilance',
        value: ''
      },
      seaLevel: {
        title: '初雨初始高度(单位：mm)',
        placeholder: '请输入数值',
        inputType: 'text',
        componentId: 'seaLevel',
        value: ''
      },
      stopWaterLevel1: {
        title: '1#水泵停止水位',
        inputType: 'text',
        placeholder: '请输入数值',
        componentId: 'stopWaterLevel1',
        maxlength: 5,
        value: ''
      },
      startWaterLevel1: {
        title: '1#水泵开启水位',
        placeholder: '请输入数值',
        inputType: 'text',
        componentId: 'startWaterLevel1',
        value: ''
      },
      stopWaterLevel2: {
        title: '2#水泵停止水位',
        placeholder: '请输入数值',
        inputType: 'text',
        componentId: 'stopWaterLevel2',
        value: ''
      },
      startWaterLevel2: {
        title: '2#水泵开启水位',
        placeholder: '请输入数值',
        inputType: 'text',
        componentId: 'startWaterLevel2',
        value: ''
      },
      stopWaterLevel3: {
        title: '3#水泵停止水位',
        placeholder: '请输入数值',
        inputType: 'text',
        componentId: 'stopWaterLevel2',
        value: '0'
      },
      startWaterLevel3: {
        title: '3#水泵开启水位',
        placeholder: '请输入数值',
        inputType: 'text',
        componentId: 'startWaterLevel2',
        value: '0'
      },
      COD: {
        title: 'COD浓度',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'cod',
        maxlength: 5,
        value: ''
      },
      SS: {
        title: 'SS悬浮物',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'ss'
      }
    },
    value: '23',
    work: 0,
    controls: [
      {
        id: 'drainageOverflowHeight',
        min: 0,
        max: 80
      },
      {
        id: 'InterceptingLimitflowHeight',
        min: 0,
        max: 100
      }
    ],
    devices: {},
    device: {},
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      equipid: options.equipid
    })
    wx.setNavigationBarTitle({
      title: options.equipname + '号情景模式'
    })
    that.getdata();
  },
  model: function (e) {
    this.setData({
      work: e.currentTarget.id,
    })
  },
  // toggleBaseDialog() {
  //   const that = this;
  //   that.showZanDialog({
  //     title: '参数修改',
  //     content: '请确认是否保存操作',
  //     showCancel: true
  //   }).then(() => {
  //     that.setdata();
  //   }).catch(() => {
  //   });
  // },
  handleZanFieldChange: function (e) {
    const that = this
    console.log(e);
  },
  garbagechange: function (value) {
    const that = this
    that.setData({
      [`data.garbage`]: value.detail.value
    });
  },
  InterceptingLimitflowHeight: function (value) {
    const that = this
    console.log(value)
    that.setData({
      [`base.InterceptingLimitflowHeight`]: value.detail.value
    });
  },
  drainageOverflowHeight: function (value) {
    const that = this
    console.log(value)
    that.setData({
      [`base.drainageOverflowHeight`]: value.detail.value
    });
  },
  addCount: function (event) {
    const that = this;
    let compontId = event.currentTarget.dataset.id
    let controls = that.data.controls[compontId];
    switch (parseInt(compontId)) {
      case 0:
        if (that.data.base.drainageOverflowHeight >= controls.max) {
          return
        } else {
          that.setData({
            [`base.drainageOverflowHeight`]: that.data.base.drainageOverflowHeight + 5,
          });
        }
        break
      case 1:
        if (that.data.base.InterceptingLimitflowHeight >= controls.max) {
          return
        } else {
          that.setData({
            [`base.InterceptingLimitflowHeight`]: that.data.base.InterceptingLimitflowHeight + 5,
          });
        }
        break
    }
  },
  minusCount: function (event) {
    const that = this;
    let compontId = event.currentTarget.dataset.id
    let controls = that.data.controls[compontId];
    switch (parseInt(compontId)) {
      case 0:
        if (that.data.base.drainageOverflowHeight <= controls.min) {
          return
        } else {
          that.setData({
            [`base.drainageOverflowHeight`]: that.data.base.drainageOverflowHeight - 5,
          });
        }
        break
      case 1:
        if (that.data.base.InterceptingLimitflowHeight <= controls.min) {
          return
        } else {
          that.setData({
            [`base.InterceptingLimitflowHeight`]: that.data.base.InterceptingLimitflowHeight - 5,
          });
        }
        break
    }
  },
  drainagechange: function (value) {
    const that = this
    that.setData({
      [`data.drainage`]: value.detail.value
    });
  },
  toggleBaseDialog:function(event) {
    const that = this;
    console.log(that.data.devices.ss)
    that.setData({
      device: event.detail.value,
      [`device.InterceptingLimitflowHeight`]: that.data.base.InterceptingLimitflowHeight,
      [`device.drainageOverflowHeight`]: that.data.base.drainageOverflowHeight,
      [`device.equipmentId`]: that.data.equipid,
      [`device.pattern`]: that.data.work,
      [`device.startWaterLevel1`]: that.setcountxs(event.detail.value.startWaterLevel1, that.data.devices.bottomHoleHeight),
      [`device.startWaterLevel2`]: that.setcountxs(event.detail.value.startWaterLevel2, that.data.devices.bottomHoleHeight),
      [`device.stopWaterLevel1`]: that.setcountxs(event.detail.value.stopWaterLevel1, that.data.devices.bottomHoleHeight),
      [`device.stopWaterLevel2`]: that.setcountxs(event.detail.value.stopWaterLevel2, that.data.devices.bottomHoleHeight),
      [`device.vigilance`]: that.setcountxs(event.detail.value.vigilance, that.data.devices.bottomHoleHeight),
      [`device.cod`]: that.signFigures(event.detail.value.cod * 100),
      [`device.ss`]: that.signFigures(event.detail.value.ss * 100),
    })
    console.log(that.data.device)
    console.log(that.data.device.ss)
    that.showZanDialog({
      title: '参数修改',
      content: '请确认是否保存操作',
      showCancel: true
    }).then(() => {
      that.setdata();
    }).catch(() => {
    });
  },
  setdata: function () {
    const that = this;
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    console.log(that.data.device)
    wx.request({
      url: app.globalData.url + 'equipmentPort/addEquipmentPort',
      method: 'POST',
      header: header,
      data: {
        device: that.data.device
      },
      success: function (result) {
        console.log(result)
        if (result.data.code == 1) {
          that.showZanToast('保存成功');
        } else {
          that.showZanToast('请提供设备ID');
        }
      }
    })
  },
  getdata: function () {
    const that = this;
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    console.log(that.data.devices);
    wx.request({
      url: app.globalData.url + 'equipmentPort/getEquipmentPort',
      method: 'GET',
      header: header,
      data: {
        equipmentId: that.data.equipid
      },
      success: function (result) {
        if (result.data.msg == 2000 && result.data.code == 0) {
          wx.navigateTo({
            url: '../index/index'
          })
        }
        if (result.data.result) {
          that.setData({
            devices: result.data.result,
            [`base.drainageOverflowHeight`]: result.data.result.drainageOverflowHeight,
            [`base.InterceptingLimitflowHeight`]: result.data.result.InterceptingLimitflowHeight,
            [`controls[0].max`]: result.data.result.sewerageSluice,
            [`controls[1].max`]: result.data.result.sluiceHeight,
            work: result.data.result.pattern,
          })
        }
        console.log(that.data.devices)
      }
    })
  },
  setcountxs: function (value, bt) {
    console.log(bt)
    var srt = value * 100 - bt + 10000;
    console.log(srt)
    return srt
  },
  signFigures: function (num, rank = 6) {
    if (!num) return (0);
    const sign = num / Math.abs(num);
    const number = num * sign;
    const temp = rank - 1 - Math.floor(Math.log10(number));
    let ans;
    if (temp > 0) {
      ans = parseFloat(number.toFixed(temp));
    } else if (temp < 0) {
      const temp = Math.pow(10, temp);
      ans = Math.round(number / temp) * temp;
    } else {
      ans = Math.round(number);
    }
    return (ans * sign);
  }
}));