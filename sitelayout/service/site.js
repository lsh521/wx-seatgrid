/**
 * @ngdoc function
 * @name university.service: siteService
 * @description
 * # siteService
 * service of the site
 */
angular
	.module('university')
	.service('siteService', function ($q, $http) {
		// get site informations
		this.getSites = function (page, per_page,title) {
      var deferred = $q.defer();
      if (title !== '') {
        $http.get('/api/sites/search?title=' + title)
          .success(function (data) {
            deferred.resolve(data);
          });
        return deferred.promise;
      } else {
        $http.get('/api/sites/list?page=' + page + '&per_page=' + per_page)
          .success(function (data) {
            deferred.resolve(data);
          });
        return deferred.promise;
      }
    };
		// delete site information
		this.delSite = function (id) {
			var deferred = $q.defer();
			$http.delete('/api/sites/'+id+'/delete')
				.success(function (data) {
					deferred.resolve(data);
				});
			return deferred.promise;
		};
		// top the site information
		this.topSite = function (id) {
			var deferred = $q.defer();
			$http.post('/api/sites/'+id+'/top')
				.success(function (data) {
					deferred.resolve(data);
				});
			return deferred.promise;
		};
    this.untopSite = function (id) {
      var deferred = $q.defer();
      $http.post('/api/sites/'+id+'/untop')
        .success(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };
    // 获取用户信息
    this.getSiteInfo = function (id) {
      var deferred = $q.defer();
      $http.get(' /api/sites/'+id+'/detail')
        .success(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };
		// publish or uppublish site information
		this.pubPubSite = function (id) {
			var deferred = $q.defer();
			$http.post('/api/sites/'+id+'/publish')
				.success(function (data) {
					deferred.resolve(data);
				});
			return deferred.promise;
		};
    this.UnPubSite= function (id) {
      var deferred = $q.defer();
      $http.post('/api/sites/'+id+'/unpublish')
        .success(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };
		// create site information
		this.createSite = function (fd) {
			var deferred = $q.defer();
			$http.post('/api/sites/create', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).success(function (data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		};
		// update site information
		this.updateSite = function (id,fd) {
			var deferred = $q.defer();
			$http.put('/api/sites/'+id+'/update', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).success(function (data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		};
	});
