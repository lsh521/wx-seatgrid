angular
  .module('app.router')
  .factory('httpinterceptor', function($q, $location, $cookies, toaster) {
    var authToken = $cookies.get('auth_token');
    return {
      'request': function(config) {
        // console.log(config);
        if (config.url.indexOf('api') === -1) {
          return config || $q.when(config);
        }
        if (config && authToken) {
          config.headers['Authentication-Token'] = authToken;
        }
        return config || $q.when(config);
      },
      'requestError': function(rejection) {
        /*$rootScope.$emit(eventType.NOTIFICATION, {
          // 'type': 'ERROR',
          'type': 'POPMSG',
          'message': rejection
        });*/
        toaster.pop('error', '错误提示', rejection);
        return $q.reject(rejection);
      },
      'response': function(response) {
        if (response && response.data && response.data.status === 'error') {
          /*$rootScope.$emit(eventType.NOTIFICATION, {
            'type': 'POPMSG',
            'title': '警告',
            'message': response.data.message,
            'payload': response.data.payload
          });*/
          console.log(response);
          if (response.data.code === 4) {
            $location.path('/page/login');
          }
          toaster.pop('error', '错误提示', response.data.message);
          return $q.reject(response);
        }
        if (response && response.data && response.data.status === 'success') {
          response.data = response.data.data;
          return response;
        }
        return response || $q.when(response);
      },
      'responseError': function(rejection) {
          // Handle Unauthorized error in user service
          if (rejection.status !== 401) {
            /*$rootScope.$emit(eventType.NOTIFICATION, {
              'type': 'ERROR',
              'title': '警告',
              'message': rejection.statusText ? rejection.statusText : '未知错误'
            });*/
            var message = rejection.statusText ? rejection.statusText : '未知错误';
            toaster.pop('error', '错误提示', message);
          }
          if (rejection.status === 401) {
            $location.path('/page/login');
            toaster.pop('warning', '提示信息', '请进行登录操作');
          }
          return $q.reject(rejection);
        },
        'setAuthToken' : function(token) {
          authToken = token;
        }
      };
  });
