(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceSettings')
        .controller('EthereumServiceSettingsCtrl', EthereumServiceSettingsCtrl);

    /** @ngInject */
    function EthereumServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$ngConfirm,$http,environmentConfig,
                                         $timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceId = localStorageManagement.getValue('SERVICEID');
        // $rootScope.dashboardTitle = 'Ethereum service | Moxey';
        $rootScope.dashboardTitle = 'Ethereum extension | Moxey';
        $scope.ethereumSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;
        $scope.deactivatingEthereum = false;

        $scope.goToEthereumSetting = function (setting) {
            $scope.ethereumSettingView = setting;
        };
        $scope.goToEthereumSetting('hdkeys');

        $scope.deactivateEthereumServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinDeactivation/bitcoinDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateEthereumService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateEthereumService = function () {
            if(vm.token) {
                $scope.deactivatingEthereum = true;
                $http.get(environmentConfig.API + 'admin/services/?slug=ethereum_service', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var serviceId = res.data.data.results[0].id;
                    $http.patch(environmentConfig.API + 'admin/services/' + serviceId + '/',{active: false}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                            $timeout(function () {
                                $scope.deactivatingEthereum = false;
                                toastr.success('Extension has been successfully deactivated');
                                // $location.path('/services');
                                $location.path('/extensions');
                            },600);
                        }
                    }).catch(function (error) {
                        $scope.deactivatingEthereum = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }).catch(function (error) {
                    $scope.deactivatingEthereum = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
    }
})();
