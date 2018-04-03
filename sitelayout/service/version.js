/**
 * @ngdoc function
 * @name university.service: versionService
 * @description
 * # versionService
 * service of the version
 */
angular
	.module('university')
	.service('versionService', function ($q, $http) {
		this.getVersions = function (page, per_page) {
			var deferred = $q.defer();
			$http.get('/api/sites/version/list?page=' + page + '&per_page=' + per_page)
				.success(function (data) {
					deferred.resolve(data);
				});
			return deferred.promise;
		};
		this.createVersion = function (obj) {
			var deferred = $q.defer();
			$http.post('/api/sites/create/version', obj)
				.success(function (data) {
					deferred.resolve(data);
				});
			return deferred.promise;
		};
		this.updateVersion = function (id, obj) {
			var deferred = $q.defer();
			$http.put('', obj)
				.success(function (data) {
					deferred.resolve(data);
				});
			return deferred.promise;
		};
		this.deleteVersion = function (id) {
			var deferred = $q.defer();
			$http.delete('/api/sites/' + id + '/version/delete')
				.success(function (data) {
					deferred.resolve(data);
				});
			return deferred.promise;
		};
		this.getCurrentVersion = function () {
			var deferred = $q.defer();
			$http.get('/api/sites/version/new')
				.success(function (data) {
					deferred.resolve(data);
				});
			return deferred.promise;
		};
	});
