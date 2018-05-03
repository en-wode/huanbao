// pages/deviceDetail/deviceDetail.js
const Zan = require('../../dist/index');

Page(Object.assign({}, Zan.Dialog, Zan.Switch, {
  data: {
    id: '',
    sync: {
      checked: false
    },
    async: {
      checked: true,
      loading: false
    },
  },
  onLoad: function (options) {
    console.log(options.id);
  },
  toggleBaseDialog() {
    this.showZanDialog({
      title: '设备管理操作',
      content: '请确认是否保存操作',
      showCancel: true
    }).then(() => {
      console.log('=== dialog ===', 'type: confirm');
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
  },
  handleZanSwitchChange(e) {
    var componentId = e.componentId;
    var checked = e.checked;
    if (componentId == 'sync') {
      // 同步开关
      this.setData({
        [`${componentId}.checked`]: checked
      });
    } else if (componentId == 'async') {
      // 异步开关
      this.setData({
        [`${componentId}.loading`]: true
      });
      setTimeout(() => {
        this.setData({
          [`${componentId}.loading`]: false,
          [`${componentId}.checked`]: checked
        });
      }, 500);
    }
  }
}));