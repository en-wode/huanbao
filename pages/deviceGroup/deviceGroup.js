const Zan = require('../../dist/index');
const app = getApp()

Page(Object.assign({}, Zan.Dialog, Zan.Field, Zan.Toast, {
  data: {
    id: '',
    base: {
      drainageOverflowHeight: 0,
      InterceptingLimitflowHeight: 0,
      yuliang: {
        title: '雨量计',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'yuliang'
      },
      sunnyToRain: {
        title: '晴转雨时间',
        placeholder: '请输入数值',
        componentId: 'sunnyToRain'
      },
      warning: {
        title: '警戒水位',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'warning'
      },
      bump1st: {
        title: '1#水泵停止水位',
        inputType: 'digit',
        placeholder: '请输入数值',
        componentId: 'bump1st'
      },
      bump1sp: {
        title: '1#水泵开启水位',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'bump1sp'
      },
      bump2st: {
        title: '2#水泵停止水位',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'bump2st'
      },
      bump2sp: {
        title: '2#水泵开启水位',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'bump2sp'
      },
      COD: {
        title: 'COD浓度',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'cod'
      },
      SS: {
        title: 'SS悬浮物',
        placeholder: '请输入数值',
        inputType: 'digit',
        componentId: 'ss'
      }
    },
    controls: [
      {
        id: 'drainage',
        name: '功能一',
        min: 0,
        max: 80
      },
      {
        id: 'InterceptingPollution',
        name: '功能二',
        value: 0,
        max: 100
      },
      {
        id: 'garbage',
        name: '功能三',
        min: 0,
        max: 100
      }
    ],
    data: {}
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      id: options.id
    })
  },
  toggleBaseDialog() {
    const that = this;
    that.showZanDialog({
      title: '设备管理操作',
      content: '请确认是否保存操作',
      showCancel: true
    }).then(() => {
      that.setdata();
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
  },
  handleZanSwitchChange(e) {
    var componentId = e.componentId;
    var checked = e.checked;
    var datacheck = 0;
    if (checked == true) {
      datacheck = 1
    } else {
      datacheck = 0
    }
    console.log(e)
    if (componentId == 'waterPump1') {
      // 同步开关
      this.setData({
        [`${componentId}.checked`]: checked,
        [`data.${componentId}`]: datacheck
      });
    } else if (componentId == 'waterPump2') {
      // 异步开关
      this.setData({
        [`${componentId}.checked`]: checked,
        [`data.${componentId}`]: datacheck
      });
    }
  },
  garbagechange: function (value) {
    const that = this
    that.setData({
      [`data.garbage`]: value.detail.value
    });
  },
  InterceptingLimitflowHeight: function (value) {
    const that = this
    that.setData({
      [`base.InterceptingLimitflowHeight`]: value.detail.value
    });
  },
  addCount: function (event) {
    const that = this;
    let compontId = event.currentTarget.dataset.id
    console.log(event)
    console.log(compontId)
    console.log(that.data.base.InterceptingLimitflowHeight);
    // let controls = that.data.base.controls[data.id];
    switch (parseInt(compontId)) {
      case 'InterceptingLimitflowHeight':
        if (that.data.data.drainage >= controls.max) {
          return
        } else {
          that.setData({
            [`data.base.InterceptingLimitflowHeight`]: that.data.base.InterceptingLimitflowHeight + 5
          });
          console.log(that.data.data)
        }
        break
      case 1:
        if (that.data.data.InterceptingPollution >= controls.max) {
          return
        } else {
          that.setData({
            [`data.base.InterceptingLimitflowHeight`]: that.data.base.InterceptingLimitflowHeight + 5
          });
        }
        break
      case 2:
        if (that.data.data.garbage >= controls.max) {
          return
        } else {
          that.setData({
            [`data.InterceptingLimitflowHeight`]: that.data.data.garbage + 5
          });
        }
        break
    }
  },
  minusCount: function (event) {
    const that = this;
    let data = event.currentTarget.dataset
    let controls = that.data.controls[data.id];
    switch (parseInt(data.id)) {
      case 0:
        if (that.data.data.drainage <= controls.min) {
          return
        } else {
          that.setData({
            [`data.drainage`]: that.data.data.drainage - 5
          });
          console.log(that.data.data)
        }
        break
      case 1:
        if (that.data.data.InterceptingPollution <= controls.min) {
          return
        } else {
          that.setData({
            [`data.InterceptingPollution`]: that.data.data.InterceptingPollution - 5
          });
        }
        break
      case 2:
        if (that.data.data.garbage <= controls.min) {
          return
        } else {
          that.setData({
            [`data.garbage`]: that.data.data.garbage - 5
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
  setdata: function () {
    const that = this;
    console.log(that.data.data)
    wx.request({
      url: 'http://192.168.0.115:7001/equipmentArameters/setEquipment',
      method: 'POST',
      data: {
        data: that.data.data
      },
      success: function (result) {
        if (result.data.code == 1) {
          that.showZanToast('保存成功');
        } else {
          that.showZanToast('请提供设备ID');
        }
      }
    })
  }
}));