/**
 * @ngdoc function
 * @name university.charts: flot-chart
 * @description
 * # flot-chart
 */
angular
	.module('app.charts')
	.directive('flot', function ($http, $timeout) {
		return {
			restrict: 'EA',
			template: '<div></div>',
			scope: {
				dataset: '=?',
				options: '=',
				series: '=',
				callback: '=',
				src: '='
            },
            link: function (scope, element, attrs) {
            	var height, plot, plotArea, width;
            	var heightDefault = 220;
            	plot = null;
            	width = attrs.width || '100%';
            	height = attrs.height || heightDefault;
            	plotArea = $(element.children()[0]);
            	plotArea.css({
					width: width,
					height: height
				});
				var init = function () {
					var plotObj;
					if (!scope.dataset || !scope.options) {
						return;
					}
					plotObj = $.plot(plotArea, scope.dataset, scope.options);
					scope.$emit('plotReady', plotObj);
					if (scope.callback) {
						scope.callback(plotObj, scope);
					}

					return plotObj;
				};

				var onDatasetChanged = function (dataset) {
					if (plot) {
						plot.setData(dataset);
						plot.setupGrid();
						return plot.draw();
					} else {
						plot = init();
						onSerieToggled(scope.series);
						return plot;
					}
				};
				var $watchOff1 = scope.$watchCollection('dataset', onDatasetChanged, true);

				var onSerieToggled = function (series) {
					function toggleFor(sName) {
						return function(s, i) {
							if (someData[i] && someData[i][sName]) {
								someData[i][sName].show = s;
							}
						};
					}
					if (!plot || !series) {
						return;
					}
					var someData = plot.getData();
					for (var sName in series) {
						angular.forEach(series[sName], toggleFor(sName));
					}

					plot.setData(someData);
					plot.draw();
					
				};
				var $watchOff2 = scope.$watch('series', onSerieToggled, true);

				var onSrcChanged = function (src) {
					if (src) {
						$http.get(src)
							.success(function(data) {
								$timeout(function() {
									scope.dataset = data;
								});

							}).error(function() {
								$.error('Flot chart: Bad request.');
							});
					}
				};
				var $watchOff3 = scope.$watch('src', onSrcChanged);

				scope.$on('$destroy', function(){
					// detach watches and scope events
					$watchOff1();
					$watchOff2();
					$watchOff3();
					// destroy chart
					plot.destroy();
				});
			}
		};
	});
