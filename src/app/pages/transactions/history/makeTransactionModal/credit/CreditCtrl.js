(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('CreditCtrl', CreditCtrl);

    function CreditCtrl(environmentConfig,$scope,Rehive,errorHandler,metadataTextService,$window,
                        $http,sharedResources,localStorageManagement,typeaheadService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.accountAssociation = 'user';
        $scope.creditSubtypeOptions = [];
        $scope.creditCurrencyOptions = [];
        $scope.creditTransactionData = {
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
        $scope.showAdvancedCreditOption = false;
        $scope.retrievedCreditUserObj = null;
        $scope.retrievedCreditUserAccountsArray = [];
        $scope.retrievedCreditAccountTransactions = [];
        $scope.creditTransactionStatus = ['Complete','Pending','Failed','Deleted'];
        $scope.creditUserAccountsAvailable = true;
        $scope.creditCurrencyAccountsAvailable = true;
        $scope.mfaEnabled = "Disabled";
        $scope.mfaOBj = {};   
        $scope.initialLoad = false;
        $scope.loadingAccounts = false;
        $scope.loadingAccountCurrencies = false;
        $scope.accountCurrencyMap = {};

        $scope.trackAccountCurrenciesInMap = function(account){
            if($scope.accountCurrencyMap[account.reference] !== undefined) return;
            $scope.accountCurrencyMap[account.reference] = [];
            var len = account.currencies.length;
            for(var i = 0; i < len; ++i){
                $scope.accountCurrencyMap[account.reference].push(account.currencies[i].currency.code);
            }
            $scope.accountCurrencyMap[account.reference].sort(function(a, b){
                return a.localeCompare(b);
            });
        };

        $scope.getStandaloneAccounts = function(){
            if(vm.token){
                var accountsFiltersObj = {
                    page: 1,
                    page_size: 250,
                    user__isnull: true,
                    recon: false
                };
                Rehive.admin.accounts.get({filters: accountsFiltersObj}).then(function (res) {
                    $scope.standaloneAccounts = res.results;
                    $scope.creditTransactionData.account = null;
                    $scope.standaloneAccounts.forEach(function (account) {
                        $scope.trackAccountCurrenciesInMap(account);
                        if($scope.newTransactionParams.accountUser && account.reference === $scope.newTransactionParams.accountUser){
                            $scope.creditTransactionData.account = account;
                            $scope.creditAccountSelected($scope.creditTransactionData);
                        }
                    });
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactionSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getStandaloneAccounts();

        $scope.getSubtypes = function () {
            sharedResources.getSubtypes().then(function (res) {
                $scope.creditSubtypeOptions = res;
            });
        };
        $scope.getSubtypes();

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.toggleAdvancedCreditOption = function () {
            $scope.showAdvancedCreditOption = !$scope.showAdvancedCreditOption;
        };

        vm.checkCreditTxnData = function(){
            if($scope.retrievedCreditUserObj && $scope.retrievedCreditUserObj.id) {
                $scope.accountAssociation = 'user';
                vm.getCreditUserAccounts($scope.creditTransactionData);
            } else if($scope.newTransactionParams.accountUser && $scope.newTransactionParams.userObj){
                $scope.accountAssociation = 'user';
                $scope.creditTransactionData.user = $scope.newTransactionParams.userObj.email;
                vm.getCreditUserObj($scope.creditTransactionData);
            } else if($scope.newTransactionParams.accountUser && !$scope.newTransactionParams.userObj){
                $scope.accountAssociation = 'standalone';
            } else {
                $scope.loadingTransactionSettings = false; 
            }
        };
        
        $scope.onCreditReferenceSelect = function($model) {
            $scope.creditTransactionData.user = $model;
            vm.getCreditUserObj($scope.creditTransactionData);
        };

        vm.getCreditUserObj = function (creditTransactionData) {
            var user;
            $scope.retrievedCreditUserObj = {};
            user = creditTransactionData.user;
            if(vm.token){
                $scope.loadingAccounts = true;
                Rehive.admin.users.get({filters: {user: user}}).then(function (res) {
                    if(res.results.length == 1){
                        $scope.retrievedCreditUserObj = res.results[0];
                        $scope.retrievedCreditUserObj.metadata = metadataTextService.convertToText($scope.retrievedCreditUserObj.metadata);
                        vm.checkUserMFAStatus($scope.retrievedCreditUserObj.id);
                        vm.checkCreditTxnData();
                    } else {
                        $scope.retrievedCreditUserObj = {};
                        $scope.retrievedUserAccountsArray = [];
                        creditTransactionData.currency = {};
                        $scope.loadingTransactionSettings = false;
                        $scope.loadingAccounts = false;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactionSettings = false; 
                    $scope.loadingAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
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

        $scope.$watch('creditTransactionData.user',function () {
            if($scope.initialLoad){
                $scope.initialLoad = false;
                return false;
            }
            if($scope.creditTransactionData.user){
                vm.resetCreditData();
                vm.getCreditUserObj($scope.creditTransactionData);
            } else {
                vm.resetCreditData();
            }
        });

        vm.resetCreditData = function () {
            $scope.retrievedCreditUserObj = {};
            $scope.retrievedCreditUserAccountsArray = [];
            $scope.retrievedCreditAccountTransactions = [];
            $scope.creditTransactionData.currency = {};
            $scope.creditTransactionData.account = {};
            $scope.creditUserAccountsAvailable = true;
            $scope.creditCurrencyAccountsAvailable = true;
        };

        $scope.creditCurrencySelected = function (creditTransactionData) {
            $scope.retrievedCreditUserAccountsArray = [];
            creditTransactionData.account = {};
            if(creditTransactionData.currency && creditTransactionData.currency.code){
                if(!$scope.retrievedCreditUserObj || $scope.retrievedCreditUserObj.id === undefined){
                    $scope.accountAssociation = 'standalone';
                    vm.getCreditUserAccounts(creditTransactionData);
                } else {
                    $scope.accountAssociation = 'user';
                    vm.getCreditUserAccounts(creditTransactionData);
                }
            }
        };

        vm.getCreditUserAccounts = function (creditTransactionData) {
            var filtersObj = {};
            filtersObj.user = $scope.retrievedCreditUserObj.id;
            filtersObj.user__isnull = false;
            if(vm.token){
                Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.creditUserAccountsAvailable = true;
                        vm.getCreditAccounts(filtersObj,creditTransactionData);
                    } else {
                        $scope.creditUserAccountsAvailable = false;
                        $scope.loadingAccounts = false;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCreditAccounts = function (filtersObj,creditTransactionData) {
            if(creditTransactionData.currency && creditTransactionData.currency.code){
                filtersObj.currency = creditTransactionData.currency.code;
            } 
            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                $scope.retrievedCreditUserAccountsArray = res.results;
                if(res.results.length > 0){
                    $scope.creditCurrencyAccountsAvailable = true;
                    creditTransactionData.account = null;
                    var primaryAccount = null;
                    res.results.forEach(function (account) {
                        $scope.trackAccountCurrenciesInMap(account);
                        if($scope.newTransactionParams.accountUser && account.reference === $scope.newTransactionParams.accountUser){
                            creditTransactionData.account = account;
                        } else if(account.primary){
                            primaryAccount = account;
                            primaryAccount.name = account.name + ' - (primary)';
                        }
                    });

                    if(!creditTransactionData.account && primaryAccount){
                        creditTransactionData.account = primaryAccount;
                    }
                    if(creditTransactionData.account && creditTransactionData.account.reference){
                        $scope.creditAccountSelected(creditTransactionData);
                    } else {
                        $scope.loadingTransactionSettings = false;
                    }
                    $scope.loadingAccounts = false;
                    $scope.$apply();
                } else {
                    $scope.creditCurrencyAccountsAvailable = false; 
                    $scope.loadingTransactionSettings = false;                   
                    $scope.loadingAccounts = false;                   
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                $scope.loadingAccounts = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.creditAccountSelected = function (creditTransactionData) {
            var accountRef;
            if(vm.token && creditTransactionData){
                $scope.retrievedCreditAccountTransactions = [];
                accountRef = creditTransactionData.account.reference;
                $scope.loadingAccounts = false;
                if(!$scope.loadingAccountCurrencies){
                    $scope.loadingAccountCurrencies = true;
                }
                Rehive.admin.transactions.get({filters: {
                    page: 1,
                    page_size: 5,
                    orderby: '-created',
                    account: accountRef
                }}).then(function (res) {
                    $scope.retrievedCreditAccountTransactions = res.results;
                    $scope.mapCurrencies(creditTransactionData.account);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactionSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.mapCurrencies = function(creditAccount){
            $scope.creditCurrencyOptions = [];
            creditAccount.currencies.forEach(function(item){
                $scope.creditCurrencyOptions.push(item.currency);
            });
            if($scope.newTransactionParams.accountCurrencies){
                var updatedCurrencies = [];
                $scope.newTransactionParams.accountCurrencies.forEach(function(accountCurrency){
                    $scope.creditCurrencyOptions.forEach(function(currency){
                        if(currency.code === accountCurrency.currency.code){
                            updatedCurrencies.push(currency);
                        }
                    });
                });
                $scope.creditCurrencyOptions = updatedCurrencies;
            }

            if($scope.newTransactionParams.currencyCode) {
                $scope.creditTransactionData.currency = $scope.creditCurrencyOptions.find(function (element) {
                    return element.code == $scope.newTransactionParams.currencyCode;
                });
            }
            $scope.loadingTransactionSettings = false; 
            $scope.loadingAccountCurrencies = false; 
        };

        $scope.goToCreditUserAccountCreate = function () {
            $window.open('/#/user/' + $scope.retrievedCreditUserObj.id + '/accounts?accountAction=newAccount','_blank');
        };

        $scope.goToAddCurrencyModal = function () {
            $window.open('/#/currencies/currencies-list?currencyAction=newCurrency','_blank');
        };

        if((!$scope.newTransactionParams && !$scope.newTransactionParams.txType) 
        || (!$scope.newTransactionParams.userIdentity && !$scope.newTransactionParams.userEmail && !$scope.newTransactionParams.userObj)){
            $scope.loadingTransactionSettings = true; 
            vm.checkCreditTxnData();
        }
        else if($scope.newTransactionParams.userIdentity || $scope.newTransactionParams.userEmail || $scope.newTransactionParams.userObj){
            $scope.initialLoad = true;
            //coming from user accounts credit shortcut
            $scope.creditTransactionData.user = $scope.newTransactionParams.userIdentity || $scope.newTransactionParams.userEmail || $scope.newTransactionParams.userObj.email;
            $scope.loadingTransactionSettings = true; 
            vm.getCreditUserObj($scope.creditTransactionData);
        }
        else {
            $scope.loadingTransactionSettings = true; 
            vm.checkCreditTxnData();
        }
    }
})();