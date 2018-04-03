var coordtransform = require('../../../coordtransform/index.js');
var app = getApp()
function getsiteList(that, x, y,distance) {
  console.log('begin------')
  console.log(x+'--'+y)
  // 获取所有场地
  wx.request({
    url: app.globalData.domainName + '/api/sites/list/app?openid=' + that.data.openid+'&x='+x+'&y='+y+'&scope='+distance,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      that.setData({
        showloading: true,
      })
      console.log("---------------------")
      console.log(res)
      // 升序
      res.data.data.sort(function (a, b) { return a.distance - b.distance });
      for (var i = 0; i < res.data.data.length; i++) {
        console.log(res.data.data[i].site_obj.poster)
        // 加个地址
        res.data.data[i].site_obj.poster = app.globalData.domainName + res.data.data[i].site_obj.poster
        if (res.data.data[i].site_obj.top==true){
          var str = res.data.data.splice(i, 1);
          res.data.data.unshift(str[0]);
        }
      }
      that.setData({
        Ad_list: res.data.data
      })
      console.log(that.data.Ad_list);
    },
    fail: function () {
      console.log("fail");
    }
  })
}
Page({
data:{
  array:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,'所有'],
  modalHidden1: true,
  modalHidden:true,
  distance:10,
  index:1,
  showloading:false
},
bindPickerChange: function (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    index: e.detail.value
  })
  if (this.data.array[this.data.index]=="所有"){
    this.data.array[this.data.index]=100000
  }
  console.log(this.data.array[this.data.index]);
  getsiteList(this, this.data.x, this.data.y, this.data.array[this.data.index])
 
},
Confirm:function(){
    this.setData({
      modalHidden: true
    })
  },
Confirm1: function () {
    this.setData({
      modalHidden1: true
    })
},
onPullDownRefresh: function () {
  //下拉  
  console.log("下拉");
  // var that = this;
  getsiteList(this, this.data.x, this.data.y, this.data.distance)
  // this.onLoad();
  // 刷新
}, 
onLoad:function(options){
  wx.login({
  success:function(data){
    wx.request({
      url: app.globalData.domainName+'/api/sites/user/openid?js_code=' + data.code,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ 
          id:res.data.data.id,
          openid: res.data.data.openid
        })
        console.log(that.data.openid)
        _getUserInfo()
      },
      fail: function () {
        console.log("获取用户登录态失败！")
      }
    })
  }
  });
  function _getUserInfo() {
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        })
        console.log(that.data.userInfo);
        that.data.userInfo.icon = that.data.userInfo.avatarUrl;
        that.data.userInfo.tel = '';
        that.data.userInfo.nickname = that.data.userInfo.nickName
        // 发送用户信息
        wx.request
          ({
            url: app.globalData.domainName+'/api/sites/' + that.data.id + '/user/info/update',
            data: that.data.userInfo,
            method: 'PUT',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.getLocation({
                 type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                  success:function(res){
                   console.log(res)
                   var x = res.longitude;
                   var y = res.latitude; 
                   console.log(x+"+"+y)
                   var gcj02tobd09 = coordtransform.gcj02tobd09(x, y);
                   console.log(gcj02tobd09)
                   that.setData({
                     x: gcj02tobd09[0],
                     y: gcj02tobd09[1]
                   })
                   getsiteList(that, that.data.x, that.data.y,10)
                  } 
                  })
            },
            fail: function () {
              console.log("fail")
            }
          })
      }
    })
  }
  var that = this;
},
search:function(e){
  // 搜索
  var distance = this.data.distance;
  getsiteList(this, this.data.x,this.data.y,distance)
},
intoDetail:function(e){
  // 跳转进入详情页
  var id = e.currentTarget.dataset.id;
  console.log(id)
  wx.navigateTo({
    url: '../Adlist/AdDetail/AdDetail?id='+id
  })
},
getvalue:function(e){
  // 获取picker里value；
    console.log(e.detail.value)
    this.setData({
      distance: e.detail.value
    })
  },
enshrine:function(e){
  // 收藏
  var id = e.currentTarget.dataset.id;
  var that=this
  // 提交收藏
  submitAnswer(id)
  function submitAnswer(id) {
    console.log(app.globalData.openid)
    wx.request({
      url: app.globalData.domainName + '/api/sites/' + id + '/enshrine',
      method: 'POST',
      data: {
        wx_user_id: that.data.id,
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          modalHidden: false
        })
        console.log(that.data.x + ',' + that.data.y)
        // 获取列表
        getsiteList(that, that.data.x, that.data.y, that.data.array[that.data.index])
      },
      fail: function () {
        console.log("fail")
      }
    });
  };
},
unenshrine: function (e) {
  // 取消收藏
    var id = e.currentTarget.dataset.id;
    var that = this
    // 提交取消收藏
    submitAnswer(id)
    function submitAnswer(id) {
      console.log(app.globalData.openid)
      wx.request({
        url: app.globalData.domainName + '/api/sites/' + id + '/unenshrine',
        method: 'POST',
        data: {
          wx_user_id: that.data.id,
          openid: that.data.openid
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            modalHidden1: false
          })
          console.log(that.data.x+','+ that.data.y)
          // 获取列表
          getsiteList(that, that.data.x, that.data.y, that.data.array[that.data.index])
        },
        fail: function () {
          console.log("fail")
        }
      });
    };
  }
})
