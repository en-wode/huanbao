// pages/deviceDetail/deviceDetail.js
const Zan = require('../../dist/index');
const app = getApp()

Page(Object.assign({}, Zan.Dialog, Zan.Switch, Zan.Toast,{
  data: {
    id: '',
    waterPump1: {
      checked: false
    },
    waterPump2: {
      checked: true,
    },
    data: {}
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    }) 
    that.getdata();
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
  getdata: function () {
    const that = this;
    wx.request({
      url: 'http://192.168.0.115:7001/equipmentArameters/getByEquipmentId',
      method: 'GET',
      data: {
        equipmentId: that.data.id,
        openId: app.globalData.openId,
      },
      success: function (result) {
        result.data.result.equipmentId = that.data.id;
        result.data.result.openId = app.globalData.openId
        that.setData({
          data: result.data.result,
        });
        if (that.data.data.waterPump1 == 0) {
          that.setData({
            waterPump1: {
              checked: false
            },
          });
        } else {
          that.setData({
            waterPump1: {
              checked: true
            },
          });
        }
        if (that.data.data.waterPump2 == 0) {
          that.setData({
            waterPump2: {
              checked: false
            },
          });
        } else {
          that.setData({
            waterPump2: {
              checked: true
            },
          });
        }
        console.log(that.data.data)
      }
    })
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