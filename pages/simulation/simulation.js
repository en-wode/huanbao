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
    },
    //0 全关闭 1开启1号 2开启2号 3全开启
    shuibeng: 1,
    // 水面高度 1超过管道 0低于管道
    wtheight: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const that = this;
    var wxH = wx.getSystemInfoSync().windowHeight;
    let numH = 106;
    let numW2 = 222;
    let numW1 = 150;
    let timer = null;
    let basket = wxH - 300
    // that.tree();
    timer=setInterval(()=>{
      if (numH === 286 && numW2 <= 50) {
        clearInterval(timer);
      } else if (numH === 286 && numW2 > 50) {
        numW2--
      } else {
        basket++
        numH++
      }
      that.tree(numH, numW2, basket)
    },1000/60)
    that.wind();
  },
  tree: function (num, numW, basket) {
    console.log(num)
    const that = this
    var ctx = wx.createCanvasContext('first');
    var wxH = wx.getSystemInfoSync().windowHeight;
    var wxW = wx.getSystemInfoSync().windowWidth;
    //封顶
    ctx.moveTo(0, wxH - 350)
    ctx.lineTo(wxW, wxH - 350)
    //背景色
    ctx.beginPath();
    ctx.setGlobalAlpha(0.8);
    ctx.setFillStyle('#D3D3D3')
    ctx.fillRect(50, wxH - 350, wxW - 100, 300);
    //水流
    ctx.beginPath();
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
    ctx.lineTo(75, basket);
    ctx.stroke();

    ctx.beginPath()
    ctx.setLineWidth(10)
    ctx.setStrokeStyle('#A6A6A6')
    //左侧管道
    ctx.moveTo(0, wxH - 300 / 2 - 75);
    ctx.lineTo(54, wxH - 300 / 2 - 75);
    ctx.moveTo(0, wxH - 300 / 2 - 25);
    ctx.lineTo(54, wxH - 300 / 2 - 25);
    //左侧墙壁
    ctx.moveTo(50, wxH - 300 - 50);
    ctx.lineTo(50, wxH - 300 / 2 - 75);
    ctx.moveTo(50, wxH - 300 / 2 - 25);
    ctx.lineTo(50, wxH - 50);

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
    ctx.drawImage("/assets/images/tilan.png", 55, wxH - 270, 50, 220);

    //水流方向
    ctx.drawImage("/assets/images/right.png", 10, wxH - 210, 36, 26);
    ctx.drawImage("/assets/images/right.png", wxW - 30, wxH - 210, 36, 26);
    //水泵水流方向
    ctx.drawImage("/assets/images/upward.png", 190, wxH - 210, 22, 46);

    //水泵 阀门 提篮
    ctx.drawImage("/assets/images/shuibeng.png", 110, wxH - 135, 50, 80);
    ctx.drawImage("/assets/images/shuibeng.png", 180, wxH - 135, 50, 80);
    ctx.drawImage("/assets/images/jiewu.png", 240, wxH - 190, 45, 135);

    //测量计
    ctx.drawImage("/assets/images/camera.png", 62, wxH - 352, 26, 26);
    ctx.drawImage("/assets/images/survey.png", 62, wxH - 352, 26, 26);
    ctx.drawImage("/assets/images/survey.png", 200, wxH - 352, 26, 26);
    ctx.drawImage("/assets/images/survey.png", wxW - 30, wxH - 228, 26, 26);
    ctx.drawImage("/assets/images/basket.png", 60, basket, 30, 30);

    //右侧排水阀门
    ctx.drawImage("/assets/images/paishui.png", wxW - 74, wxH - 254, 24, 190);

    //主机
    ctx.drawImage("/assets/images/zhuji.png", wxW - 85, wxH - 350, 30, 30);

    //树
    ctx.drawImage("/assets/images/tree.jpg", 300, wxH - 456, 66, 106);
    ctx.drawImage("/assets/images/tree3.jpg", 5, wxH - 450, 66, 106);

    //土壤
    ctx.drawImage("/assets/images/soil.jpg", 0, wxH - 350, 50, 125);
    ctx.drawImage("/assets/images/soil.jpg", wxW - 50, wxH - 350, 50, 125);
    ctx.drawImage("/assets/images/soil.jpg", 0, wxH - 300 / 2 - 25, 50, 130);
    ctx.drawImage("/assets/images/soil.jpg", wxW - 50, wxH - 300 / 2 - 25, 50, 130);
    // ctx.drawImage("/assets/images/soil.jpg", 0, wxH-50, wxW, 50);

    //主机箱
    ctx.beginPath();
    ctx.setLineWidth(5);
    ctx.setLineJoin('round');
    ctx.setStrokeStyle('white');
    ctx.moveTo(wxW - 88, wxH - 350);
    ctx.lineTo(wxW - 88, wxH - 316);
    ctx.lineTo(wxW - 55, wxH - 316);
    ctx.stroke();

    //水泵管道
    ctx.beginPath();
    ctx.setLineWidth(10);
    ctx.setLineJoin('round');
    ctx.setStrokeStyle('white');
    ctx.moveTo(226, wxH - 100);
    ctx.lineTo(226, wxH - 286);
    ctx.lineTo(50, wxH - 286);
    ctx.moveTo(155, wxH - 100);
    ctx.lineTo(155, wxH - 286);
    ctx.stroke();

    //水位计工作
    ctx.beginPath();
    ctx.setLineWidth(1);
    ctx.setLineJoin('round');
    ctx.setStrokeStyle('black');
    ctx.moveTo(wxW - 162, wxH - 325);
    ctx.lineTo(wxW - 162, wxH - 290);
    ctx.lineTo(wxW - 156, wxH - 295);
    ctx.moveTo(wxW - 162, wxH - 290);
    ctx.lineTo(wxW - 168, wxH - 295);
    ctx.stroke();
    //草坪
    ctx.beginPath();
    ctx.setLineWidth(1);
    ctx.setGlobalAlpha(0.6);
    ctx.moveTo(0, wxH - 350);
    ctx.lineTo(0, wxH - 358);
    ctx.lineTo(10, wxH - 359);
    ctx.lineTo(64, wxH - 366);
    ctx.lineTo(200, wxH - 370);
    ctx.lineTo(240, wxH - 363);
    ctx.lineTo(wxW - 60, wxH - 364);
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

    //设备名称
    ctx.setFontSize(12)
    ctx.setFillStyle('black')
    ctx.fillText('水流方向', 8, wxH - 205)
    ctx.fillText('提篮格栅', 45, wxH - 30)
    ctx.fillText('水泵1', 110, wxH - 30)
    ctx.fillText('水泵2', 180, wxH - 30)
    ctx.fillText('截污阀', 240, wxH - 30)
    ctx.fillText('排水阀门', 290, wxH - 30)
    ctx.fillText('水位计', 168, wxH - 334)
    ctx.fillText('物位计', 86, wxH - 334)
    ctx.fillText('主机', 245, wxH - 334)

    //设备参数显示
    ctx.fillText('1#水泵：200', 66, 70)
    ctx.fillText('2#水泵：200', 166, 70)
    ctx.fillText('主机：开', 266, 70)
    ctx.fillText('提篮格栅：开', 66, 100)
    ctx.fillText('截污阀：开', 166, 100)
    ctx.fillText('排水阀门：开', 266, 100)

    // ctx.fillText('截污体系', 215, wxH - 190)
    ctx.fillText('水位监控', 160, wxH - 300)
    ctx.setFontSize(18)
    ctx.fillText('一体化智能截污井', 100, 40)

    ctx.beginPath();
    ctx.setLineWidth(10);
    ctx.setLineJoin('round');
    ctx.setStrokeStyle('blue');
    ctx.moveTo(226, wxH - 100);
    ctx.lineTo(226, wxH - num);
    if (num>=286) {
      ctx.lineTo(numW, wxH - num);
    }
    if (that.data.shuibeng == 1) {
      ctx.moveTo(155, wxH - 100);
      ctx.lineTo(155, wxH - num);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.draw()

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