(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('accountDefinitionService', accountDefinitionService);

    /** @ngInject */
    function accountDefinitionService(Rehive,$ngConfirm,toastr,$uibModal,localStorageManagement) {

        return {
            getAccountDefinition: function(accountsFiltersObj){
                return new Promise(function(resolve, reject){
                    Rehive.admin.account.definitions.get(accountsFiltersObj)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });
                });
            },
            createAccountDefinition: function(newAccountDefParams){
                return new Promise(function(resolve, reject){  
                    Rehive.admin.account.definitions.create(newAccountDefParams)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                   
                });               
            },
            updateAccountDefinition: function(accDefName, data, isArchiving, shouldBeDeleted){
                var vm = this;  
                return new Promise(function(resolve, reject){ 
                    Rehive.admin.account.definitions.update(accDefName, data)
                    .then(function (res) {
                        if(isArchiving && shouldBeDeleted){
                            vm.deleteAccountDefinition(accDefName)
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
            deleteAccountDefinition: function(accDefName){  
                return new Promise(function(resolve, reject){
                    Rehive.admin.account.definitions.delete(accDefName)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                   
                });              
            },
            getAccountDefintionGroups: function(accDefName, filtersObj){  
                return new Promise(function(resolve, reject){
                    Rehive.admin.account.definitions.groups.get(accDefName, filtersObj)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                                       
                });              
            },
            handleMultipleGroupDefinitionCreate: function(accDefName, groupsList){
                var vm = this;
                return new Promise(function(resolve, reject){
                    groupsList.forEach(function(groupObj, idx, arr){
                        var newGroupObj = {
                            group: groupObj.group.name,
                            default: groupObj.default,
                            primary: groupObj.primary,
                        };

                        vm.createAccountDefinitionGroup(accDefName, newGroupObj, groupObj.currencies)
                        .then(function(res){
                            if(idx === arr.length-1){
                                resolve(res);
                            }
                        })
                        .catch(function(error){
                            reject(error);
                        });
                    });
                });
            },
            createAccountDefinitionGroup: function(accDefName, newGroupObj, currenciesList){ 
                var vm = this; 
                return new Promise(function(resolve, reject){ 
                    Rehive.admin.account.definitions.groups.create(accDefName, newGroupObj)
                    .then(function (res) {
                        if(currenciesList && currenciesList.length > 0){
                            vm.handleMultipleGroupCurrencyCreate(accDefName, newGroupObj.group, currenciesList)
                            .then(function(res){ resolve(res); })
                            .catch(function(error){ resolve(error); })
                        } else {
                            resolve(res);
                        }
                    }, function (error) {
                        reject(error);
                    });                                      
                });              
            },
            updateAccountDefinitionGroup: function(accDefName, groupName, data, isArchiving, shouldBeDeleted){  
                return new Promise(function(resolve, reject){  
                    Rehive.admin.account.definitions.groups.update(accDefName, groupName, data)
                    .then(function (res) {
                        if(isArchiving && shouldBeDeleted){
                            vm.deleteAccountDefinitionGroup(accDefName, groupName)
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
            deleteAccountDefinitionGroup: function(accDefName, groupName){  
                return new Promise(function(resolve, reject){
                    Rehive.admin.account.definitions.groups.delete(accDefName, groupName)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                                       
                });              
            },
            getAccountDefinitionGroupCurrencies: function(accDefName, groupName, filtersObj){  
                return new Promise(function(resolve, reject){  
                    Rehive.admin.account.definitions.groups.currencies.get(accDefName, groupName, filtersObj)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                                     
                });              
            },
            handleMultipleGroupCurrencyCreate: function(accDefName, groupName, currenciesList){
                var vm = this;
                return new Promise(function(resolve, reject){
                    currenciesList.forEach(function(element, idx, arr){
                        var newCurrencyObj = {currency: element.code};
                        vm.createAccountDefinitionGroupCurrency(accDefName, groupName, newCurrencyObj)
                        .then(function(res){
                            if(idx === arr.length-1){
                                resolve(res);
                            }
                        })
                        .catch(function(error){ reject(error)});
                    });
                });
            },
            createAccountDefinitionGroupCurrency: function(accDefName, groupName, newCurrencyObj){  
                return new Promise(function(resolve, reject){ 
                    Rehive.admin.account.definitions.groups.currencies.create(accDefName, groupName, newCurrencyObj)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                                      
                });              
            },
            updateAccountDefinitionGroupCurrency: function(accDefName, groupName, currencyCode, data, isArchiving, shouldBeDeleted){  
                return new Promise(function(resolve, reject){ 
                    Rehive.admin.account.definitions.groups.currencies.update(accDefName, groupName, currencyCode, data)
                    .then(function (res) {
                        if(isArchiving && shouldBeDeleted){
                            vm.deleteAccountDefinitionGroupCurrency(accDefName, groupName, currencyCode)
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
            deleteAccountDefinitionGroupCurrency: function(accDefName, groupName, currencyCode){  
                return new Promise(function(resolve, reject){ 
                    Rehive.admin.account.definitions.groups.currencies.delete(accDefName, groupName, currencyCode)
                    .then(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });                                      
                });              
            },
            openAddAccountDefinitionModal: function(){
                return $uibModal.open({
                    animation: true,
                    templateUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionsList/addAccountDefinitionModal/addAccountDefinitionModal.html',
                    size: 'md',
                    controller: 'AddAccountDefinitionModalCtrl',
                });
            },
            openEditAccountDefinitionModal: function(activeDefinitionObj){
                return $uibModal.open({
                    animation: true,
                    templateUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionsList/editAccountDefinitionModal/editAccountDefinitionModal.html',
                    size: 'md',
                    controller: 'EditAccountDefinitionModalCtrl',
                    resolve: {
                        accDefinitionObj: function(){
                            return {
                                name: activeDefinitionObj.name,
                                label: activeDefinitionObj.label,
                                recon: activeDefinitionObj.recon 
                            };
                        } 
                    }
                });
            },
            openAddGroupDefinitionModal: function(accDefName, existingGroups, groupOptions, currenciesOptions){
                return $uibModal.open({
                    animation: true,
                    templateUrl: 'app/pages/accounts/accountDefinitions/editAccountDefinition/addAccountDefinitionGroupModal/addAccountDefinitionGroupModal.html',
                    size: 'md',
                    controller: 'AddAccountDefinitionGroupModalCtrl',
                    resolve: {
                        accDefName: function(){
                            return accDefName;
                        },
                        existingGroups: function(){
                            return existingGroups;
                        },
                        groupOptions: function () {
                            return groupOptions;
                        },
                        currenciesOptions: function () {
                            return currenciesOptions;
                        }
                    }
                });
            },
            openAddGroupDefCurrenciesModal: function(accDefName, groupName, currenciesOptions, existingCurrencies){
                return $uibModal.open({
                    animation: true,
                    templateUrl: 'app/pages/accounts/accountDefinitions/editAccountDefinition/addAccDefGroupCurrencyModal/addAccDefGroupCurrencyModal.html',
                    size: 'md',
                    controller: 'AddAccDefGroupCurrencyModalCtrl',
                    resolve: {
                        accDefName: function(){
                            return accDefName;
                        },
                        groupName: function(){
                            return groupName;
                        },
                        currenciesOptions: function () {
                            return currenciesOptions;
                        },
                        existingCurrencies: function () {
                            return existingCurrencies;
                        }
                    }
                });
            },
            showArchiveAccountDefinitionPrompt: function(scope, accDefObj, handleCBFunc){
                scope.accDefObj = accDefObj;
                $ngConfirm({
                    title: 'Archive account definition',
                    contentUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionPrompts/archiveAccDefPrompt.html',
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
                                handleCBFunc(accDefObj, false);
                            }
                        }
                    }
                });
            },
            showRestoreAccountDefinitionPrompt: function(scope, accDefObj, handleCBFunc){
                scope.accDefObj = accDefObj;
                $ngConfirm({
                    title: 'Restore account definition',
                    contentUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionPrompts/restoreAccDefPrompt.html',
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
                                handleCBFunc(accDefObj, false);
                            }
                        }
                    }
                });
            },
            showDeleteAccountDefinitionPrompt: function(scope, accDefObj, handleCBFunc, deleteCBFunc){
                scope.accDefObj = accDefObj;
                $ngConfirm({
                    title: 'Delete account configuration',
                    contentUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionPrompts/deleteAccDefPrompt.html',
                    columnClass: 'medium',
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: scope,
                    buttons: {
                        close: {
                            text: "Close",
                            btnClass: 'btn-default pull-left dashboard-btn'
                        },
                        Add: {
                            text: "Delete permanently",
                            btnClass: 'btn btn-danger delete-button',
                            keys: ['enter'],
                            action: function(scope){
                                if(scope.accDefDeleteText != 'DELETE'){
                                    toastr.error('DELETE text did not match');
                                    return;
                                }
                                if(!accDefObj.archived){
                                    handleCBFunc(accDefObj, true);
                                } else {
                                    deleteCBFunc(accDefObj);
                                }
                            }
                        }
                    }
                });
            },
            showArchiveAccDefGroupDefinitionPrompt: function(scope, accDefName, groupObj, handleCBFunc){
                scope.accDefName = accDefName;
                scope.groupObj = groupObj;
                $ngConfirm({
                    title: 'Archive account definition group',
                    contentUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionPrompts/archiveAccDefGroupPrompt.html',
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
                                handleCBFunc(accDefName, groupObj, false);
                            }
                        }
                    }
                });
            },
            showRestoreAccDefGroupDefinitionPrompt: function(scope, accDefName, groupObj, handleCBFunc){
                scope.accDefName = accDefName;
                scope.groupObj = groupObj;
                $ngConfirm({
                    title: 'Restore account definition group',
                    contentUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionPrompts/restoreAccDefGroupPrompt.html',
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
                                handleCBFunc(accDefName, groupObj, false);
                            }
                        }
                    }
                });
            },
            showDeleteAccDefGroupDefinitionPrompt: function(scope, accDefName, groupObj, handleCBFunc,deleteCBFunc){
                scope.accDefName = accDefName;
                scope.groupObj = groupObj;
                $ngConfirm({
                    title: 'Delete account definition group',
                    contentUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionPrompts/deleteAccDefGroupPrompt.html',
                    columnClass: 'medium',
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: scope,
                    buttons: {
                        close: {
                            text: "Close",
                            btnClass: 'btn-default pull-left dashboard-btn'
                        },
                        Add: {
                            text: "Delete permanently",
                            btnClass: 'btn btn-danger delete-button',
                            keys: ['enter'], // will trigger when enter is pressed
                            action: function(scope){
                                if(scope.accDefGroupDeleteText != 'DELETE'){
                                    toastr.error('DELETE text did not match');
                                    return;
                                }
                                if(!groupObj.archived){
                                    handleCBFunc(accDefName, groupObj, true);
                                } else {
                                    deleteCBFunc(accDefName, groupObj);
                                }
                            }
                        }
                    }
                });
            },
            showArchiveAccDefGroupCurrencyPrompt: function(scope, accDefName, groupName, currencyObj, handleCBFunc){
                scope.accDefName = accDefName;
                scope.groupName = groupName;
                scope.currencyObj = currencyObj;
                $ngConfirm({
                    title: 'Archive account definition group currency',
                    contentUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionPrompts/archiveAccDefGroupCurrencyPrompt.html',
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
                                handleCBFunc(accDefName, groupName, currencyObj, false);
                            }
                        }
                    }
                });
            },
            showRestoreAccDefGroupCurrencyPrompt: function(scope, accDefName, groupName, currencyObj, handleCBFunc){
                scope.accDefName = accDefName;
                scope.groupName = groupName;
                scope.currencyObj = currencyObj;
                $ngConfirm({
                    title: 'Restore account definition group currency',
                    contentUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionPrompts/restoreAccDefGroupCurrencyPrompt.html',
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
                                handleCBFunc(accDefName, groupName, currencyObj, false);
                            }
                        }
                    }
                });                
            },
            showDeleteAccDefGroupCurrencyPrompt: function(scope, accDefName, groupName, currencyObj, handleCBFunc,deleteCBFunc){
                scope.accDefName = accDefName;
                scope.groupName = groupName;
                scope.currencyObj = currencyObj;
                $ngConfirm({
                    title: 'Delete account definition group currency',
                    contentUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionPrompts/deleteAccDefGroupCurrencyPrompt.html',
                    columnClass: 'medium',
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: scope,
                    buttons: {
                        close: {
                            text: "Close",
                            btnClass: 'btn-default pull-left dashboard-btn margin-right-30'
                        },
                        Add: {
                            text: "Delete permanently",
                            btnClass: 'btn btn-danger delete-button',
                            keys: ['enter'], // will trigger when enter is pressed
                            action: function(scope){
                                if(scope.accDefGroupCurrencyDeleteText != 'DELETE'){
                                    toastr.error('DELETE text did not match');
                                    return;
                                }
                                if(!currencyObj.archived){
                                    handleCBFunc(accDefName, groupName, currencyObj, true);
                                } else {
                                    deleteCBFunc(accDefName, groupName, currencyObj);
                                }
                            }
                        }
                    }
                });
            }
        };
    }
})();