(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAssets')
        .controller('StellarTestnetServiceAssetsCtrl', StellarTestnetServiceAssetsCtrl);

    /** @ngInject */
    function StellarTestnetServiceAssetsCtrl($scope,localStorageManagement,environmentConfig,$filter,$http,errorHandler,$uibModal,toastr,$location,extensionsHelper) {

        $scope.stellarAccountSettingView = '';

        var vm = this;
        vm.serviceUrl = null;
        var serviceName = "stellar_testnet_service";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.stellarCurrency = {};
        $scope.assetsObj = [];
        $scope.loadingAssets =  true;
        $scope.onchainData = null;

        $scope.getTXLMCurrency = function () {
            $scope.loadingAssets =  true;
            if(vm.token) {
                $http.get(environmentConfig.API + 'admin/currencies/TXLM/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.stellarCurrency = res.data.data;
                        vm.getAssets();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        vm.getAssets = function () {
            $scope.loadingAssets =  true;
            if(vm.token) {

                if($scope.assetsObj.length > 0){
                    $scope.assetsObj.length = 0;
                }

                $http.get(vm.serviceUrl + 'admin/asset/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        var assets = res.data.data;
                        if(assets.length > 0){
                            assets.forEach(function (asset,index,array) {
                                if(index === array.length - 1){
                                    vm.getAssetsBalance(asset,'last');
                                } else {
                                    vm.getAssetsBalance(asset);
                                }
                            });
                        } else {
                            $scope.loadingAssets =  false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingAssets =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getAssetsBalance = function (asset,last) {
            if(asset){
                $http.get(vm.serviceUrl + 'admin/asset/' + asset.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        asset.balance = $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(res.data.data.rehive_acc_balance.available_balance,res.data.data.rehive_acc_balance.currency.divisibility));
                        $scope.assetsObj.push(asset);
                        if(last){
                            $scope.loadingAssets =  false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingAssets =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAddAssetsModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddStellarTestnetAssetsModalCtrl',
                windowClass: 'custom-stellar-asset-window',
                scope: $scope
            });

            vm.theModal.result.then(function(assets){
                if(assets){
                    vm.getAssets();
                }
            }, function(){
            });
        };

        $scope.openFundAssetsModal = function (page, size, asset_id) {
            vm.theFundModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'FundStellarTestnetAssetsModalCtrl',
                scope: $scope,
                resolve: {
                    assetId: function(){
                        return asset_id;
                    }
                }
            });
        };   

        vm.getOnChainBalances = function(){
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/stellar_accounts/' + $scope.hotwalletObj.primary_stellar_account.id + '/?expand=onchain_data', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.onchainData = res.data.data.onchain_data;
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions = false;
                    if(error.status === 400){
                        $scope.onchainData = null;
                    } else {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };

        vm.getHotwalletActive = function () {
            $scope.loadingAssets =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/hotwallet/active/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.hotwalletObj = res.data.data;
                    $scope.hotwalletObj.total_fees = 0;
                    vm.getOnChainBalances();
                    $scope.getTXLMCurrency();
                }).catch(function (error) {
                    $scope.loadingAssets =  false;
                    if(error.status != 404){
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getHotwalletActive();
            })
            .catch(function(err){
                $scope.loadingAssets = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
