// pages/model/model.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: false,
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    }) 
  },
  onChangeState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  model: function (event) {
    const that = this;
    let modelId = event.currentTarget.id;
    wx.navigateTo({
      url: '../setModel/setModel?id=' + that.data.id + '&modelId=' + modelId
    })
  }
})