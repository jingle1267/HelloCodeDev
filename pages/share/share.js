Page({
  data: {
    background: 'https://cdn.iciba.com/news/word/big_20180103b.jpg',
    shareTitle: '每日一句',
    shareContent: 'Stay hungry, stay foolish!',
    shareUrl: '',
    shareRes:{},
    screenWidth: 720,
    screenHeight: 1080,
    blueHeight: 500
  },
  onLoad: function () {
    this.requestData();
    this.setData({
      screenWidth: wx.getSystemInfoSync().windowWidth,
      screenHeight: wx.getSystemInfoSync().screenHeight
    })
  },
  onShow: function () {
    //this.requestData();
  },
  onReady: function (e) {
    console.log("onReady")
  },
  requestData: function () {
    var that = this;
    wx.request({
      url: 'https://open.iciba.com/dsapi',
      method: 'GET',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        // var shareUrl = '' + res.data.fenxiang_img
        var shareUrl = '' + res.data.picture2
        console.log("shareUrl 1: " + shareUrl)
        // http://cdn.iciba.com/news/word/http://cdn.iciba.com/news/word/big_20191127b.jpg
        shareUrl = shareUrl.toLocaleLowerCase().replace('http://cdn.iciba.com/news/word/http://cdn.iciba.com/news/word/', 'http://cdn.iciba.com/news/word/')
        shareUrl = shareUrl.toLocaleLowerCase().replace('http:', 'https:')
        console.log("shareUrl 2: " + shareUrl)
        var sRes = res.data
        that.setData({
          background: shareUrl,
          shareTitle: '每日一句' + res.data.dateline,
          shareContent: res.data.note,
          shareUrl: shareUrl,
          shareRes: sRes
        })
        console.log("shareContent : " + that.data.shareContent);
        console.log("shareTitle : " + that.data.shareTitle);
        console.log("shareUrl : " + that.data.shareUrl);
        wx.downloadFile({
          url: shareUrl,
          success (res) {
            console.log(res)
            if (res.statusCode == 200) {
              console.log("tmp file url : " + res.tempFilePath)
              that.setData({
                background: res.tempFilePath
              })
              that.drawShare(res.tempFilePath, sRes)
            } else {
              console.log('Download image error.')
            }
          }
        })
      }
    })
  },
  drawShare: function (imgPath, sRes) {
    var that = this
    var ctx = wx.createCanvasContext('canvas')
    console.log('screenWidth : ' + that.data.screenWidth)
    console.log('screenHeight : ' + that.data.screenHeight)

    // 画背景图
    // ctx.drawImage(this.data.background, 0, 0, screenWidth, screenHeight - 30)
    // ctx.save()

    this.drawDate(ctx, sRes)

    // this.drawMemo(ctx, sRes)

    // this.drawPic(ctx)

    // this.drawQR(ctx, sRes)

    if (true) {
      return;
    }

    // wx.drawCanvas({
    //   canvasId: 'canvas',
    //   actions: ctx.getActions()
    // })
  },
  drawDate: function(ctx, sRes) {
    var that = this
    // 画白色背景
    ctx.setFillStyle("#FFFFFF")
    ctx.fillRect(0, 0, that.data.screenWidth, that.data.screenHeight)
    ctx.save()

    // 画右上角几何图形
    ctx.setLineWidth(1)
    ctx.setStrokeStyle("#079dd8")
    ctx.setFillStyle("#079dd8")
    ctx.beginPath()
    ctx.moveTo(that.data.screenWidth * 100 / 640, 0)
    ctx.lineTo(that.data.screenWidth - that.data.screenWidth * 100 / 640, that.data.screenHeight * 140 / 1000)
    ctx.lineTo(that.data.screenWidth, that.data.screenHeight * 110 / 1000)
    ctx.lineTo(that.data.screenWidth, 0)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.save()

    // 画日期
    var date = new Date()
    ctx.setFontSize(40)
    ctx.setFillStyle("#FF8700")
    ctx.fillText('' + date.getDate(), 15, 65)
    ctx.setFontSize(20)
    ctx.fillText('' + (date.getMonth() + 1) + '.' + date.getFullYear(), 70, 65)
    ctx.save()

    ctx.draw(true, function(){
      console.log("callback1")
      setTimeout(function() {
        console.log("callback11")
        that.drawMemo(ctx, sRes)
      }, 200)
    })
  },
  drawMemo: function (ctx, sRes) {
    var that = this
    // 画每日一句-英文
    ctx.setFontSize(22)
    ctx.setFillStyle("#BBBBBB")
    console.log("shareRes : " + sRes);
    var arr = this.txt2arr(ctx, sRes.content, that.data.screenWidth * 0.9, true)
    // console.log(arr)
    for (var i = 0; i < arr.length; i++) {
      ctx.fillText('' + arr[i], 15, that.data.screenHeight * 145 / 1000 + (i + 1) * 24)
    }
    ctx.save()

    // 画每日一句-中文
    ctx.setFontSize(14)
    ctx.setFillStyle("#7D7D7D")
    // ctx.fillText(sRes.note, 15, screenHeight * 375 / 1000)
    var arrZH = this.txt2arr(ctx, sRes.note, that.data.screenWidth * 0.9, false)
    // console.log(arrCH)
    for (var k = 0; k < arrZH.length; k++) {
      ctx.fillText('' + arrZH[k], 15, that.data.screenHeight * 345 / 1000 + (k + 1) * 16)
    }
    ctx.save()
    ctx.draw(true, function() {
      console.log("callback2")
      setTimeout(function () {
        that.drawPic(ctx, sRes)
      }, 200)
    })
  },
  drawPic: function (ctx, sRes) {
    console.log("callback23")
    var that = this
    // 画配图
    var picY = that.data.screenHeight * 0.4
    var picHeight = that.data.screenWidth * 580 / 938
    ctx.drawImage(this.data.background, 0, picY, that.data.screenWidth, picHeight)
    ctx.save()

    // 画渐变
    var grd = ctx.createLinearGradient(that.data.screenWidth / 2, picY - 2, that.data.screenWidth / 2, picY * 1.3);
    grd.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grd.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, picY - 2, that.data.screenWidth, picHeight / 3)
    ctx.save()

    // 画底部梯形
    // blueHeight 蓝色提醒的高度，画二维码会用到这个高度值
    that.setData({
      blueHeight: picY + picHeight
    })
    var blueHeight = that.data.blueHeight;
    ctx.setLineWidth(5)
    ctx.setStrokeStyle("#079dd8")
    ctx.setFillStyle("#079dd8")
    ctx.beginPath()
    ctx.moveTo(0, blueHeight - that.data.screenWidth * 70 / 640)
    ctx.lineTo(that.data.screenWidth, blueHeight)
    ctx.lineTo(that.data.screenWidth, that.data.screenHeight)
    ctx.lineTo(0, that.data.screenHeight)
    ctx.lineTo(0, blueHeight - that.data.screenWidth * 70 / 640)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.save()
    ctx.draw(true, function () {
      console.log("callback3")
      setTimeout(function () {
        that.drawQR(ctx, sRes)
      }, 200)
    })
  },
  drawQR: function (ctx, sRes) {
    var that = this
    // 小程序码宽度
    var qrWidth = 80
    // 小程序码边距
    var qrMargin = that.data.screenHeight * 0.02
    // 小程序码路径
    var qrPath = '../../img/ic_wx_mini.jpg'
    // 画小编的话
    ctx.setFontSize(12)
    ctx.setFillStyle("#FFFFFF")
    var arr2 = this.txt2arr(ctx, sRes.translation, that.data.screenWidth * 0.6)
    console.log(arr2)
    var startHeight = that.data.blueHeight * 1.04
    for (var j = 0; j < arr2.length; j++) {
      ctx.fillText('' + arr2[j], 15, startHeight + j * 18)
    }
    ctx.save()

    // 画小程序码
    ctx.setLineWidth(1)
    ctx.beginPath()
    ctx.arc(that.data.screenWidth - qrWidth / 2 - qrMargin, that.data.screenHeight - qrWidth / 2 - qrMargin, qrWidth / 2, 0, 2 * Math.PI)
    ctx.setStrokeStyle("#ffff00")
    ctx.stroke()
    ctx.clip()
    ctx.drawImage(qrPath, that.data.screenWidth - qrWidth - qrMargin, that.data.screenHeight - qrWidth - qrMargin, qrWidth, qrWidth)
    ctx.save()

    ctx.draw(true, function () {
      console.log("callback4")
    })
  },
  click: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '保存当前图片到相册，然后可以分享到朋友圈',
      success: function(res) {
        if (res.confirm) {
          wx.canvasToTempFilePath({
            canvasId: 'canvas',
            success: function (res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res) {
                  // console.log("图片保存到相册成功");
                  wx.showToast({
                    title: '保存成功'
                  })
                },
                fail: function (res) {
                  console.log("图片保存到本地失败")
                }
              })
            },
            fail: function (res) {
              console.log("保存到本地失败");
            }
          }, that)
        }
      }
    })
    
  },
  /**
   * 文本转换为数组，数组里面分别是每行的文本内容，支持英文分行
   * 
   * ctx Context
   * txt 待换行的文本
   * width 需要显示文本的最大宽度
   * isEng 是否是英文
   */
  txt2arr: function (ctx, txt, width, isEng) {
    var chr = txt.split(isEng ? " " : "");
    var temp = "";
    var row = [];

    for (var i = 0; i < chr.length; i++) {
      var cur = chr[i];
      var tempWidth = ctx.measureText(temp).width;
      var curWidth = ctx.measureText(cur).width;
      // 需要考虑英文换行问题
      if (tempWidth + curWidth < width) {
        temp += cur;
        temp += (isEng ? " " : "");
      } else {
        row.push(temp);
        temp = "";
        temp += cur;
        temp += (isEng ? " " : "");
      }
    }

    row.push(temp);
    return row;
  },
  onShareAppMessage: function(res) {
    var that = this;
    console.log("shareContent : " + that.data.shareContent);
    return {
      title: that.data.shareContent
    }
  }
})
