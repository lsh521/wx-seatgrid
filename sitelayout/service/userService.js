/**
 * @ngdoc function
 * @name university.service: userService
 * @description
 * # userService
 * service of the university
 */
angular
	.module('app.pages')
	.service('userService', function ($rootScope, $q, $state, $http, httpinterceptor) {
		var that = this;
		this.user = null;
		// login method
		this.login = function (user) {
			var defferred = $q.defer();
			$http
				.post('/api/auth/admin/login', user)
				.success(function (data) {
					console.log(data);
					/*var reg = new RegExp('static');
 					if (reg.test(data.user.icon)) {
 						data.user.icon = data.user.icon.substring(7, data.user.icon.length);
 					}*/
					var authToken = data.auth_token;
					that.user = data.user;
					httpinterceptor.setAuthToken(authToken);
					defferred.resolve(data);
				});
			return defferred.promise;
		};
		this.loginout = function () {
			var defferred = $q.defer();
			$http
				.post('/api/auth/admin/logout')
				.success(function (data) {
					that.user = null;
					httpinterceptor.setAuthToken(null);
					defferred.resolve(data);
				});
			return defferred.promise;
		};
		this.freshToken = function () {
			var defferred = $q.defer();
			$http.get('/api/auth/refreshtoken')
				.success(function (data) {
					defferred.resolve(data);
				});
			return defferred.promise;
		};
	});
