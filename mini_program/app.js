const openIdUrl = require('./config').openIdUrl
Object.assign = Object.assign && typeof Object.assign === 'function' ? Object.assign : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key] } } } return target }
Array.from = Array.from && typeof Array.from === 'function' ? Array.from : obj => [].slice.call(obj)

import Wux from 'page/component/wux'
import WxValidate from 'assets/plugins/WxValidate'

//app.js
App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo && this.globalData.openid) {
      typeof cb == "function" && cb(this.globalData.userInfo) && cb(this.globalData.openid)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          console.log(res.code);
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
          if (res.code) {
            console.log(res.code);
            wx.request({
              url: 'https://icecream.boringkiller.cn/api/sites/user/openid?js_code=' +res.code,
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data.data.openid)
                that.globalData.id = res.data.data.id
                that.globalData.openid = res.data.data.openid
                typeof cb == "function" && cb(that.globalData.userInfo) && cb(this.globalData.openid)
              },
              fail: function () {
                console.log("获取用户登录态失败！")
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }

          typeof cb == "function" && cb(that.globalData.userInfo, that.globalData.openid)
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    openid: null
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    openid: null,
    domainName: 'https://icecream.boringkiller.cn'
  },
  Wux: Wux,
  WxValidate: (rules, messages) => new WxValidate(rules, messages), 
})