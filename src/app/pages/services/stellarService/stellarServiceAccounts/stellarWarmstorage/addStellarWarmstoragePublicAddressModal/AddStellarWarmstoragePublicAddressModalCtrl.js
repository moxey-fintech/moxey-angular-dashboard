(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .controller('AddStellarWarmstoragePublicAddressModalCtrl', AddStellarWarmstoragePublicAddressModalCtrl);

    function AddStellarWarmstoragePublicAddressModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = null; 
        var serviceName = "stellar_service";
        $scope.addingPublicAddress = true;
        $scope.publicAddressParams = {
            account_address: ''
        };

        $scope.addPublicAddress = function (publicAddressParams) {
            $scope.addingPublicAddress = true;
            publicAddressParams.status = 'Active';
            $http.post(vm.serviceUrl + 'admin/warmstorage/accounts/', publicAddressParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingPublicAddress = false;
                if (res.status === 201) {
                    toastr.success('Public address successfully added');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.addingPublicAddress = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.addingPublicAddress = false;
            })
            .catch(function(err){
                $scope.addingPublicAddress = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();