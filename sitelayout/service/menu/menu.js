/**
 * @ngdoc function
 * @name university.service: SidebarLoader
 * @description
 * # services to load menu data
 */
// angular
//   .module('app.sidebar')
//     .service('SidebarLoader', function ($http) {
//       return {
//         getMenu: function () {
//           var menuJson = 'menu.json',
//               menuURL = menuJson + '?v=' + (new Date().getTime());
//           onError = onError || function () { alert('loading menu failed!'); };
//           $http
//             .get(menuURL)
//             .success(onReady)
//             .error(onError);
//             // var menuData = [
//             //   {
//             //     "text": "首页",
//             //     "sref": "app.home",
//             //     "icon": "icon-home"
//             //   }
//             // ];
//             return menuData;
//         }
//       };
//   });
angular
  .module('app.sidebar')
  .service('SidebarLoader', function ($cookies) {
    return {
      getMenu: function () {
        /*var menuJson = './server/menu.json',
            menuURL = menuJson + '?v=' + (new Date().getTime());
        onError = onError || function () { alert('loading menu failed!'); };
        $http
          .get(menuURL)
          .success(onReady)
          .error(onError);*/
          console.log($cookies.getObject('user'));
          var menuData;
          var user = $cookies.getObject('user');
            menuData = [
              {
                "text": "场馆",
                "sref": "app.miniVotingList",
                "icon": "icon-map"
              }
            ];
          return menuData;
      }
    };
  });
