(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserGroupsCtrl', UserGroupsCtrl);

    /** @ngInject */
    function UserGroupsCtrl($scope,$stateParams,Rehive,
                            localStorageManagement,errorHandler,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.userGroups = {};
        $scope.loadingUserGroup = true;

        vm.getUserGroups = function () {
            if(vm.token) {
                $scope.loadingUserGroup = true;
                Rehive.admin.users.groups.get(vm.uuid, {filters: {page_size: 250}}).then(function (res) {
                    $scope.loadingUserGroup = false;
                    if(res.results.length > 0){
                        $scope.userGroups = res.results[0];
                        if($scope.userGroups.name === "service"){
                            $scope.userGroups.name = "extension";
                        }
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserGroups();


        $scope.openEditUserGroupModal = function (page, size, userGroup) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserGroupModalCtrl',
                scope: $scope,
                resolve: {
                    userGroup: function () {
                        return userGroup;
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(userGroup){
                if(userGroup){
                    vm.getUserGroups();
                }
            }, function(){
            });
        };


    }
})();
