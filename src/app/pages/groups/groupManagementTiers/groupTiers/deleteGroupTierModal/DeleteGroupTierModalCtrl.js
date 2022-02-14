(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('DeleteGroupTierModalCtrl', DeleteGroupTierModalCtrl);

    function DeleteGroupTierModalCtrl($scope,$stateParams,$uibModalInstance,Rehive,$ngConfirm,
                                      toastr,tier,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        $scope.tier = tier;
        $scope.deletingTiers = false;

        $scope.archiveTier = function(deleteTier){
            if(vm.token) {
                $scope.deletingTiers = true;
                Rehive.admin.groups.tiers.update(vm.groupName,$scope.tier.id, { archived: true }).then(function (res) {
                    if(deleteTier){
                        $scope.deleteGroupTier();
                        $scope.$apply();
                    } else {
                        $scope.deletingTiers = false;
                        toastr.success('You have successfully archived the tier');
                        $uibModalInstance.close(true);
                        $scope.$apply();
                    }


                }, function (error) {
                    $scope.deletingTiers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteGroupTierConfirm = function () {
            $ngConfirm({
                title: 'Delete tier',
                contentUrl: 'app/pages/groups/groupManagementTiers/groupTiers/deleteGroupTierModal/deleteGroupTierPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger delete-button',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            if(!$scope.tier.archived){
                                $scope.archiveTier('deleteTier');
                            } else {
                                $scope.deleteGroupTier();
                            }
                        }
                    }
                }
            });
        };

        $scope.deleteGroupTier = function () {
            $scope.deletingTiers = true;
            Rehive.admin.groups.tiers.delete(vm.groupName,$scope.tier.id).then(function (res) {
                toastr.success('Tier successfully deleted');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.deletingTiers = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };


    }
})();
