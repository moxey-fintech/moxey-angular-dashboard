(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceSettings')
        .controller('AppServiceSettingsCtrl', AppServiceSettingsCtrl);

    /** @ngInject */
    function AppServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,$state,extensionsHelper,
                                    $timeout,toastr,$location,errorHandler,Rehive,_,$uibModal, serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        vm.serviceId = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        $scope.walletSettingView = '';
        $scope.updatingWalletSettings = true;
        $scope.deactivatingWallet = false;
        $scope.currenciesList = [];
        $scope.walletCompanySettings = {};
        vm.walletCompanySettings = {};

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

        $scope.goToWalletSetting = function (view) {
            $scope.walletSettingView = view;
        };

        $scope.deactivateWalletConfirm = function () {
            $ngConfirm({
                title: 'Deactivate App extension',
                contentUrl: 'app/pages/services/appService/appServiceSettings/appServiceDeactivation/appServiceDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateAppService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateAppService = function () {
            if(vm.token) {
                $scope.deactivatingWallet = true; 
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                    }).then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                            $timeout(function () {
                                $scope.deactivatingWallet = false;
                                toastr.success('Extension has been successfully deactivated');
                                $location.path('/extensions');
                            },600);
                        }
                    }).catch(function (error) {
                        $scope.deactivatingWallet = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
            }
        };
        
        vm.getWalletSettings = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.walletCompanySettings = {};
                    vm.walletCompanySettings = {};
                    $scope.walletCompanySettings = res.data.data;
                    console.log($scope.walletCompanySettings)
                    $scope.updatingWalletSettings = false;
                }).catch(function (error) {
                    $scope.updatingWalletSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.trackUpdatedWalletSetting = function(fieldName){
            vm.walletCompanySettings[fieldName] = $scope.walletCompanySettings[fieldName];
        };
        
        $scope.updateWalletSettings = function(){
            if(vm.token){
                $scope.updatingWalletSettings = true;
                $http.patch(vm.serviceUrl + 'admin/company/', vm.walletCompanySettings, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    toastr.success('Settings updated successfully');
                    vm.getWalletSettings();
                }).catch(function(error){
                    $scope.updatingWalletSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
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
                $scope.goToWalletSetting('settings');
                vm.getCompanyCurrencies();
                vm.getWalletSettings();
            })
            .catch(function(err){
                $scope.updatingWalletSettings = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
       
    }
})();
