let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let time = 0;//从按下到松开共多少时间*100
let dateArr = [];
let curDateIndex = 100;
var ctx;
let showToast = true;

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
    console.log("onLoad()");
    this.initDateArr();
    wx.startPullDownRefresh();
    
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
  onPullDownRefresh() {
    // 下拉刷新
    if (!this.loading) {
      curDateIndex = 0;
      this.requestData();
    }
  },
  initDateArr: function() {
    
    /**
      *对Date的扩展，将 Date 转化为指定格式的String
      *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
      *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
      *例子：
      *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
      *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
      */
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }

    var todayDate = new Date();
    var startDate = new Date(Date.parse('2018-01-01'))
    console.log('todayDate', todayDate.getTime())
    console.log('startDate', startDate.getTime())
    // 可以查看到明天的数据
    while (startDate.getTime() < todayDate.getTime()) {
      // console.log('startDate:', startDate.format("yyyy-MM-dd"))
      dateArr.push(startDate.format("yyyy-MM-dd"));
      startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    }
  },
  requestData: function () {
    var that = this;
    let title = dateArr[(dateArr.length - 1 - curDateIndex) % dateArr.length];
    console.log('== title:', title);
    wx.request({
      url: 'https://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=' + title + '&_=1576034193213',
      method: 'GET',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json',
        'Referer': 'http://www.iciba.com/'
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        // console.log(res.data)
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
        wx.showLoading({
          title: '拼命加载中...'
        })
        wx.downloadFile({
          url: shareUrl,
          success (res) {
            console.log(res)
            wx.hideLoading()
            if (res.statusCode == 200) {
              console.log("tmp file url : " + res.tempFilePath)
              that.setData({
                background: res.tempFilePath
              })
              that.drawShare(res.tempFilePath, sRes)
            } else {
              console.error('Download image error.')
            }
          }
        })
      }
    })
  },
  drawShare: function (imgPath, sRes) {
    console.log("== drawShare()");
    var that = this
    
    if (!ctx) {
      ctx = wx.createCanvasContext('canvas')
    }
    // var ctx = wx.createCanvasContext('canvas')
    // ctx.clearRect();
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
    console.log('== drawDate()');
    var that = this
    // 画白色背景
    ctx.save()
    ctx.setFillStyle("#FFFFFF")
    ctx.fillRect(0, 0, that.data.screenWidth, that.data.screenHeight)

    // 画右上角几何图形
    ctx.restore()
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
    // ctx.restore()

    // 画日期
    var date = new Date()
    ctx.save()
    ctx.setFontSize(40)
    ctx.setFillStyle("#FF8700")
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    ctx.fillText(day, 15, 65)
    ctx.setFontSize(20)
    ctx.fillText(month + '.' + date.getFullYear(), 70, 65)
    // ctx.restore()

    ctx.draw(true, function(){
      // console.log("callback1")
      setTimeout(function() {
        // console.log("callback11")
        that.drawMemo(ctx, sRes)
        ctx.restore()
      }, 200)
    })
  },
  drawMemo: function (ctx, sRes) {
    console.log('== drawMemo()');
    var that = this
    // 画每日一句-英文
    ctx.save()
    ctx.setFontSize(22)
    ctx.setFillStyle("#BBBBBB")
    console.log("shareRes : " + sRes);
    var arr = this.txt2arr(ctx, sRes.content, that.data.screenWidth * 0.9, true)
    // console.log(arr)
    for (var i = 0; i < arr.length; i++) {
      ctx.fillText('' + arr[i], 15, that.data.screenHeight * 170 / 1000 + (i + 1) * 28)
    }
    // ctx.restore()

    // // 画每日一句-中文
    // ctx.setFontSize(14)
    // ctx.setFillStyle("#7D7D7D")
    // // ctx.fillText(sRes.note, 15, screenHeight * 375 / 1000)
    // var arrZH = this.txt2arr(ctx, sRes.note, that.data.screenWidth * 0.9, false)
    // // console.log(arrCH)
    // for (var k = 0; k < arrZH.length; k++) {
    //   ctx.fillText('' + arrZH[k], 15, that.data.screenHeight * 345 / 1000 + (k + 1) * 16)
    // }
    // ctx.save()
    ctx.draw(true, function() {
      // console.log("callback2")
      setTimeout(function () {
        that.drawPic(ctx, sRes)
        ctx.restore()
      }, 200)
    })
  },
  drawPic: function (ctx, sRes) {
    // console.log("callback23")
    ctx.save()
    var that = this
    // 画配图
    var picY = that.data.screenHeight * 0.4
    var picHeight = that.data.screenWidth * 580 / 938
    ctx.drawImage(this.data.background, 0, picY, that.data.screenWidth, picHeight)
    // ctx.restore()

    // 画渐变
    ctx.save()
    var grd = ctx.createLinearGradient(that.data.screenWidth / 2, picY - 2, that.data.screenWidth / 2, picY * 1.3);
    grd.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grd.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, picY - 2, that.data.screenWidth, picHeight / 3)
    // ctx.restore()

    // 画底部梯形
    // blueHeight 蓝色提醒的高度，画二维码会用到这个高度值
    that.setData({
      blueHeight: picY + picHeight
    })
    var blueHeight = that.data.blueHeight;
    ctx.save()
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
    // ctx.restore()
    ctx.draw(true, function () {
      // console.log("callback3")
      setTimeout(function () {
        that.drawQR(ctx, sRes)
        ctx.restore()
      }, 200)
    })
  },
  drawQR: function (ctx, sRes) {
    var that = this
    // 小程序码宽度
    var qrWidth = 70
    // 小程序码边距
    var qrMargin = that.data.screenHeight * 0.03
    // 小程序码路径
    var qrPath = '../../img/ic_wx_mini.jpg'
    // 画小编的话
    ctx.save()
    ctx.setFontSize(14)
    ctx.setFillStyle("#FFFFFF")
    // var arr2 = this.txt2arr(ctx, sRes.translation, that.data.screenWidth * 0.6)
    var arr2 = this.txt2arr(ctx, sRes.note, that.data.screenWidth * 0.7)
    console.log(arr2)
    var startHeight = that.data.blueHeight * 1.06
    for (var j = 0; j < arr2.length; j++) {
      ctx.fillText('' + arr2[j], 15, startHeight + j * 24)
    }
    // ctx.restore()

    // 画小程序码
    // ctx.setLineWidth(1)
    ctx.save()
    ctx.shadowOffsetX = 0; // 阴影Y轴偏移
    ctx.shadowOffsetY = 0; // 阴影X轴偏移
    ctx.shadowBlur = 10; // 模糊尺寸
    ctx.shadowColor = 'rgba(0, 0, 0, 1)'; // 颜色
    ctx.beginPath()
    ctx.arc(that.data.screenWidth - qrWidth / 2 - qrMargin, that.data.screenHeight - qrWidth / 2 - qrMargin, qrWidth / 2, 0, 2 * Math.PI)
    ctx.setStrokeStyle("#ffffff")
    
    ctx.stroke()
    ctx.clip()
    ctx.drawImage(qrPath, that.data.screenWidth - qrWidth - qrMargin, that.data.screenHeight - qrWidth - qrMargin, qrWidth, qrWidth)

    ctx.draw(true, function () {
      if (showToast) {
        wx.showToast({
          title: '左右滑动有惊喜哟~~',
          icon: 'none'
        })
        showToast = false
      }
      // console.log("callback4")
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
  // 触摸开始事件
  touchStart: function (e) {
    console.log("touchStart");
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    console.log("touchEnd");
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        console.log('curDateIndex:', curDateIndex);
        if (tmX < 0) {
          console.log("左滑=====")
          this.reduceIndex()
        } else {
          console.log("右滑=====")
          this.addIndex()
        }
        this.requestData();
      }
      if (absY > absX * 2 && tmY < 0) {
        console.log("上滑动=====")
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
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
  addIndex: function() {
    curDateIndex++
    if (curDateIndex >= dateArr.length) {
      curDateIndex = 0
    }
  },
  reduceIndex: function() {
    curDateIndex--
    if (curDateIndex < 0) {
      curDateIndex = dateArr.length - 1;
    }
  },
  onShareAppMessage: function(res) {
    var that = this;
    console.log("shareContent : " + that.data.shareContent);
    return {
      title: that.data.shareContent
    }
  }
})
