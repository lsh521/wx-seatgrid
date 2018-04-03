/**
 * @ngdoc function
 * @name university.utils: now
 * @description
 * # show current date and time
 */
angular
	.module('app.utils')
	.directive('now', function (dateFilter, $interval) {
		return {
			restrict: 'AE',
			link: function (scope, element, attrs) {
				var format = attrs.format;
				var update = function () {
					var datetime = dateFilter(new Date(), format);
					element.text(datetime);
				};
				update();
				var interval = $interval(update, 1000);
				scope.$on('destroy', function () {
					$interval.cancel(interval);
				});
			}
		};
	});
