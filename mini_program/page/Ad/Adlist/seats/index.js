// import data from './data'
const App = getApp()
var util = require('../../../../util/util.js');
Page({
  data: {
    scrollTop:0,
    data: {
      "code": 200,
      "msg": {
        "seatingPlan": {
          "ajaxSeatBeanList": [
            { name: "羽毛球1号场", money: 25, start: "6:00", end: "21:00", noUser: [{ time: "9：00-12:00" }, { time: "16：00-18:00" }, { time: "19：00-20:00" }], want: [{ time: "13:00-14:00", num: 10 }] },
            { name: "羽毛球2号场", money: 35, start: "8:00", end: "20:00", noUser: [{ time: "8：00-11:00" }, { time: "16：00-18:00" }, { time: "19：00-20:00" }], want: [{ time: "13:00-14:00", num: 10 }] },
            { name: "羽毛球3号场", money: 45, start: "9:00", end: "24:00", noUser: [{ time: "8：00-12:00" }, { time: "16：00-17:00" }, { time: "19：00-20:00" }], want: [{ time: "13:00-14:00", num: 8, me: true }, { time: "20:00-21:00", num: 1, me: false }] }, { name: "羽毛球1号场", money: 25, start: "6:00", end: "21:00", noUser: [{ time: "9：00-12:00" }, { time: "16：00-18:00" }, { time: "19：00-20:00" }], want: [{ time: "13:00-14:00", num: 10 }] }, { name: "羽毛球4号场", money: 35, start: "8:00", end: "20:00", noUser: [{ time: "8：00-11:00" }, { time: "16：00-18:00" }, { time: "19：00-20:00" }], want: [{ time: "13:00-14:00", num: 10 }] },
            { name: "羽毛球5号场", money: 45, start: "9:00", end: "24:00", noUser: [{ time: "8：00-12:00" }, { time: "16：00-17:00" }, { time: "19：00-20:00" }], want: [{ time: "13:00-14:00", num: 8, me: true }, { time: "20:00-21:00", num: 1, me: false }] }, { name: "羽毛球6号场", money: 35, start: "8:00", end: "20:00", noUser: [{ time: "8：00-11:00" }, { time: "16：00-18:00" }, { time: "19：00-20:00" }], want: [{ time: "13:00-14:00", num: 10 }] },
            { name: "羽毛球7号场", money: 45, start: "9:00", end: "24:00", noUser: [{ time: "8：00-12:00" }, { time: "16：00-17:00" }, { time: "19：00-20:00" }], want: [{ time: "13:00-14:00", num: 8, me: true }, { time: "20:00-21:00", num: 1, me: false }] }
          ]
        }
      }
    }
    },
  onLoad(options) {
    // 获取当前7天后的日期
    console.log(new Date().toLocaleDateString())
    var allTimearray=[];
    for(var g=0;g<7;g++){
      var weektemp={
        "0":"周日",
        "1": "周一",
        "2": "周二",
        "3": "周三",
        "4": "周四",
        "5": "周五",
        "6": "周六",
      }
      var dateobj={};
      console.log(util.getweek(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * g))
      dateobj.date = util.numformatTime(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * g)
      dateobj.week = weektemp[util.getweek(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * g)]
      // dateobj.choose=false
      console.log(util.numformatTime(parseFloat(options.date)))
      console.log(util.numformatTime(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * g))
      if (util.numformatTime(parseFloat(options.date)) == util.numformatTime(Date.parse(new Date()) + 1000 * 60 * 60 * 24 * g)){
        dateobj.choose = true;
      }else{
        dateobj.choose= false;
      }
      allTimearray.push(dateobj)
    }
    allTimearray[0].date="今天"
    console.log(allTimearray)

    this.setData({ dates: allTimearray})
    console.log(this)

    var startsort = [];
    var endsort = [];
    var ajaxSeatBeannew = [];
    for (var i = 0; i < this.data.data.msg.seatingPlan.ajaxSeatBeanList.length; i++) {
      startsort.push(parseFloat(this.data.data.msg.seatingPlan.ajaxSeatBeanList[i].start.split(":")[0]))
      endsort.push(parseFloat(this.data.data.msg.seatingPlan.ajaxSeatBeanList[i].end.split(":")[0]))
    }
    this.data.data.msg.seatingPlan.maxColumnIndex = this.data.data.msg.seatingPlan.ajaxSeatBeanList.length
    this.data.data.msg.seatingPlan.maxRowIndex = endsort.reverse()[0] - startsort.sort()[0];
    var time = [];
    var startmintime = startsort.sort()[0]
    var endmaxtime = endsort.sort().reverse()[0]
    for (var j = startmintime; j <= endmaxtime; j++) {
      time.push(j + ":00")
    }
    // console.log(data.msg.seatingPlan.maxRowIndex)
    this.setData({ time: time })
    var startsort2 = [];
    var endsort2 = [];
    for (var s = 0; s < this.data.data.msg.seatingPlan.ajaxSeatBeanList.length; s++){
      startsort2.push(parseFloat(this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].start.split(":")[0]))
      endsort2.push(parseFloat(this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].end.split(":")[0]))
      // 取到不可用的时间段
      var nouserarry = [];
      for (var q = 0; q < this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].noUser.length; q++) {
        nouserarry.push(this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].noUser[q].time)
      }
      var hourtime = []
      // 取到每个格子不可以用的时间1小时
      for (var e = 0; e < nouserarry.length; e++) {
        var max = parseFloat(nouserarry[e].split("-")[1].split(":")[0])
        var min = parseFloat(nouserarry[e].split("-")[0].split(":")[0])
        for (var r = min; r < max; r++) {
          hourtime.push(r)
        }
      }
      var keyong = [];
      var keyongtemp = [];
      var keyongarry = [];
      var startmax = parseFloat(startsort2[s])
      var endmax = parseFloat(endsort2[s])
      for (var y = startmax; y < endmax; y++) {
        keyongarry.push(y)
      }
      for (var a = 0; a < hourtime.length; a++) {
        keyongtemp[hourtime[a]] = true;
      }
      console.log(keyongtemp)
      console.log(hourtime)
      for (var z = 0; z < keyongarry.length; z++) {
        if (!keyongtemp[keyongarry[z]]) {
          console.log(keyongarry[z])
          keyong.push(keyongarry[z])
        };
      }
      //  取到所有可用时间段
     
      for (var o = 0; o < keyong.length; o++) {
        var keyongobj = {};
        keyongobj.rowIndex = keyong[o] - parseFloat(time[0].split(":")[0])+1
        keyongobj.columnIndex=s+1
        keyongobj.disabled=false
        keyongobj.money = this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].money
        keyongobj.label = this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].name
        keyongobj.time = keyong[o] + ":00" + "-"+(parseInt(keyong[o])+1)+":00"
        for (var c = 0; c < this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].want.length;c++){
          console.log(keyongobj.rowIndex)
          console.log(this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].want[c])
          // 给加想去人数
          var wanttime = parseFloat(this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].want[c].time.split("-")[0].split(":")[0]) - parseFloat(time[0].split(":")[0]) + 1
          if (wanttime === keyongobj.rowIndex){
            if (this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].want[c].me===true){
              keyongobj.disabled = true;
            }else{
              keyongobj.loveFlag = this.data.data.msg.seatingPlan.ajaxSeatBeanList[s].want[c].num}
          }
      }
        keyongobj.id = keyongobj.rowIndex + "-"+keyongobj.columnIndex
        console.log(keyongobj)
        ajaxSeatBeannew.push(keyongobj)
      }
    } 
    this.data.data.msg.seatingPlan.ajaxSeatBeanList=[];
    this.data.data.msg.seatingPlan.ajaxSeatBeanList=ajaxSeatBeannew
    console.log(this.data.data.msg.seatingPlan.ajaxSeatBeanList)
    this.initSeats()
    // console.log(this.data)
  },
  initSeats() {
    const seatingPlan = this.data.data.msg.seatingPlan
    const maps = seatingPlan.ajaxSeatBeanList
    const maxRowIndex = seatingPlan.maxRowIndex
    const maxColumnIndex = seatingPlan.maxColumnIndex
    console.log(maps)
    this.$wuxSeats = App.Wux().$wuxSeats.init('movie', {
      maps: maps,
      maxRowIndex: maxRowIndex,
      maxColumnIndex: maxColumnIndex,
      max: 4,
      onSelect(items) {
        this.page.setData({
          scrollTop: this.page.data.scrollTop + 100
        })
        console.log(items)
        var num=0
        for (var d = 0; d < items.length;d++){
          num += items[d].money
        }
        console.log(num)
        this.page.setData({
          items,
          total: (num).toFixed(2)
        })
      },
    })
    this.$wuxSeats.disabled([`4520200`])
  },
  intothisDay:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(this.data.data)
    console.log(id)
    for (var i = 0; i < this.data.dates.length;i++){
      if (this.data.dates[i].choose===true){
        this.data.dates[i].choose = false
      }
      if (this.data.dates[i].date===id){
        this.data.dates[i].choose=true
         }else{
        this.data.dates[i].choose =false
         }
    }
    this.setData({ dates: this.data.dates })
    console.log(this.data.dates)

    // 重新请求数据
    this.setData({ data: this.data.data })
  },
  IwantGo:function(){
    this.setData({

    })
  }
})