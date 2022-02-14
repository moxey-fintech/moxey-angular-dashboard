(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.definitions.list')
        .controller('AccountDefinitionsListCtrl', AccountDefinitionsListCtrl);

    /** @ngInject */
    function excludeSelectedGroups() {
        return function(list, ngModel, selectList) {
            var listLength = selectList.length;
            var output = [];

            angular.forEach(list, function(listItem){
                var enabled = true;
                for (var index = 0; index < listLength; ++index) {
                    if(selectList[index].group.name !== ngModel.name && selectList[index].group.name === listItem.name){
                        enabled = false;
                        break;
                    }
                }
                if(enabled){
                    output.push(listItem);
                }
            });

            return output;
        };
    }
    
    function AccountDefinitionsListCtrl($rootScope,$scope,localStorageManagement,typeaheadService,toastr,
                          _,errorHandler,Rehive, $intercom, $state,accountDefinitionService,$filter) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Accounts | Moxey';
        $scope.initialLoad = true;
        $scope.loadingAccountDefinitions = true;
        $scope.accountDefinitionsCount = 0;
        $scope.accountDefinitionsList = [];
        $scope.activeAccountDefinitions = [];
        $scope.archivedAccountDefinitions = [];
        $scope.accountDefinitionView = 'active';
        $scope.filtersCount = 0;
        $scope.groupOptions = [];

        $scope.accountsDefPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.toggleAccountDefinitionView = function(displayList){
            $scope.accountDefinitionView = displayList;
        };

        $scope.getAllAccountDefinitions = function(){
            
            var accountsFiltersObj = {
                page: $scope.accountsDefPagination.pageNo,
                page_size: $scope.accountsDefPagination.itemsPerPage ? $scope.accountsDefPagination.itemsPerPage : 25,
                orderby: 'name'
            };
            
            if(vm.token){
                $scope.loadingAccountDefinitions = true;
                accountDefinitionService.getAccountDefinition({filters: accountsFiltersObj}).then(function (res) {
                    $scope.accountDefinitionsListData = res;
                    $scope.accountDefinitionsList = res.results;
                    $scope.activeAccountDefinitions = [];
                    $scope.archivedAccountDefinitions = [];

                    $scope.accountDefinitionsList.forEach(function(accDef){
                        accDef.groups.forEach(function(groupObj){
                            var activeCurrencies = [];
                            var archivedCurrencies = [];
                            groupObj.currencies.forEach(function(groupCurrency){
                                groupCurrency.archived ? archivedCurrencies.push(groupCurrency) : activeCurrencies.push(groupCurrency);
                            });
                            activeCurrencies = activeCurrencies.sort(function(item1, item2){return item1.currency.code > item2.currency.code});
                            archivedCurrencies = archivedCurrencies.sort(function(item1, item2){return item1.currency.code > item2.currency.code});
                            groupObj.currencies = activeCurrencies.concat(archivedCurrencies);
                        });

                        accDef.archived ? $scope.archivedAccountDefinitions.push(accDef) : $scope.activeAccountDefinitions.push(accDef);
                    });
                    $scope.loadingAccountDefinitions = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountDefinitions = false;
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
                    $scope.getAllAccountDefinitions();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountDefinitions = false;
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
                    $scope.loadingAccountDefinitions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.goToAccountDefinitionEdit = function(accountDefinition){
            $state.go('accounts.definitions.edit', {accDefName: accountDefinition.name}, {reload: true});
        };

        $scope.trackGroupRoleChange = function(accDefName, groupObj, fieldName){
            var updateGroupObj = {};
            updateGroupObj[fieldName] = groupObj[fieldName];
            if(vm.token){
                accountDefinitionService.updateAccountDefinitionGroup(accDefName, groupObj.group.name, updateGroupObj, false, false)
                .then(function(res){
                    toastr.success($filter('capitalizeWord')(groupObj.group.name) + " group definition updated successfully");
                    $scope.$apply();                 
                }, function(error){
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();                    
                })
            }
        };

        $scope.openAddAccountDefinitionModal = function (page, size) {
            vm.addAccDefModal = accountDefinitionService.openAddAccountDefinitionModal();

            vm.addAccDefModal.result.then(function(accountDefinition){
                if(accountDefinition){
                    $scope.getAllAccountDefinitions();
                }
            }, function(){
            });

        };

        $scope.openEditAccountDefinitionsModal = function (accDefinitionObj) {
            vm.editAccDefModal = accountDefinitionService.openEditAccountDefinitionModal(accDefinitionObj);

            vm.editAccDefModal.result.then(function(accountDefinition){
                if(accountDefinition){
                    $scope.getAllAccountDefinitions();
                }
            }, function(){
            });

        }; 

        $scope.openAddGroupDefinitionsModal = function(accDefObj){
            var existingGroups = [];
            accDefObj.groups.forEach(function(groupObj){
                existingGroups.push(groupObj.group.name);
            });
            vm.addAccDefGroupModal = accountDefinitionService.openAddGroupDefinitionModal(accDefObj.name, existingGroups, $scope.groupOptions, $scope.currenciesOptions);

            vm.addAccDefGroupModal.result.then(function(newGroupsAdded){
                if(newGroupsAdded){
                    $scope.getAllAccountDefinitions();
                }
            }, function(){
            });            
        };

        //#region Acc def controls
        $scope.showArchiveAccDefPrompt = function(accDefObj){
            accountDefinitionService.showArchiveAccountDefinitionPrompt($scope, accDefObj, $scope.handleArchiveStatusOfAccDef);
        };

        $scope.showRestoreAccDefPrompt = function(accDefObj){
            accountDefinitionService.showRestoreAccountDefinitionPrompt($scope, accDefObj, $scope.handleArchiveStatusOfAccDef);
        };

        $scope.showDeleteAccDefPrompt = function(accDefObj){
            accountDefinitionService.showDeleteAccountDefinitionPrompt($scope, accDefObj, $scope.handleArchiveStatusOfAccDef, $scope.deleteAccDef);
        };

        $scope.handleArchiveStatusOfAccDef = function(accDefObj, shouldBeDeleted){
            if(vm.token){
                var shouldArchive = !accDefObj.archived;
                var toastrMessage = "Account definition " + (shouldArchive ? "archived" : "restored") + " successfully";
                $scope.loadingAccountDefinitions = true;
                accountDefinitionService.updateAccountDefinition(accDefObj.name, {archived: shouldArchive}, true, shouldBeDeleted)
                .then(function(res){
                    if(shouldBeDeleted){
                        toastr.success("Account definition deleted successfully");
                    }  else {
                        toastr.success(toastrMessage);
                    }
                    $scope.getAllAccountDefinitions();                  
                }, function(error){
                    $scope.loadingAccountDefinitions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();                    
                });
            }
        };

        $scope.deleteAccDef = function(accDefObj){  
            if(vm.token){
                $scope.loadingAccountDefinitions = true;
                accountDefinitionService.deleteAccountDefinition(accDefObj.name)
                .then(function (res) {
                    toastr.success("Account definition deleted successfully");
                    $scope.getAllAccountDefinitions();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountDefinitions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }                     
        };

        //#endregion

        //#region  Acc def group controls
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
                    $scope.getAllAccountDefinitions();
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
                    $scope.getAllAccountDefinitions();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountDefinitions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }                                 
        };

        //#endregion
    }
})();
