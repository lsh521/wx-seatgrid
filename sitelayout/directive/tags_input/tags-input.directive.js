/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/

(function() {
    'use strict';
    function tagsinput ($timeout) {
      function link(scope, element, attrs, ngModel) {
        element.on('itemAdded itemRemoved', function(){
          // check if view value is not empty and is a string
          // and update the view from string to an array of tags
          if(ngModel.$viewValue && ngModel.$viewValue.split) {
            console.log(typeof (ngModel.$viewValue));
            ngModel.$setViewValue( ngModel.$viewValue.split(',') );
            console.log(ngModel.$viewValue);
            ngModel.$render();
          }
        });

        $timeout(function(){
          element.tagsinput();
        });
        
      }
      var directive = {
          link: link,
          require: 'ngModel',
          restrict: 'A'
      };
      return directive;
    }
  tagsinput.$inject = ['$timeout'];
  angular
    .module('university')
    .directive('tagsinput', tagsinput);
})();

