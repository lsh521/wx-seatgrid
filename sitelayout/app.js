/**
 * @ngdoc overview
 * @name university
 * @description
 * # university
 *
 * Main module of the application.
 */
angular
  .module('university', [
    'app.core',
    'app.router',
    'app.loadingbar',
    'app.pages',
    'app.sidebar',
    'app.utils',
    'app.settings',
    'angular-simditor',
    'ngTable',
    // 'chart.js',
    'app.panels',
    'ui.grid',
    'ui.grid.autoResize',
    'app.charts'
  ]);
  /**
 * @ngdoc overview
 * @name app.core
 * @description
 * # app.core
 *
 * core function of the application.
 */
 angular
  .module('app.core', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngTouch',
    'ngStorage',
    'ngTable',
    'ui.router',
    'ui.utils',
    'ui.bootstrap',
    'ui.sortable',
    'cfp.loadingBar',
    'toaster',
    'oitozero.ngSweetAlert',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.edit',
    'ui.grid.exporter',
    'ui.grid.pagination',
    'ui.grid.resizeColumns',
    // 'tmh.dynamicLocale',
    'ngLocale'
    //'oc.lazyLoad'
  ]);
// router function of the application
angular
  .module('app.router', []);
// loadingbar of the function
angular
  .module('app.loadingbar', []);
// define color system of the application
angular
  .module('app.colors', []);
// util function of the application
angular
  .module('app.utils', ['app.colors']);
// setting function of the application
angular
  .module('app.settings', []);
// login, regist and lockscreen function of the application
angular
  .module('app.pages', []);
// menu function of the application
angular
  .module('app.sidebar', []);
// panel function of the application
angular
  .module('app.panels', []);
// charts function of the application
angular
  .module('app.charts', []);
// define system color constant
angular
  .module('app.pages', [])
  .constant('EVENT_TYPE', {
    LOGIN_SUCCESS: 'loginSuccess',
    LOGIN_FAILED: 'loginFailed',
    LOGINOUT: 'loginout'
  });
angular
  .module('app.colors')
  .constant('APP_COLORS', {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2'
  });
//define media query constant
angular
  .module('app.core')
  .constant('APP_MEDIAQUERY', {
    'desktopLG':             1200,
    'desktop':                992,
    'tablet':                 768,
    'mobile':                 480
  });

// config loadingbar
angular
  .module('app.loadingbar')
  .config(function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
  });
// run loadingbar
angular
  .module('app.loadingbar')
  .run(function ($rootScope, $timeout, cfpLoadingBar) {
    var thBar;
    $rootScope.$on('$stateChangeStart', function () {
      // console.log(angular.element('.wrapper > section'));
      if (angular.element('.wrapper > section').length) {
        thBar = $timeout(function () {
          cfpLoadingBar.start();
        }, 0);
      }
    });
    $rootScope.$on('$stateChangeSuccess', function (event) {
      event.targetScope.$watch('$viewContentLoaded', function () {
        $timeout.cancel(thBar);
        cfpLoadingBar.complete();
      });
    });
  });
angular
  .module('app.router')
  .config(function ($routeProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    //initialize get if not there
    $httpProvider.defaults.withCredentials = true;
    if (!$httpProvider.defaults.headers.get) {
       $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    // Set the following to true to enable the HTML5 Mode
    // You may have to set <base> tag in index and a routing configuration in your server
    // $locationProvider.html5Mode(false);
    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'partial/home/main.html'
    });
    // 场馆信息路由
    $stateProvider.state('app.miniVotingList', {
      url: '/site',
      templateUrl: 'partial/site/siteList.html'
    });
    // 场馆信息路由
    $stateProvider.state('app.site', {
      url: '/site/:id',
      templateUrl: 'partial/site/editSite.html'
    });
    $stateProvider.state('page', {
      url: '/page',
      templateUrl: 'partial/pages/page.html',
      controller: ['$rootScope', function ($rootScope) {
        $rootScope.app.layout.isBoxed = false;
      }]
    });
    // login page
    $stateProvider.state('page.login', {
      url: '/login',
      templateUrl: 'partial/pages/login.html'
    });
    // version information route
    $stateProvider.state('app.versionManage', {
      url: '/versionManage',
      templateUrl: 'partial/version/versionList.html'
    });
    $stateProvider.state('app.editVersion', {
      url: '/editVersion/:id',
      templateUrl: 'partial/version/editVersion.html'
    });
    $urlRouterProvider.otherwise('/page/login');
    // $urlRouterProvider.otherwise('/app/site');
    //add httpinterceptor
    $httpProvider.interceptors.push('httpinterceptor');
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    /*$routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });*/
  });

