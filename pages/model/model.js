// pages/model/model.js
const Zan = require('../../dist/index');
const app = getApp()

Page(Object.assign({}, Zan.Dialog, Zan.Field, Zan.Toast, Zan.Select,{
  data: {
    equipid: '',
    base: {
      drainageOverflowHeight: 0,
      InterceptingLimitflowHeight: 0,
      rainGauge: {
        title: '雨量计(单位：L)',
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
        inputType: 'digit',
        componentId: 'vigilance',
        value: ''
      },
      stopWaterLevel1: {
        title: '1#水泵停止水位',
        inputType: 'digit',
        placeholder: '请输入数值',
        componentId: 'stopWaterLevel1',
        value: ''
      },
      startWaterLevel1: {
        title: '1#水泵开启水位',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'startWaterLevel1',
        value: ''
      },
      stopWaterLevel2: {
        title: '2#水泵停止水位',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'stopWaterLevel2',
        value: ''
      },
      startWaterLevel2: {
        title: '2#水泵开启水位',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'startWaterLevel2',
        value: ''
      },
      stopWaterLevel3: {
        title: '3#水泵停止水位',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'stopWaterLevel2',
        value: '0'
      },
      startWaterLevel3: {
        title: '3#水泵开启水位',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'startWaterLevel2',
        value: '0'
      },
      COD: {
        title: 'COD浓度',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'cod',
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
    work: 1,
    controls: [
      {
        id: 'InterceptingLimitflowHeight',
        min: 0,
        max: 80
      },
      {
        id: 'InterceptingLimitflowHeight',
        value: 0,
        max: 100
      }
    ],
    devices: {}
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      equipid: options.equipid
    })
    that.getdata();
  },
  model: function (e) {
    this.setData({
      work: e.currentTarget.id
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
        if (that.data.data.InterceptingPollution <= controls.min) {
          return
        } else {
          that.setData({
            [`base.InterceptingLimitflowHeight`]: that.data.data.InterceptingPollution - 5,
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
    that.setData({
      devices: event.detail.value,
      [`devices.InterceptingLimitflowHeight`]: that.data.base.InterceptingLimitflowHeight,
      [`devices.drainageOverflowHeight`]: that.data.base.drainageOverflowHeight,
      [`devices.equipmentId`]: that.data.equipid,
    })
    console.log(event)
    console.log(that.data.devices)
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
    console.log(that.data.devices);
    wx.request({
      url: 'http://192.168.0.115:7001/equipmentPort/addEquipmentPort',
      method: 'POST',
      header: header,
      data: {
        device: that.data.devices
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
      url: 'http://192.168.0.115:7001/equipmentPort/getEquipmentPort',
      method: 'GET',
      header: header,
      data: {
        equipmentId: that.data.equipid
      },
      success: function (result) {
        if (result.data.result) {
          that.setData({
            devices: result.data.result,
            [`base.drainageOverflowHeight`]: result.data.result.drainageOverflowHeight,
            [`base.InterceptingLimitflowHeight`]: result.data.result.InterceptingLimitflowHeight,
          })
        }
        console.log(that.data.devices)
      }
    })
  }
}));