/**
 * @ngdoc function
 * @name university.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the university
 */
angular.module('app.sidebar',[ ] )
	.controller('MainCtrl', function ($rootScope, $scope, $state, SidebarLoader, Utils) {
		var collapseList = [];
		//controller helpers
		//check item and children active state
		var isActive = function (item) {
			if (!item) { return; }
			if (!item.sref || item.sref === '#') {
				var foundActive = false;
				angular.forEach(item.submenu, function (value) {
					if (isActive(value)) {
						foundActive = true;
					}
				});
				return foundActive;
			} else {
				return $state.is(item.sref) || $state.includes(item.sref);
			}
		};
		//close other menu items
		var closeAllBut = function (index) {
			index += '';
			angular.forEach(collapseList, function (value, key) {
				if (index < 0 || index.indexOf(key) < 0) {
					value = true;
				}
			});
		};
		var isChild = function ($index) {
			/*jshint -W018*/
			return (typeof $index === 'string') && !($index.indexOf('-') < 0);
		};
		var exc = function () {
			// when switch one item, close the others
			var watchOff = $rootScope.$watch('app.layout.asideHover', function (oldValue, newValue) {
				if (newValue === false && oldValue === true) {
					closeAllBut(-1);
				}
			});
			// load menu data
			$scope.menuItems = SidebarLoader.getMenu();
			// console.log($scope.menuItems);
			// handle sidebar and collapse items
			$scope.getMenuItemPropClasses = function (item) {
				return (item.heading ? 'nav-heading' : '') +
						(isActive(item) ? 'active' : '');
			};
			$scope.addCollapse = function ($index, item) {
				collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
			};
			$scope.isCollapse = function ($index) {
				return collapseList[$index];
			};
			$scope.toggleCollapse = function ($index, isParentItem) {
				// console.log(Utils.isSidebarCollapsed());
				// collapsed sidebar doesn't toggle drodopwn
				if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {
					return true;
				}
				// make sure the item index exists
				if (angular.isDefined(collapseList[$index])) {
					if (!$scope.lastEventFromChild) {
						collapseList[$index] = !collapseList[$index];
						closeAllBut($index);
					}
				} else if (isParentItem) {
					closeAllBut(-1);
				}
				$scope.lastEventFromChild = isChild($index);
				return true;
			};
			$scope.$on('$destroy', function () {
				watchOff();
			});
		};
		exc();
	});
