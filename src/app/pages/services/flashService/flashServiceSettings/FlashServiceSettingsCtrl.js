(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.flashService.flashServiceSettings')
        .controller('FlashServiceSettingsCtrl', FlashServiceSettingsCtrl);

    /** @ngInject */
    function FlashServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,$state,extensionsHelper,
                                    $timeout,toastr,$location,errorHandler,Rehive,_,$uibModal, serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        vm.serviceId = null;
        var serviceName = "flash_service";
        $rootScope.dashboardTitle = 'Flash Extension | Moxey';
        $scope.flashSettingView = '';
        $scope.updatingFlashSettings = true;
        $scope.deactivatingflash = false;
        $scope.flashCompanySettings = {};
        vm.flashCompanySettings = {};

        $scope.goToFlashSetting = function (setting) {
            $scope.flashSettingView = setting;
        };

        $scope.deactivateFlashConfirm = function () {
            $ngConfirm({
                title: 'Deactivate Flash extension',
                contentUrl: 'app/pages/services/flashService/flashServiceSettings/flashServiceDeactivation/flashDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateFlashService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateFlashService = function () {
            if(vm.token) {
                $scope.deactivatingFlash = true; 
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                    }).then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                            $timeout(function () {
                                $scope.deactivatingFlash = false;
                                toastr.success('Extension has been successfully deactivated');
                                $location.path('/extensions');
                            },600);
                        }
                    }).catch(function (error) {
                        $scope.deactivatingFlash = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
            }
        };
        
        vm.getFlashSettings = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.flashCompanySettings = {};
                    vm.flashCompanySettings = {};
                    $scope.flashCompanySettings = res.data.data;
                    $scope.updatingFlashSettings = false;
                }).catch(function (error) {
                    $scope.updatingFlashSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.copiedSecretSuccessfully = function () {
            toastr.success('Secret copied to clipboard');
        };

        $scope.trackUpdatedFlashSetting = function(fieldName){
                vm.flashCompanySettings[fieldName] = $scope.flashCompanySettings[fieldName];
        };
        
        $scope.updateFlashSettings = function(){
            if(vm.token){
                $scope.updatingFlashSettings = true;
                $http.patch(vm.serviceUrl + 'admin/company/', vm.flashCompanySettings, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    toastr.success('Settings updated successfully');
                    vm.getFlashSettings();
                }).catch(function(error){
                    $scope.updatingFlashSettings = false;
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
                $scope.goToFlashSetting('settings');
                vm.getFlashSettings();
            })
            .catch(function(err){
                $scope.updatingFlashSettings = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
       
    }
})();
