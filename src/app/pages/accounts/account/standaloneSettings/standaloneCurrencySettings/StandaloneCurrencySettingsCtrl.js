(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.account.standaloneSettings.standaloneCurrencySettings')
        .controller('StandaloneCurrencySettingsCtrl', StandaloneCurrencySettingsCtrl);

    /** @ngInject */
    function StandaloneCurrencySettingsCtrl($scope,$stateParams,Rehive,localStorageManagement,errorHandler,$rootScope, toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.shouldBeBlue = 'Users';
        vm.currencyCode = $stateParams.currencyCode;
        vm.reference = $stateParams.reference;

        $scope.accountCurrencySettingsObj = {};
        $scope.loadingAccountCurrencySettings = false;

        vm.getGroupSettings = function () {
            if(vm.token) {
                $scope.loadingAccountCurrencySettings = true;
                Rehive.admin.accounts.currencies.settings.get(vm.reference,vm.currencyCode).then(function (res) {
                    $scope.loadingAccountCurrencySettings = false;
                    $scope.accountCurrencySettingsObj = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountCurrencySettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getGroupSettings();

        $scope.toggleAccountCurrencySettings = function (groupSetting,type) {

            var updatedSetting = {};
            updatedSetting[type] = !groupSetting;

            if(vm.token) {
                $scope.loadingAccountCurrencySettings = true;
                Rehive.admin.accounts.currencies.settings.update(vm.reference,vm.currencyCode,updatedSetting).then(function (res) {
                    $scope.accountCurrencySettingsObj = {};
                    $scope.accountCurrencySettingsObj = res;
                    $scope.loadingAccountCurrencySettings = false;
                    toastr.success('Account currency transaction setting updated successfully');
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountCurrencySettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();