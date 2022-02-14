(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('accountService', accountService);

    /** @ngInject */
    function accountService(Rehive,$ngConfirm,toastr,$uibModal,localStorageManagement) {

        return {
            getAccounts: function(accountsFiltersObj){
                return new Promise(function(resolve, reject){
                    Rehive.admin.accounts.get(accountsFiltersObj)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });
                });
            },
            createAccount: function(newAccountDefParams){
                return new Promise(function(resolve, reject){  
                    Rehive.admin.accounts.create(newAccountDefParams)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                   
                });               
            },
            updateAccount: function(accountObj, data, isArchiving, shouldBeDeleted){
                var vm = this;  
                return new Promise(function(resolve, reject){ 
                    Rehive.admin.accounts.update(accountObj.reference, data)
                    .then(function (res) {
                        if(isArchiving && shouldBeDeleted){
                            vm.deleteAccount(accountObj)
                            .then(function(res){
                                resolve(res);
                            })
                            .catch(function(error){                                
                                reject(error);
                            });
                        } else {
                            resolve(res);
                        }
                    }, function (error) {
                        reject(error);
                    });                   
                });              
            },
            deleteAccount: function(accountObj){  
                return new Promise(function(resolve, reject){
                    Rehive.admin.accounts.delete(accountObj.reference)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                   
                });              
            },
            openAddUserAccountModal: function(scope){
                return $uibModal.open({
                    animation: true,
                    templateUrl: 'app/pages/users/user/userAccountsOnly/addAccountModal/addAccountModal.html',
                    size: 'md',
                    controller: 'AddAccountModalCtrl',
                    scope: scope
                });
            },
            openEditUserAccountModal: function(scope, account, currencies){
                return $uibModal.open({
                    animation: true,
                    templateUrl: 'app/pages/users/user/userAccountsOnly/editAccountModal/editAccountModal.html',
                    size: 'md',
                    controller: 'EditAccountModalCtrl',
                    scope: scope,
                    resolve: {
                        account: function () {
                            return account;
                        },
                        currenciesList: function () {
                            return currencies;
                        }
                    }
                });
            },
            getAccountCurrencies: function(accountObj, filtersObj){  
                return new Promise(function(resolve, reject){  
                    Rehive.admin.accounts.currencies.get(accountObj.reference, filtersObj)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                                     
                });              
            },
            handleMultipleAccountCurrencyCreate: function(accountObj, currenciesList){
                var vm = this;
                return new Promise(function(resolve, reject){
                    currenciesList.forEach(function(element, idx, arr){
                        var newCurrencyObj = {currency: element.code};
                        vm.createAccountCurrency(accountObj, newCurrencyObj)
                        .then(function(res){
                            if(idx === arr.length-1){
                                resolve(res);
                            }
                        })
                        .catch(function(error){ reject(error)});
                    });
                });
            },
            createAccountCurrency: function(accountObj, newCurrencyObj){  
                return new Promise(function(resolve, reject){ 
                    Rehive.admin.accounts.currencies.create(accountObj.reference, newCurrencyObj)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                                      
                });              
            },
            updateAccountCurrency: function(accountObj, accCurrencyObj, data, isArchiving, shouldBeDeleted){  
                return new Promise(function(resolve, reject){ 
                    Rehive.admin.accounts.currencies.update(accountObj.reference, accCurrencyObj.currency.code, data)
                    .then(function (res) {
                        if(isArchiving && shouldBeDeleted){
                            vm.deleteAccountCurrency(accountObj, currencyCode)
                            .then(function(res){
                                resolve(res);
                            })
                            .catch(function(error){                                
                                reject(error);
                            });
                        } else {
                            resolve(res);
                        }
                    }, function (error) {
                        reject(error);
                    });                                      
                });              
            },
            deleteAccountCurrency: function(accountObj, accCurrencyObj){  
                return new Promise(function(resolve, reject){ 
                    Rehive.admin.accounts.currencies.delete(accountObj.reference, accCurrencyObj.currency.code)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                                      
                });              
            },
            showArchiveAccountPrompt: function(scope, accountObj, handleCBFunc){
                scope.accountObj = accountObj;
                $ngConfirm({
                    title: 'Archive account',
                    contentUrl: 'app/pages/accounts/account/accountPrompts/accountArchivePrompt.html',
                    columnClass: 'medium',
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: scope,
                    buttons: {
                        close: {
                            text: "Close",
                            btnClass: 'btn-default pull-right dashboard-btn'
                        },
                        ok: {
                            text: "Archive",
                            btnClass: 'btn-primary dashboard-btn margin-right-30',
                            keys: ['enter'],
                            action: function(scope){
                                handleCBFunc(accountObj, false);
                            }
                        }
                    }
                });
            },
            showRestoreAccountPrompt: function(scope, accountObj, handleCBFunc){
                scope.accountObj = accountObj;
                $ngConfirm({
                    title: 'Restore account',
                    contentUrl: 'app/pages/accounts/account/accountPrompts/accountRestorePrompt.html',
                    columnClass: 'medium',
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: scope,
                    buttons: {
                        close: {
                            text: "Close",
                            btnClass: 'btn-default pull-right dashboard-btn'
                        },
                        ok: {
                            text: "Restore",
                            btnClass: 'btn-primary dashboard-btn margin-right-30',
                            keys: ['enter'],
                            action: function(scope){
                                handleCBFunc(accountObj, false);
                            }
                        }
                    }
                });
            },
            showArchiveAccountCurrencyPrompt: function(scope, accountObj, accCurrencyObj, handleCBFunc){
                scope.accountObj = accountObj;
                scope.currencyObj = accCurrencyObj.currency;
                $ngConfirm({
                    title: 'Archive account currency',
                    contentUrl: 'app/pages/accounts/account/accountPrompts/accountCurrencyArchivePrompt.html',
                    columnClass: 'medium',
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: scope,
                    buttons: {
                        close: {
                            text: "Close",
                            btnClass: 'btn-default pull-right dashboard-btn'
                        },
                        ok: {
                            text: "Archive",
                            btnClass: 'btn-primary dashboard-btn margin-right-30',
                            keys: ['enter'],
                            action: function(scope){
                                handleCBFunc(accountObj, accCurrencyObj, false);
                            }
                        }
                    }
                });
            },
            showRestoreAccountCurrencyPrompt: function(scope, accountObj, accCurrencyObj, handleCBFunc){
                scope.accountObj = accountObj;
                scope.currencyObj = accCurrencyObj.currency;
                $ngConfirm({
                    title: 'Restore account currency',
                    contentUrl: 'app/pages/accounts/account/accountPrompts/accountCurrencyRestorePrompt.html',
                    columnClass: 'medium',
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: scope,
                    buttons: {
                        close: {
                            text: "Close",
                            btnClass: 'btn-default pull-right dashboard-btn'
                        },
                        ok: {
                            text: "Restore",
                            btnClass: 'btn-primary dashboard-btn margin-right-30',
                            keys: ['enter'],
                            action: function(scope){
                                handleCBFunc(accountObj, accCurrencyObj, false);
                            }
                        }
                    }
                });                
            }
        };
    }
})();