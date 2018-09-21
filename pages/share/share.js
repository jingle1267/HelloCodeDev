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
    
    // this.drawShare();
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
        that.setData({
          background: res.data.fenxiang_img,
          shareTitle: '每日一句' + res.data.dateline,
          shareContent: res.data.note,
          shareUrl: res.data.fenxiang_img,
          shareRes: res.data
        })
        wx.downloadFile({
          url: res.data.fenxiang_img,
          success (res) {
            if (res.statusCode == 200) {
              console.log("tmp file url : " + res.tempFilePath)
              that.setData({
                background: res.tempFilePath
              })
              that.drawShare(res.tempFilePath)
            }
          }
        })
      }
    })
  },
  drawShare: function(imgPath) {
    var ctx = wx.createContext()
    var screenWidth = wx.getSystemInfoSync().windowWidth
    var screenHeight = wx.getSystemInfoSync().screenHeight
    // 小程序码宽度
    var qrWidth = 80
    // 小程序码边距
    var qrMargin = 6
    // 小程序码路径
    var qrPath = '../../img/ic_wx_mini.jpg'

    console.log("");

    // 画背景图
    ctx.drawImage(this.data.background, 0, 0, screenWidth, screenHeight - 30)
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
    // var date = new Date()
    // ctx.setFontSize(40)
    // ctx.setFillStyle("#FF8700")
    // ctx.fillText('' + date.getDate(), 15, 70)
    // ctx.setFontSize(20)
    // ctx.fillText('' + (date.getMonth() + 1) + '.' + date.getFullYear(), 70, 70)
   
    // 画每日一句

    // 画配图

    // 乎底部梯形

    // 画小编的话

    // 画底部矩阵
    // 画右上角几何图形
    ctx.setLineWidth(5)
    ctx.setStrokeStyle("#079dd8")
    ctx.setFillStyle("#079dd8")
    ctx.fillRect(0, screenHeight - 40, screenWidth, 40)
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
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showToast({
              title: '保存成功，可在微信中分享',
              icon: '',
              image: '',
              duration: 0,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        })
        
      }
    }, this)
  }
})
