(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('TransferCtrl', TransferCtrl);

    function TransferCtrl(Rehive,environmentConfig,$scope,errorHandler,metadataTextService,$window,typeaheadService,
                          $http,$location,localStorageManagement, sharedResources) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.transferCurrencyOptions = [];
        $scope.retrievedSenderUserObj = {};
        $scope.retrievedSenderUserAccountsArray = [];
        $scope.retrievedSenderAccountTransactions = [];
        $scope.retrievedRecipientObj = {};
        $scope.retrievedRecipientAccountsArray = [];
        $scope.retrievedRecipientAccountTransactions = [];
        $scope.senderUserAccountsAvailable = true;
        $scope.senderCurrencyAccountsAvailable = true;
        $scope.recipientUserAccountsAvailable = true;
        $scope.recipientCurrencyAccountsAvailable = true;
        $scope.showAdvancedTransferOption = false;
        $scope.senderMfaEnabled = "Disabled";
        $scope.senderMfaOBj = {};  
        $scope.recipientMfaEnabled = "Disabled";
        $scope.recipientMfaOBj = {};  

        $scope.allSubtypes = [];

        $scope.transferTransactionData = {
            user: null,
            recipient: null,
            amount: null,
            currency: {},
            account: {},
            credit_account: {},
            debit_reference: null,
            credit_reference: null,
            debit_note: null,
            credit_note: null,
            debit_metadata: null,
            credit_metadata: null,
            debit_subtype: null,
            credit_subtype: null
        };

        if($scope.newTransactionParams.userEmail){
            $scope.transferTransactionData.user = $scope.newTransactionParams.userEmail;
            $scope.loadingTransactionSettings = true;
            if(!$scope.newTransactionParams.accountUser && !$scope.newTransactionParams.currencyCode){
                $location.search('userEmail', null);
            }         
        } 

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.getSubtypes = function () {
            sharedResources.getSubtypes().then(function (res) {
                $scope.allSubtypes = res;
            });
        };
        $scope.getSubtypes();

        vm.getTransferCompanyCurrencies = function(){
            var transferWithoutUser = false;
            if($scope.newTransactionParams.accountUser && $scope.newTransactionParams.currencyCode){
                transferWithoutUser = $scope.newTransactionParams.userEmail === undefined;
            }
            
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.transferCurrencyOptions = res.results;

                    if(transferWithoutUser){
                        var defaultCurrency = $scope.transferCurrencyOptions.find(function(currency){
                            return currency.code === $scope.newTransactionParams.currencyCode;
                        });                   
                        $scope.transferTransactionData.currency = defaultCurrency !== undefined ? defaultCurrency : $scope.transferCurrencyOptions[0];
                        $scope.loadingTransactionSettings = true;
                        $scope.currencySelected($scope.transferTransactionData, null);
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getTransferCompanyCurrencies();

        $scope.onRecipientEmailSelect = function($model){
            $scope.transferTransactionData.recipient = $model;
            vm.resetTransferData('recipient');
            vm.getUserObj($scope.transferTransactionData,'recipient');
        };

        $scope.onSendEmailSelect = function($model){
            $scope.transferTransactionData.user = $model;
            vm.resetTransferData();
            vm.getUserObj($scope.transferTransactionData);
        };

        $scope.$watch('transferTransactionData.user',function () {
            if($scope.transferTransactionData.user){
                vm.resetTransferData();
                vm.getUserObj($scope.transferTransactionData);
            } else {
                vm.resetTransferData();
            }
        });

        $scope.$watch('transferTransactionData.recipient',function () {
            if($scope.transferTransactionData.recipient){
                vm.resetTransferData('recipient');
                vm.getUserObj($scope.transferTransactionData,'recipient');
            } else {
                vm.resetTransferData('recipient');
            }
        });

        vm.resetTransferData = function (recipient) {
            if(recipient){
                $scope.retrievedRecipientObj = {};
                $scope.retrievedRecipientAccountsArray = [];
                $scope.retrievedRecipientAccountTransactions = [];
                $scope.transferTransactionData.credit_account = {};
                $scope.transferTransactionData.currency = {};
                // $scope.senderUserAccountsAvailable = true;
                // $scope.senderCurrencyAccountsAvailable = true;
                $scope.recipientUserAccountsAvailable = true;
                $scope.recipientCurrencyAccountsAvailable = true;
            } else {
                $scope.retrievedSenderUserObj = {};
                $scope.retrievedSenderUserAccountsArray = [];
                $scope.retrievedSenderAccountTransactions = [];
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.account = {};
                $scope.senderUserAccountsAvailable = true;
                $scope.senderCurrencyAccountsAvailable = true;
                // $scope.recipientUserAccountsAvailable = true;
                // $scope.recipientCurrencyAccountsAvailable = true;
            }
        };

        vm.getUserObj = function (transactionData,recipient) {
            var user;

            if(recipient){
                $scope.retrievedRecipientObj = {};
                user = transactionData.recipient;
            } else {
                $scope.retrievedSenderUserObj = {};
                user = transactionData.user;
            }

            Rehive.admin.users.get({filters: {user: user}}).then(function (res) {
                if(res.results.length == 1){
                    if(recipient){
                        $scope.retrievedRecipientObj = res.results[0];
                        $scope.retrievedRecipientObj.metadata = metadataTextService.convertToText($scope.retrievedRecipientObj.metadata);
                        vm.checkUserMFAStatus($scope.retrievedRecipientObj.id, recipient);
                        if($scope.transferCurrencyOptions.length > 0 && !$scope.transferTransactionData.currency){
                            $scope.transferTransactionData.currency = $scope.transferCurrencyOptions[0];
                            $scope.currencySelected($scope.transferTransactionData,'recipient');
                        } else {
                            $scope.loadingTransactionSettings = false;
                        }
                        $scope.$apply();
                    } else {
                        $scope.retrievedSenderUserObj = res.results[0];
                        $scope.retrievedSenderUserObj.metadata = metadataTextService.convertToText($scope.retrievedSenderUserObj.metadata);
                        vm.checkUserMFAStatus($scope.retrievedSenderUserObj.id);
                        if($scope.newTransactionParams.accountUser 
                            && $scope.newTransactionParams.currencyCode 
                            && $scope.transferCurrencyOptions.length > 0
                            && !$scope.transferTransactionData.currency){
                            var defaultCurrency = $scope.transferCurrencyOptions.find(function(currency){
                                return currency.code === $scope.newTransactionParams.currencyCode;
                            });
                            $scope.newTransactionParams.currencyCode = null;                            
                            $scope.transferTransactionData.currency = defaultCurrency !== undefined ? defaultCurrency : $scope.transferCurrencyOptions[0];
                            $scope.currencySelected($scope.transferTransactionData,'recipient');
                        } else {
                            $scope.loadingTransactionSettings = false;
                        }
                        $scope.$apply();
                    }
                } else {
                    if(recipient){
                        $scope.retrievedRecipientAccountsArray = [];
                        $scope.retrievedRecipientObj = {email: user + ' ( new user )'};
                    } else {
                        $scope.retrievedSenderUserObj = {};
                        $scope.retrievedSenderUserAccountsArray = [];
                    }
                    transactionData.currency = {};
                    $scope.loadingTransactionSettings = false;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
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

        $scope.currencySelected = function (transactionData,recipient) {
            if(recipient){
                $scope.retrievedSenderUserAccountsArray = [];
                $scope.retrievedRecipientAccountsArray = [];
                transactionData.credit_account = {};
                transactionData.debit_account = {};
                if(transactionData.currency && transactionData.currency.code){
                    ($scope.retrievedRecipientObj && $scope.retrievedRecipientObj.id !== undefined) ? 
                        vm.getUserAccounts($scope.retrievedRecipientObj,transactionData,recipient) : vm.getUserAccounts(null, transactionData, recipient);
                    ($scope.retrievedSenderUserObj && $scope.retrievedSenderUserObj.id !== undefined) ?
                        vm.getUserAccounts($scope.retrievedSenderUserObj,transactionData, null) : vm.getUserAccounts(null, transactionData, null);
                }
            } else {
                $scope.retrievedSenderUserAccountsArray = [];
                transactionData.account = {};
                if(transactionData.currency && transactionData.currency.code) {
                    vm.getUserAccounts($scope.retrievedSenderUserObj,transactionData);
                }
            }
        };

        vm.getUserAccounts = function (user,transactionData,recipient) {
            var filtersObj = {};
            if(user && user.id){
                filtersObj.user = user.id;
                filtersObj.user__isnull = false;
            } else {
                filtersObj.user__isnull = true;
            }
            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                if(res.results.length > 0 ){
                    if(recipient){
                        $scope.recipientUserAccountsAvailable = true;
                        vm.getAccounts(filtersObj,transactionData,recipient);
                        $scope.$apply();
                    } else {
                        $scope.senderUserAccountsAvailable = true;
                        vm.getAccounts(filtersObj,transactionData);
                        $scope.$apply();
                    }
                } else {
                    if(recipient){
                        $scope.recipientUserAccountsAvailable = false;
                    } else {
                        $scope.senderUserAccountsAvailable = false;
                    }
                    $scope.loadingTransactionSettings = false;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getAccounts = function (filtersObj,transactionData,recipient) {
            if(transactionData.currency && transactionData.currency.code){
                filtersObj.currency = transactionData.currency.code
            }
            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                if(res.results.length > 0 ){
                    res.results.forEach(function (account) {
                        if($scope.newTransactionParams.accountUser && account.reference === $scope.newTransactionParams.accountUser){
                            account.name = account.name + ' - (primary)';
                            transactionData.account = account;
                            $scope.newTransactionParams.accountUser = null;
                            $scope.accountSelected(transactionData);
                            $scope.$apply();
                        } else if(account.primary){
                            account.name = account.name + ' - (primary)';
                            if(recipient){
                                transactionData.credit_account = account;
                                $scope.accountSelected(transactionData,recipient);
                                $scope.$apply();
                            } else {
                                transactionData.account = account;
                                $scope.accountSelected(transactionData);
                                $scope.$apply();
                            }
                        }
                    });

                    if(recipient){
                        $scope.recipientCurrencyAccountsAvailable = true;
                        $scope.retrievedRecipientAccountsArray = res.results;
                    } else {
                        $scope.senderCurrencyAccountsAvailable = true;
                        $scope.retrievedSenderUserAccountsArray = res.results;
                    }
                    $scope.$apply();
                } else {
                    if(recipient){
                        $scope.recipientCurrencyAccountsAvailable = false;
                    } else {
                        $scope.senderCurrencyAccountsAvailable = false;
                    }
                    $scope.loadingTransactionSettings = false;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.accountSelected = function (transactionData,recipient) {

            var accountRef;

            if(transactionData){
                if(recipient && transactionData.credit_account){
                    $scope.retrievedRecipientAccountTransactions = [];
                    accountRef = transactionData.credit_account.reference;
                } else if(transactionData.account) {
                    $scope.retrievedSenderAccountTransactions = [];
                    accountRef = transactionData.account.reference;
                }

                Rehive.admin.transactions.get({filters: {
                    page: 1,
                    page_size: 5,
                    orderby: '-created',
                    account: accountRef
                }}).then(function (res) {
                    if(recipient){
                        $scope.retrievedRecipientAccountTransactions = res.results;
                    } else {
                        $scope.retrievedSenderAccountTransactions = res.results;
                    }
                    $scope.loadingTransactionSettings = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactionSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleAdvancedTransferOption = function () {
            $scope.showAdvancedTransferOption = !$scope.showAdvancedTransferOption;
        };

        $scope.goToTransferUserAccountCreate = function (id) {
            $window.open('/#/user/' + id + '/accounts?accountAction=newAccount','_blank');
        };

    }
})();
