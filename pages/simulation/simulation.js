// pages/simulation/simulation.js
var wxDraw = require("../../utils/wxdraw.js").wxDraw;
var Shape = require("../../utils/wxdraw.js").Shape;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(380, 100);
    ctx.setStrokeStyle('green');
    ctx.stroke();
    ctx.draw(true);
  }
})