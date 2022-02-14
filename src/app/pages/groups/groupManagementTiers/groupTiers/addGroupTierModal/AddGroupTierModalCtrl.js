(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('AddGroupTierModalCtrl', AddGroupTierModalCtrl);

    function AddGroupTierModalCtrl($scope,$stateParams,$uibModalInstance,Rehive,
                                   toastr,localStorageManagement,errorHandler,_) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        $scope.addingTiers = false;
        $scope.newTier = {};

        vm.getAllTiers = function(){
            if(vm.token) {
                $scope.addingTiers = true;
                Rehive.admin.groups.tiers.get(vm.groupName).then(function (res) {
                    var addedTierIds = _.map(res,'level');
                    $scope.tierLevels = _.difference([1,2,3,4,5,6,7], addedTierIds);
                    $scope.newTier.level = $scope.tierLevels[0];
                    $scope.addingTiers = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.addingTiers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getAllTiers();

        $scope.addGroupTier = function(){
            if(vm.token) {
                $scope.addingTiers = true;
                Rehive.admin.groups.tiers.create(vm.groupName,$scope.newTier).then(function (res) {
                    $scope.addingTiers = false;
                    $scope.newTier = {currency: $scope.currencyCode,level: 1};
                    toastr.success('You have successfully added a tier');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.addingTiers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();
