(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .controller('FundStellarTestnetHotwalletModalCtrl', FundStellarTestnetHotwalletModalCtrl);

    function FundStellarTestnetHotwalletModalCtrl($scope,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = null;
        var serviceName = "stellar_testnet_service";
        $scope.fundingHotwallet = true;
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
                    $scope.hotWalletFundObj = res.data.data;
                    $scope.hotWalletFundObj.qr_code = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + $scope.hotWalletFundObj.account_address + '&choe=UTF-8';
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
