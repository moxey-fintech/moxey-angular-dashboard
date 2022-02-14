(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupAccountConfigurations')
        .controller('GroupAccountConfigurationsCtrl', GroupAccountConfigurationsCtrl);

    /** @ngInject */
    function GroupAccountConfigurationsCtrl($scope,localStorageManagement,serializeFiltersService,
                                            Rehive,$stateParams,$location,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.groupName = ($stateParams.groupName == 'service') ? 'extension' : $stateParams.groupName;
        vm.updatedGroup = {};
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.groupAccountConfigurationsList = [];

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.getGroup = function () {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: groupName}).then(function (res) {
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

        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        $scope.groupAccountConfigurationNameToLowercase = function () {
            if($scope.groupAccountConfigurationParams.name){
                $scope.groupAccountConfigurationParams.name = $scope.groupAccountConfigurationParams.name.toLowerCase();
            }
        };

        vm.getGroupAccountConfigurationsFilterObj = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getGroupAccountConfigurations = function(fromModalDelete){
            if(vm.token) {
                $scope.loadingGroupAccountConfigurations = true;

                if ($scope.groupAccountConfigurationsList.length > 0) {
                    $scope.groupAccountConfigurationsList.length = 0;
                }

                if(fromModalDelete){
                    $scope.pagination.pageNo = 1;
                }

                var groupAccountConfigurationsFilterObj = vm.getGroupAccountConfigurationsFilterObj();
                var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
                Rehive.admin.groups.accountConfigurations.get(groupName,{filters: groupAccountConfigurationsFilterObj}).then(function (res)
                {
                    $scope.loadingGroupAccountConfigurations = false;
                    $scope.groupAccountConfigurationsData = res;
                    $scope.groupAccountConfigurationsList = res.results;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroupAccountConfigurations();
        
        $scope.updateAccountConfig = function (accountConfig,type) {
            var updateObj = {};
            if(type == 'default'){
                updateObj.default = accountConfig.default;
            } else {
                $scope.loadingGroupAccountConfigurations = true;
                updateObj.primary = accountConfig.primary;
                if(accountConfig.primary){
                    updateObj.default = accountConfig.primary;
                }

            }
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            Rehive.admin.groups.accountConfigurations.update(groupName,accountConfig.name,updateObj).then(function (res) {
                toastr.success('Account configuration updated successfully');
                if(type == 'primary'){
                    $scope.getGroupAccountConfigurations();
                }
                $scope.$apply();
            }, function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.restoreAccountConfiguration = function (accountConfig) {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            $scope.loadingGroupAccountConfigurations = true;
            Rehive.admin.groups.accountConfigurations.update(groupName,accountConfig.name,{archived : false}).then(function (res) {
                $scope.getGroupAccountConfigurations();
                $scope.$apply();
            }, function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.openAddAccountConfigurationsModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddGroupAccountConfigModalCtrl',
                resolve: {
                    groupObj: function(){
                        return null;
                    }
                }
                
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.getGroupAccountConfigurations();
                }
            }, function(){
            });
        };

        $scope.openManageAccountConfigurationsModal = function (page, size,groupAccountConfiguration) {
            vm.theManageModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ManageGroupAccountConfigModalCtrl',
                resolve:{
                    accountConfig: function () {
                        return groupAccountConfiguration;
                    }
                }
            });

            vm.theManageModal.result.then(function(account){
                if(account){
                    $scope.getGroupAccountConfigurations();
                }
            }, function(){
            });
        };

        $scope.openDeleteAccountConfigurationsModal = function (page, size,groupAccountConfiguration) {
            vm.theDeleteModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteGroupAccountConfigModalCtrl',
                resolve:{
                    accountConfig: function () {
                        return groupAccountConfiguration;
                    }
                }
            });

            vm.theDeleteModal.result.then(function(account){
                if(account){
                    $scope.getGroupAccountConfigurations();
                }
            }, function(){
            });
        };

    }
})();
