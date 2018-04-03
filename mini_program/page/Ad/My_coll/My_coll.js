var app = getApp()
function getsiteList(that) {
  wx.request({
    url: app.globalData.domainName + '/api/sites/enshrine/list?openid=' + that.data.openid,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      that.setData({
        showloading: true,
      })
      console.log(res)
      for (var i = 0; i < res.data.data.items.length; i++) {
        res.data.data.items[i].site_obj.poster = app.globalData.domainName + res.data.data.items[i].site_obj.poster
      }
      if (!res.data.data.items || res.data.data.items.length==0){
        that.setData({
          modalHidden1: false
        })
      }
      that.setData({
        Ad_list: res.data.data.items
      })
      console.log(that.data.Ad_list);
    },
    fail: function () {
      console.log("fail");
    }
  })
}
Page({
  data: {
    modalHidden:true,
    modalHidden1: true,
    showloading:false
  },
  Confirm: function () {
    this.setData({
      modalHidden: true
    })
  },
  Confirm1: function () {
    this.setData({
      modalHidden1: true
    })
    wx.navigateTo({
      url: '../Adlist/Adlist'
    })
  },
  // onPullDownRefresh: function () {
  //   //下拉  
  //   console.log("下拉");
  //   var that = this
  //   this.onLoad();
  // }, 
  onLoad: function (e) {
    var that=this
    // 获取用户信息
    wx.login({
      success: function (res) {
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
                openid: res.data.data.openid,
                id: res.data.data.id,
                user: res.data.data
              })
              getsiteList(that)
            },
            fail: function () {
              console.log("fail")
            }
          })
      }
    })
  },
  intoDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../Adlist/AdDetail/AdDetail?id=' + id
    })
  }
})