(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .controller('DisplayStellarUnAssignedTxnModalCtrl', DisplayStellarUnAssignedTxnModalCtrl);

    function DisplayStellarUnAssignedTxnModalCtrl($scope,$uibModal,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler, unassignedTxn,$location,extensionsHelper) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = null;
        var serviceName = "stellar_service";
        $scope.unassignedTxn = unassignedTxn;
        $scope.loadingTransaction = true;

        $scope.openAssignTransactionModal = function(page, size){
            vm.theAssignTxnModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AssignStellarTransactionModalCtrl',
                resolve: {
                    transaction: function(){
                        return $scope.unassignedTxn;
                    }
                }
            });

            vm.theAssignTxnModal.result.then(function(transactionAssigned){
                if(transactionAssigned){
                    $uibModalInstance.close(true);
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.loadingTransaction = false;
            })
            .catch(function(err){
                $scope.loadingTransaction = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();