var app = getApp()
var util = require('../../../../util/util.js');
var WxParse = require('../../../../wxParse/wxParse.js');
var coordtransform = require('../../../../coordtransform/index.js');
var QQMapWX = require('../../../../libs/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.min.js');
var wxMarkerData = [];
function getSiteDetail(optionsId,that) {
  wx.request({
    url: app.globalData.domainName + '/api/sites/' + optionsId + '/detail?openid='+that.data.openid,
    data: {
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      that.setData({
        showloading: true,
      })
      WxParse.wxParse('describe', 'html', res.data.data.site_obj.describe, that, 5)
      // 进入详情页
        res.data.data.site_obj.poster = app.globalData.domainName + res.data.data.site_obj.poster
      var latitude = res.data.data.site_obj.location_y;
      var longitude = res.data.data.site_obj.location_x;
      // 百度加密坐标转火星坐标
      var bd09togcj02 = coordtransform.bd09togcj02(res.data.data.site_obj.location_x, res.data.data.site_obj.location_y);
      console.log(bd09togcj02)
      latitude = bd09togcj02[1]
      longitude = bd09togcj02[0]
      that.data.markers[0].latitude = latitude;
      that.data.markers[0].longitude = longitude
      that.setData({
        latitude: latitude,
        longitude: longitude,
        markers: that.data.markers
      })
      that.setData({
        siteinfo: res.data.data
      })
      console.log(res.data.data.site_obj.tel)
      var allTimearray = [];
      for (var g = 0; g < 7; g++) {
        var weektemp = {
          "0": "周日",
          "1": "周一",
          "2": "周二",
          "3": "周三",
          "4": "周四",
          "5": "周五",
          "6": "周六",
        }
        var dateobj = {};
        console.log(util.getweek(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * g))
        dateobj.date = util.numformatTime(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * g)
        dateobj.week = weektemp[util.getweek(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * g)]
        dateobj.choose = false
        allTimearray.push(dateobj)
      }
      allTimearray[0].date = "今天"
      allTimearray[0].choose = true;
      console.log(allTimearray)

      that.setData({ dates: allTimearray })
  //  获取时间
    },
    fail: function () {
      console.log("fail")
    }
  });
};
Page({
  data: {
    phone:180,
    markers: [],
    placeData: {},
    markers: [{
      id: 0,
      width: 20,
      height: 20,
    }],
    Ad_list: ["../../../../image/poster.png","../../../../image/poster.png"],
    showloading: false
  },
  openloction:function(){
    var that=this
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude =that.data.latitude
          var longitude = that.data.longitude
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28
          })
        }
      })
  },
  onLoad: function (options) {
    // 获取用户信息
    wx.login({
      success: function (res) {
        _getUserInfo
        wx.request
          ({
            url: app.globalData.domainName+'/api/sites/user/openid?js_code=' + res.code,
            data: {
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.setData({
                id: res.data.data.id,
                openid: res.data.data.openid
              })

              _getUserInfo()
            },
            fail: function () {
              console.log("fail")
            }
          })
      }
    })
    function _getUserInfo() {
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            userInfo: res.userInfo
          })
          that.setData({
            optionId: options.id
          })
          getSiteDetail(options.id,that)
          console.log(that.data.userInfo);
        }
      })
    }
    var that = this

   },
   reserve:function(e){
     console.log(e)
     var datestring;
     if (e.target.dataset.date==="今天"){
       datestring = Date.parse(new Date())
     }else{
       datestring =Date.parse(new Date(new Date().getFullYear() + '-' + e.target.dataset.date));
     }
     console.log(datestring)
     wx.navigateTo({
       url: '../seats/index?date='+datestring
     })
   }
})
