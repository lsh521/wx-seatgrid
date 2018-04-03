/**
 * @ngdoc function
 * @name university.filters: filters
 * @description
 * # format second to 'xx小时xx分xx秒'
 */
angular
	.module('university')
	.filter('secondToHour', function () {
		return function (second) {
			if (isNaN(second)) {
				return '0秒';
			}
			var timeStr = parseInt(second) + '秒';
			if (parseInt(second) > 60) {
				var second1 = parseInt(second) % 60;
				var minute = parseInt(second / 60);
				timeStr = minute + '分' + second1 + '秒';
				if (minute > 60) {
					minute = parseInt(second / 60) % 60;
					var hour = parseInt(parseInt(second / 60) / 60);
					timeStr = hour + '小时' + minute + '分' + second1 + '秒';
					if (hour > 24) {
						hour = parseInt(parseInt(second / 60) / 60) % 24;
						var day  = parseInt(parseInt(parseInt(second / 60) / 60) / 24);
						timeStr = day + '天' + hour + '小时' + minute + '分' + second1 + '秒';
					}
				}
			}
			return timeStr;
		};
	})
  .filter('to_trusted', ['$sce', function ($sce) {
  return function (text) {
    return $sce.trustAsHtml(text);
  };
}]);
