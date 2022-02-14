(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceSettings')
        .controller('ChiplessCardServiceSettingsCtrl', ChiplessCardServiceSettingsCtrl);

    /** @ngInject */
    function ChiplessCardServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                 extensionsHelper,$timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceId = null;
        var serviceName = "chipless_card_service";
        // $rootScope.dashboardTitle = 'Chipless Card service | Moxey';
        $rootScope.dashboardTitle = 'Chipless Card extension | Moxey';
        $scope.chiplessCardSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;
        $scope.deactivatingChiplessCard = true;

        $scope.goToChiplessCardServiceSetting = function (setting) {
            $scope.chiplessCardSettingView = setting;
        };        

        $scope.deactivateChiplessCardServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/chiplessCardService/chiplessCardServiceSettings/chiplessCardServiceDeactivation/chiplessCardDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateChiplessCardService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateChiplessCardService = function () {
            if(vm.token) {
                $scope.deactivatingChiplessCard = true;
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $timeout(function () {
                            $scope.deactivatingChiplessCard = false;
                            toastr.success('Extension has been successfully deactivated');
                            // toastr.success('Service has been successfully deactivated');
                            // $location.path('/services');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingChiplessCard = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });              
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceId = JSON.parse(localStorageManagement.getValue('extensionsList'))["chipless_card_service"].id;
                $scope.goToChiplessCardServiceSetting('deactivation');
                $scope.deactivatingChiplessCard = false;
            })
            .catch(function(err){
                $scope.deactivatingChiplessCard = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
