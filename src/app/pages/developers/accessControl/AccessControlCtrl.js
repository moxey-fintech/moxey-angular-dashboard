(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.accessControl')
        .controller('AccessControlCtrl', AccessControlCtrl);

    /** @ngInject */
    function AccessControlCtrl($rootScope,$scope,serializeFiltersService,
                               localStorageManagement,errorHandler,$uibModal,Rehive,$intercom) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Access control | Moxey';
        $scope.accessControlRules = [];
        $scope.loadingAccessControl = false;

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getAccessControlFiltersObj = function(){
            // $scope.filtersCount = 0;
            //
            // for(var x in $scope.filtersObj){
            //     if($scope.filtersObj.hasOwnProperty(x)){
            //         if($scope.filtersObj[x]){
            //             $scope.filtersCount = $scope.filtersCount + 1;
            //         }
            //     }
            // }

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 25
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getAccessControlRules = function(){
            $scope.loadingAccessControl = true;

            var accessControlFiltersObj = vm.getAccessControlFiltersObj();

            Rehive.admin.accessControlRules.get({filters: accessControlFiltersObj}).then(function (res) {
                $scope.loadingAccessControl = false;
                $scope.accessControlRulesData =  res;
                $scope.accessControlRules =  res.results;
                $scope.$apply();
            }, function (error) {
                $scope.loadingAccessControl = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        $scope.getAccessControlRules();

        $scope.openAddAccessControlModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddAccessControlModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(rule){
                if(rule){
                    $scope.getAccessControlRules();
                }
            }, function(){
            });
        };

        $scope.openEditAccessControlModal = function (page, size, rule) {
            vm.theEditModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditAccessControlModalCtrl',
                scope: $scope,
                resolve: {
                    rule: function () {
                        return rule;
                    }
                }
            });

            vm.theEditModal.result.then(function(rule){
                if(rule){
                    $scope.getAccessControlRules();
                }
            }, function(){
            });
        };

        $scope.openDeleteAccessControlModal = function (page, size, rule) {
            vm.theDeleteModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteAccessControlModalCtrl',
                scope: $scope,
                resolve: {
                    rule: function () {
                        return rule;
                    }
                }
            });

            vm.theDeleteModal.result.then(function(rule){
                if(rule){
                    $scope.getAccessControlRules();
                }
            }, function(){
            });
        };

    }
})();
