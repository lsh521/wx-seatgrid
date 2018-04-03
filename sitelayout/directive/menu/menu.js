/**
 * @ngdoc function
 * @name university.directive: menu
 * @description
 * # relative menu directive
 */
angular
	.module('app.sidebar')
	.directive('sidebar', function ($rootScope, $state, $timeout, $window, Utils) {
		return {
			restrict: 'AE',
			template: '<nav class="sidebar" ng-transclude></nav>',
			transclude: true,
			replace: true,
			link: function (scope, element, attrs) {
				var $win = angular.element($window);
				// get current route name
				var currentState = $state.current.name;
				var $sidebar = element;
				console.log(Utils.isTouch());
				var eventName = Utils.isTouch() ? 'click' : 'mouseenter';
				var subNav = $();

				$sidebar.on(eventName, '.nav > li', function () {
					if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {
						subNav.trigger('mouseleave');
						subNav = toggleMenuItem($(this), $sidebar);
						// use to detect click and touch events outside the sidebar
						sidebarAddBackdrop();
					}
				});
				var eventOff1 = scope.$on('closeSidebarMenu', function () {
					removeFloatingNav();
				});
				// mormalize state when resize to mobile
				$win.on('resize.sidebar', function () {
					if (!Utils.isMobile()) {
						asideToggleOff();
					}
				});
				// adjustment on route changes
				var eventOff2 = $rootScope.$on('$stateChangeStart', function (event, toState) {
					currentState = toState.name;
					// hide sidebar automatically on mobile
					asideToggleOff();
					$rootScope.$broadcast('closeSidebarMenu');
				});
				var watchExternalClicks = function (newValue) {
					// if sidebar becomes visible
					if (newValue === true) {
						$timeout(function() {
							wrapper.on(sbclickEvent, function (e) {
								// if not child of sidebar
								if( ! $(e.target).parents('.aside').length ) {
									asideToggleOff();
								}
							});
						});
					} else {
						// dettach event
						wrapper.off(sbclickEvent);
					}
				};
				// autoclose when click outside sidebar
				if (angular.isDefined(attrs.sidebarAnyclickClose)) {
					var wrapper = $('.wrapper');
					var sbclickEvent = 'click.sidebar';
					var watchOff1 = $rootScope.$watch('app.asideToggled', watchExternalClicks);
				}
				// helpers
				var asideToggleOff = function () {
					$rootScope.app.asideToggled = false;
					// anti-pattern but sometimes necessary
					if (!scope.$$phase) {
						scope.$apply();
					}
				};
				scope.$on('$destroy', function () {
					// detach scope events
					eventOff1();
					eventOff2();
					watchOff1();
					// detach dom events
					$sidebar.off(eventName);
					$win.off('resize.sidebar');
					wrapper.off(sbclickEvent);
				});
				var sidebarAddBackdrop = function () {
					var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'});
					$backdrop.insertAfter('.aside-inner').on('click mouseenter', function () {
						removeFloatingNav();
					});
				};
				// Open the collapse sidebar submenu items when on touch devices
				// - desktop only opens on hover
				var toggleTouchItem = function ($element) {
					$element
						.siblings('li')
						.removeClass('open')
						.end()
						.toggleClass('open');
				};
				// Handles hover to open items under collapsed menu
				var toggleMenuItem = function ($listItem, $sidebar) {
					removeFloatingNav();
					var ul = $listItem.children('ul');

					if(!ul.length) {
						return $();
					}
					if($listItem.hasClass('open')) {
						toggleTouchItem($listItem);
						return $();
					}

					var $aside = $('.aside');
					var $asideInner = $('.aside-inner'); // for top offset calculation
					// float aside uses extra padding on aside
					var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
					var subNav = ul.clone().appendTo( $aside );

					toggleTouchItem($listItem);

					var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
					var vwHeight = $win.height();

					subNav
						.addClass('nav-floating')
						.css({
							position: $rootScope.app.layout.isFixed ? 'fixed' : 'absolute',
							top: itemTop,
							bottom: (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
						});

					subNav.on('mouseleave', function() {
						toggleTouchItem($listItem);
						subNav.remove();
					});
					return subNav;
				};
				var removeFloatingNav = function () {
					$('.dropdown-backdrop').remove();
					$('.sidebar-subnav.nav-floating').remove();
					$('.sidebar li.open').removeClass('open');
				};
			}
		};
	});
