/**
 * @ngdoc function
 * @name university.service: colors
 * @description
 * # services to retrieve global colors
 */
angular
  .module('app.colors')
  .service('Colors', function (APP_COLORS) {
    console.log('this is system color service');
    return (APP_COLORS[name] || '#fff');
  });
 /**
 * @ngdoc function
 * @name university.service: utils
 * @description
 * # utility library to use across the theme
 */
angular
  .module('app.utils')
  .service('Utils', function ($window, APP_MEDIAQUERY) {
    console.log('this is util');
    var $html = angular.element('html'),
        $win = angular.element($window),
        $body = angular.element('body');
    return {
      support: { //detection
          transition: function () {

          },
          animation: function () {

          },
          requestAnimationFrame: window.requestAnimationFrame ||
                                 window.webkitRequestAnimationFrame ||
                                 window.mozRequestAnimationFrame ||
                                 window.msRequestAnimationFrame ||
                                 window.oRequestAnimationFrame ||
                                 function(callback){ window.setTimeout(callback, 1000/60); },
          /*jshint -W069*/
          touch: (
              ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
              (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
              (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
              (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
              false
          ),
          mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
      },
      langdirection: $html.attr('dir') === 'rtl' ? 'right' : 'left',

      isTouch: function () {
        return $html.hasClass('touch');
      },

      isSidebarCollapsed: function () {
        return $body.hasClass('aside-collapsed') || $body.hasClass('aside-collapsed-text');
      },

      isSidebarToggled: function () {
        return $body.hasClass('aside-toggled');
      },

      isMobile: function () {
        return $win.width() < APP_MEDIAQUERY.tablet;
      }
    };
  });
