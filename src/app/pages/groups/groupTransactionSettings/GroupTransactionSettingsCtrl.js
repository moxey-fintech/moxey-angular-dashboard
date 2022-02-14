(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings')
        .controller('GroupTransactionSettingsCtrl', GroupTransactionSettingsCtrl);

    /** @ngInject */
    function GroupTransactionSettingsCtrl($scope,toastr,localStorageManagement,
                                          Rehive,$stateParams,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.groupName = ($stateParams.groupName == 'service') ? 'extension' : $stateParams.groupName;
        vm.updatedGroup = {};
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.subMenuLocation = vm.locationArray[vm.locationArray.length - 1];
        $scope.locationIndicator = 'transaction-settings';
        
        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.goToGroupManagementTransactionSettings = function (path) {
            $scope.subMenuLocation = path;
            $location.path('/groups/' + $scope.groupName + '/transaction-settings/' + path);
        };

        if($scope.subMenuLocation !== 'limits' && $scope.subMenuLocation !== 'fees' && $scope.subMenuLocation !== 'group-controls' && $scope.subMenuLocation !== 'tier-controls'){
            // $scope.goToGroupManagementTransactionSettings('fees');
            $scope.goToGroupManagementTransactionSettings('group-controls');
        }

        $scope.getGroup = function () {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: groupName}).then(function (res) {
                    if(res.name === "service"){
                        res.name = "extension";
                    }
                    $scope.editGroupObj = res;
                    $scope.editGroupObj.prevName = res.name;
                    $scope.loadingGroup = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroup();
    }
})();
