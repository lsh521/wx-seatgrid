/**
 * @ngdoc function
 * @name university.controller: SiteCtrl
 * @description
 * # SiteCtrl
 * controller of the site
 */
angular
	.module('university')
	.controller('SiteCtrl', function ($scope, $state, ngTableParams, siteService, paramService, SweetAlert,$sce) {

		var getSites = function () {
			var NgTableParams = ngTableParams;
			$scope.tableParams = new NgTableParams({
				page: 1,
				count: 10,
				filter: {
					name: ''
				}
			}, {
				counts: [10, 15, 20, 25],
				total: 0,
				getData: function ($defer, params) {
					var filter = params.filter();
					var searchCondition = {};
					searchCondition['title'] = filter.name;
					console.log(filter.name);
					siteService.getSites(params.page(), params.count(),filter.name)
						.then(function (data) {
							params.total(data.total);
							$defer.resolve(data.items);
						});
				}
			});
		};
		// 获取列表
		getSites();
		// 删除
		$scope.deleteSite=function (id) {
      siteService.delSite(id)
        .then(function (data) {
          getSites();
          SweetAlert.swal('删除成功', '', 'success');
        });
    };
    // 上架
    $scope.upSite=function (id) {
      siteService.pubPubSite(id)
        .then(function (data) {
          console.log(data);
          getSites();
          SweetAlert.swal('已上架', '', 'success');
        });
    };
    // 下架
    $scope.downSite=function (id) {
      siteService.UnPubSite(id)
        .then(function (data) {
          console.log(data);
          getSites();
          SweetAlert.swal('已下架', '', 'success');
        });
    };
    // 更新场地信息
    $scope.updateSite = function (site) {
    	// 服务器返回tag_list数据
    	// site.tag_list = [{ id: 1, name: '篮球' }, { id: 2, name: '新建' }];
    	paramService.setOrigin(site.tag_list);
    	// 将数据转换成我们需要的格式
    	var temp = [];
    	angular.forEach(site.tag_list, function (value, key) {
    		temp.push(value.name);
    	});
    	console.log(temp);
    	site.new_tag = temp;
    	paramService.setNew(site.new_tag);
    	console.log(site.new_tag);
		$state.go('app.site', {
			id: site.id
		});
    };
    // 置顶
    $scope.top=function (id) {
      siteService.topSite(id)
        .then(function (data) {
          console.log(data);
          SweetAlert.swal('置顶成功', '', 'success');
          getSites();
        });
    };
    // 取消置顶
    $scope.untop=function (id) {
      siteService.untopSite(id)
        .then(function (data) {
          console.log(data);
          SweetAlert.swal('取消置顶成功', '', 'success');
          getSites();
        });
    };
	});