angular
  .module('app.settings')
  .run(function ($rootScope, $localStorage) {
      //user setting
      /*$rootScope.user = {
        name:     'Alice',
        job:      'ng-developer',
        picture:  'images/user/08.jpg'
      };*/
      // hides or show user avatar
      $rootScope.toggleUserBlock = function () {
        $rootScope.$broadcast('toggleUserBlock');
      };
      // caculate remaining time
      var check = function (i) {
        if (i < 10) {
          i = '0' + i;
        }
        return i;
      };
      $rootScope.cRemainingTime = function (current, deadLine) {
        var str;
        if (deadLine > current) {
          var ts = deadLine - current;
          var day = parseInt(ts / 1000 / 60 / 60 / 24, 10);
          var hour = parseInt(ts / 1000 / 60 / 60 % 24, 10);
          var minute = parseInt(ts / 1000 / 60 % 60, 10);
          var second = parseInt(ts / 1000 % 60, 10);
          day = check(day);
          hour = check(hour);
          minute = check(minute);
          second = check(second);
          str = day + "天" + hour + "时" + minute + '分';
          return str;
        } else {
          str = '投票已结束';
          return str;
        }
      };
      //global setting
      $rootScope.app = {
        name: 'www.borningKiller.cn',
        description: 'study and test inline system',
        year: ((new Date()).getFullYear()),
        layout: {
          isFixed: true,
          isCollapsed: false,
          isBoxed: false,
          isRTL: false,
          horizontal: false,
          isFloat: false,
          asideHover: false,
          theme: null,
          asideScrollbar: false,
          isCollapsedText: false
        },
        useFullLayout: false,
        hiddenFooter: false,
        offsidebarOpen: false,
        asideToggled: false,
        viewAnimation: 'ng-fadeInUpBig'
      };
      //restore layout settings
      if (angular.isDefined($localStorage.layout)) {
        $rootScope.app.layout = $localStorage.layout;
      } else {
        $localStorage.layout = $rootScope.app.layout;
      }

      $rootScope.$watch('app.layout', function () {
        $localStorage.layout = $rootScope.app.layout;
      }, true);
      //close submenu when sidebar change from collapsed to normal
      $rootScope.$watch('app.layout.isCollapsed', function (newValue) {
        if (!newValue) {
          $rootScope.$broadcast('closeSideMenu');
        }
      });

  });


// simditor constant config
angular
  .module('university')
  .constant('simditorConfig', {
    placeholder: '输入内容请限制在2000字以内',
    toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'color', '|',
      'ol', 'ul', 'blockquote', 'table', '|', 'link', 'hr', '|', 'indent', 'outdent', 'alignment'],
    pasteImage: true,
    toolbarFloat: false,
    defaultImage: '',
    upload: {
        url: '/upload'
    },
    allowedTags: ['br', 'a', 'img', 'b', 'strong', 'i', 'u', 'font', 'p', 'ul', 'ol', 'li','blockquote',
      'pre', 'h1', 'h2', 'h3', 'h4', 'hr', 'div', 'script', 'style']
  });
// (function() {
//   'use strict';
//
//   angular
//     .module('university')
//     .directive('tagsinput', tagsinput);
//
//   tagsinput.$inject = ['$timeout'];
//   function tagsinput ($timeout) {
//     var directive = {
//       link: link,
//       require: 'ngModel',
//       restrict: 'A'
//     };
//     return directive;
//
//     function link(scope, element, attrs, ngModel) {
//       element.on('itemAdded itemRemoved', function(){
//         // check if view value is not empty and is a string
//         // and update the view from string to an array of tags
//         if(ngModel.$viewValue && ngModel.$viewValue.split) {
//           ngModel.$setViewValue( ngModel.$viewValue.split(',') );
//           ngModel.$render();
//         }
//       });
//
//       $timeout(function(){
//         element.tagsinput();
//       });
//     }
//   }
// })();
