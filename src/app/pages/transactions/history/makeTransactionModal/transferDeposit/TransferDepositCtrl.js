(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('TransferDepositCtrl', TransferDepositCtrl);

    function TransferDepositCtrl(Rehive,$rootScope, $scope,errorHandler,metadataTextService,$window,$http,environmentConfig,
                          $location,localStorageManagement, sharedResources,identifySearchInput,typeaheadService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.transferDepositCurrencyOptions = [];
        $scope.retrievedDepositSenderUserObj = {};
        $scope.retrievedDepositSenderUserAccountsArray = [];
        $scope.retrievedDepositSenderAccountTransactions = [];
        $scope.retrievedDepositRecipientObj = {};
        $scope.retrievedDepositRecipientAccountsArray = [];
        $scope.retrievedDepositRecipientAccountTransactions = [];
        $scope.senderUserDepositAccountsAvailable = true;
        $scope.senderDepositCurrencyAccountsAvailable = true;
        $scope.recipientUserDepositAccountsAvailable = true;
        $scope.recipientDepositCurrencyAccountsAvailable = true;
        $scope.showAdvancedTransferDepositOption = false;
        $scope.searchSender = $scope.searchRecipient = "";
        $scope.allDepositSubtypes = [];
        $scope.senderMfaEnabled = "Disabled";
        $scope.senderMfaOBj = {};  
        $scope.recipientMfaEnabled = "Disabled";
        $scope.recipientMfaOBj = {}; 

        $scope.transferDepositTransactionData = {
            user: null,
            recipient: null,
            amount: null,
            currency: {},
            account: {},
            credit_account: {},
            debit_reference: null,
            credit_reference: null,
            debit_metadata: null,
            credit_metadata: null,
            debit_subtype: null,
            credit_subtype: null
        };

        if($scope.newTransactionParams.userEmail){
            $scope.transferDepositTransactionData.user = $scope.newTransactionParams.userEmail;
            $location.search('userEmail', null);
        }

        $scope.getSubtypes = function () {
            sharedResources.getSubtypes().then(function (res) {
                $scope.allDepositSubtypes = res;
                var creditSubtypePreselected = $scope.allDepositSubtypes.filter(function(subtype){
                    return (subtype.name === "deposit_transfer" && subtype.tx_type === "credit");
                });
                var debitSubtypePreselected = $scope.allDepositSubtypes.filter(function(subtype){
                    return (subtype.name === "withdraw_admin" && subtype.tx_type === "debit");
                });
                $scope.transferDepositTransactionData.credit_subtype = creditSubtypePreselected.length > 0 ? creditSubtypePreselected[0] : null;
                $scope.transferDepositTransactionData.debit_subtype = debitSubtypePreselected.length > 0 ? debitSubtypePreselected[0] : null;
            });
        };
        $scope.getSubtypes();

        vm.getTransferDepositCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.transferDepositCurrencyOptions = res.results;

                    if($scope.newTransactionParams.accountCurrencies){
                        var updatedCurrencies = [];
                        $scope.newTransactionParams.accountCurrencies.forEach(function(accountCurrency){
                            $scope.transferDepositCurrencyOptions.forEach(function(currency){
                                if(currency.code === accountCurrency.currency.code){
                                    updatedCurrencies.push(currency);
                                }
                            });
                        });
                        $scope.transferDepositCurrencyOptions = updatedCurrencies;
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getTransferDepositCompanyCurrencies();        

        $scope.resetTransferDepositData = function (recipient) {
            if(recipient){
                $scope.retrievedDepositRecipientObj = {};
                $scope.retrievedDepositRecipientAccountsArray = [];
                $scope.retrievedDepositRecipientAccountTransactions = [];
                $scope.transferDepositTransactionData.credit_account = {};
                $scope.transferDepositTransactionData.recipient = null;
                $scope.recipientUserDepositAccountsAvailable = true;
                $scope.recipientDepositCurrencyAccountsAvailable = true;
                $scope.searchRecipient = "";
            } else {
                $scope.retrievedDepositSenderUserObj = {};
                $scope.retrievedDepositSenderUserAccountsArray = [];
                $scope.retrievedDepositSenderAccountTransactions = [];
                $scope.transferDepositTransactionData.account = {};
                $scope.transferDepositTransactionData.user = null;
                $scope.senderUserDepositAccountsAvailable = true;
                $scope.senderDepositCurrencyAccountsAvailable = true;
                $scope.searchSender = "";
            }
        };        

        $scope.depositCurrencySelected = function (transactionData) {
            if(!$scope.newTransactionParams.accountUser){
                $scope.retrievedDepositRecipientObj = {};
                $scope.retrievedDepositSenderUserObj = {};
                $scope.retrievedDepositRecipientAccountsArray = [];
                $scope.retrievedDepositSenderUserAccountsArray = [];
                $scope.retrievedDepositRecipientAccountTransactions = [];
                $scope.retrievedDepositSenderAccountTransactions = [];
                $scope.transferDepositTransactionData.credit_account = {};
                $scope.transferDepositTransactionData.account = {};
                $scope.recipientUserDepositAccountsAvailable = true;
                $scope.senderUserDepositAccountsAvailable = true;
                $scope.recipientDepositCurrencyAccountsAvailable = true;
                $scope.senderDepositCurrencyAccountsAvailable = true;
            }
        };
        
        $scope.getTransferUsersAccountTypeahead = typeaheadService.getAccountsReferenceTypeahead();

        $scope.searchRecipientAccountWithReference = function($model){
            var searchString = $model;
            var filterObj = {};
            filterObj.reference = searchString;
            if($scope.transferDepositTransactionData.currency.code){
                filterObj.currency = $scope.transferDepositTransactionData.currency.code;
            }
            vm.getRecipientAccounts(filterObj, false);

            /* Uncomment this and remove the above if user search required.
            var type = "";
            if(identifySearchInput.isMobile(searchString)){
                type = "mobile";
            }
            else{
                type = (searchString.indexOf('@') > 0) ? "email" : "reference";
            } 
            var filterObj = {};
            if(type == "reference"){
                filterObj.reference = searchString;
                filterObj.currency = $scope.transferDepositTransactionData.currency.code;
                vm.getRecipientAccounts(filterObj, false);
            }
            else{
                if(type == 'mobile'){
                    filterObj.mobile__contains = searchString;
                }else {
                    filterObj.email__contains = searchString;
                }
                vm.getRecipientUserObj(filterObj, true);
            }
             */
        };

        vm.getRecipientUserObj = function (filterObj, userSearchedFirst) {
            $scope.retrievedDepositRecipientObj = {};
            $scope.transferDepositTransactionData.recipient = null;
            Rehive.admin.users.get({filters: filterObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.retrievedDepositRecipientObj = res.results[0];
                    $scope.retrievedDepositRecipientObj.metadata = metadataTextService.convertToText($scope.retrievedDepositRecipientObj.metadata);
                    $scope.transferDepositTransactionData.recipient = $scope.retrievedDepositRecipientObj.email ? $scope.retrievedDepositRecipientObj.email : $scope.retrievedDepositRecipientObj.id;
                    vm.checkUserMFAStatus($scope.retrievedDepositRecipientObj.id, 'recipient');
                    if(userSearchedFirst){
                        filterObj = {};
                        filterObj.user = $scope.retrievedDepositRecipientObj.id;
                        filterObj.currency = $scope.transferDepositTransactionData.currency.code;
                        vm.getRecipientAccounts(filterObj, true);
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

        vm.getRecipientAccounts = function (filterObj, userSearchedFirst) {
            $scope.transferDepositTransactionData.credit_account = null;
            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.recipientDepositCurrencyAccountsAvailable = true;
                    res.results.find(function (account) {
                        if(account.primary){
                            account.name = account.name + ' - (primary)';
                        }
                        $scope.transferDepositTransactionData.credit_account = account;
                        $scope.depositAccountSelected($scope.transferDepositTransactionData, 'recipient');                        
                    });
                    $scope.retrievedDepositRecipientAccountsArray = res.results;
                    if(!userSearchedFirst && $scope.retrievedDepositRecipientAccountsArray[0].user){
                        filterObj = {};
                        filterObj.id__contains = $scope.retrievedDepositRecipientAccountsArray[0].user.id;
                        vm.getRecipientUserObj(filterObj, false);
                    }
                    $scope.$apply();
                } else {
                    $scope.recipientDepositCurrencyAccountsAvailable = false;
                    $scope.retrievedDepositRecipientAccountsArray = res.results;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingDepositTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.searchSenderAccountWithReference = function($model){
            var searchString = $model;
            var filterObj = {};
            filterObj.reference = searchString;
            filterObj.currency = $scope.transferDepositTransactionData.currency.code;
            vm.getSenderAccounts(filterObj, false);

            /* Uncomment this and remove the above if user search required.
            var type = "";
            if(identifySearchInput.isMobile(searchString)){
                type = "mobile";
            }
            else{
                type = (searchString.indexOf('@') > 0) ? "email" : "reference";
            } 
            var filterObj = {};
            if(type == "reference"){
                filterObj.reference = searchString;
                filterObj.currency = $scope.transferDepositTransactionData.currency.code;
                vm.getSenderAccounts(filterObj, false);
            }
            else{
                if(type == 'mobile'){
                    filterObj.mobile__contains = searchString;
                }else {
                    filterObj.email__contains = searchString;
                }
                vm.getSenderUserObj(filterObj, true);
            }
            */
        };

        vm.getSenderUserObj = function (filterObj, userSearchedFirst) {
            $scope.retrievedDepositSenderUserObj = {};
            Rehive.admin.users.get({filters: filterObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.retrievedDepositSenderUserObj = res.results[0];
                    $scope.retrievedDepositSenderUserObj.metadata = metadataTextService.convertToText($scope.retrievedDepositRecipientObj.metadata);
                    $scope.transferDepositTransactionData.user = $scope.retrievedDepositSenderUserObj.email ? $scope.retrievedDepositSenderUserObj.email : $scope.retrievedDepositSenderUserObj.id;
                    vm.checkUserMFAStatus($scope.retrievedDepositSenderUserObj.id);
                    if(userSearchedFirst){
                        filterObj = {};
                        filterObj.user = $scope.retrievedDepositSenderUserObj.id;
                        filterObj.currency = $scope.transferDepositTransactionData.currency.code;
                        vm.getSenderAccounts(filterObj, true);
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

        vm.checkUserMFAStatus = function (uuid, recipient) {
            if(vm.token) {
                Rehive.admin.users.mfa.get(uuid).then(function (res) {
                    for(var key in res){
                        if (res.hasOwnProperty(key)) {
                            if(res[key]){
                                if(key == 'sms'){
                                    if(recipient){
                                        $scope.recipientMfaEnabled = "Enabled";
                                        vm.getUserSmsMFADetails(uuid, recipient)
                                    } else {
                                        $scope.senderMfaEnabled = "Enabled";
                                        vm.getUserSmsMFADetails(uuid)
                                    }
                                } else if(key == 'token'){
                                    if(recipient){
                                        $scope.recipientMfaEnabled = "Enabled";
                                        vm.getUserTokenMFADetails(uuid, recipient);
                                    } else {
                                        $scope.senderMfaEnabled = "Enabled";
                                        vm.getUserTokenMFADetails(uuid)
                                    }
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

        vm.getUserSmsMFADetails = function(uuid, recipient) {
            if(vm.token){
                $http.get(environmentConfig.API + 'admin/users/' + uuid + '/mfa/sms/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(recipient){
                            $scope.recipientMfaOBj = res.data.data;
                        } else {
                            $scope.senderMfaOBj = res.data.data;
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        }

        vm.getUserTokenMFADetails = function(uuid, recipient) {
            if(vm.token){
                $http.get(environmentConfig.API + 'admin/users/' + uuid + '/mfa/token/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(recipient){
                            $scope.recipientMfaOBj = res.data.data;
                        } else {
                            $scope.senderMfaOBj = res.data.data;
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        }

        vm.getSenderAccounts = function (filterObj, userSearchedFirst) {
            $scope.transferDepositTransactionData.account = null;
            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                if(res.results.length > 0){
                    $scope.senderDepositCurrencyAccountsAvailable = true;
                    res.results.find(function (account) {
                        if(account.primary){
                            account.name = account.name + ' - (primary)';
                        }
                        $scope.transferDepositTransactionData.account = account;
                        $scope.depositAccountSelected($scope.transferDepositTransactionData, null);
                    });
                    $scope.retrievedDepositSenderUserAccountsArray = res.results;
                    if(!userSearchedFirst){
                        filterObj = {};
                        filterObj.id__contains = $scope.retrievedDepositSenderUserAccountsArray[0].user.id;
                        vm.getSenderUserObj(filterObj, false);
                    }
                    $scope.$apply();
                } else {
                    $scope.senderDepositCurrencyAccountsAvailable = false;
                    $scope.retrievedDepositSenderUserAccountsArray = res.results;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingDepositTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.depositAccountSelected = function (transactionData,recipient) {

            var accountRef = "";

            if(transactionData){
                if(recipient && transactionData.credit_account){
                    $scope.retrievedDepositRecipientAccountTransactions = [];
                    accountRef = transactionData.credit_account.reference;
                } else if(transactionData.account) {
                    $scope.retrievedDepositSenderAccountTransactions = [];
                    accountRef = transactionData.account.reference;
                }

                Rehive.admin.transactions.get({filters: {
                    page: 1,
                    page_size: 5,
                    orderby: '-created',
                    account: accountRef
                }}).then(function (res) {
                    if(recipient){
                        $scope.retrievedDepositRecipientAccountTransactions = res.results;
                    } else {
                        $scope.retrievedDepositSenderAccountTransactions = res.results;
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleAdvancedTransferDepositOption = function () {
            $scope.showAdvancedTransferDepositOption = !$scope.showAdvancedTransferDepositOption;
        };

        $scope.goToTransferUserAccountCreate = function (id) {
            $window.open('/#/user/' + id + '/accounts?accountAction=newAccount','_blank');
        };

        if($scope.newTransactionParams.accountUser){
            $scope.searchRecipientAccountWithReference($scope.newTransactionParams.accountUser);
        }
    }
})();
