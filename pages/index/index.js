//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    background: 'https://cdn.iciba.com/news/word/big_20180103b.jpg'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
          background: res.data.fenxiang_img
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '微信小程序',
      desc: 'Stay hungry, stay foolish!',
      path: '/pages/index/index'
    }
  }
})
