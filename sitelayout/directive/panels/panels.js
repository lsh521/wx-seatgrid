/**
 * @ngdoc function
 * @name university.panels: paneltolls
 * @description
 * # the oper menu of panel directives
 */

angular
	.module('app.panels')
	.directive('paneltool', function ($compile, $timeout) {
		return {
			restrict: 'E',
			scope: false,
			link: function (scope, element, attrs) {
				var templates = {
					/* jshint multistr: true */
					collapse: '<a panel-collapse="" uib-tooltip="" ng-click="{{panelId}} = !{{panelId}}"> \
							<em ng-show="{{panelId}}" class="fa fa-plus ng-no-animation"></em> \
							<em ng-show="!{{panelId}}" class="fa fa-minus ng-no-animation"></em> \
							</a>',
					dismiss: '<a href="#" panel-dismiss="" uib-tooltip="Close Panel">\
							<em class="fa fa-times"></em>\
							</a>',
					refresh: '<a href="#" panel-refresh="" data-spinner="{{spinner}}" uib-tooltip="">\
							<em class="fa fa-refresh"></em>\
							</a>'
				};
				var tools = scope.panelTools || attrs;
				$timeout(function () {
					element.html(getTemplate(element, tools)).show();
					// angular js show html dynamic
					$compile(element.contents())(scope);
					element.addClass('pull-right');
				});
				var getTemplate = function (elem, attrs) {
					var temp = '';
					attrs = attrs || {};
					if (attrs.toolCollapse) {
						temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')));
					}
					if (attrs.toolDismiss) {
						temp += templates.dismiss;
					}
					if (attrs.toolRefresh) {
						temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
					}
					return temp;
				};
			}
		};
	});

angular
	.module('app.panels')
	.directive('panelRefresh', function () {
		return {
			restrict: 'A',
			scope: false,
			controller: function ($scope, $element) {
				var refreshEvent = 'panel-refresh',
				whirlClass = 'whirl',
				defaultSpinner = 'traditional';
				// catch clicks to toggle panel refresh
				$element.on('click', function (e) {
					e.preventDefault();
					var $this   = $(this),
					panel   = $this.parents('.panel').eq(0),
					spinner = $this.data('spinner') || defaultSpinner;
					// start showing the spinner
					panel.addClass(whirlClass + ' ' + spinner);
					// Emit event when refresh clicked
					$scope.$emit(refreshEvent, panel.attr('id'));
					// listen to remove spinner
					$scope.$on('removeSpinner', function (ev, id) {
						console.log(ev);
						console.log(id);
						if (!id) { return; }
						var newid = id.charAt(0) === '#' ? id : ('#'+id);
						angular
							.element(newid)
							.removeClass(whirlClass);
					});
				});
			}
		};
	});
