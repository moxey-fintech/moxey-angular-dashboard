(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionLimits')
        .controller('AddGroupTransactionLimitModalCtrl', AddGroupTransactionLimitModalCtrl);

    function AddGroupTransactionLimitModalCtrl($scope,$uibModalInstance,sharedResources,selectedTier,toastr,currencyModifiers,
                                   Rehive,localStorageManagement,errorHandler,_,$stateParams,accountDefinitions,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        $scope.selectedTier = selectedTier;
        $scope.addingTierLimit = false;
        $scope.loadingSubtypes = false;
        $scope.accountDefinitions = accountDefinitions && accountDefinitions.length > 0 ? accountDefinitions : [];
        $scope.tierLimitsParams = {
            tx_type: 'credit',
            type: 'Maximum per transaction',
            subtype: '',
            account_definition: null
        };
        $scope.typeOptions = ['Maximum per transaction','Maximum per day','Maximum per month','Minimum','Overdraft'];
        vm.groupTierLimitTypeLabelsObj = {
            'Maximum per transaction': 'max',
            'Maximum per day': 'day_max',
            'Maximum per month': 'month_max',
            'Minimum': 'min',
            'Overdraft': 'overdraft'
        };

        $scope.goToAddCurrencyModal = function () {
            $window.open('/#/currencies/currencies-list?currencyAction=newCurrency','_blank');
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesOptions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

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
        $scope.getSubtypesArray($scope.tierLimitsParams);

        $scope.addTierLimit = function(tierLimitsParams){
            if(tierLimitsParams.value && tierLimitsParams.currency){
                if(currencyModifiers.validateCurrency(tierLimitsParams.value,tierLimitsParams.currency.divisibility)){
                    tierLimitsParams.value = currencyModifiers.convertToCents(tierLimitsParams.value,tierLimitsParams.currency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + tierLimitsParams.currency.divisibility + ' decimal places');
                    return;
                }
            } else {
                tierLimitsParams.value = 0;
            }

            if(tierLimitsParams.account_definition){
                tierLimitsParams.account_definition = tierLimitsParams.account_definition.name;
            }

            if(vm.token) {
                $scope.addingTierLimit = true;
                tierLimitsParams.tx_type = tierLimitsParams.tx_type.toLowerCase();
                tierLimitsParams.type = vm.groupTierLimitTypeLabelsObj[tierLimitsParams.type];

                tierLimitsParams.currency = tierLimitsParams.currency.code;

                Rehive.admin.groups.tiers.limits.create(vm.groupName,$scope.selectedTier.id, tierLimitsParams).then(function (res)
                {
                    $scope.addingTierLimit = false;
                    toastr.success('Limit added successfully to tier');
                    $uibModalInstance.close($scope.selectedTier.level);
                    $scope.$apply();
                }, function (error) {
                    $scope.tierLimitsParams = {
                        tx_type: 'Credit',
                        type: 'Maximum per transaction',
                        subtype: ''
                    };
                    $scope.addingTierLimit = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
