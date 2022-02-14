(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('FundEthereumHotwalletModalCtrl', FundEthereumHotwalletModalCtrl);

    function FundEthereumHotwalletModalCtrl($scope,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "ethereum_service";
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
                $scope.fundingHotwallet = false;
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
