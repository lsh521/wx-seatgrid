/**
 * @ngdoc function
 * @name university.controller: VersionCtrl
 * @description
 * # VersionCtrl
 * controller of the version
 */
angular
	.module('university')
	.controller('VersionCtrl', function ($scope, ngTableParams, versionService, SweetAlert) {

		var getVersions = function () {
			var NgTableParam = ngTableParams;
			$scope.tableParams = new NgTableParam({
				page: 1,            // show first page
				count: 10,          // count per page
			}, {
				counts: [10, 15, 20, 25],
				total: 0,
				getData: function ($defer, params) {
					versionService.getVersions(params.page(), params.count())
						.then(function (data) {
							params.total(data.total);
							$defer.resolve(data.items);
						});
				}
			});
		};
		getVersions();
		$scope.deleteVersion = function (version) {
			SweetAlert.swal({
				title: '确定删除“' + version.version_number + '”?',
				text: '',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#DD6B55',
				confirmButtonText: '是, 删除!',
        		cancelButtonText: '不, 取消操作!',
				closeOnConfirm: false,
				closeOnCancel: false
			}, function (isConfirm) {
				if (isConfirm) {
					versionService
						.deleteVersion(version.id)
						.then(function (data) {
							$scope.tableParams.reload();
							SweetAlert.swal('操作成功。', '', 'success');
						});
				} else {
					SweetAlert.swal('操作已取消。', '', 'error');
				}
			});
		};
	});