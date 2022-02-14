(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.krakenService.krakenServiceSettings')
        .controller('KrakenServiceSettingsCtrl', KrakenServiceSettingsCtrl);

    /** @ngInject */
    function KrakenServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,$state,extensionsHelper,
                                    $timeout,toastr,$location,errorHandler,Rehive,_,$uibModal, serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        vm.serviceId = null;
        var serviceName = "kraken_service";
        $rootScope.dashboardTitle = 'Kraken Extension | Moxey';
        $scope.krakenSettingView = '';
        $scope.updatingKrakenSettings = true;
        $scope.loadingExchangePairs = true;
        $scope.deactivatingKraken = false;
        $scope.currenciesList = [];
        $scope.krakenExchangePairsList = [];
        $scope.krakensymbols = ["BTC/EUR","BTC/USD"];
        $scope.krakenCompanySettings = {};
        vm.krakenCompanySettings = {};

        vm.getCompanyCurrencies = function() {
            if(vm.token) {
                $http.get(environmentConfig.API + 'admin/currencies/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.currenciesList = res.data.data.results;
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getKrakenExchangePairs = function() {
            if(vm.token) {
                $scope.loadingExchangePairs = true;
                $http.get(vm.serviceUrl + 'admin/exchange-pairs/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.krakenExchangePairsList = res.data.data.results;
                    $scope.loadingExchangePairs = false;
                }).catch(function (error) {
                    $scope.loadingExchangePairs = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToKrakenSetting = function (setting) {
            $scope.krakenSettingView = setting;
        };

        $scope.deactivateKrakenConfirm = function () {
            $ngConfirm({
                title: 'Deactivate Kraken extension',
                contentUrl: 'app/pages/services/krakenService/krakenServiceSettings/krakenServiceDeactivation/krakenDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateKrakenService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateKrakenService = function (password) {
            if(vm.token) {
                $scope.deactivatingKraken = true; 
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{password: password,active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                    }).then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                            $timeout(function () {
                                $scope.deactivatingKraken = false;
                                toastr.success('Extension has been successfully deactivated');
                                $location.path('/extensions');
                            },600);
                        }
                    }).catch(function (error) {
                        $scope.deactivatingKraken = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
            }
        };
        
        vm.getKrakenSettings = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.krakenCompanySettings = {};
                    vm.krakenCompanySettings = {};
                    $scope.krakenCompanySettings = res.data.data;
                    $scope.updatingKrakenSettings = false;
                }).catch(function (error) {
                    $scope.updatingKrakenSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.copiedSecretSuccessfully = function () {
            toastr.success('Secret copied to clipboard');
        };

        $scope.trackUpdatedKrakenSetting = function(fieldName){
            if(fieldName === 'kraken_currencies'){
                vm.krakenCompanySettings[fieldName] = _.map($scope.krakenCompanySettings[fieldName], 'code');
            } else {
                vm.krakenCompanySettings[fieldName] = $scope.krakenCompanySettings[fieldName];
            }
        };
        
        $scope.updateKrakenSettings = function(){
            if(vm.token){
                $scope.updatingKrakenSettings = true;
                $http.patch(vm.serviceUrl + 'admin/company/', vm.krakenCompanySettings, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    toastr.success('Settings updated successfully');
                    vm.getKrakenSettings();
                }).catch(function(error){
                    $scope.updatingKrakenSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAddNewExchangePairModal = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddKrakenServiceExchangePairModalCtrl',
                scope: $scope,
            });

            vm.theAddModal.result.then(function(exchangePair){
                if(exchangePair){
                    vm.getKrakenExchangePairs();
                }

            }, function(){
            });
        };

        // $scope.openEditKrakenServiceExchangePairsModal = function (page, size, exchangePairs) {
        //     vm.theModal = $uibModal.open({
        //         animation: true,
        //         templateUrl: page,
        //         size: size,
        //         controller: 'EditKrakenServiceExchangePairsModalCtrl',
        //         scope: $scope,
        //         resolve: {
        //             exchangePairs: function () {
        //                 return exchangePairs;
        //             }
        //         }
        //     });
        //     vm.theModal.result.then(function(exchangePairEdited){
        //             if(exchangePairEdited){
        //                 vm.getKrakenExchangePairs();
        //             }
        //         }, function(){}
        //     );
        // };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.serviceId = extensionsHelper.getActiveServiceId(serviceName);
                if(!vm.serviceId){
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                }
                $scope.goToKrakenSetting('settings');
                vm.getKrakenSettings();
                vm.getCompanyCurrencies();
                vm.getKrakenExchangePairs();

            })
            .catch(function(err){
                $scope.updatingKrakenSettings = false;
                $scope.loadingCurrencies = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
       
    }
})();
