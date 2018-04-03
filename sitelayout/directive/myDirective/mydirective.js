angular.module('university').
directive('formInput', function($compile) {
  return {
    restrict: 'E',
    scope: {
      name: '=',
      title: '='
    },
    transclude: true,
    templateUrl: 'directive/form-input/form-input.html',
    link: function(scope, element, attrs) {}
  };
})
.directive('mySelect2', function ($compile, $filter, $http) {
  return {
    // require: 'ngModel',
    restrict: 'AE',
    scope: {
      activityId: '=activityId'
    },
    link: function (scope, element, attribute) {
      $http.get('/api/auth/refreshtoken').success(function (response) {
        loadSelect(response.auth_token);
      });
      var loadSelect = function (auth_token) {
        var $select = element.select2({
          placeholder: {
            id: '-1',
            text: '请选择问卷'
          },
          minimumResultsForSearch: Infinity,
          // data: scope.data
          selectOnClose: true,
          tags: true,
          ajax: {
            url: '/api/questionnaire/list/terminal', //remote data api
            delay: 1000,
            dataType: 'json',
            headers: {
              'Authentication-Token': auth_token
            },
            data: function (params) {
              var query = {
                page: params.page || 1,
                per_page: params.per_page || 10
              };
              return query; //request params ?page = [page] & per_page = [per_page]
            },
            processResults: function (data, params) {
              //deal with params
              params.page = params.page || 1;
              params.per_page = params.per_page || 10;
              var select2_data = [];
              angular.forEach(data.data.items, function (value) {
                var obj = {id: '', text: ''};
                obj.id = value.id;
                obj.text = value.title+ ' ' + $filter('date')(new Date(value.create_time), 'yyyy-MM-dd HH:mm');
                console.log(obj);
                select2_data.push(obj);
              });
              return {
                results: select2_data,
                pagination: {
                  more: (params.page * params.per_page) < data.data.total
                }
              };
            },
            cache: true
          }
        });
        $select.on('change', function (event) {
          scope.questionnaire_id = $select.val();
          scope.$emit('select:change', scope.questionnaire_id);
        });
      };
    }
  };
});
