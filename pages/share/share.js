Page({
  data: {
    background: 'https://cdn.iciba.com/news/word/big_20180103b.jpg',
    shareTitle: '每日一句',
    shareContent: 'Stay hungry, stay foolish!',
    shareUrl: '',
    shareRes:{}
  },
  onLoad: function () {
    this.requestData();
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
            if (res.statusCode == 200) {
              console.log("tmp file url : " + res.tempFilePath)
              that.setData({
                background: res.tempFilePath
              })
              that.drawShare(res.tempFilePath, sRes)
            }
          }
        })
      }
    })
  },
  drawShare: function (imgPath, sRes) {
    var ctx = wx.createContext()
    var screenWidth = wx.getSystemInfoSync().windowWidth
    var screenHeight = wx.getSystemInfoSync().screenHeight
    // 小程序码宽度
    var qrWidth = 80
    // 小程序码边距
    var qrMargin = screenHeight * 0.02
    // 小程序码路径
    var qrPath = '../../img/ic_wx_mini.jpg'

    // 画背景图
    // ctx.drawImage(this.data.background, 0, 0, screenWidth, screenHeight - 30)
    // ctx.save()

    // 画白色背景
    ctx.setFillStyle("#FFFFFF")
    ctx.fillRect(0, 0, screenWidth, screenHeight)
    ctx.save()

    // 画右上角几何图形
    ctx.setLineWidth(5)
    ctx.setStrokeStyle("#079dd8")
    ctx.setFillStyle("#079dd8")
    ctx.beginPath()
    ctx.moveTo(30, 0)
    ctx.lineTo(screenWidth - 30, 70)
    ctx.lineTo(screenWidth, 55)
    ctx.lineTo(screenWidth, 0)
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

    // 画每日一句-英文
    ctx.setFontSize(26)
    ctx.setFillStyle("#BBBBBB")
    console.log("shareRes : " + sRes);
    var arr = this.txt2arr(ctx, sRes.content, screenWidth * 0.75, true)
    // console.log(arr)
    for (var i = 0; i < arr.length; i++) {
      ctx.fillText('' + arr[i], 15, screenHeight * 145 / 1000 + (i + 1) * 27)
    }
    ctx.save()

    // 画每日一句-中文
    ctx.setFontSize(14)
    ctx.setFillStyle("#7D7D7D")
    ctx.fillText(sRes.note, 15, screenHeight * 375 / 1000)
    ctx.save()

    // 画配图
    var picY = screenHeight * 0.4
    var picHeight = screenWidth * 580 / 938
    ctx.drawImage(this.data.background, 0, picY, screenWidth, picHeight)
    ctx.save()

    // 画渐变
    var grd = ctx.createLinearGradient(screenWidth / 2, picY - 2, screenWidth / 2, picY * 1.3);
    grd.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grd.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, picY - 2, screenWidth, picHeight / 3)
    ctx.save()

    // 画底部梯形
    var blueHeight = picY + picHeight;
    ctx.setLineWidth(5)
    ctx.setStrokeStyle("#079dd8")
    ctx.setFillStyle("#079dd8")
    ctx.beginPath()
    ctx.moveTo(0, blueHeight - screenWidth * 70 / 640)
    ctx.lineTo(screenWidth, blueHeight)
    ctx.lineTo(screenWidth, screenHeight)
    ctx.lineTo(0, screenHeight)
    ctx.lineTo(0, blueHeight - screenWidth * 70 / 640)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.save()

    // 画小编的话
    ctx.setFontSize(12)
    ctx.setFillStyle("#FFFFFF")
    var arr2 = this.txt2arr(ctx, sRes.translation, screenWidth * 0.6)
    console.log(arr)
    var startHeight = blueHeight * 1.04
    for (var j = 0; j < arr2.length; j++) {
      ctx.fillText('' + arr2[j], 15, startHeight + j * 18)
    }
    ctx.save()

    // 画小程序码
    ctx.setLineWidth(1)
    ctx.beginPath()
    ctx.arc(screenWidth - qrWidth / 2 - qrMargin, screenHeight - qrWidth / 2 - qrMargin, qrWidth / 2, 0, 2 * Math.PI)
    ctx.setStrokeStyle("#ffff00")
    ctx.stroke()
    ctx.clip()
    ctx.drawImage(qrPath, screenWidth - qrWidth - qrMargin, screenHeight - qrWidth - qrMargin, qrWidth, qrWidth)
    ctx.save()

    wx.drawCanvas({
      canvasId: 'canvas',
      actions: ctx.getActions()
    })
  },
  click: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '保存当前图片到相册，然后可以分享到朋友圈',
      success: function() {
        wx.showToast({
          title: '图片保存中...',
        })
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          success: function (res) {
            // console.log("图片保存到本地成功 " + res.tempFilePath);
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
      if (ctx.measureText(temp).width < width) {
        ;
      } else {
        row.push(temp);
        temp = "";
      }
      temp += chr[i];
      temp += (isEng ? " " : "");
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
