(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreTestnetService.wyreTestnetServiceSettings')
        .controller('WyreTestnetServiceSettingsCtrl', WyreTestnetServiceSettingsCtrl);

    /** @ngInject */
    function WyreTestnetServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                 extensionsHelper,$timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        vm.serviceId = null;
        var serviceName = "wyre_testnet_service";
        $rootScope.dashboardTitle = 'Wyre Testnet Extension | Moxey';
        $scope.wyreTestnetSettingView = '';
        $scope.deactivatingWyreTestnet = false;
        $scope.updatingCompanyDetails =  true;
        $scope.company = {};
        vm.updatedCompany = {};

        vm.getCompanyDetails = function () {
            $scope.updatingCompanyDetails =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/configuration/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyDetails =  false;
                    $scope.company = res.data.data;
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.companyDetailsChanged = function (field) {
            vm.updatedCompany[field] = $scope.company[field];
        };

        $scope.updateCompanyDetails = function () {
            $scope.updatingCompanyDetails =  true;
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/configuration/', vm.updatedCompany, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.company = {};
                    $scope.updatingCompanyDetails =  false;
                        toastr.success('Company details have been successfully updated');
                        $scope.company = res.data.data;
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.goToWyreTestnetServiceSetting = function (setting) {
            $scope.wyreTestnetSettingView = setting;
        };        

        $scope.deactivateWyreTestnetServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/wyreTestnetService/wyreTestnetServiceSettings/wyreTestnetServiceDeactivation/wyreTestnetDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateWyreTestnetService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateWyreTestnetService = function () {
            if(vm.token) {
                $scope.deactivatingWyreTestnet = true;
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $timeout(function () {
                            $scope.deactivatingWyreTestnet = false;
                            toastr.success('Extension has been successfully deactivated');
                            // toastr.success('Service has been successfully deactivated');
                            // $location.path('/services');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingWyreTestnet = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });              
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.serviceId = JSON.parse(localStorageManagement.getValue('extensionsList'))["wyre_testnet_service"].id;
                $scope.goToWyreTestnetServiceSetting('settings');
                vm.getCompanyDetails();
            })
            .catch(function(err){
                $scope.updatingCompanyDetails = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
