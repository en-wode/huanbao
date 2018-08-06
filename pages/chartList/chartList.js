// pages/chartList/chartList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: ''
  },
  /**
   * 事件处理函数
   */
  history: function (event) {
    const that = this;
    let devideId = event.currentTarget.id;
    wx.navigateTo({
      url: '../dataChart/dataChart?id=' + that.data.id + '&datalist=' + devideId + '&name=' + that.data.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      id: options.equipid,
      name: options.equipname
    }) 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})