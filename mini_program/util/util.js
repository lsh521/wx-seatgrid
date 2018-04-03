function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}
function numformatTime(ns) {
  var date = new Date(ns);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
  return M + D;
  // return new Date(parseInt(ns)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "); ;    
}
function getweek(ns) {
  var date = new Date(ns);
  date.getDay();
  return date.getDay()
}
module.exports = {
  numformatTime:numformatTime,
  formatTime: formatTime,
  getweek: getweek,
  formatLocation: formatLocation
}
