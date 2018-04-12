// pages/deviceLink/deviceLink.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawClock();
  },

  /**
   * canvas绘画
   */
  drawClock: function () {
    const ctx = wx.createCanvasContext('r');
    var range = 100;

    //range控件信息
    var rangeValue = range;
    var nowRange = 50;   //水高度

    //画布属性
    var mW = 150;
    var mH = 150;
    var lineWidth = 2;

    //圆属性
    var r = mH / 2; //圆心
    var cR = r - 16 * lineWidth; //圆半径

    //Sin 曲线属性
    var sX = 0;
    var sY = mH / 2;
    var axisLength = mW; //轴长
    var waveWidth = 0.015;   //波浪宽度,数越小越宽
    var waveHeight = 6; //波浪高度,数越大越高
    var speed = 0.09; //波浪速度，数越大速度越快
    var xOffset = 0; //波浪x偏移量

    //画sin 曲线函数
    var drawSin = function (xOffset) {
      ctx.save();
      var points = [];  //用于存放绘制Sin曲线的点
      ctx.beginPath();
      //在整个轴长上取点
      for (var x = sX; x < sX + axisLength; x += 20 / axisLength) {
        //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
        var y = -Math.sin((sX + x) * waveWidth + xOffset);
        var dY = mH * (1 - nowRange / 100);
        points.push([x, dY + y * waveHeight]);
        ctx.lineTo(x, dY + y * waveHeight);
      }
      //封闭路径
      ctx.lineTo(axisLength, mH);
      ctx.lineTo(sX, mH);
      ctx.lineTo(points[0][0], points[0][1]);
      ctx.fillStyle = '#1c86d1';
      ctx.fill();
      ctx.restore();
    };

    //写百分比文本函数
    var drawText = function () {
      ctx.save();
      var size = 0.4 * cR;
      ctx.textAlign = 'center';
      ctx.fillStyle = "rgba(06, 85, 128, 0.8)";
      ctx.fillText(~~nowRange + '%', r, r + size / 2);
      ctx.restore();
    };

    var render = function () {
      ctx.clearRect(0, 0, mW, mH);
      drawSin(xOffset);
      drawText();

      xOffset += speed;
      ctx.draw();
    }
    render();
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