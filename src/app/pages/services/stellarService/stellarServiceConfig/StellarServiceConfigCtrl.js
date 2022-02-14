(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceConfig')
        .controller('StellarServiceConfigCtrl', StellarServiceConfigCtrl);

    /** @ngInject */
    function StellarServiceConfigCtrl($scope,$http,localStorageManagement,toastr,errorHandler,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "stellar_service";
        $scope.currentConfigView = 'hot wallet';
        $scope.hotwalletHasBeenFunded = false;
        $scope.warmStorageHasBeenFunded = false;
        $scope.hotwalletHasBeenFunded = false;
        $scope.fundingHotwallet = true;
        $scope.warmStorage = {
            publicKey: ''
        };
        $scope.warmStoragePublicKeyLengthValid = false;
        $scope.showHelpMessage = false;

        $scope.goToConfigView = function (view) {
            $scope.currentConfigView = view;
        };

        $scope.copiedSuccessfully = function () {
            toastr.success('Address copied successfully');
        };

        $scope.getFundHotwallet = function () {
            $scope.fundingHotwallet = true;
            $http.get(vm.serviceUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $scope.hotWalletFundObj = res.data.data;
                    $scope.hotWalletFundObj.qr_code = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + $scope.hotWalletFundObj.account_address + '&choe=UTF-8';
                    $scope.fundingHotwallet = false;
                }
            }).catch(function (error) {
                $scope.fundingHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };        

        $scope.addWarmStoragePublicKey = function () {
            $scope.addingPublicKey = true;
            $http.post(vm.serviceUrl + 'admin/warmstorage/accounts/', {account_address: $scope.warmStorage.publicKey,status: 'Active'}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingPublicKey = false;
                if (res.status === 201) {
                    $scope.goToConfigView('finish');
                }
            }).catch(function (error) {
                $scope.addingPublicKey = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.onPublicKeyChange = function (warmStorage) {
            $scope.showHelpMessage = false;
            if(warmStorage.publicKey.length == 56){
                $scope.warmStoragePublicKeyLengthValid = true;
            } else {
                $scope.warmStoragePublicKeyLengthValid = false;
            }
        };

        $scope.goToAccountsView = function () {
            $location.path('services/stellar/accounts');
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
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
