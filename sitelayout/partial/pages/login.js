/**
 * @ngdoc function
 * @name university.controller: LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the university
 */
 angular
 	.module('app.pages',[ ] )
 	.controller('LoginCtrl',['$scope', 'userService', '$cookies', '$state','versionService',
    function ($scope, userService, $cookies, $state,versionService) {
 		// console.log('this is login controlle js');
 		$scope.user = {
 			username: '',
 			password: ''
 		};
 		console.log($cookies.get('user'));
 		if ($cookies.get('user')) {
 			userService.freshToken()
 				.then(function (data) {
 					$cookies.put('auth_token', data.auth_token);
 					$state.go('app.miniVotingList');
 				});

 		}
 		// submit login info
 		$scope.login = function () {
 			userService
 				.login($scope.user)
 				.then(function (data) {
 					$cookies.put('auth_token', data.auth_token);
 					$cookies.putObject('user', data.user);
 					$state.go('app.miniVotingList');
 				});
 		};
 		console.log(versionService);
 		var getCurrentVersion = function () {
 			versionService.getCurrentVersion()
 				.then(function (data) {
 					$scope.currentVersion = data.version_number;
 				});
 		};
 		getCurrentVersion();
 		$scope.$on('loginSuccess', function () {
			window.alert('loginSuccess');
		});
 	}]
  );
