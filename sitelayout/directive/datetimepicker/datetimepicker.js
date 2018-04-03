angular
  .module('university')
  .directive('datetimepicker', function($filter) {
  	return {
      restrict: 'E',
      scope: {
        datetime: '=',
        starttime: '=',
        endtime: '='
      },
      template: '<div class="input-group date" data-date-format="YYYY-MM-DD HH:mm">'+
        '<input type="text" class="form-control" ng-model="_datetime" style="background-color: white;" readonly="true" placeholder="点击右面按钮选择时间"/>'+
        '<span class="input-group-addon"><span></span></span></div>',
      replace: true,
      link: function(scope, elem, attr, ctrl) {
        $(elem).datetimepicker({
          icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
          },
          language: 'zh-CN',
          sideBySide: false,
          useCurrent: false,
          format: 'YYYY-MM-DD HH:mm'
        });

        $(elem).on("dp.change",function (e) {
          elem.find('input').trigger('change');
          // elem.data("DateTimePicker").hide();
        });

        scope.$watch('datetime', function(newVal) {
          if (typeof(newVal) === "number") {
            scope._datetime = $filter('date')(scope.datetime, 'yyyy-MM-dd HH:mm');
          }
        });

        scope.$watch('_datetime', function(newVal) {
          if (newVal && window.escape(newVal).indexOf('%u')<0) {
            scope.datetime = newVal;
          } else {
            if ($(elem).data("DateTimePicker")) {
              scope.datetime = $(elem).data("DateTimePicker").date.format("YYYY-MM-DD HH:mm");
            }
          }
         /* if ($(elem).data("DateTimePicker")) {
            console.log($(elem).data('DateTimePicker').date.format("YYYY-MM-DD HH:mm"));
            scope.datetime = $(elem).data("DateTimePicker").date.format("YYYY-MM-DD HH:mm");
          }*/
        });

        scope.$watch('starttime', function(newVal) {
          if (newVal) {
            try {
              $(elem).data("DateTimePicker").setMinDate(moment(newVal));
            } catch (e) {
              console.log(e);
            }
          }
        });

        scope.$watch('endtime', function(newVal) {
          if (newVal) {
            try {
              $(elem).data("DateTimePicker").setMaxDate(moment(newVal));
            } catch (e) {
              console.log(e);
            }
          }
        });
      }
    };
  });
