// pages/simulation/simulation.js
var wxDraw = require("../../utils/wxdraw.js").wxDraw;
var Shape = require("../../utils/wxdraw.js").Shape;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {
      width: 300,
      heigth: 300
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const that = this;
    that.tree();
    that.scene();
    that.wind();
  },
  tree: function() {
    var Tree = (function () {
      var ctx = wx.createCanvasContext('first');
      var wxH = wx.getSystemInfoSync().windowHeight;
      var wxW = wx.getSystemInfoSync().windowWidth;
      //封顶
      ctx.moveTo(0, wxH - 350)
      ctx.lineTo(wxW, wxH - 350)

      //水流
      ctx.beginPath();
      ctx.setGlobalAlpha(0.8);
      const wrd = ctx.createLinearGradient(0, wxH - 300, 0, wxH - 20);
      wrd.addColorStop(0, '#63B8FF');
      wrd.addColorStop(0.6, '#1C86EE');
      wrd.addColorStop(1, '#0000FF');
      ctx.setFillStyle(wrd);
      ctx.fillRect(50, wxH - 300, wxW - 100, 300 + (wxH - 350 - (wxH - 300)));
      ctx.fillRect(0, wxH - 225, 50, 50);
      ctx.fillRect(wxW - 50, wxH - 225, 50, 50);
      ctx.stroke();

      //提篮线条
      ctx.moveTo(75, wxH - 335);
      ctx.lineTo(75, wxH - 226);
      ctx.stroke();

      //水泵管道

      //截污阀
      const jiewufa = ctx.createLinearGradient(0, 0, 200, 0)
      jiewufa.addColorStop(0, 'red')
      jiewufa.addColorStop(1, 'white')

      // Fill with gradient
      ctx.setFillStyle(jiewufa)
      ctx.fillRect(180, wxH - 120, 40, 70)

      //右侧排水阀门
      ctx.rect(wxW - 65, wxH - 204, 10, 100);
      ctx.setFillStyle('#515151');
      ctx.fill();

      ctx.beginPath()
      ctx.setLineWidth(8)
      ctx.setStrokeStyle('#A6A6A6')
      //左侧管道
      ctx.moveTo(0, wxH - 300 / 2 - 75);
      ctx.lineTo(54, wxH - 300 / 2 - 75);
      ctx.moveTo(0, wxH - 300 / 2 - 25);
      ctx.lineTo(54, wxH - 300 / 2 - 25);
      //左侧墙壁
      ctx.moveTo(50, wxH-300-50);
      ctx.lineTo(50, wxH-300/2-75);
      ctx.moveTo(50, wxH - 300/2-25);
      ctx.lineTo(50, wxH -50);

      //右侧管道
      ctx.moveTo(wxW - 54, wxH - 300 / 2 - 75);
      ctx.lineTo(wxW, wxH - 300 / 2 - 75);
      ctx.moveTo(wxW - 54, wxH - 300 / 2 - 25);
      ctx.lineTo(wxW, wxH - 300 / 2 - 25);
      //右侧墙壁
      ctx.moveTo(wxW - 50, wxH - 300 - 50);
      ctx.lineTo(wxW - 50, wxH - 300 / 2 - 75);
      ctx.moveTo(wxW - 50, wxH - 300 / 2 - 25);
      ctx.lineTo(wxW - 50, wxH - 50);

      //封底
      ctx.moveTo(50, wxH - 50)
      ctx.lineTo(wxW - 50, wxH - 50)
      ctx.stroke();

      //水流方向
      ctx.drawImage("/assets/images/right.png", 10, wxH - 210, 36, 26);
      ctx.drawImage("/assets/images/right.png", wxW - 30, wxH - 210, 36, 26);

      //测量计
      ctx.drawImage("/assets/images/survey.png", 10, wxH - 228, 26, 26);
      ctx.drawImage("/assets/images/survey.png", 62, wxH - 352, 26, 26);
      ctx.drawImage("/assets/images/survey.png", 200, wxH - 352, 26, 26);
      ctx.drawImage("/assets/images/survey.png", wxW - 30, wxH - 228, 26, 26);
      ctx.drawImage("/assets/images/basket.png", 50, wxH - 250, 50, 50);

      //水泵 阀门
      ctx.drawImage("/assets/images/shuibeng.png", 120, wxH - 100, 50, 50);
      ctx.drawImage("/assets/images/tap.png", 185, wxH - 100, 30, 30);
      //树
      ctx.drawImage("/assets/images/tree.jpg", 300, wxH - 456, 66, 106);
      ctx.drawImage("/assets/images/tree3.jpg", 200, wxH - 457, 66, 106);
      
      //土壤
      ctx.drawImage("/assets/images/soil.jpg", 0, wxH - 350, 50, 125);
      ctx.drawImage("/assets/images/soil.jpg", wxW - 50, wxH - 350, 50, 125);
      ctx.drawImage("/assets/images/soil.jpg", 0, wxH - 300 / 2 - 25, 50, 130);
      ctx.drawImage("/assets/images/soil.jpg", wxW - 50, wxH - 300 / 2 - 25, 50, 130);
      // ctx.drawImage("/assets/images/soil.jpg", 0, wxH-50, wxW, 50);

      //背景色

      //草坪
      ctx.beginPath();
      ctx.setLineWidth(1)
      ctx.setGlobalAlpha(0.6);
      ctx.moveTo(0, wxH - 350);
      ctx.lineTo(0, wxH - 358);
      ctx.lineTo(10, wxH - 359);
      ctx.lineTo(64, wxH - 366);
      ctx.lineTo(200, wxH - 370);
      ctx.lineTo(240, wxH - 363);
      ctx.lineTo(wxW-60, wxH - 364);
      ctx.lineTo(wxW, wxH - 356);
      ctx.lineTo(wxW, wxH - 350);
      const grd = ctx.createLinearGradient(0, 0, 0, 300);
      grd.addColorStop(0, '#458B74');
      grd.addColorStop(0.7, '#2e4f11');
      grd.addColorStop(1, '#54FF9F');
      ctx.setStrokeStyle('#458B74');
      ctx.setFillStyle(grd);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      //天空
      const ard = ctx.createLinearGradient(0, 0, 0, 120)
      ard.addColorStop(0, '#63B8FF')
      ard.addColorStop(1, 'white')
      ctx.setFillStyle(ard)
      ctx.fillRect(0, 0, wxW, 120)
      ctx.stroke();
      ctx.draw()

    })();
  },
  scene: function () {
    // const ctx = wx.createCanvasContext('first');
    // ctx.beginPath();
    // ctx.moveTo(0, 150);
    // ctx.lineTo(380, 150);
    // ctx.setStrokeStyle('green');
    // ctx.stroke();
    // ctx.draw(true);

    // ctx.beginPath();
    // var range = 100;

    // //range控件信息
    // var rangeValue = range;
    // var nowRange = 200;   //水高度

    // //画布属性
    // var mW = this.data.view.width;
    // var mH = 160;
    // var lineWidth = 2;
    // //圆属性
    // var r = mH / 2; //圆心
    // var cR = r - 16 * lineWidth; //圆半径

    // //Sin 曲线属性
    // var sX = 0;
    // var sY = mH / 2;
    // var axisLength = mW; //轴长
    // var waveWidth = 0.015;   //波浪宽度,数越小越宽
    // var waveHeight = 6; //波浪高度,数越大越高
    // var speed = 0.09; //波浪速度，数越大速度越快
    // var xOffset = 0; //波浪x偏移量
    // // 降级处理
    // let delay = 17;
    // let createAnimationFrame = function () {
    //   if (typeof requestAnimationFrame !== 'undefined') {
    //     return requestAnimationFrame;
    //   } else if (typeof setTimeout !== 'undefined') {
    //     return function (step, delay) {
    //       setTimeout(function () {
    //         let timeStamp = +new Date();
    //         step(timeStamp);
    //       }, delay);
    //     }
    //   } else {
    //     return function (step) {
    //       step(null);
    //     }
    //   }
    // }
    // let animationFrame = createAnimationFrame();
    // //画sin 曲线函数
    // var drawSin = function (xOffset) {
    //   ctx.save();
    //   var points = [];  //用于存放绘制Sin曲线的点
    //   ctx.beginPath();
    //   //在整个轴长上取点
    //   for (var x = sX; x < sX + axisLength; x += 20 / axisLength) {
    //     //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
    //     var y = -Math.sin((sX + x) * waveWidth + xOffset);
    //     var dY = mH * (1 - nowRange / 100)+320;
    //     points.push([x, dY + y * waveHeight]);
    //     ctx.lineTo(x, dY + y * waveHeight);
    //   }
    //   //封闭路径
    //   ctx.lineTo(axisLength, mH+320);
    //   ctx.lineTo(sX, mH + 320);
    //   ctx.lineTo(points[0][0], points[0][1]);
    //   var grad = ctx.createLinearGradient(0, 160, 0, 520);
    //   /* 指定几个颜色 */
    //   grad.addColorStop(0, '#87CEFA');
    //   grad.addColorStop(0.5, '#63B8FF');
    //   grad.addColorStop(1, '#4A708B');
    //   /* 将这个渐变设置为fillStyle */
    //   ctx.fillStyle = grad;
    //   ctx.fill();
    //   ctx.restore();
    // };

    // var render = function () {
    //   ctx.clearRect(0, 150, mW, mH);
    //   drawSin(xOffset);

    //   xOffset += speed;
    //   ctx.draw(true);
    //   let timer = setTimeout(function () {
    //     render();
    //     clearTimeout(timer);
    //   }, 35)
    // }
    // render();
  },
  wind: function () {
    /*Javascript代码片段*/
    //创建画布并开始动画
    function showCloud() {
      //创建画布设置画布属性
      const ctx = wx.createCanvasContext('first');
      drawCloud(ctx, 30, 40, 40);
      drawCloud(ctx, 260, 40, 30);
      drawCloud(ctx, 160, 30, 50);
    }


    /*渲染单个云朵
    context:  canvas.getContext("2d")对象
    cx: 云朵X轴位置
    cy: 云朵Y轴位置
    cw: 云朵宽度
    */
    function drawCloud(context, cx, cy, cw) {
      //云朵高度为宽度的60%
      var ch = cw * 0.6;
      //开始绘制云朵
      context.beginPath();
      context.setFillStyle('white');
      //创建渐变
      var grd = context.createLinearGradient(0, 0, 0, cy);
      grd.addColorStop(0, 'rgba(255,255,255,0.8)');
      grd.addColorStop(1, 'rgba(255,255,255,0.5)');
      context.fillStyle = grd;
      context.fill();
      //在不同位置创建5个圆拼接成云朵现状
      context.arc(cx, cy, cw * 0.19, 0, 360, false);
      context.arc(cx + cw * 0.08, cy - ch * 0.3, cw * 0.11, 0, 360, false);
      context.arc(cx + cw * 0.3, cy - ch * 0.25, cw * 0.25, 0, 360, false);
      context.arc(cx + cw * 0.6, cy, cw * 0.21, 0, 360, false);
      context.arc(cx + cw * 0.3, cy - ch * 0.1, cw * 0.28, 0, 360, false);
      context.closePath();
      context.fill();
      context.draw(true)
      
    }
    showCloud();
  }
})