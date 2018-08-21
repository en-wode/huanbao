var wxDraw = require("../../utils/wxdraw.js").wxDraw;
var Shape = require("../../utils/wxdraw.js").Shape;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: {
      width: 300,
      heigth: 300
    },
    shuibeng1: '关',
    shuibeng2: '关',
    liftingGrid: '停',
    // 水面高度 1超过管道 0低于管道
    wtheight: 1,
    socketdata: {},
    canw: wx.getSystemInfoSync().windowHeight,
    tilan: 150,
    paishui: 150,
    paishui1: 150,
    water: 250,
    out: '',
    river: '',
    waterlevel: '',
    // chaoguo: true,
    // riverchaoguo: true,
    start: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    const that = this;
    // 连接socket

    var starta = null;
    that.tree(); //基础图案
    that.wind();
    var header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionid")//读取cookie
    };
    wx.request({
      url: app.globalData.url + 'io/getData',
      method: 'GET',
      header: header,
      data: {
        equipmentId: option.equipid
      },
      success: function (d) {
        d = d.data.result
        if (d.equipmentId != option.equipid) {
          return
        } else {
          that.setData({
            socketdata: d,
            paishui1: 80 * (1-d.sluiceOpeningDegree / d.sewerageSluice) + 110
          })
          that.startcanvas()
        }
      }
    })
    app.globalData.cvtime = setInterval(function () {
      wx.request({
        url: app.globalData.url + 'io/getData',
        method: 'GET',
        header: header,
        data: {
          equipmentId: option.equipid
        },
        success: function (d) {
          d = d.data.result
          if (d.equipmentId != option.equipid) {
            return
          } else {
            that.setData({
              socketdata: d,
              paishui1: 80 * (1 -d.sluiceOpeningDegree / d.sewerageSluice) + 110
            })
            that.startcanvas()
          }
        }
      })
    }, 2000)

    that.sheb()
    // 每40ms执行一次drawClock()，人眼看来就是流畅的画面
    setTimeout(function () {
      that.data.start = setInterval(that.drawClock, 40);
    }, 1000)
  },
  tree: function (ctx, wxH, wxW) {
    const that = this
    var ctx = wx.createCanvasContext('two');
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

    ctx.beginPath()
    ctx.setLineWidth(10)
    ctx.setStrokeStyle('#A6A6A6')

    //左侧墙壁
    ctx.moveTo(50, wxH - 300 - 50);
    // ctx.lineTo(50, wxH - 300 / 2 - 100);
    // ctx.moveTo(50, wxH - 300 / 2 - 25);
    ctx.lineTo(50, wxH - 50);

    //右侧管道
    ctx.moveTo(wxW - 74, wxH - 300 / 2 - 100);
    ctx.lineTo(wxW - 30, wxH - 300 / 2 - 100);
    ctx.moveTo(wxW - 74, wxH - 300 / 2 - 25);
    ctx.lineTo(wxW - 30, wxH - 300 / 2 - 25);
    //右侧墙壁
    ctx.moveTo(wxW - 70, wxH - 300 - 50);
    ctx.lineTo(wxW - 70, wxH - 300 / 2 - 100);
    ctx.moveTo(wxW - 70, wxH - 300 / 2 - 25);
    ctx.lineTo(wxW - 70, wxH - 50);


    //封底
    ctx.moveTo(0, wxH - 50)
    ctx.lineTo(wxW - 50, wxH - 50)

    ctx.moveTo(wxW - 50, wxH - 50)
    ctx.lineTo(wxW, wxH - 50)
    ctx.stroke();

    //主机
    ctx.drawImage("/assets/images/zhuji.png", wxW - 105, wxH - 350, 30, 30);

    //树
    ctx.drawImage("/assets/images/tree.jpg", 300, wxH - 456, 66, 106);
    ctx.drawImage("/assets/images/tree3.jpg", 5, wxH - 450, 66, 106);

    //土壤
    ctx.drawImage("/assets/images/soil.jpg", 0, wxH - 350, 50, 300);

    ctx.drawImage("/assets/images/soil.jpg", wxW - 70, wxH - 350, 40, 100);
    ctx.drawImage("/assets/images/soil.jpg", wxW - 70, wxH - 300 / 2 - 25, 40, 130);
    // ctx.drawImage("/assets/images/soil.jpg", 0, wxH-50, wxW, 50);

    //主机箱
    ctx.beginPath();
    ctx.setLineWidth(5);
    ctx.setLineJoin('round');
    ctx.setStrokeStyle('white');
    ctx.moveTo(wxW - 108, wxH - 350);
    ctx.lineTo(wxW - 108, wxH - 316);
    ctx.lineTo(wxW - 75, wxH - 316);
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
    ctx.fillText('提篮格栅', 65, wxH - 30)
    ctx.fillText('水泵1', 130, wxH - 30)
    ctx.fillText('水泵2', 200, wxH - 30)
    ctx.fillText('截污阀', 260, wxH - 30)
    ctx.fillText('排水阀门', 300, wxH - 30)
    ctx.fillText('河道水位', 360, wxH - 30)
    ctx.fillText('水位计', 168, wxH - 334)
    ctx.fillText('物位计', 106, wxH - 334)
    ctx.fillText('主机', 245, wxH - 334)

    ctx.fillText('水位监控', 160, wxH - 300)
    ctx.setFontSize(18)
    ctx.fillText('一体化智能截污井', 114, 40)
    ctx.draw()

  },
  sheb: function () {
    const that = this
    var ctx = wx.createCanvasContext('five');
    var wxH = wx.getSystemInfoSync().windowHeight;
    var wxW = wx.getSystemInfoSync().windowWidth;

    //水泵管道
    ctx.beginPath();
    ctx.setLineWidth(10);
    ctx.setLineJoin('round');
    ctx.setStrokeStyle('white');
    ctx.moveTo(246, wxH - 100);
    ctx.lineTo(246, wxH - 286);
    ctx.lineTo(50, wxH - 286);
    ctx.moveTo(175, wxH - 100);
    ctx.lineTo(175, wxH - 286);
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

    ctx.drawImage("/assets/images/tilan.png", 75, wxH - 270, 50, 220);

    //水流方向
    ctx.drawImage("/assets/images/right.png", wxW - 60, wxH - 220, 36, 26);
    //水泵水流方向
    ctx.drawImage("/assets/images/upward.png", 190, wxH - 210, 22, 46);

    //水泵 阀门 提篮
    ctx.drawImage("/assets/images/shuibeng.png", 130, wxH - 135, 50, 80);
    ctx.drawImage("/assets/images/shuibeng.png", 200, wxH - 135, 50, 80);
    ctx.drawImage("/assets/images/jiewu.png", 260, wxH - 190, 45, 135);

    //测量计
    ctx.drawImage("/assets/images/camera.png", 82, wxH - 352, 26, 26);
    ctx.drawImage("/assets/images/survey.png", 82, wxH - 352, 26, 26);
    ctx.drawImage("/assets/images/survey.png", wxW - 60, wxH - 253, 26, 26);
    ctx.drawImage("/assets/images/survey.png", 200, wxH - 352, 26, 26);

    //右侧排水阀门
    ctx.drawImage("/assets/images/paishui.png", wxW - 94, wxH - 274, 24, 190);

    //设备名称
    // ctx.setFontSize(12)
    // ctx.setFillStyle('black')
    // ctx.fillText('水流方向', 8, wxH - 225)
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
  },
  startcanvas() {
    const that = this;
    var wxH = wx.getSystemInfoSync().windowHeight;
    let numH2 = 106;
    let numH1 = 106;
    let numW2 = 222;
    let numW1 = 150;

    let numl1 = 175;
    let numl2 = 246;
    let timer1 = null;
    let timer2 = null;
    let st1 = 0;   //是否启动动画水泵1
    let st2 = 0;    //是否启动动画水泵2

    if (that.data.shuibeng1 !== that.data.socketdata.waterPump1) {
      that.setData({
        shuibeng1: that.data.socketdata.waterPump1,
      })
      if (that.data.shuibeng1 == '开') {
        st1 = 1;
      } else {
        st1 = 0;
      }
    }
    if (that.data.shuibeng2 !== that.data.socketdata.waterPump2) {
      that.setData({
        shuibeng2: that.data.socketdata.waterPump2,
      })
      if (that.data.shuibeng2 == '开') {
        st2 = 1
      } else {
        st2 = 0
      }
    }
    if (st1 == 1) {
      timer1 = setInterval(() => {
        if (numH1 === 286 && numW1 <= 50) {
          clearInterval(timer1);
        } else if (numH1 === 286 && numW1 > 50) {
          numW1--
        } else {
          numH1++
        }
        that.water(numW1, numH1, numl1)
      }, 1000 / 60)
    }
    if (st2 == 1) {
      timer2 = setInterval(() => {
        if (numH2 === 286 && numW2 <= 50) {
          clearInterval(timer2);
        } else if (numH2 === 286 && numW2 > 50) {
          numW2--
        } else {
          numH2++
        }
        that.water(numW2, numH2, numl2)
      }, 1000 / 60)
    }

    //井内水位井外水位对比
    if ((that.data.socketdata.waterLevelInWell - that.data.socketdata.riveRaterLevel) > 0) {
      that.setData({
        out: '高于',
      })
    } else if (that.data.socketdata.waterLevelInWell == that.data.socketdata.riveRaterLevel) {
      that.setData({
        out: '停止'
      })
    } else {
      that.setData({
        out: '高于'
      })
    }
    //井内水位
    if (((that.data.socketdata.inletPipeHeight / 100 + that.data.socketdata.sewerageSluice / 1000) - (that.data.socketdata.waterLevelInWell - (that.data.socketdata.bottomHoleHeight - 10000) / 100) > 0) && ((that.data.socketdata.waterLevelInWell - (that.data.socketdata.bottomHoleHeight - 10000) / 100) - (that.data.socketdata.inletPipeHeight / 100) > 0)) {
      that.setData({
        waterlevel: '停止',
      })
    } else if (that.data.socketdata.waterLevelInWell - ((that.data.socketdata.bottomHoleHeight - 10000) / 100) - (that.data.socketdata.inletPipeHeight / 100 + that.data.socketdata.sewerageSluice / 1000) > 0) {
      that.setData({
        waterlevel: '高于'
      })
    } else if (that.data.socketdata.waterLevelInWell - (that.data.socketdata.bottomHoleHeight - 10000) / 100 < that.data.socketdata.inletPipeHeight / 100) {
      that.setData({
        waterlevel: '低于'
      })
    }
    //河道水位
    if (((that.data.socketdata.inletPipeHeight / 100 + that.data.socketdata.sewerageSluice / 1000) - (that.data.socketdata.riveRaterLevel - (that.data.socketdata.bottomHoleHeight - 10000) / 100) > 0) && ((that.data.socketdata.riveRaterLevel - (that.data.socketdata.bottomHoleHeight - 10000) / 100) - (that.data.socketdata.inletPipeHeight / 100) > 0)){
      that.setData({
        river: '停止',
      })
    } else if (that.data.socketdata.riveRaterLevel - (that.data.socketdata.bottomHoleHeight - 10000) / 100 - (that.data.socketdata.inletPipeHeight / 100 + that.data.socketdata.sewerageSluice / 1000) > 0) {
      that.setData({
        river: '高于'
      })
    } else if (((that.data.socketdata.riveRaterLevel - (that.data.socketdata.bottomHoleHeight - 10000) / 100) - that.data.socketdata.inletPipeHeight / 100 < 0) || (that.data.socketdata.riveRaterLevel == "???")) {
      that.setData({
        river: '低于'
      })
    }
    console.log(that.data.socketdata.inletPipeHeight / 100)
    console.log(that.data.socketdata.sewerageSluice/1000)
    console.log(that.data.socketdata.riveRaterLevel - (that.data.socketdata.bottomHoleHeight - 10000) / 100)
    console.log(that.data.socketdata.waterLevelInWell - (that.data.socketdata.bottomHoleHeight - 10000) / 100)
    console.log(that.data.waterlevel)
    // if (that.data.socketdata.waterLevelInWell < (that.data.socketdata.truncatedPipeHeight / 100 + (that.data.socketdata.bottomHoleHeight - 10000) / 100)) {
    //   that.setData({
    //     chaoguo: false
    //   })
    // } else {
    //   that.setData({
    //     chaoguo: true
    //   })
    // }

    // if ((that.data.socketdata.riveRaterLevel - (that.data.socketdata.bottomHoleHeight - 10000) / 100)  < (that.data.socketdata.truncatedPipeHeight / 100 + (that.data.socketdata.bottomHoleHeight - 10000) / 100)) {
    //   that.setData({
    //     riverchaoguo: true
    //   })
    // } else {
    //   that.setData({
    //     riverchaoguo: false
    //   })
    // }
  },
  water(numW, numH, numl) {
    const that = this;
    function showwater() {
      //创建画布设置画布属性
      const ctx = wx.createCanvasContext('three');
      drawwater(ctx, numW, numH, numl);
    }
    function drawwater(ctx, numW, numH, numl) {
      ctx.beginPath();
      ctx.setLineWidth(10);
      ctx.setLineJoin('round');
      ctx.setStrokeStyle('blue');
      ctx.moveTo(numl, that.data.canw - 100);
      ctx.lineTo(numl, that.data.canw - numH);
      if (numH >= 286) {
        ctx.lineTo(numW, that.data.canw - numH);
      }
      ctx.stroke();
      ctx.closePath();
      ctx.draw(true)
    }
    showwater()
  },
  drawtilan(ctx, wxH, wxW) {
    const that = this;
    if (that.data.tilan >= 300 || that.data.tilan <= 100) {
    } else if (that.data.socketdata.liftingGrid == '升') {
      that.setData({
        tilan: that.data.tilan + 1
      })
    } else if (that.data.socketdata.liftingGrid == '降') {
      that.setData({
        tilan: that.data.tilan - 1
      })
    } else if (that.data.socketdata.liftingGrid == '停') {
      // that.setData({
      //   tilan: that.data.tilan + 1
      // })
    }
    function drawwater(ctx, wxH, wxW) {
      ctx.beginPath();
      ctx.setLineWidth(1);
      ctx.setLineJoin('round');
      ctx.setStrokeStyle('black');
      ctx.moveTo(95, wxH - 335);
      ctx.lineTo(95, wxH - that.data.tilan);
      ctx.drawImage("/assets/images/basket.png", 80, wxH - that.data.tilan, 30, 30);
      ctx.stroke();
      ctx.closePath();
    }
    drawwater(ctx, wxH, wxW)
  },
  drawpaishui(ctx, wxW, wxH) {
    const that = this;
    if (Math.abs(that.data.paishui - that.data.paishui1) < 2) {

    } else if (that.data.paishui > that.data.paishui1) {
      that.setData({
        paishui: that.data.paishui - 1
      })
    } else if (that.data.paishui < that.data.paishui1) {
      that.setData({
        paishui: that.data.paishui + 1
      })
    }

    function drawpaishui(ctx, wxW, wxH) {
      ctx.beginPath(); //that.data.paishui -  154  that.data.paishui - 230
      ctx.setLineWidth(4);
      ctx.moveTo(wxW - 82, wxH - that.data.paishui + 20);
      ctx.lineTo(wxW - 82, wxH - that.data.paishui - 70);
      ctx.stroke();
      ctx.closePath();
    }
    drawpaishui(ctx, wxW, wxH)
  },
  drawwrite(ctx) {
    const that = this;
    function drawwrite(ctx) {
      ctx.beginPath();
      ctx.restore()
      ctx.setFontSize(12)
      ctx.setFillStyle('black')
      ctx.fillText('1#水泵：' + that.data.socketdata.waterPump1, 66, 70)
      ctx.fillText('2#水泵：' + that.data.socketdata.waterPump2, 166, 70)
      ctx.fillText('主机：' + that.data.socketdata.hydraulicPumpMotor, 266, 70)
      ctx.fillText('提篮格栅：' + that.data.socketdata.basketGrille, 66, 100)
      ctx.fillText('截污阀：' + that.data.socketdata.sluiceSluiceSwitch, 166, 100)
      ctx.fillText('排水阀门：' + that.data.socketdata.sluiceSwitch, 266, 100)
    }
    drawwrite(ctx)
  },
  drawwater: function () {
    const that = this;
    var ctx = wx.createCanvasContext('four');
    var wxH = wx.getSystemInfoSync().windowHeight;
    var wxW = wx.getSystemInfoSync().windowWidth;
    function water() {
      ctx.beginPath();
      const wrd = ctx.createLinearGradient(0, wxH - 300, 0, wxH - 20);
      wrd.addColorStop(0, '#63B8FF');
      wrd.addColorStop(0.6, '#1C86EE');
      wrd.addColorStop(1, '#0000FF');
      ctx.setFillStyle(wrd);

      if (that.data.waterlevel == '高于') {
        if (that.data.water >= 280 || that.data.water <= 120) {
        } else {
          that.setData({
            water: that.data.water + 1
          })
        }
        ctx.fillRect(50, wxH - that.data.water, wxW - 120, 300 + (wxH - 350 - (wxH - that.data.water)));
        if (that.data.out == '低于') {
          ctx.fillRect(wxW - 30, wxH - 290, 30, 240);
          ctx.fillRect(wxW - 70, wxH - 250, 50, 75);
        } else if (that.data.river == '高于') {
          ctx.fillRect(wxW - 70, wxH - 250, 50, 75);
          ctx.fillRect(wxW - 30, wxH - 270, 30, 220);
        } else if (that.data.river == '停止') {
          ctx.fillRect(wxW - 70, wxH - 210, 50, 30);
          ctx.fillRect(wxW - 30, wxH - 210, 30, 160);
        } else if (that.data.river == '低于'){
          console.log('低于1', 'rever')
          ctx.fillRect(wxW - 30, wxH - 140, 30, 90);
        }

      } else if (that.data.waterlevel == '停止') {
        console.log('停止')
        if (that.data.water <= 200) {
        } else {
          that.setData({
            water: that.data.water - 1
          })
        }
        if (that.data.river == '低于') {
          console.log('低于', 'rever')
          ctx.fillRect(wxW - 30, wxH - 140, 30, 90);
        } else if (that.data.river == '高于') {
          console.log('高于', 'rever')
          ctx.fillRect(wxW - 70, wxH - 250, 50, 75);
          ctx.fillRect(wxW - 30, wxH - 270, 30, 220);
        } else if (that.data.river == '停止') {
          if (that.data.out == '高于'){
            console.log('高于1', 'rever')
            ctx.fillRect(wxW - 70, wxH - 190, 50, 10);
            ctx.fillRect(wxW - 30, wxH - 190, 30, 140);
          } else if (that.data.out == '低于') {
            console.log('低于1', 'rever')
            ctx.fillRect(wxW - 30, wxH - 210, 30, 160);
            ctx.fillRect(wxW - 70, wxH - 210, 40, 30);
          } else {
            console.log('0', 'rever')
            ctx.fillRect(wxW - 30, wxH - 180, 30, 220);
          }
        }

        ctx.fillRect(50, wxH - that.data.water, wxW - 120, 300 + (wxH - 350 - (wxH - that.data.water)));

        // ctx.fillRect(30, wxH - that.data.water, 50, that.data.water - 180);
        // ctx.fillRect(wxW - 80, wxH - that.data.water, 50, that.data.water - 180);
      } else if (that.data.waterlevel == '低于') {
        console.log('低于')
        if (that.data.water <= 160) {
        } else {
          that.setData({
            water: that.data.water - 1
          })
        }
        console.log(that.data.out, '对比')
        ctx.fillRect(50, wxH - that.data.water, wxW - 120, 300 + (wxH - 350 - (wxH - that.data.water)));
        if (that.data.river == '高于') {
          console.log('高于', 'river')
          ctx.fillRect(wxW - 70, wxH - 250, 50, 75);
          ctx.fillRect(wxW - 30, wxH - 270, 30, 220);
        } else if (that.data.river == '停止') {
          console.log('停止', 'river')
          ctx.fillRect(wxW - 70, wxH - 190, 40, 10);
          ctx.fillRect(wxW - 30, wxH - 190, 30, 140);
        } else if (that.data.out == '高于') {
          console.log('低于', 'river')
          ctx.fillRect(wxW - 30, wxH - 150, 30, 100);
        } else if (that.data.out == '低于'){
          console.log('低于2', 'river')
          ctx.fillRect(wxW - 30, wxH - 165, 30, 115);
        } else if (that.data.out == '停止') {
          console.log('低于2', 'river')
          ctx.fillRect(wxW - 30, wxH - 160, 30, 110);
        }
        // 左右俩边河道水位
        // console.log('低于')
        // if (that.data.riverchaoguo) {
        //   ctx.fillRect(wxW - 30, wxH - 130, 40, 80);
        // } else {
        //   ctx.fillRect(wxW - 70, wxH - 250, 50, 75);
        //   ctx.fillRect(wxW - 30, wxH - 270, 30, 220);
        // }
        // if (!that.data.chaoguo) {
        //   if (that.data.water <= 300) {
        //   } else {
        //     that.setData({
        //       water: that.data.water - 1
        //     })
        //   }
        //   ctx.fillRect(50, wxH - that.data.water, wxW - 120, 300 + (wxH - 350 - (wxH - that.data.water)));

        // } else {
        //   if (that.data.water <= 140) {
        //   } else {
        //     that.setData({
        //       water: that.data.water - 1
        //     })
        //   }
        //   ctx.fillRect(50, wxH - that.data.water, wxW - 120, 300 + (wxH - 350 - (wxH - that.data.water)));
        // }
      }
      ctx.stroke();
      ctx.draw()
    }
    water()
  },
  drawClock: function () {
    const that = this
    var ctx = wx.createCanvasContext('first');
    var wxH = wx.getSystemInfoSync().windowHeight;
    var wxW = wx.getSystemInfoSync().windowWidth;
    function Clock(ctx, wxH, wxW) {
      // 实时获取各个参数
      // 依次执行各个方法
      that.drawwater(); //水位高度
      that.drawtilan(ctx, wxH, wxW);    //tilan
      that.drawpaishui(ctx, wxW, wxH); //排水阀门
      that.drawwrite(ctx);    //数据显示
      // 微信小程序要多个draw才会画出来，所以在最后画出
      ctx.draw();
    }
    // 执行Clock这个方法，实际上执行了所有步骤
    Clock(ctx, wxH, wxW);
  },
  onUnload: function () {
    const that = this;
    clearInterval(that.data.start);
    clearInterval(app.globalData.cvtime)
    // app.socket().close();
  },
  onHide: function () {
    const that = this;
    clearInterval(that.data.start);
    clearInterval(app.globalData.cvtime)
    // app.socket().close();
  }
})