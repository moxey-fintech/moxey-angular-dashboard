(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees')
        .controller('EditAccountCurrencyFeeCtrl', EditAccountCurrencyFeeCtrl);

    function EditAccountCurrencyFeeCtrl($scope,$uibModalInstance,currencyCode,reference,accountCurrencyFee,sharedResources,$window,
                                        _,Rehive,toastr,localStorageManagement,currencyModifiers,errorHandler,typeaheadService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        vm.accountCurrencyFee = accountCurrencyFee;
        $scope.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        $scope.editAccountCurrencyFee = {};
        vm.updatedAccountCurrencyFee = {};
        $scope.editingAccountCurrencyFees = false;
        $scope.loadingSubtypes = false;
        $scope.allSubtypeOptions = [];
        $scope.debitSubtypeOptions = [];
        $scope.creditSubtypeOptions = [];
        $scope.feeEdited = false;
        $scope.accountOptions = [];
        $scope.standaloneAccountOptions = [];
        $scope.searchAccountBy = '';
        $scope.txTypeOptions = ['Credit','Debit'];

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

        vm.returnCurrencyObj = function (currencyCode) {
            return $scope.currenciesList.find(function (element) {
                return (element.code == currencyCode);
            });
        };
        
        vm.getAccountByReference = function(){
            Rehive.admin.accounts.get({filters: {reference: $scope.editAccountCurrencyFee.credit_account}})
                .then(function(res){
                    if(res.results){
                        $scope.editAccountCurrencyFee.fee_user = res.results[0].user ? (res.results[0].user.email ? res.results[0].user.email : res.results[0].user.id) : null;
                        if($scope.editAccountCurrencyFee.fee_user){
                            $scope.searchAccountBy = 'user';
                            $scope.onSelect($scope.editAccountCurrencyFee.fee_user, $scope.editAccountCurrencyFee.credit_account);
                        } else if($scope.standaloneAccountOptions.length > 0) {
                            $scope.editAccountCurrencyFee.credit_account = $scope.standaloneAccountOptions.find(function(account) {
                                return account.reference === res.results[0].reference;
                            });
                        }
                    }
                    $scope.editingAccountCurrencyFees = false;
                    $scope.$apply();
                }, function(error){
                    $scope.editingAccountCurrencyFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
        };

        $scope.getUserAccounts = function(userEmail, accountRef){
            $scope.accountOptions = [];
            $scope.loadingAccounts = true;
            var filtersObj = {
                page_size: 250, 
                user: userEmail
            };
            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                if(res.results.length > 0) {
                    $scope.accountOptions = res.results.slice();
                }
                if(accountRef){
                    $scope.editAccountCurrencyFee.credit_account = $scope.accountOptions.find(function(account){
                        return (account.reference == $scope.editAccountCurrencyFee.credit_account);
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

        vm.getAccountCurrencyFee = function (accountCurrencyFee) {
            $scope.editingAccountCurrencyFees = true;
            Rehive.admin.accounts.currencies.fees.get(vm.reference,vm.currencyCode, {id: accountCurrencyFee.id}).then(function (res) {
                res.currency = vm.returnCurrencyObj(res.currency);
                $scope.editAccountCurrencyFee = res;
                $scope.editAccountCurrencyFee.value = currencyModifiers.convertFromCents($scope.editAccountCurrencyFee.value,$scope.currencyObj.divisibility);
                vm.getAllSubtypes($scope.editAccountCurrencyFee, 'editing');
                $scope.searchAccountBy = 'standalone';
                if($scope.editAccountCurrencyFee.credit_account){
                    vm.getAccountByReference();
                } else {
                    $scope.editingAccountCurrencyFees = false;
                }
                $scope.$apply();
            }, function (error) {
                $scope.editingAccountCurrencyFees = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

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
                    vm.getAccountCurrencyFee(vm.accountCurrencyFee);
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        
        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingAccountCurrencyFees = true;
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesList = res.results;
                    vm.getStandaloneAccounts();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.accountCurrencyFeeChanged = function(field){
            vm.updatedAccountCurrencyFee[field] = $scope.editAccountCurrencyFee[field];
            if(!$scope.feeEdited){
                $scope.feeEdited = true;
            }
            if(field == 'description'){
                if($scope.editAccountCurrencyFee[field].length > 255){
                    toastr.error("Fee description is longer than 255 characters.");
                }
            }
            if(field == 'name'){
                $scope.editAccountCurrencyFee[field] = $scope.editAccountCurrencyFee[field].toLowerCase();
                if($scope.editAccountCurrencyFee[field].length > 50){
                    toastr.error("Fee name is longer than 50 characters.");
                }
            }
        };

        $scope.updateAccountCurrencyFee = function(){
            if(!$scope.feeEdited){
                return;
            }

            if(!$scope.editAccountCurrencyFee.subtype){
                vm.updatedAccountCurrencyFee.subtype = null;
            }

            if($scope.editAccountCurrencyFee.currency){
                vm.updatedAccountCurrencyFee.currency = $scope.editAccountCurrencyFee.currency.code;
            }

            if(!$scope.editAccountCurrencyFee.subtype){
                vm.updatedAccountCurrencyFee.subtype = '';
            }

            if($scope.editAccountCurrencyFee.value){
                $scope.currencyObj = vm.returnCurrencyObj(vm.currencyCode);
                if(currencyModifiers.validateCurrency($scope.editAccountCurrencyFee.value,$scope.currencyObj.divisibility)){
                    vm.updatedAccountCurrencyFee.value = currencyModifiers.convertToCents($scope.editAccountCurrencyFee.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedAccountCurrencyFee.value = 0;
            }

            if(vm.updatedAccountCurrencyFee.percentage == ''){
                vm.updatedAccountCurrencyFee.percentage = 0;
            }

            if(vm.updatedAccountCurrencyFee.percentage > 100 || vm.updatedAccountCurrencyFee.percentage < 0){
                toastr.error('Please input percentage value between 0 to 100');
                return;
            }

            if(vm.updatedAccountCurrencyFee.credit_account){
                vm.updatedAccountCurrencyFee.credit_account = vm.updatedAccountCurrencyFee.credit_account.reference;
            }

            if(vm.token) {
                $scope.editingAccountCurrencyFees = true;
                vm.updatedAccountCurrencyFee.tx_type ? vm.updatedAccountCurrencyFee.tx_type = vm.updatedAccountCurrencyFee.tx_type.toLowerCase() : '';
                vm.updatedAccountCurrencyFee.name ? vm.updatedAccountCurrencyFee.name = vm.updatedAccountCurrencyFee.name.toLowerCase() : '';
                vm.updatedAccountCurrencyFee.name ? vm.updatedAccountCurrencyFee.name = vm.updatedAccountCurrencyFee.name.replace(/-/g, '_').replace(/ /g, '_') : '';

                Rehive.admin.accounts.currencies.fees.update(vm.reference,vm.currencyCode,$scope.editAccountCurrencyFee.id,vm.updatedAccountCurrencyFee).then(function (res) {
                    $scope.editingAccountCurrencyFees = false;
                    toastr.success('Fee updated successfully');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingAccountCurrencyFees = false;
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

        $scope.onSelect = function($model, accountRef){
            accountRef ? $scope.getUserAccounts($model, accountRef) : $scope.getUserAccounts($model, null);
        };
    }
})();
