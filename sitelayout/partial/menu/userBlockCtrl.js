/**
 * @ngdoc function
 * @name university.controller:sidebarMenu controller
 * @description
 * # deal with menu function
 * Controller of the university
 */
angular
	.module('app.sidebar')
	.controller('UserBlockCtrl', function ($scope, $cookies, $state, userService,versionService) {
		$scope.user = $cookies.getObject('user');
		console.log($scope.user);
		$scope.userBlockVisible = true;
		var getCurrentVersion = function () {
 			versionService.getCurrentVersion()
 				.then(function (data) {
 					$scope.currentVersion = data.version_number;
 				});
 		};
 		getCurrentVersion();
		var detach = $scope.$on('toggleUserBlock', function () {
			$scope.userBlockVisible = !$scope.userBlockVisible;
		});
		$scope.$on('$destroy', detach);
		$scope.loginout = function () {
			userService
				.loginout()
				.then(function (data) {
					$cookies.remove('auth_token');
					$cookies.remove('user');
					$state.go('page.login');
				});
		};
	});
