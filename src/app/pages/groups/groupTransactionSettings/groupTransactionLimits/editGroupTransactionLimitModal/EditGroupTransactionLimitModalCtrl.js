(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionLimits')
    .controller('EditGroupTransactionLimitModalCtrl', EditGroupTransactionLimitModalCtrl);

    function EditGroupTransactionLimitModalCtrl($scope,$uibModalInstance,tierLimit,selectedTier,toastr,$stateParams,sharedResources,
                                     Rehive,localStorageManagement,errorHandler,currencyModifiers,_,accountDefinitions) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.tierLimit = tierLimit;
        $scope.selectedTier = selectedTier;
        $scope.accountDefinitions = accountDefinitions && accountDefinitions.length > 0 ? accountDefinitions : [];
        $scope.editingTierLimits = false;
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        $scope.editTierLimit = {};
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
        $scope.loadingSubtypes = false;
        vm.updatedTierLimit = {};
        $scope.limitEdited = false;

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingTierLimits = true;
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesOptions = res.results;
                    vm.getTierLimit();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        vm.returnCurrencyObj = function (currencyCode) {
            return $scope.currenciesOptions.find(function (element) {
                return (element.code == currencyCode);
            });
        };

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

        vm.getTierLimit = function () {
            $scope.editingTierLimits = true;
            Rehive.admin.groups.tiers.limits.get(vm.groupName,$scope.selectedTier.id, {id: $scope.tierLimit.id}).then(function (res) {
                $scope.editingTierLimits = false;
                res.currency = vm.returnCurrencyObj(res.currency);
                $scope.editTierLimit = res;
                $scope.editTierLimit.type = vm.groupTierLimitTypeSlugsObj[$scope.editTierLimit.type];
                if($scope.editTierLimit.account_definition){
                    $scope.editTierLimit.account_definition = $scope.accountDefinitions.find(function(accDef){
                        return accDef.name === $scope.editTierLimit.account_definition;
                    });
                }
                $scope.editTierLimit.value = currencyModifiers.convertFromCents($scope.editTierLimit.value,$scope.editTierLimit.currency.divisibility);
                $scope.getSubtypesArray($scope.editTierLimit,'editing');
                $scope.$apply();
            }, function (error) {
                $scope.editingTierLimits = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };


        $scope.tierLimitChanged = function(field){
            vm.updatedTierLimit[field] = $scope.editTierLimit[field];
            if(!$scope.limitEdited){
                $scope.limitEdited = true;
            }
        };

        $scope.updateTierLimit = function(){

            if(!$scope.limitEdited){
                return;
            }

            if(!$scope.editTierLimit.subtype){
                vm.updatedTierLimit.subtype = '';
            }

            if(vm.updatedTierLimit.currency){
                vm.updatedTierLimit.currency = vm.updatedTierLimit.currency.code;
            }

            if(vm.updatedTierLimit.account_definition){
                vm.updatedTierLimit.account_definition = vm.updatedTierLimit.account_definition.name;
            }

            if($scope.editTierLimit.value && $scope.editTierLimit.currency){
                if(currencyModifiers.validateCurrency($scope.editTierLimit.value,$scope.editTierLimit.currency.divisibility)){
                    vm.updatedTierLimit.value = currencyModifiers.convertToCents($scope.editTierLimit.value,$scope.editTierLimit.currency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.editTierLimit.currency.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedTierLimit.value = 0;
            }

            if(vm.token) {
                $scope.editingTierLimits = true;
                vm.updatedTierLimit.tx_type ? vm.updatedTierLimit.tx_type = vm.updatedTierLimit.tx_type.toLowerCase() : '';
                vm.updatedTierLimit.type ? vm.updatedTierLimit.type = vm.groupTierLimitTypeLabelsObj[vm.updatedTierLimit.type] : '';

                Rehive.admin.groups.tiers.limits.update(vm.groupName,$scope.selectedTier.id, $scope.editTierLimit.id,vm.updatedTierLimit).then(function (res) {
                    $scope.editingTierLimits = false;
                    toastr.success('Limit updated successfully');
                    $uibModalInstance.close($scope.selectedTier.level);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingTierLimits = false;
                    vm.updatedTierLimit = {};
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();
