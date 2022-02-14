(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.exchangeServiceSettings')
        .controller('ExchangeServiceSettingsCtrl', ExchangeServiceSettingsCtrl);

    /** @ngInject */
    function ExchangeServiceSettingsCtrl($rootScope,$scope,$http,localStorageManagement,toastr,errorHandler,$state) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        // $rootScope.dashboardTitle = 'Exchange service | Moxey';
        $rootScope.dashboardTitle = 'Exchange extension | Moxey';
        $scope.exchangeSettingView = '';
        $scope.updatingCompanyDetails =  false;
        vm.updatedCompany = {};
        $scope.company = {};

        $scope.goToExchangeSetting = function (setting) {
            $scope.exchangeSettingView = setting;
        };

        vm.getCompanyDetails = function () {
          $scope.updatingCompanyDetails =  true;
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyDetails =  false;
                    if (res.status === 200 || res.status === 201) {
                      $scope.company = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyDetails();

        $scope.companyDetailsChanged = function (field) {
            vm.updatedCompany[field] = $scope.company[field];
        };

        $scope.updateCompanyDetails = function () {
          $scope.updatingCompanyDetails =  true;
            $scope.company = {};
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/company/', vm.updatedCompany, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyDetails =  false;
                    if (res.status === 200 || res.status === 201) {
                      toastr.success('Company details have been successfully updated');
                      $scope.company = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToWebhooks = function(secret){
            $state.go('webhooks.list',{"secret": secret});
        };


    }
})();
