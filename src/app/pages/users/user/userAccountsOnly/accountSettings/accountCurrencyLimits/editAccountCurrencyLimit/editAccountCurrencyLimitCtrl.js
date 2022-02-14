(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits')
        .controller('EditAccountCurrencyLimitCtrl', EditAccountCurrencyLimitCtrl);

    function EditAccountCurrencyLimitCtrl($scope,$uibModalInstance,currencyCode,reference,accountCurrencyLimit,
                                          Rehive,_,sharedResources,$window,toastr,localStorageManagement,currencyModifiers,
                                          errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        $scope.editingAccountCurrencyLimits = false;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        vm.updatedAccountCurrencyLimit = {};
        vm.accountCurrencyLimit = accountCurrencyLimit;
        $scope.editAccountCurrencyLimit = {};
        $scope.loadingSubtypes = false;
        $scope.txTypeOptions = ['Credit','Debit'];
        $scope.typeOptions = ['Maximum per transaction','Maximum per day','Maximum per month','Minimum','Overdraft'];
        vm.groupTierLimitTypeLabelsObj = {
            'Maximum per transaction': 'max',
            'Maximum per day': 'day_max',
            'Maximum per month': 'month_max',
            'Minimum': 'min',
            'Overdraft': 'overdraft'
        };
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

        vm.getAccountCurrencyLimit = function (accountCurrencyLimit) {
            $scope.editingAccountCurrencyLimits = true;
            Rehive.admin.accounts.currencies.limits.get(vm.reference,vm.currencyCode,{id: accountCurrencyLimit.id}).then(function (res) {
                $scope.editingAccountCurrencyLimits = false;
                $scope.editAccountCurrencyLimit = res;
                $scope.editAccountCurrencyLimit.type = vm.groupTierLimitTypeSlugsObj[$scope.editAccountCurrencyLimit.type];
                $scope.editAccountCurrencyLimit.value = currencyModifiers.convertFromCents($scope.editAccountCurrencyLimit.value,$scope.currencyObj.divisibility);
                $scope.editAccountCurrencyLimit.tx_type == 'credit' ? $scope.editAccountCurrencyLimit.tx_type = 'Credit' : $scope.editAccountCurrencyLimit.tx_type = 'Debit';
                $scope.getSubtypesArray($scope.editAccountCurrencyLimit,'editing');
                $scope.$apply();
            }, function (error) {
                $scope.editingAccountCurrencyLimits = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getAccountCurrencyLimit(vm.accountCurrencyLimit);

        $scope.accountCurrencyLimitChanged = function(field){
            vm.updatedAccountCurrencyLimit[field] = $scope.editAccountCurrencyLimit[field];
        };

        $scope.updateAccountCurrencyLimit = function(){

            if(!$scope.editAccountCurrencyLimit.subtype){
                vm.updatedAccountCurrencyLimit.subtype = '';
            }

            if($scope.editAccountCurrencyLimit.value){
                if(currencyModifiers.validateCurrency($scope.editAccountCurrencyLimit.value,$scope.currencyObj.divisibility)){
                    vm.updatedAccountCurrencyLimit.value = currencyModifiers.convertToCents($scope.editAccountCurrencyLimit.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedAccountCurrencyLimit.value = 0;
            }

            if(vm.token) {
                $scope.editingAccountCurrencyLimits = true;
                vm.updatedAccountCurrencyLimit.tx_type ? vm.updatedAccountCurrencyLimit.tx_type = vm.updatedAccountCurrencyLimit.tx_type.toLowerCase() : '';
                if(vm.updatedAccountCurrencyLimit.type){
                    vm.updatedAccountCurrencyLimit.type = vm.groupTierLimitTypeLabelsObj[vm.updatedAccountCurrencyLimit.type];
                }

                Rehive.admin.accounts.currencies.limits.update(vm.reference,vm.currencyCode,$scope.editAccountCurrencyLimit.id,vm.updatedAccountCurrencyLimit).then(function (res) {
                    $scope.editingAccountCurrencyLimits = false;
                    toastr.success('Limit updated successfully');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingAccountCurrencyLimits = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
    }
})();
