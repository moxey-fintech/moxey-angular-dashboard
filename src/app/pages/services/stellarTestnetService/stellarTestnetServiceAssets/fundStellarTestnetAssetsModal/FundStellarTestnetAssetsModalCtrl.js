(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAssets')
        .controller('FundStellarTestnetAssetsModalCtrl', FundStellarTestnetAssetsModalCtrl);

    function FundStellarTestnetAssetsModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper, assetId) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null;
        var serviceName = "stellar_testnet_service";
        $scope.fundingassets = true;

        $scope.getFundAssets = function () {
            $scope.fundingassets = true;

            $http.get(vm.baseUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.fundingassets = false;
                if (res.status === 200 || res.status === 201) {
                    $scope.assetsFundObj = res.data.data;
                    $scope.assetsFundObj.qr_code = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + $scope.assetsFundObj.account_address + '&choe=UTF-8';
                }
            }).catch(function (error) {
                $scope.fundingassets = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        
        $scope.addAssets = function (assetParams) {
            $scope.addingassets = true;

            $http.post(vm.baseUrl + 'admin/asset/' + assetId + '/fund/', assetParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingassets = false;
                if (res.status === 200 || res.status === 201) {
                    toastr.success('Asset successfully funded');
                    $uibModalInstance.close();
                }
            }).catch(function (error) {
                $scope.addingassets = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.getFundAssets();
            })
            .catch(function(err){
                $scope.fundingassets = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
