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
  },
  tree: function() {
    var Tree = (function () {
      var ctx = wx.createCanvasContext('first');
      var wxH = wx.getSystemInfoSync().windowHeight;
      var wxW = wx.getSystemInfoSync().windowWidth;

      //封顶
      ctx.moveTo(0, wxH - 350)
      ctx.lineTo(wxW, wxH - 350)
      
      //左侧管道
      ctx.moveTo(0, wxH - 300 / 2 - 75);
      ctx.lineTo(50, wxH - 300 / 2 - 75);
      ctx.moveTo(0, wxH - 300 / 2 - 25);
      ctx.lineTo(50, wxH - 300 / 2 - 25);
      //左侧墙壁
      ctx.moveTo(50, wxH-300-50);
      ctx.lineTo(50, wxH-300/2-75);
      ctx.moveTo(50, wxH - 300/2-25);
      ctx.lineTo(50, wxH -50);

      //右侧管道
      ctx.moveTo(wxW - 50, wxH - 300 / 2 - 75);
      ctx.lineTo(wxW, wxH - 300 / 2 - 75);
      ctx.moveTo(wxW - 50, wxH - 300 / 2 - 25);
      ctx.lineTo(wxW, wxH - 300 / 2 - 25);
      //右侧墙壁
      ctx.moveTo(wxW - 50, wxH - 300 - 50);
      ctx.lineTo(wxW - 50, wxH - 300 / 2 - 75);
      ctx.moveTo(wxW - 50, wxH - 300 / 2 - 25);
      ctx.lineTo(wxW - 50, wxH - 50);
      //右侧排水阀门
      ctx.rect(wxW - 60, wxH - 200, 10, 100);
      ctx.setFillStyle('#515151');
      ctx.fill();

      ctx.stroke();
      //测量计
      ctx.drawImage("/assets/images/survey.png", 10, wxH - 228, 26, 26);
      ctx.drawImage("/assets/images/survey.png", 60, wxH - 352, 26, 26);
      ctx.drawImage("/assets/images/survey.png", 200, wxH - 352, 26, 26);
      ctx.drawImage("/assets/images/survey.png", wxW - 30, wxH - 228, 26, 26);

      ctx.drawImage("/assets/images/basket.png", 50, wxH - 250, 50, 50);
      ctx.drawImage("/assets/images/pump.png", 100, wxH - 130, 50, 50);
      ctx.drawImage("/assets/images/tap.png", 150, wxH - 130, 50, 50);
      //水流
      ctx.setGlobalAlpha(0.6);
      ctx.rect(50, wxH - 270, wxW - 100, wxH - 280);
      ctx.rect(0, wxH - 225, 50, 50);
      ctx.rect(wxW - 50, wxH - 225, 50, 50);
      ctx.setFillStyle('#1E90FF');
      ctx.fill();
      ctx.draw()
      var maxBranch = 4;
      var W = 375;
      var H = 800;
      var init = function (x, y) {
        var x = 250, y = 150;
        draw(x, y, 20, -Math.PI / 2, 8, 2);
      }
      var draw = function (startX, startY, length, angle, depth, branchWidth) {
        var color, endX, endY, subBranches, newAngle, newLength;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        endX = startX + length * Math.cos(angle);
        endY = startY + length * Math.sin(angle);
        ctx.setLineCap('round');
        ctx.setLineWidth(branchWidth);
        ctx.lineTo(endX, endY);
        if (depth-- <= 2) {
          color = 'rgb(0,' + (rand(128, 192) >> 0) + ',0)';
        } else {
          color = 'rgb(' + (rand(64, 128) >> 0) + ',50,25)';
        }
        ctx.setStrokeStyle(color);
        ctx.stroke();
        ctx.draw(true);
        if (!depth) return;
        subBranches = rand(1, maxBranch);
        branchWidth *= 0.7;
        for (var i = 0; i < subBranches; i++) {
          newAngle = angle + rand(-Math.PI / 4, Math.PI / 4);
          newLength = length * rand(0.7, 1);
          draw(endX, endY, newLength, newAngle, depth, branchWidth)
        }
      }
      var rand = function (min, max) {
        return Math.random() * (max - min) + min;
      }
      return { init: init }
    })();
    Tree.init()
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
  }
})