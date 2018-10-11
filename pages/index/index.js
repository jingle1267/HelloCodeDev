//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    background: 'https://cdn.iciba.com/news/word/big_20180103b.jpg',
    shareTitle: '每日一句',
    shareContent: 'Stay hungry, stay foolish!',
    shareUrl: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // this.requestData();
    wx.redirectTo({
      url: '../share/share',
    })
  },
  onShow: function () {
    this.requestData();
  },
  // onPullDownRefreash: function () {
  //   this.requestData();
  // },
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
          shareUrl: res.data.fenxiang_img
        })
      }
    })
  },
  onShareAppMessage: function () {
    var that = this;
    console.log(that.data.shareTitle);
    return {
      title: that.data.shareTitle,
      desc: that.data.shareContent,
      path: '/pages/index/index'
    }
  },
  share: function () {
    
  }
})
