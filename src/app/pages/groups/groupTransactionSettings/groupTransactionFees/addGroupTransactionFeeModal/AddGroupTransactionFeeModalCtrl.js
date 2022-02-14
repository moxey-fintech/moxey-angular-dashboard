(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionFees')
        .controller('AddGroupTransactionFeeModalCtrl', AddGroupTransactionFeeModalCtrl);

    function AddGroupTransactionFeeModalCtrl($scope,$uibModalInstance,currencyModifiers,selectedTier,toastr,_,typeaheadService,
                                      Rehive,localStorageManagement,errorHandler,$stateParams,sharedResources,accountDefinitions) {

        var vm = this;
        $scope.selectedTier = selectedTier;
        $scope.addingTierFees = false;
        $scope.loadingSubtypes = false;
        $scope.loadingAccounts = false;
        $scope.showAccounts = false;
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        vm.token = localStorageManagement.getValue('token');
        $scope.searchAccountBy = 'standalone';
        $scope.userEmailForAccount = '';
        $scope.standaloneAccountOptions = [];
        $scope.accountOptions = [];
        $scope.allSubtypeOptions = [];
        $scope.debitSubtypeOptions = [];
        $scope.creditSubtypeOptions = [];
        $scope.accountDefinitions = accountDefinitions && accountDefinitions.length > 0 ? accountDefinitions : [];
        $scope.tierFeesParams = {
            name: '',
            tx_type: 'credit',
            subtype: '',
            description: '',
            account_definition: null,
            debit_subtype: null,
            credit_subtype: null,
            fee_user: null,
            credit_account: null
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

        vm.getStandaloneAccounts = function(){
            if(vm.token){
                Rehive.admin.accounts.get({filters: {
                    user__isnull: true,
                    page_size: 50
                }}).then(function (res) {
                    $scope.standaloneAccountOptions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getStandaloneAccounts();

        $scope.getSubtypesArray = function(params,editing){
            $scope.loadingSubtypes = true;
            if(!editing){
                params.subtype = '';
            } else if(!params.subtype && editing){
                params.subtype = '';
            }

            var res = $scope.allSubtypeOptions.filter(function (element) {
                return element.tx_type == (params.tx_type).toLowerCase();
            });
            $scope.subtypeOptions = _.map(res,'name');
            $scope.subtypeOptions.unshift('');
            $scope.loadingSubtypes = false;
        };

        $scope.emailChanging = function(){
            $scope.showAccounts = false;
        };

        $scope.triggerSearchByUser = function(){           
            $scope.getUserAccounts($scope.userEmailForAccount, null);
        };

        $scope.onSelect = function($model){
            $scope.getUserAccounts($model);
       };

        $scope.trackFeeDescription = function(){
            if($scope.tierFeesParams.description.length > 255){
                toastr.error("Fee description is longer than 255 characters.");
            }
        };

        $scope.trackFeeName = function(){
            if($scope.tierFeesParams.name.length > 50){
                toastr.error("Fee name is longer than 50 characters.");
            }
        };

        vm.getAllSubtypes = function(){
            $scope.loadingSubtypes = true;
            $scope.allSubtypeOptions = [];
            $scope.debitSubtypeOptions = [];
            $scope.creditSubtypeOptions = [];
            sharedResources.getSubtypes().then(function (res) {
                $scope.allSubtypeOptions = res;

                $scope.debitSubtypeOptions = res.filter(function (element) {
                    return element.tx_type == 'debit';
                });
                $scope.debitSubtypeOptions = _.map($scope.debitSubtypeOptions,'name');
                $scope.debitSubtypeOptions.unshift('');

                $scope.creditSubtypeOptions = res.filter(function (element) {
                    return element.tx_type == 'credit';
                });
                $scope.creditSubtypeOptions = _.map($scope.creditSubtypeOptions,'name');
                $scope.creditSubtypeOptions.unshift('');

                $scope.loadingSubtypes = false;
                $scope.getSubtypesArray($scope.tierFeesParams);
                $scope.$apply();
            });
        };
        vm.getAllSubtypes();

        $scope.addTierFee = function(tierFeesParams){
            if(tierFeesParams.value){
                if(currencyModifiers.validateCurrency(tierFeesParams.value,tierFeesParams.currency.divisibility)){
                    tierFeesParams.value = currencyModifiers.convertToCents(tierFeesParams.value,tierFeesParams.currency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + tierFeesParams.currency.divisibility + ' decimal places');
                    return;
                }
            } else {
                tierFeesParams.value = 0;
            }

            if(!tierFeesParams.percentage){
                tierFeesParams.percentage = 0;
            }

            if($scope.tierFeesParams.description.length > 255){
                toastr.error("Fee description is longer than 255 characters.");
                return;
            }

            if($scope.tierFeesParams.name.length > 50){
                toastr.error("Fee name is longer than 50 characters.");
                return;
            }

            if(tierFeesParams.account_definition){
                tierFeesParams.account_definition = tierFeesParams.account_definition.name;
            }

            if(vm.token) {
                
                $scope.tierFeesParams.name = $scope.tierFeesParams.name.replace(/-/g, '_').replace(/ /g, '_');
                $scope.addingTierFees = true;
                tierFeesParams.name = tierFeesParams.name.toLowerCase();
                tierFeesParams.tx_type = tierFeesParams.tx_type.toLowerCase();
                tierFeesParams.currency = tierFeesParams.currency.code;
                tierFeesParams.inferred = true;
                tierFeesParams.credit_account = tierFeesParams.credit_account && tierFeesParams.credit_account.reference ? tierFeesParams.credit_account.reference : null;
                
                Rehive.admin.groups.tiers.fees.create(vm.groupName,$scope.selectedTier.id, tierFeesParams).then(function (res) {
                    $scope.addingTierFees = false;
                    toastr.success('Fee added successfully to tier');
                    $uibModalInstance.close($scope.selectedTier.level);
                    $scope.$apply();
                }, function (error) {
                    $scope.tierFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    $scope.addingTierFees = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.getUserAccounts = function(userEmail){
            $scope.accountOptions = [];
            $scope.loadingAccounts = true;
            Rehive.admin.accounts.get({filters: {page_size: 250, user: userEmail}}).then(function (res) {
                if(res.results.length > 0) {
                    $scope.accountOptions = res.results.slice();
                }
                $scope.showAccounts = true;
                $scope.loadingAccounts = false;
                $scope.$apply();
            }, function (error) {
                $scope.loadingAccounts = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
    }
})();
