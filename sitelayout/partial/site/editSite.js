/**
 * @ngdoc function
 * @name university.controller: EditSiteCtrl
 * @description
 * # EditSiteCtrl
 * controller of the site
 */
angular
	.module('university')
	.controller('EditSiteCtrl', function ($scope, $rootScope, siteService,$stateParams, paramService, SweetAlert, $state) {
	  $scope.site_id=$stateParams.id;
    var originTag = [];
    var tapMap = {};
    // 初始化地图
    $scope.initBap = function () {
      $scope.map = new BMap.Map("container"); // 创建地图实例
      $scope.map.centerAndZoom(new BMap.Point($scope.longitude, $scope.latitude), 13);  // 初始化地图，设置中心点坐标和地图级别
      var point=new BMap.Point($scope.longitude, $scope.latitude);
      var marker = new BMap.Marker(point);        // 创建标注
      $scope.map.addOverlay(marker);                     // 将标注添加到地图中
      $scope.map.addControl(new BMap.NavigationControl());
      $scope.map.addControl(new BMap.ScaleControl());
      $scope.map.addControl(new BMap.OverviewMapControl());
      $scope.map.enableScrollWheelZoom(true);
      // 创建地址解析器实例
      $scope.myGeo = new BMap.Geocoder();
      /**
       * 监听地图点击事件，获取点击处建筑物名称
       */
      $scope.map.addEventListener("click", function (e) {
        var pt = e.point;
        $scope.longitude = pt.lng;
        $scope.latitude = pt.lat;
        $scope.myGeo.getLocation(pt, function (rs) {
          var addComp = rs.addressComponents;
          /**
           * 将获取到的建筑名赋值给$scope.address
           */
          $scope.address = addComp.province !== addComp.city ? addComp.province + addComp.city : addComp.city + addComp.district + addComp.street + addComp.streetNumber;
          /**
           * 通知angularjs更新视图
           */
          $scope.$digest();
        });
      });
      /**
       * 初始化查询配置
       * @type {BMap.LocalSearch}
       */
      $scope.local = new BMap.LocalSearch($scope.map, {
        renderOptions: {
          map: $scope.map,
          panel: "results",
          autoViewport: true,
          selectFirstResult: true
        },
        pageCapacity: 8
      });
      /**
       * 监听地址改变事件，当地址输入框的值改变时
       */
      $scope.$watch('address', function () {
        /**
         * 查询输入的地址并显示在地图上、调整地图视野
         */
        $scope.local.search($scope.address);
        /**
         * 将输入的地址解析为经纬度
         */
        console.log( $scope.myGeo.getPoint());
        $scope.myGeo.getPoint($scope.address, function (point) {
           console.log(point);
          if (point) {
            /**
             * 将地址解析为经纬度并赋值给$scope.longitude和$scope.latitude
             */
            $scope.longitude = point.lng;
            $scope.latitude = point.lat;
          }
        });
        console.log($scope.longitude+"+"+$scope.latitude);
      });
    };
    // 如果是创建中
	  if($scope.site_id==='-1'){
      /**
       * 初始化经度
       */
      $scope.longitude = 116.404 ;
      /**
       * 初始化纬度
       */
      $scope.latitude= 39.915;
      /**
       * 初始化百度地图
       */
      $scope.initBap();
      $scope.site={};
      $scope.address = null;
    }
    // 组装map,形如 {name : id}
    var makeMap = function (arr) {
      var temp = {};
      angular.forEach(arr, function (value, key) {
        temp[value.name] = value.id;
      });
      return temp;
    };
// 如果是更新
    if($scope.site_id!=='-1'){
      $scope.site = {};
      // 服务器返回数据，形如 [{id: 1, name: '...'}...]
      $scope.site.originTag = paramService.getOrigin();
      // 保存服务器返回的原始数组 [ name1, name2...]
      originTag = paramService.getNew();
      // 组装map,形如 {name : id}
      tapMap = makeMap($scope.site.originTag);
      $scope.site.tag = paramService.getNew();
      // 请求详情信息渲染页面
      siteService.getSiteInfo($scope.site_id)
        .then(function (data) {
          $scope.longitude = data.site_obj.location_x;
          $scope.latitude=data.site_obj.location_y;
          /**
           * 初始化经纬度
           */
          $scope.initBap();
          $scope.site.title=data.site_obj.title;
          $scope.site.phone= data.site_obj.phone;
          $scope.site.poster=data.site_obj.poster;
          $scope.site.tel=data.site_obj.tel;
          console.log($scope.site.tel.split('-'));
          $scope.site.special_Plane= $scope.site.tel.split('-')[1];
          $scope.site.city_phone=$scope.site.tel.split('-')[0];
          // $scope.site.tag=data.site_obj.tag_list;
          $scope.site.describe=data.site_obj.describe;
        });
    }

    // 创建保存
    $scope.save=function () {
      var special_Plane=$scope.site.special_Plane;
      var city_special_Plane=$scope.site.city_phone+"-"+special_Plane;
      console.log(city_special_Plane);
      var phone = $scope.site.phone;
      if(!special_Plane && !phone){
        SweetAlert
          .swal({ title: '提示信息', text: '手机号和座机号必填一项', type: 'warning',
            showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
        return false;
      }
      if(special_Plane|| phone){
        if(special_Plane) {
          if (!(/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(city_special_Plane))) {
            SweetAlert
              .swal({
                title: '提示信息',
                text: '座机号码有误，请重填',
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                closeOnConfirm: false,
                closeOnCancel: false
              });
            return false;
          }
        }
        if(phone){
          if(!(/^1[34578]\d{9}$/.test(phone))){
            SweetAlert
              .swal({ title: '提示信息', text: '手机号码有误，请重填', type: 'warning',
                showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
            return false;
          }
        }
      }
      if(!$scope.site.title){
        SweetAlert
          .swal({ title: '提示信息', text: '名称必填项', type: 'warning',
            showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
        return false;
      }
      if(!$scope.site.poster){
        SweetAlert
          .swal({ title: '提示信息', text: '海报必选', type: 'warning',
            showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
        return false;
      }
      if(!$scope.site.describe){
        SweetAlert
          .swal({ title: '提示信息', text: '请填写简介', type: 'warning',
            showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
        return false;
      }
      var fd = new FormData();
      fd.append("location_x",$scope.longitude);
      fd.append("location_y",$scope.latitude);
      fd.append("title",$scope.site.title);
       if(!special_Plane){
         city_special_Plane='';
       }
      if(!phone){
        phone='';
      }
      fd.append("tel",city_special_Plane);
      fd.append("phone",phone);
      JSON.stringify($scope.site.tag);
      console.log( JSON.stringify($scope.site.tag));
      console.log( typeof (JSON.stringify($scope.site.tag)));
      fd.append("tags",JSON.stringify($scope.site.tag));
      fd.append("describe",$scope.site.describe);
      fd.append('images',$scope.site.poster);
      console.log($scope.site.poster);
      console.log(fd);
      siteService.createSite(fd)
        .then(function (data) {
          console.log(data);
          SweetAlert.swal('创建成功', '', 'success');
            $state.go('app.miniVotingList');
        });
    };
    // 找出原始tag数组和最新的tag数组之间的差值
    var diffArray = function (originArr, newArr) {
      var arr = [];
      var arr1 = [];
      var arr2 = [];
      angular.forEach(originArr, function (value, key) {
        if (newArr.indexOf(value) === -1) {
          arr1.push(value);
        }
      });
      angular.forEach(newArr, function (value, key) {
        if (originArr.indexOf(value) === -1) {
          arr2.push(value);
        }
      });
      arr = arr1.concat(arr2);
      return arr;
    };
    // 更新
    $scope.update=function () {
      var tags = [];
      // 删除的tags id数组
      var delTags = [];
      // 添加的tags数组
      var addTags = [];
      // 此处进行tags参数的组装
      console.log($scope.site.tag);
      if (typeof $scope.site.tag === 'string') {
        tags = $scope.site.tag.split(',');
      } else {
        tags = $scope.site.tag;
      }
      console.log(tags);
      if (tags.length !== 0) {
        var diffArr = [];
        diffArr =  diffArray(originTag, tags);
        console.log(diffArr);
        console.log(tapMap);
        angular.forEach(diffArr, function (value, key) {
          if (tapMap[value]) {
            delTags.push(tapMap[value]);
          } else {
            addTags.push(value);
          }
        });
        console.log(delTags);
        console.log(addTags);
      } else {
        SweetAlert
          .swal({ title: '提示信息', text: '请填写标签', type: 'warning',
            showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定',
            closeOnConfirm: false, closeOnCancel: false});
        return false;
      }
      var special_Plane=$scope.site.special_Plane;
      var city_special_Plane=$scope.site.city_phone+"-"+special_Plane;
      console.log(city_special_Plane);
      var phone = $scope.site.phone;
      if(!special_Plane && !phone){
        SweetAlert
          .swal({ title: '提示信息', text: '手机号和座机号必填一项', type: 'warning',
            showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
        return false;
      }
      if(special_Plane|| phone){
        if(special_Plane) {
          if (!(/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(city_special_Plane))) {
            SweetAlert
              .swal({
                title: '提示信息',
                text: '座机号码有误，请重填',
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                closeOnConfirm: false,
                closeOnCancel: false
              });
            return false;
          }
        }
        if(phone){
          if(!(/^1[34578]\d{9}$/.test(phone))){
            SweetAlert
              .swal({ title: '提示信息', text: '手机号码有误，请重填', type: 'warning',
                showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
            return false;
          }
        }
      }
      if(!$scope.site.title){
        SweetAlert
          .swal({ title: '提示信息', text: '名称必填项', type: 'warning',
            showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
        return false;
      }
      var fd = new FormData();
      fd.append("location_x",$scope.longitude);
      fd.append("location_y",$scope.latitude);
      fd.append("title",$scope.site.title);
      fd.append("tel_phone",city_special_Plane);
      fd.append("phone",phone);
      fd.append("describe",$scope.site.describe);
      fd.append('images',$scope.site.poster);
      // console.log(JSON.stringify(delTags));
      // console.log(JSON.stringify(addTags));
      fd.append("tags_del",JSON.stringify(delTags));
      fd.append("tags_add",JSON.stringify(addTags));
      siteService.updateSite($scope.site_id,fd)
        .then(function (data) {
          console.log(data);
          SweetAlert.swal('更新成功', '', 'success');
          $state.go("app.miniVotingList");
        });
    };

// 保存上架
    $scope.saveup=function () {
      var phone = $scope.site.phone;
      var special_Plane=$scope.site.special_Plane;
      var city_special_Plane=$scope.site.city_phone+"-"+special_Plane;
      console.log(city_special_Plane);
      if(!(/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(city_special_Plane))){
        SweetAlert
          .swal({ title: '提示信息', text: '座机号码有误，请重填', type: 'warning',
            showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
        return false;
      }
      if(!(/^1[34578]\d{9}$/.test(phone))){
        SweetAlert
          .swal({ title: '提示信息', text: '手机号码有误，请重填', type: 'warning',
            showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
        return false;
      }
      var fd = new FormData();
      fd.append("location_x",$scope.longitude);
      fd.append("location_y",$scope.latitude);
      fd.append("title",$scope.site.title);
      fd.append("tel",$scope.site.phone);
      fd.append("tags",JSON.stringify($scope.site.tag));
      fd.append("describe",$scope.site.describe);
      fd.append('images',$scope.site.poster);
      console.log($scope.site.poster);
      console.log(fd);
      siteService.createSite(fd)
        .then(function (data) {
          siteService.pubPubSite(data.id)
            .then(function (data) {
                console.log(data);
                $state.go("app.miniVotingList");
            }
            );
        });
    };

  });
