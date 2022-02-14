(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .controller('AddStellarTestnetHotwalletModalCtrl', AddStellarTestnetHotwalletModalCtrl);

    function AddStellarTestnetHotwalletModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null;
        var serviceName = "stellar_testnet_service";
        $scope.addingHotwallet = true;
        $scope.hotwalletParams = {
            low_balance_percentage: 0.1
        };

        $scope.addHotwallet = function (hotwalletParams) {
            $scope.addingHotwallet = true;

            $http.post(vm.baseUrl + 'admin/hotwallet/', hotwalletParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingHotwallet = false;
                if (res.status === 201) {
                    toastr.success('Hotwallet successfully added');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.addingHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.addingHotwallet = false;
            })
            .catch(function(err){
                $scope.addingHotwallet = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
