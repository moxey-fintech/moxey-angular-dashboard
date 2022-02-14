(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .controller('SendStellarHotwalletModalCtrl', SendStellarHotwalletModalCtrl);

    function SendStellarHotwalletModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler,hotWalletCurrencies,currencyModifiers,
                                            $location, extensionsHelper) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "stellar_service";
        $scope.hotWalletCurrencies = hotWalletCurrencies;
        $scope.creatingSendOnHotwallet = true;
        $scope.hotwalletParams = {
            to_reference: "",
            amount: 0,
            currency: $scope.hotWalletCurrencies[0],
            memo: null
        };

        $scope.createHotwalletWithdrawal = function () {
            var hotwalletParams = {
                to_reference: $scope.hotwalletParams.to_reference,
                amount: currencyModifiers.convertToCents($scope.hotwalletParams.amount, $scope.hotwalletParams.currency.currency.divisibility),
                currency: $scope.hotwalletParams.currency.currency.code,
                memo: $scope.hotwalletParams.memo
            }; 
            $scope.creatingSendOnHotwallet = true;

            $http.post(vm.baseUrl + 'admin/hotwallet/send/', hotwalletParams, {
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
                vm.baseUrl = serviceUrl;
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
