(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('editGroupTierModalCtrl', editGroupTierModalCtrl);

    function editGroupTierModalCtrl($scope,tier,$uibModalInstance,toastr,$stateParams,
                                    Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        $scope.editTier = tier;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        vm.updatedTier = {};
        $scope.tierLevels = [1,2,3,4,5,6,7];
        $scope.editingTiers = false;

        $scope.tierChanged = function(field){
            vm.updatedTier[field] = $scope.editTier[field];
        };

        $scope.updateGroupTier = function(){
            if(vm.token) {
                $scope.editingTiers = true;
                Rehive.admin.groups.tiers.update(vm.groupName,$scope.editTier.id, vm.updatedTier).then(function (res) {
                    $scope.editingTiers = false;
                    vm.updatedTier = {};
                    toastr.success('You have successfully updated a tier');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingTiers = false;
                    vm.updatedTier = {};
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();
