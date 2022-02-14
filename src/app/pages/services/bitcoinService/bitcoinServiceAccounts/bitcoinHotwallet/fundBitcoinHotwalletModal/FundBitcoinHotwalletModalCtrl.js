(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('FundBitcoinHotwalletModalCtrl', FundBitcoinHotwalletModalCtrl);

    function FundBitcoinHotwalletModalCtrl($scope,toastr,$http,localStorageManagement,errorHandler,extensionsHelper,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null;
        // vm.baseUrl = "https://bitcoin-testnet.services.rehive.io/api/1/";
        $scope.fundingHotwallet = true;
        var serviceName = "bitcoin_service";
        
        $scope.hotwalletParams = {
            low_balance_percentage: 0.1
        };

        $scope.copiedSuccessfully = function () {
            toastr.success('Address copied successfully');
        };

        $scope.getFundHotwallet = function () {
            $scope.fundingHotwallet = true;

            $http.get(vm.baseUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.fundingHotwallet = false;
                if (res.status === 200 || res.status === 201) {
                    $scope.hotWalletFundObj = res.data.data.crypto;
                }
            }).catch(function (error) {
                $scope.fundingHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.getFundHotwallet();
            })
            .catch(function(err){
                $scope.fundingHotwallet = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
