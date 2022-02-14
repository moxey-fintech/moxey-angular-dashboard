(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits')
        .controller('AccountCurrencyLimitsCtrl', AccountCurrencyLimitsCtrl);

    /** @ngInject */
    function AccountCurrencyLimitsCtrl($window,$scope,$stateParams,$uibModal,$rootScope,
                                       Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.shouldBeBlue = 'Users';
        vm.currencyCode = $stateParams.currencyCode;
        vm.reference = $stateParams.reference;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        $scope.userData = JSON.parse($window.sessionStorage.userData);
        $scope.loadingAccountCurrencyLimits = true;
        vm.groupTierLimitTypeSlugsObj = {
            'max': 'Maximum per transaction',
            'day_max': 'Maximum per day',
            'month_max': 'Maximum per month',
            'min': 'Minimum',
            'overdraft': 'Overdraft'
        };
        vm.getCurrencyObjFromCurrenciesList = function(){
            $scope.currencyObj = vm.currenciesList.find(function(element){
                return element.code == vm.currencyCode;
            });
        };
        vm.getCurrencyObjFromCurrenciesList();

        $scope.getAccountCurrencyLimits = function(){
            if(vm.token) {
                $scope.loadingAccountCurrencyLimits = true;
                Rehive.admin.accounts.currencies.limits.get(vm.reference, vm.currencyCode).then(function (res) {
                    $scope.loadingAccountCurrencyLimits = false;
                    $scope.accountCurrencyLimitsList = res.results;
                    if($scope.accountCurrencyLimitsList.length > 0){
                        $scope.accountCurrencyLimitsList.forEach(function(limit){
                            limit.type = vm.groupTierLimitTypeSlugsObj[limit.type];
                        });    
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountCurrencyLimits = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getAccountCurrencyLimits();


        $scope.openAddAccountCurrencyLimitModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddAccountCurrencyLimitCtrl',
                scope: $scope,
                resolve: {
                    currencyCode: function () {
                        return vm.currencyCode;
                    },
                    reference: function () {
                        return vm.reference;
                    }
                }
            });

            vm.theModal.result.then(function(accountCurrencyLimit){
                if(accountCurrencyLimit){
                    $scope.getAccountCurrencyLimits();
                }
            }, function(){
            });
        };

        $scope.openEditAccountCurrencyLimitModal = function (page, size,accountCurrencyLimit) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditAccountCurrencyLimitCtrl',
                scope: $scope,
                resolve: {
                    accountCurrencyLimit: function () {
                        return accountCurrencyLimit;
                    },
                    currencyCode: function () {
                        return vm.currencyCode;
                    },
                    reference: function () {
                        return vm.reference;
                    }
                }
            });

            vm.theModal.result.then(function(accountCurrencyLimit){
                if(accountCurrencyLimit){
                    $scope.getAccountCurrencyLimits();
                }
            }, function(){
            });
        };

        $scope.openAccountCurrencyLimitsModal = function (page, size,accountCurrencyLimit) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AccountCurrencyLimitsModalCtrl',
                scope: $scope,
                resolve: {
                    accountCurrencyLimit: function () {
                        return accountCurrencyLimit;
                    },
                    currencyCode: function () {
                        return vm.currencyCode;
                    },
                    reference: function () {
                        return vm.reference;
                    }
                }
            });

            vm.theModal.result.then(function(accountCurrencyLimit){
                if(accountCurrencyLimit){
                    $scope.getAccountCurrencyLimits();
                }
            }, function(){
            });
        };


    }
})();