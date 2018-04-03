/**
 * @ngdoc function
 * @name university.service: paramService
 * @description
 * # paramService
 * make router param util
 */
angular
	.module('university')
	.service('paramService', function ($q, $http, $cookies) {

		this.setOrigin = function (object) {
			$cookies.putObject('origin_tag', object);
		};

		this.getOrigin = function () {
			return $cookies.getObject('origin_tag');
		};

		this.setNew = function (object) {
			$cookies.putObject('new_tag', object);
		};

		this.getNew = function () {
			return $cookies.getObject('new_tag');
		};
	});