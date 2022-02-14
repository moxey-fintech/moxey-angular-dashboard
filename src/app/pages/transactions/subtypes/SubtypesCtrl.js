(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes.subtypesList')
        .controller('SubtypesCtrl', SubtypesCtrl);

    /** @ngInject */
    function SubtypesCtrl($scope,Rehive,$uibModal,localStorageManagement,$state,errorHandler,$filter,sharedResources) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingSubtypes = true;
        $scope.locationIndicator = 'subtypes';
        $scope.defaultSubtypes = [];

        $scope.goToAddDefaultSubtypes = function() {
            $state.go('transactions.subtypes.subtypesDefault', {defaultSubtypes: $scope.defaultSubtypes});
        };

        vm.fetchDefaultTemplateSubtypes = function(){
            if(vm.token) {
                sharedResources.getDefaultSubtypes().then(function (res) {
                    $scope.defaultSubtypes = [];
                    if(res.length > 0 && res[0].config && res[0].config.subtypes){
                        $scope.defaultSubtypes = sharedResources.getMissingDefaultSubtypes(res[0].config.subtypes, $scope.subtypes);
                        if($scope.defaultSubtypes.length > 0){
                            $scope.defaultSubtypes.forEach(function(defaultSubtype){
                                if(!defaultSubtype.label){ defaultSubtype.label = $filter('capitalizeWord')(defaultSubtype.name).replace('_', ' '); }
                                defaultSubtype.selected = false;
                            });
                        }
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getSubtypes = function () {
            if(vm.token) {
                $scope.loadingSubtypes = true;
                sharedResources.getSubtypes().then(function (res) {
                    $scope.subtypes = res;
                    vm.fetchDefaultTemplateSubtypes();
                    $scope.loadingSubtypes = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSubtypes = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getSubtypes();

        $scope.restoreSubtype = function (subtype) {
            $scope.loadingSubtypes = true;
            Rehive.admin.subtypes.update(subtype.id, {archived: false}).then(function (res) {
                vm.getSubtypes();
                $scope.$apply();
            }, function (error) {
                $scope.loadingSubtypes = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.openAddSubtypeModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddSubtypeModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(subtype){
                if(subtype){
                    vm.getSubtypes();
                }
            }, function(){
            });
        };

        $scope.openEditSubtypeModal = function (page, size,subtype) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditSubtypeModalCtrl',
                scope: $scope,
                resolve: {
                    subtype: function () {
                        return subtype;
                    }
                }
            });

            vm.theModal.result.then(function(subtype){
                if(subtype){
                    vm.getSubtypes();
                }
            }, function(){
            });
        };

        $scope.openSubtypeModal = function (page, size,subtype) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'SubtypeModalCtrl',
                scope: $scope,
                resolve: {
                    subtype: function () {
                        return subtype;
                    }
                }
            });

            vm.theModal.result.then(function(subtype){
                if(subtype){
                    vm.getSubtypes();
                }
            }, function(){
            });
        };
    }
})();
