(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('CreditDepositCtrl', CreditDepositCtrl);

    function CreditDepositCtrl($rootScope,$scope,Rehive,errorHandler,metadataTextService,$window,environmentConfig,
                               $http,sharedResources,localStorageManagement,typeaheadService,identifySearchInput) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.creditDepositSubtypeOptions = [];
        $scope.creditDepositCurrencyOptions = [];
        $scope.creditDepositTransactionData = {
            user: null,
            amount: null,
            reference: "",
            status: 'Complete',
            metadata: "",
            currency: {},
            subtype: {},
            note: "",
            account: {}
        };
        $scope.showAdvancedCreditDepositOption = false;
        $scope.retrievedCreditDepositUserObj = {};
        $scope.retrievedCreditDepositAccountsArray = [];
        $scope.retrievedCreditDepositAccountTransactions = [];
        $scope.creditTransactionStatus = ['Complete','Pending','Failed','Deleted'];
        $scope.creditDepositAccountsAvailable = true;
        $scope.creditDepositUserExists = true;
        $scope.creditDepositCurrencyAccountsAvailable = true;
        $scope.searchAccountReferenceString = "";
        $scope.mfaEnabled = "Disabled";
        $scope.mfaOBj = {};   

        
        vm.getCreditCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.creditDepositCurrencyOptions = res.results;
                    if($scope.newTransactionParams.accountCurrencies){
                        var updatedCurrencies = [];
                        $scope.newTransactionParams.accountCurrencies.forEach(function(accountCurrency){
                            $scope.creditDepositCurrencyOptions.forEach(function(currency){
                                if(currency.code === accountCurrency.currency.code){
                                    updatedCurrencies.push(currency);
                                }
                            });
                        });
                        $scope.creditDepositCurrencyOptions = updatedCurrencies;
                    }
                    if($scope.newTransactionParams.currencyCode) {
                        $scope.creditDepositTransactionData.currency = $scope.creditDepositCurrencyOptions.find(function (element) {
                            return element.code == $scope.newTransactionParams.currencyCode;
                        });
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        
        if(!$scope.newTransactionParams.txType){
            vm.getCreditCompanyCurrencies();
        }        
        
        $scope.getSubtypes = function () {
            sharedResources.getSubtypes().then(function (res) {
                $scope.creditDepositSubtypeOptions = res;
                var creditSubtypePreselected = $scope.creditDepositSubtypeOptions.filter(function(subtype){
                    return (subtype.name === "deposit_manual" && subtype.tx_type === "credit");
                });
                $scope.creditDepositTransactionData.subtype = creditSubtypePreselected.length > 0 ? creditSubtypePreselected[0] : null;
            });
        };
        $scope.getSubtypes();

        $scope.toggleAdvancedCreditDepositOption = function () {
            $scope.showAdvancedCreditDepositOption = !$scope.showAdvancedCreditDepositOption;
        };

        $scope.creditCurrencyChanged = function () {
            if(!$scope.newTransactionParams.accountUser){
                $scope.retrievedCreditDepositAccountsArray = [];
                $scope.creditDepositTransactionData.account = {};
                $scope.retrievedCreditDepositUserObj = {};
                $scope.retrievedCreditDepositAccountsArray = [];
                $scope.creditDepositCurrencyAccountsAvailable = true;
                $scope.searchAccountReferenceString = "";
            }            
        };

        $scope.getCreditUsersAccountTypeahead = typeaheadService.getAccountsReferenceTypeahead();

        $scope.onCreditReferenceSelected = function($model){
            var filterObj = {};
            filterObj.reference = $model;
            if($scope.creditDepositTransactionData.currency.code){
                filterObj.currency = $scope.creditDepositTransactionData.currency.code;
            }
            vm.getCreditDepositAccounts(filterObj, false);
        };

        vm.getCreditDepositUserObj = function (filterObj, userSearchedFirst) {
            $scope.retrievedCreditDepositUserObj = {};
            Rehive.admin.users.get({filters: filterObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.retrievedCreditDepositUserObj = res.results[0];
                    $scope.retrievedCreditDepositUserObj.metadata = metadataTextService.convertToText($scope.retrievedCreditDepositUserObj.metadata);
                    $scope.creditDepositTransactionData.user = $scope.retrievedCreditDepositUserObj.email;
                    vm.checkUserMFAStatus($scope.retrievedCreditDepositUserObj.id);
                    if(userSearchedFirst){
                        filterObj = {};
                        filterObj.user = $scope.retrievedCreditDepositUserObj.id;
                        filterObj.currency = $scope.creditDepositTransactionData.currency.code;
                        vm.getCreditDepositAccounts(filterObj, true);
                    }                    
                } else {
                    if(userSearchedFirst){
                        $scope.creditDepositUserExists = false;
                    } else {
                        $scope.creditDepositAccountsAvailable = false;
                    }                    
                }
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
            });
        };   

        vm.checkUserMFAStatus = function (uuid) {
            if(vm.token) {
                Rehive.admin.users.mfa.get(uuid).then(function (res) {
                    for(var key in res){
                        if (res.hasOwnProperty(key)) {
                            if(res[key]){
                                $scope.mfaEnabled = "Enabled";
                                if(key == 'sms'){
                                    vm.getUserSmsMFADetails(uuid)
                                } else if(key == 'token'){
                                    vm.getUserTokenMFADetails(uuid);
                                }
                                $scope.$apply();
                            }
                        }
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getUserSmsMFADetails = function(uuid) {
            if(vm.token){
                $http.get(environmentConfig.API + 'admin/users/' + uuid + '/mfa/sms/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.mfaOBj = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        }

        vm.getUserTokenMFADetails = function(uuid) {
            if(vm.token){
                $http.get(environmentConfig.API + 'admin/users/' + uuid + '/mfa/token/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.mfaOBj = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        }

        vm.getCreditDepositAccounts = function (filterObj, userSearchedFirst) {
            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.creditDepositCurrencyAccountsAvailable = true;
                    
                    $scope.creditDepositTransactionData.account = res.results[0];
                    $scope.creditDepositAccountSelected($scope.creditDepositTransactionData);
                    
                    $scope.retrievedCreditDepositAccountsArray = res.results;
                    if(!userSearchedFirst && $scope.retrievedCreditDepositAccountsArray[0].user){
                        filterObj = {};
                        filterObj.email__contains = $scope.retrievedCreditDepositAccountsArray[0].user.email;
                        vm.getCreditDepositUserObj(filterObj, false);
                    }
                    $scope.$apply();
                } else {
                    $scope.creditDepositCurrencyAccountsAvailable = false;
                    $scope.retrievedCreditDepositAccountsArray = res.results;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.creditDepositAccountSelected = function (creditTransactionData) {
            var accountRef;
            if(creditTransactionData){
                $scope.retrievedCreditDepositAccountTransactions = [];
                accountRef = creditTransactionData.account.reference;

                Rehive.admin.transactions.get({filters: {
                    page: 1,
                    page_size: 5,
                    orderby: '-created',
                    account: accountRef
                }}).then(function (res) {
                    $scope.loadingTransactionSettings = false;
                    $scope.retrievedCreditDepositAccountTransactions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.goToCreditUserAccountCreate = function () {
            $window.open('/#/user/' + $scope.retrievedCreditDepositUserObj.id + '/accounts?accountAction=newAccount','_blank');
        };

        $scope.goToAddCurrencyModal = function () {
            $window.open('/#/currencies/currencies-list?currencyAction=newCurrency','_blank');
        };

        if($scope.newTransactionParams.userEmail){
            $scope.creditDepositTransactionData.user = $scope.newTransactionParams.userEmail;
        }

        if($scope.newTransactionParams.accountUser){
            $scope.onCreditReferenceSelected($scope.newTransactionParams.accountUser);
        }
    }
})();
