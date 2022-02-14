(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('AddPublicAddressModalCtrl', AddPublicAddressModalCtrl);

    function AddPublicAddressModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "ethereum_service";
        // vm.serviceUrl = "https://ethereum.services.rehive.io/api/1/";
        $scope.addingPublicAddress = true;
        $scope.publicAddressParams = {
            address: ''
        };

        $scope.addPublicAddress = function (publicAddressParams) {
            $scope.addingPublicAddress = true;

            $http.post(vm.serviceUrl + 'admin/coldstorage/public-addresses/', publicAddressParams, {
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

        vm.loadExtensionUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.addingPublicAddress = false;
                vm.serviceUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.addingPublicAddress = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.loadExtensionUrl(serviceName);
    }
})();