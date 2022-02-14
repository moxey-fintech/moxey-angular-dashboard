(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionFees')
        .controller('EditGroupTransactionFeeModalCtrl', EditGroupTransactionFeeModalCtrl);

    function EditGroupTransactionFeeModalCtrl($scope,$uibModalInstance,tierFee,currencyModifiers,selectedTier,toastr,_,typeaheadService,Rehive,localStorageManagement,errorHandler,$stateParams,sharedResources,accountDefinitions) {

        var vm = this;
        $scope.selectedTier = selectedTier;
        $scope.tierFee = tierFee;
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        vm.token = localStorageManagement.getValue('token');
        $scope.editingTierFees = false;
        $scope.loadingSubtypes = false;
        $scope.editTierFee = {};
        $scope.searchAccountBy = 'standalone';
        vm.updatedTierFee = {};
        $scope.feeEdited = false;
        $scope.accountOptions = [];
        $scope.standaloneAccountOptions = [];
        $scope.allSubtypeOptions = [];
        $scope.debitSubtypeOptions = [];
        $scope.creditSubtypeOptions = [];
        $scope.accountDefinitions = accountDefinitions && accountDefinitions.length > 0 ? accountDefinitions : [];
        
        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingTierFees = true;
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesOptions = res.results;
                    vm.getTierFee();
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
                    $scope.standaloneAccountOptions = $scope.standaloneAccountOptions.sort(function(a, b){
                        return a.name < b.name ? 1 : a.name === b.name ? 0 : 1;
                    });
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getStandaloneAccounts();

        vm.returnCurrencyObj = function (currencyCode) {
            return $scope.currenciesList.find(function (element) {
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

            var res = $scope.allSubtypeOptions.filter(function (element) {
                return element.tx_type == (params.tx_type).toLowerCase();
            });
            $scope.subtypeOptions = _.map(res,'name');
            $scope.subtypeOptions.unshift('');
            $scope.loadingSubtypes = false;
        };

        vm.getAllSubtypes = function(editParams, editing){
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
                editing ? $scope.getSubtypesArray(editParams, 'editing') : $scope.getSubtypesArray(editParams, null);
                $scope.$apply();
            });
        };
        
        vm.getAccountByReference = function(){
            Rehive.admin.accounts.get({filters: {reference: $scope.editTierFee.credit_account}})
                .then(function(res){
                    if(res.results){
                        $scope.editTierFee.fee_user = res.results[0].user ? (res.results[0].user.email ? res.results[0].user.email : res.results[0].user.id) : null;
                        if($scope.editTierFee.fee_user){
                            $scope.searchAccountBy = 'user';
                            $scope.onSelect($scope.editTierFee.fee_user, $scope.editTierFee.credit_account);
                        } else if($scope.standaloneAccountOptions.length > 0) {
                            $scope.editTierFee.credit_account = $scope.standaloneAccountOptions.find(function(account) {
                                return account.reference === res.results[0].reference;
                            });
                        }
                    }
                    $scope.editingTierFees = false;
                    $scope.$apply();
                }, function(error){
                    $scope.editingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
        };
        
        vm.getTierFee = function () {
            $scope.editingTierFees = true;
            Rehive.admin.groups.tiers.fees.get(vm.groupName,$scope.selectedTier.id, {id: $scope.tierFee.id}).then(function (res) {
                res.currency = vm.returnCurrencyObj(res.currency);
                $scope.editTierFee = res;
                $scope.editTierFee.value = currencyModifiers.convertFromCents($scope.editTierFee.value,$scope.editTierFee.currency.divisibility);
                if($scope.editTierFee.account_definition){
                    $scope.editTierFee.account_definition = $scope.accountDefinitions.find(function(accDef){
                        return accDef.name === $scope.editTierFee.account_definition;
                    });
                }
                vm.getAllSubtypes($scope.editTierFee,'editing');
                $scope.searchAccountBy = 'standalone';
                $scope.editTierFee.credit_account ? vm.getAccountByReference() : $scope.editingTierFees = false;
                $scope.$apply();
            }, function (error) {
                $scope.editingTierFees = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.tierFeeChanged = function(field){
            vm.updatedTierFee[field] = $scope.editTierFee[field];
            if(!$scope.feeEdited){
                $scope.feeEdited = true;
            }
            if( field == 'description'){
                if($scope.editTierFee[field].length > 255){
                    toastr.error("Fee description is longer than 255 characters.");
                }
            }
            if( field == 'name'){
                $scope.editTierFee[field] =$scope.editTierFee[field].toLowerCase();
                if($scope.editTierFee[field].length > 50){
                    toastr.error("Fee name is longer than 50 characters.");
                }
            }
            if( field == 'account_definition'){
                vm.updatedTierFee[field] = $scope.editTierFee[field].name;
            }
        };

        $scope.updateTierFee = function(){
            if(!$scope.feeEdited){
                return;
            }

            if(!$scope.editTierFee.subtype){
                vm.updatedTierFee.subtype = null;
            }

            if($scope.editTierFee.currency){
                vm.updatedTierFee.currency = $scope.editTierFee.currency.code;
            }

            if($scope.editTierFee.value){
                if(currencyModifiers.validateCurrency($scope.editTierFee.value,$scope.editTierFee.currency.divisibility)){
                    vm.updatedTierFee.value = currencyModifiers.convertToCents($scope.editTierFee.value,$scope.editTierFee.currency.divisibility);
                    vm.updatedTierFee.currency = $scope.editTierFee.currency.code;
                } else {
                    toastr.error('Please input amount to ' + $scope.editTierFee.currency.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedTierFee.value = 0;
            }

            if($scope.editTierFee.percentage == ""){
                vm.updatedTierFee.percentage = 0;
            }

            if(vm.updatedTierFee.credit_account){
                vm.updatedTierFee.credit_account = vm.updatedTierFee.credit_account.reference;
            }

            if(vm.token) {
                $scope.editingTierFees = true;
                vm.updatedTierFee.tx_type ? vm.updatedTierFee.tx_type = vm.updatedTierFee.tx_type.toLowerCase() : '';
                vm.updatedTierFee.name ? vm.updatedTierFee.name = vm.updatedTierFee.name.toLowerCase() : '';
                vm.updatedTierFee.name ? vm.updatedTierFee.name = vm.updatedTierFee.name.replace(/-/g, '_').replace(/ /g, '_') :'';

                Rehive.admin.groups.tiers.fees.update(vm.groupName,$scope.selectedTier.id, $scope.editTierFee.id,vm.updatedTierFee).then(function (res) {
                    $scope.editingTierFees = false;
                    toastr.success('Fee updated successfully');
                    vm.updatedTierFee = {};
                    $uibModalInstance.close($scope.selectedTier.level);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingTierFees = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.emailChanging = function(){
            $scope.showAccounts = false;
        };

        $scope.getUserAccounts = function(userEmail, accountRef){
            $scope.accountOptions = [];
            $scope.loadingAccounts = true;
            Rehive.admin.accounts.get({filters: {page_size: 250, user: userEmail}}).then(function (res) {
                if(res.results.length > 0) {
                    $scope.accountOptions = res.results.slice();
                }
                if(accountRef){
                    $scope.editTierFee.credit_account = $scope.accountOptions.find(function(account){
                        return (account.reference == $scope.editTierFee.credit_account);
                    });
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

        $scope.onSelect = function($model, accountRef){
            accountRef ? $scope.getUserAccounts($model, accountRef) : $scope.getUserAccounts($model, null);
        };
    }
})();
