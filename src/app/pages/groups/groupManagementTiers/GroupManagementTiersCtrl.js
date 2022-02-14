(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers')
        .controller('GroupManagementTiersCtrl', GroupManagementTiersCtrl);

    /** @ngInject */
    function GroupManagementTiersCtrl($scope,Rehive,localStorageManagement,
                                          $stateParams,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.groupName = ($stateParams.groupName == 'service') ? 'extension' : $stateParams.groupName;
        vm.updatedGroup = {};
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.subMenuLocation = $scope.locationIndicator;
        $scope.locationIndicator = 'tiers';

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.goToGroupManagementTiersSettings = function (path) {
            $scope.subMenuLocation = path;
            $location.path('/groups/' + $scope.groupName + '/tiers/' + path);
        };

        if($scope.subMenuLocation != 'requirements' && $scope.subMenuLocation != 'list'){
            $scope.goToGroupManagementTiersSettings('list');
        }

        $scope.getGroup = function () {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: groupName}).then(function (res) {
                    $scope.editGroupObj = res;
                    if(groupName === "service"){
                        $scope.editGroupObj.name = "extension";
                    }
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
