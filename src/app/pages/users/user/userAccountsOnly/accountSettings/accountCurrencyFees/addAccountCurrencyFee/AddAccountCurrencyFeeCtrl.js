(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees')
        .controller('AddAccountCurrencyFeeCtrl', AddAccountCurrencyFeeCtrl);

    function AddAccountCurrencyFeeCtrl($scope,$uibModalInstance,currencyCode,reference,sharedResources,$window,
                                       Rehive,_,toastr,localStorageManagement,currencyModifiers,errorHandler,typeaheadService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        $scope.addingAccountCurrencyFees = false;
        $scope.loadingSubtypes = false;
        $scope.loadingAccounts = false;
        $scope.showAccounts = false;
        $scope.userEmailForAccount = '';
        $scope.standaloneAccountOptions = [];
        $scope.accountOptions = [];
        $scope.currencyObj = {};
        $scope.accountCurrencyFeesParams = {
            name: '',
            tx_type: 'credit',
            subtype: '',
            description: '',
            debit_subtype: null,
            credit_subtype: null,
            fee_user: null,
            credit_account: null
        };
        $scope.txTypeOptions = ['Credit','Debit'];

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
                $scope.getSubtypesArray($scope.accountCurrencyFeesParams);
                $scope.$apply();
            });
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    vm.currenciesList = res.results;
                    vm.getStandaloneAccounts();
                    vm.getAllSubtypes();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

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
            if($scope.accountCurrencyFeesParams.description.length > 255){
                toastr.error("Fee description is longer than 255 characters.");
            }
        };

        $scope.trackFeeName = function(){
            if($scope.accountCurrencyFeesParams.name.length > 50){
                toastr.error("Fee name is longer than 50 characters.");
            }
        };

        $scope.addAccountCurrencyFee = function(){
            $scope.currencyObj = vm.currenciesList.find(function(currency){
                return currency.code === vm.currencyCode;
            });

            if($scope.accountCurrencyFeesParams.value) {
                if (currencyModifiers.validateCurrency($scope.accountCurrencyFeesParams.value, $scope.currencyObj.divisibility)) {
                    $scope.accountCurrencyFeesParams.value = currencyModifiers.convertToCents($scope.accountCurrencyFeesParams.value, $scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            }

            if(!$scope.accountCurrencyFeesParams.percentage){
                $scope.accountCurrencyFeesParams.percentage = 0;
            }

            if($scope.accountCurrencyFeesParams.percentage > 100 || $scope.accountCurrencyFeesParams.percentage < 0){
                toastr.error('Please input percentage value between 0 to 100');
                return;
            }

            if($scope.accountCurrencyFeesParams.description.length > 255){
                toastr.error("Fee description is longer than 255 characters.");
                return;
            }

            if($scope.accountCurrencyFeesParams.name.length > 50){
                toastr.error("Fee name is longer than 50 characters.");
                return;
            }

            if(vm.token) {                
                $scope.accountCurrencyFeesParams.name = $scope.accountCurrencyFeesParams.name.replace(/-/g, '_').replace(/ /g, '_').toLowerCase();
                $scope.accountCurrencyFeesParams.tx_type = $scope.accountCurrencyFeesParams.tx_type.toLowerCase();
                $scope.accountCurrencyFeesParams.currency = vm.currencyCode;
                $scope.accountCurrencyFeesParams.inferred = true;
                $scope.accountCurrencyFeesParams.credit_account = $scope.accountCurrencyFeesParams.credit_account ? $scope.accountCurrencyFeesParams.credit_account.reference : null;
                
                $scope.addingAccountCurrencyFees = true;
                Rehive.admin.accounts.currencies.fees.create(vm.reference, vm.currencyCode, $scope.accountCurrencyFeesParams).then(function (res) {
                    $scope.addingAccountCurrencyFees = false;
                    toastr.success('Fee added successfully to account');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.accountCurrencyFeesParams = {
                        name: '',
                        tx_type: 'credit',
                        subtype: '',
                        description: '',
                        debit_subtype: null,
                        credit_subtype: null,
                        fee_user: null,
                        credit_account: null
                    };
                    $scope.addingAccountCurrencyFees = false;
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
            var filtersObj = {
                page_size: 250, 
                user: userEmail,
            };
            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
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
