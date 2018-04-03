/**
 * @ngdoc function
 * @name university.controller: EditVersion
 * @description
 * # EditVersion
 * controller of the version
 */
angular
	.module('university')
	.controller('EditVersion', function ($scope, $state, versionService, SweetAlert) {
		var versionReg = /^[A-Za-z0-9_|\-|\.]+$/;
		$scope.version = {};

		var validate = function () {
			if (!$scope.version.title || !versionReg.test($scope.version.title)) {
				SweetAlert
 					.swal({ title: '提示信息', text: '请填写版本号，且由字母、数字、“.”、“-”或“_”组成。', type: 'warning', 
 						showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
				return false;
			}
			if (!$scope.version.operator) {
				SweetAlert
 					.swal({ title: '提示信息', text: '请填写操作人。', type: 'warning', 
 						showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
				return false;
			}
			if (!$scope.version.describe) {
				SweetAlert
 					.swal({ title: '提示信息', text: '请填写更新内容。', type: 'warning', 
 						showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: '确定', closeOnConfirm: false, closeOnCancel: false});
				return false;
			}
			return true;
		};

		$scope.createVersion = function () {
			if (!validate()) {
				return;
			}
			var params = {};
			params['version_number'] = $scope.version.title;
			params['creator'] = $scope.version.operator;
			params['content'] = $scope.version.describe;
			versionService.createVersion(params)
				.then(function (data) {
					SweetAlert.swal('创建成功', '', 'success');
					$state.go('app.versionManage');
				});
		};

	});