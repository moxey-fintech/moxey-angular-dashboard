(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.definitions.edit')
        .controller('EditAccountDefinitionCtrl', EditAccountDefinitionCtrl);

    /** @ngInject */
    function EditAccountDefinitionCtrl($scope,$filter,localStorageManagement,$state,_,errorHandler,Rehive,toastr,accountDefinitionService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.accDefName = $state.params && $state.params.accDefName ? $state.params.accDefName : null;
        $scope.currenciesOptions = [];
        $scope.groupOptions = [];
        $scope.editingAcountDefinition = true;
        $scope.editDefinition = {};
        $scope.activeGroupDefinitions = [];
        $scope.archivedGroupDefinitions = [];
        $scope.existingGroups = [];
        $scope.showGroupDefinitions = 'active';
        
        $scope.backToDefinitions = function(){
            $state.go('accounts.definitions.list', {}, {reload: true});
        };

        $scope.toggleGroupDefinitionList = function(displayList){
            $scope.showGroupDefinitions = displayList;
        };

        $scope.getEditAccountDef = function(){        
            if(!vm.accDefName){
                toastr.error("Name for account definition not found.");
                $scope.backToDefinitions();
            }
            if(vm.token){
                $scope.editingAcountDefinition = true;
                accountDefinitionService.getAccountDefinition({name: vm.accDefName}).then(function (res) {
                    $scope.editDefinition = res;
                    if(!$scope.editDefinition.label || $scope.editDefinition == ''){
                        $scope.editDefinition.label = $filter('capitalizeWord')($scope.editDefinition.name);
                    }
                                
                    $scope.activeGroupDefinitions = [];
                    $scope.archivedGroupDefinitions = [];
                    if($scope.editDefinition.groups){
                        $scope.editDefinition.groups.forEach(function(groupObj){
                            $scope.existingGroups.push(groupObj.group.name);

                            var activeCurrencies = [];
                            var archivedCurrencies = [];
                            groupObj.currencies.forEach(function(groupCurrency){
                                groupCurrency.archived ? archivedCurrencies.push(groupCurrency) : activeCurrencies.push(groupCurrency);
                            });
                            activeCurrencies = activeCurrencies.sort(function(item1, item2){return item1.currency.code > item2.currency.code});
                            archivedCurrencies = archivedCurrencies.sort(function(item1, item2){return item1.currency.code > item2.currency.code});
                            groupObj.currencies = activeCurrencies.concat(archivedCurrencies);
                            
                            groupObj.archived ? $scope.archivedGroupDefinitions.push(groupObj) : $scope.activeGroupDefinitions.push(groupObj);
                        });
                    }
                    $scope.editingAcountDefinition = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.editingAcountDefinition = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.getCompanyGroups = function(){
            if(vm.token) {
                var groupFiltersObj = {
                    page_size: 250
                };

                Rehive.admin.groups.get({filters: groupFiltersObj}).then(function (res) {
                    $scope.groups = res.results;
                    if($scope.groupOptions.length === 0){
                        $scope.groupOptions = $scope.groups.slice();
                    }
                    $scope.getEditAccountDef();
                    $scope.$apply();
                }, function (error) {
                    $scope.editingAcountDefinition = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        
        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesOptions = res.results;
                    $scope.getCompanyGroups();
                    $scope.$apply();
                }, function (error) {
                    $scope.editingAcountDefinition = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.openAddGroupDefinitionsModal = function(){
            vm.addAccDefGroupModal = accountDefinitionService.openAddGroupDefinitionModal(vm.accDefName, $scope.existingGroups, $scope.groupOptions, $scope.currenciesOptions);

            vm.addAccDefGroupModal.result.then(function(newGroupsAdded){
                if(newGroupsAdded){
                    $scope.getEditAccountDef();
                }
            }, function(){
            });            
        };

        $scope.openAddGroupCurrenciesModal = function(groupObj){
            vm.addAccDefGroupCurrencyModal = accountDefinitionService.openAddGroupDefCurrenciesModal(vm.accDefName, groupObj.group.name, $scope.currenciesOptions, groupObj.currencies);
            
            vm.addAccDefGroupCurrencyModal.result.then(function(newCurrenciesAdded){
                if(newCurrenciesAdded){
                    $scope.getEditAccountDef();
                }
            }, function(){
            });            
        };

        $scope.trackGroupRoleChange = function(groupObj, fieldName){
            var updateGroupObj = {};
            updateGroupObj[fieldName] = groupObj[fieldName];
            if(vm.token){
                accountDefinitionService.updateAccountDefinitionGroup(vm.accDefName, groupObj.group.name, updateGroupObj, false, false)
                .then(function(res){
                    toastr.success($filter('capitalizeWord')(groupObj.group.name) + " group definition updated successfully").
                    $scope.$apply();                 
                }, function(error){
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();                    
                })
            }
        };

        $scope.showArchiveAccDefPrompt = function(accDefObj){
            accountDefinitionService.showArchiveAccountDefinitionPrompt($scope, accDefObj, $scope.handleArchiveStatusOfAccDef);
        };

        $scope.handleArchiveStatusOfAccDef = function(accDefObj, shouldBeDeleted){
            if(vm.token){
                var shouldArchive = !accDefObj.archived;
                $scope.editingAcountDefinition = true;
                accountDefinitionService.updateAccountDefinition(accDefObj.name, {archived: shouldArchive}, true, shouldBeDeleted)
                .then(function(res){
                    toastr.success("Account definition archived successfully");
                    $scope.backToDefinitions();                  
                }, function(error){
                    $scope.editingAcountDefinition = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();                    
                });
            }
        };

        $scope.showArchiveAccDefGroupPrompt = function(accDefName, groupObj){
            accountDefinitionService.showArchiveAccDefGroupDefinitionPrompt($scope, accDefName, groupObj, $scope.handleArchiveStatusOfAccDefGroup);
        };

        $scope.showRestoreAccDefGroupPrompt = function(accDefName, groupObj){
            accountDefinitionService.showRestoreAccDefGroupDefinitionPrompt($scope, accDefName, groupObj, $scope.handleArchiveStatusOfAccDefGroup);
        };

        $scope.showDeleteAccDefGroupPrompt = function(accDefName, groupObj){
            accountDefinitionService.showDeleteAccDefGroupDefinitionPrompt($scope, accDefName, groupObj, $scope.handleArchiveStatusOfAccDefGroup, $scope.deleteAccDefGroup);
        };

        $scope.handleArchiveStatusOfAccDefGroup = function(accDefName, groupObj, shouldBeDeleted){
            if(vm.token){
                var shouldArchive = !groupObj.archived;
                var toastrMessage = "Account definition group " + (shouldArchive ? "archived" : "restored") + " successfully";
                $scope.loadingAccountDefinitions = true;
                accountDefinitionService.updateAccountDefinitionGroup(accDefName, groupObj.group.name, {archived: shouldArchive}, true, shouldBeDeleted).then(function (res) {
                    if(shouldBeDeleted){
                        toastr.success("Account definition group deleted successfully");
                    } else {
                        toastr.success(toastrMessage);
                    }
                    $scope.getEditAccountDef();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountDefinitions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteAccDefGroup = function(accDefName, groupObj){ 
            if(vm.token){
                $scope.loadingAccountDefinitions = true;
                accountDefinitionService.deleteAccountDefinitionGroup(accDefName, groupObj.group.name).then(function (res) {
                    toastr.success("Account definition group deleted successfully");
                    $scope.getEditAccountDef();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountDefinitions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }                                 
        };
        
        $scope.showArchiveAccDefGroupCurrencyPrompt = function(accDefName, groupName, currencyObj){
            accountDefinitionService.showArchiveAccDefGroupCurrencyPrompt($scope, accDefName, groupName, currencyObj, $scope.handleArchiveStatusOfAccDefGroupCurrency);
        };

        $scope.showRestoreAccDefGroupCurrencyPrompt = function(accDefName, groupName, currencyObj){
            accountDefinitionService.showRestoreAccDefGroupCurrencyPrompt($scope, accDefName, groupName, currencyObj, $scope.handleArchiveStatusOfAccDefGroupCurrency);
        };

        $scope.showDeleteAccDefGroupCurrencyPrompt = function(accDefName, groupName, currencyObj){
            accountDefinitionService.showDeleteAccDefGroupCurrencyPrompt($scope, accDefName, groupName, currencyObj, $scope.handleArchiveStatusOfAccDefGroupCurrency, $scope.deleteAccDefGroupCurrency);
        };

        $scope.handleArchiveStatusOfAccDefGroupCurrency = function(accDefName, groupName, currencyObj, shouldBeDeleted){
            if(vm.token){
                var shouldArchive = !currencyObj.archived;
                var toastrMessage = "Group currency " + (shouldArchive ? "archived" : "restored") + " successfully";
                $scope.loadingAccountDefinitions = true;
                accountDefinitionService.updateAccountDefinitionGroupCurrency(accDefName, groupName, currencyObj.currency.code, {archived: shouldArchive}, true, shouldBeDeleted).then(function (res) {
                    if(shouldBeDeleted){
                        toastr.success("Group currency deleted successfully");
                    } else {
                        toastr.success(toastrMessage);
                    }
                    $scope.getEditAccountDef();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountDefinitions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteAccDefGroupCurrency = function(accDefName, groupName, currencyObj){ 
            if(vm.token){
                $scope.loadingAccountDefinitions = true;
                accountDefinitionService.deleteAccountDefinitionGroupCurrency(accDefName, groupName, currencyObj.currency.code).then(function (res) {
                    toastr.success("Group currency deleted successfully");
                    $scope.getEditAccountDef();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountDefinitions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }                                 
        };
    }
})();