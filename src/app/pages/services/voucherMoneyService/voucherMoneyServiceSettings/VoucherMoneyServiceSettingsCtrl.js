(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.voucherMoneyService.voucherMoneyServiceSettings')
        .controller('VoucherMoneyServiceSettingsCtrl', VoucherMoneyServiceSettingsCtrl);

    /** @ngInject */
    function VoucherMoneyServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,$state,extensionsHelper,
                                    $timeout,toastr,$location,errorHandler,Rehive,_,$uibModal, serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        vm.serviceId = null;
        var serviceName = "vouchermoney_service";
        $rootScope.dashboardTitle = 'VoucherMoney Extension | Moxey';
        $scope.voucherMoneySettingView = '';
        $scope.updatingVoucherMoneySettings = true;
        $scope.loadingCurrencies = true;
        $scope.deactivatingVoucherMoney = false;
        $scope.currenciesList = [];
        $scope.voucherMoneyCompanySettings = {};
        vm.voucherMoneyCompanySettings = {};

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

        vm.getVoucherMoneyCurrencies = function() {
            if(vm.token) {
                $scope.loadingCurrencies = true;
                $http.get(vm.serviceUrl + 'admin/currencies/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.voucherMoneyCurrenciesList = res.data.data.results;
                    $scope.loadingCurrencies = false;
                }).catch(function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToVoucherMoneySetting = function (setting) {
            $scope.voucherMoneySettingView = setting;
        };

        $scope.deactivateVoucherMoneyConfirm = function () {
            $ngConfirm({
                title: 'Deactivate VoucherMoney extension',
                contentUrl: 'app/pages/services/voucherMoneyService/voucherMoneyServiceSettings/voucherMoneyServiceDeactivation/voucherMoneyDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateVoucherMoneyService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateVoucherMoneyService = function () {
            if(vm.token) {
                $scope.deactivatingVoucherMoney = true; 
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                    }).then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                            $timeout(function () {
                                $scope.deactivatingVoucherMoney = false;
                                toastr.success('Extension has been successfully deactivated');
                                $location.path('/extensions');
                            },600);
                        }
                    }).catch(function (error) {
                        $scope.deactivatingVoucherMoney = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
            }
        };
        
        vm.getVoucherMoneySettings = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.voucherMoneyCompanySettings = {};
                    vm.voucherMoneyCompanySettings = {};
                    $scope.voucherMoneyCompanySettings = res.data.data;
                    $scope.updatingVoucherMoneySettings = false;
                }).catch(function (error) {
                    $scope.updatingVoucherMoneySettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.copiedSecretSuccessfully = function () {
            toastr.success('Secret copied to clipboard');
        };

        $scope.trackUpdatedVoucherMoneySetting = function(fieldName){
                vm.voucherMoneyCompanySettings[fieldName] = $scope.voucherMoneyCompanySettings[fieldName];
        };
        
        $scope.updateVoucherMoneySettings = function(){
            if(vm.token){
                $scope.updatingVoucherMoneySettings = true;
                $http.patch(vm.serviceUrl + 'admin/company/', vm.voucherMoneyCompanySettings, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    toastr.success('Settings updated successfully');
                    vm.getVoucherMoneySettings();
                }).catch(function(error){
                    $scope.updatingVoucherMoneySettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openEditVoucherMoneyServiceCurrencyModal = function (page, size, currency) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditVoucherMoneyServiceCurrencyModalCtrl',
                scope: $scope,
                resolve: {
                    currency: function () {
                        return currency;
                    }
                }
            });
            vm.theModal.result.then(function(currencyEdited){
                    if(currencyEdited){
                        vm.getVoucherMoneyCurrencies();
                    }
                }, function(){}
            );
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.serviceId = extensionsHelper.getActiveServiceId(serviceName);
                if(!vm.serviceId){
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                }
                $scope.goToVoucherMoneySetting('settings');
                vm.getVoucherMoneySettings();
                vm.getCompanyCurrencies();
                vm.getVoucherMoneyCurrencies();

            })
            .catch(function(err){
                $scope.updatingVoucherMoneySettings = false;
                $scope.loadingCurrencies = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
       
    }
})();
