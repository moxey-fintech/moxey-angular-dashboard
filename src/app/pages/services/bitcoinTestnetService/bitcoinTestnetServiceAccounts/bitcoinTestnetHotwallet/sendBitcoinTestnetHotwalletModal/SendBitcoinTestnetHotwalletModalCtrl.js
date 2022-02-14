(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceAccounts')
        .controller('SendBitcoinTestnetHotwalletModalCtrl', SendBitcoinTestnetHotwalletModalCtrl);

    function SendBitcoinTestnetHotwalletModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler,hotWalletCurrencies,currencyModifiers,extensionsHelper,$location) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "bitcoin_testnet_service";
        $scope.sendCurrency = null;
        $scope.hotWalletCurrencies = hotWalletCurrencies;
        $scope.sendCurrency = $scope.hotWalletCurrencies.find(function(currency){
            return currency.currency.code === 'TXBT';
        });
        $scope.creatingSendOnHotwallet = true;
        $scope.hotwalletParams = {
            to_reference: "",
            amount: 0,
            currency: $scope.hotWalletCurrencies[0]
        };

        $scope.createHotwalletWithdrawal = function () {
            var hotwalletParams = {
                to_reference: $scope.hotwalletParams.to_reference,
                amount: currencyModifiers.convertToCents($scope.hotwalletParams.amount, $scope.sendCurrency.currency.divisibility),
                currency: $scope.hotwalletParams.currency.currency.code,
            };
            $scope.creatingSendOnHotwallet = true;

            $http.post(vm.serviceUrl + 'admin/hotwallet/send/', hotwalletParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.creatingSendOnHotwallet = false;
                toastr.success('Withdrawal request created successfully on hotwallet');
                $uibModalInstance.close(res.data);

            }).catch(function (error) {
                $scope.creatingSendOnHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
                .then(function(serviceUrl){
                    vm.serviceUrl = serviceUrl;
                    $scope.creatingSendOnHotwallet = false;
                })
                .catch(function(err){
                    $scope.creatingSendOnHotwallet = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
