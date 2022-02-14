(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits')
        .controller('AddAccountCurrencyLimitCtrl', AddAccountCurrencyLimitCtrl);

    function AddAccountCurrencyLimitCtrl($scope,$uibModalInstance,currencyCode,_,reference,sharedResources,$window,
                                         Rehive,toastr,localStorageManagement,currencyModifiers,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        $scope.addingAccountCurrencyLimits = false;
        $scope.loadingSubtypes = false;
        $scope.accountCurrencyLimitsParams = {
            tx_type: 'Credit',
            type: 'Maximum per transaction',
            subtype: ''
        };
        $scope.txTypeOptions = ['Credit','Debit'];
        $scope.typeOptions = ['Maximum per transaction','Maximum per day','Maximum per month','Minimum','Overdraft'];

        vm.getCurrencyObjFromCurrenciesList = function(){
            $scope.currencyObj = vm.currenciesList.find(function(element){
                return element.code == vm.currencyCode;
            });
        };
        vm.getCurrencyObjFromCurrenciesList();

        $scope.getSubtypesArray = function(params,editing){
            $scope.loadingSubtypes = true;
            if(!editing){
                params.subtype = '';
            } else if(!params.subtype && editing){
                params.subtype = '';
            }
            sharedResources.getSubtypes().then(function (res) {
                res = res.filter(function (element) {
                    return element.tx_type == (params.tx_type).toLowerCase();
                });
                $scope.subtypeOptions = _.map(res,'name');
                $scope.subtypeOptions.unshift('');
                $scope.loadingSubtypes = false;
                $scope.$apply();
            });
        };
        $scope.getSubtypesArray($scope.accountCurrencyLimitsParams);

        $scope.addAccountCurrencyLimit = function(accountCurrencyLimitsParams){
            if(accountCurrencyLimitsParams.value){
                if(currencyModifiers.validateCurrency(accountCurrencyLimitsParams.value,$scope.currencyObj.divisibility)){
                    accountCurrencyLimitsParams.value = currencyModifiers.convertToCents(accountCurrencyLimitsParams.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                accountCurrencyLimitsParams.value = 0;
            }
            if(vm.token) {
                $scope.addingAccountCurrencyLimits = true;
                accountCurrencyLimitsParams.tx_type = accountCurrencyLimitsParams.tx_type.toLowerCase();
                accountCurrencyLimitsParams.type = accountCurrencyLimitsParams.type == 'Maximum per transaction' ? 'max': accountCurrencyLimitsParams.type == 'Maximum per day' ? 'day_max':
                    accountCurrencyLimitsParams.type == 'Maximum per month' ? 'month_max': accountCurrencyLimitsParams.type == 'Minimum' ? 'min': 'overdraft';

                Rehive.admin.accounts.currencies.limits.create(vm.reference, vm.currencyCode, accountCurrencyLimitsParams).then(function (res) {
                    $scope.addingAccountCurrencyLimits = false;
                    toastr.success('Limit added successfully.');
                    $scope.accountCurrencyLimitsParams = {
                        tx_type: 'Credit',
                        type: 'Maximum per transaction',
                        subtype: ''
                    };
                    $scope.getSubtypesArray($scope.accountCurrencyLimitsParams);
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.accountCurrencyLimitsParams = {
                        tx_type: 'Credit',
                        type: 'Maximum per transaction',
                        subtype: ''
                    };
                    $scope.getSubtypesArray($scope.accountCurrencyLimitsParams);
                    $scope.addingAccountCurrencyLimits = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
