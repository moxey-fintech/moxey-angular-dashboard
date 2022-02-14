(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies.currenciesList')
        .controller('AddCurrencyModalCtrl', AddCurrencyModalCtrl);

    /** @ngInject */
    function AddCurrencyModalCtrl($scope,localStorageManagement,$uibModalInstance,
                                  $window,currenciesList,errorHandler,toastr,Rehive,accountDefinitionService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');

        $scope.initialCurrencies = currenciesList.slice();
        $scope.currencyToAdd = null;
        $scope.newCurrencyParams = {};
        $scope.showCustomCurrency = false;
        $scope.showCurrencyConfirmPanel = false;
        $scope.loadingCurrencies = true;
        $scope.currencyAdditionStep = 1;
        $scope.accountDefinitionsList = [];
        $scope.selectedDefinitionCount = 0;
        $scope.goBackToCurrencySelectionView = function () {
            $scope.showCurrencyConfirmPanel = false;
        };

        vm.getCompanyAccountDefinitions = function(){            
            var filtersObj = {
                page_size: 250,
                orderby: 'name',
                archived: false
            };
            
            if(vm.token){
                accountDefinitionService.getAccountDefinition({filters: filtersObj}).then(function (res) {
                    $scope.accountDefinitionsList = res.results;
                    if($scope.accountDefinitionsList.length > 0){
                        var accDefWithGroups = [];
                        $scope.accountDefinitionsList.forEach(function(accDefObj){
                            if(accDefObj.groups.length > 0){
                                var validGroups = [];
                                accDefObj.groups.forEach(function(groupObj){
                                    if(!groupObj.archived){
                                        groupObj.selected = true;
                                        validGroups.push(groupObj);
                                    }
                                });
                                accDefObj.groups = validGroups;
                                if(accDefObj.groups.length > 0){
                                    accDefObj.selected = true;
                                    accDefWithGroups.push(accDefObj);
                                }
                            }
                        });
                        $scope.accountDefinitionsList = accDefWithGroups.sort(function(a, b){
                            return a.label < b.label ? -1 : 1;
                        });
                        $scope.selectedDefinitionCount = $scope.accountDefinitionsList.length;
                    }
                    $scope.loadingCurrencies = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCurrencies = function(){
            $scope.loadingCurrencies = true;
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    res.results.forEach(function (currency) {
                        var index = $scope.initialCurrencies.findIndex(function (element) {
                            return element.code == currency.code;
                        });
                        if(index >=0){
                            $scope.initialCurrencies.splice(index,1);
                        }
                    });
                    $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                    vm.getCompanyAccountDefinitions();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCurrencies();

        $scope.trackAccountDefinitionSelection = function(accDefObj, checkType){
            var idx = $scope.accountDefinitionsList.findIndex(function(accDef){
                return accDef.name === accDefObj.name;
            });
            if(idx > -1){
                if(checkType == 'account'){
                    $scope.accountDefinitionsList[idx].groups.forEach(function(groupObj){
                        groupObj.selected = $scope.accountDefinitionsList[idx].selected;
                    });
                } else {
                    var isSelected = false;
                    $scope.accountDefinitionsList[idx].groups.forEach(function(groupObj){
                        if(groupObj.selected){
                            isSelected = true;
                            return true;
                        }
                    });
                    $scope.accountDefinitionsList[idx].selected = isSelected;
                }
                $scope.selectedDefinitionCount += $scope.accountDefinitionsList[idx].selected ? (checkType == 'account' ? 1 : 0) : -1;
            }
        };

        $scope.addCompanyCurrency = function () {
            $scope.loadingCurrencies = true;
            var newCurrency = $scope.showCustomCurrency ? $scope.newCurrencyParams : $scope.currencyToAdd;
            newCurrency.archived = false;
            Rehive.admin.currencies.create(newCurrency).then(function (res) {
                if($scope.selectedDefinitionCount > 0){
                    var currencyToBeAddedTo = [];
                    $scope.accountDefinitionsList.forEach(function(accDef){
                        if(accDef.selected) {
                            accDef.groups.forEach(function(groupObj){
                                if(groupObj.selected) {
                                    currencyToBeAddedTo.push({
                                        account_definition: accDef.name, 
                                        group: groupObj.group.name
                                    });
                                }
                            });
                        }
                    });
                    var arrLen = currencyToBeAddedTo.length; 
                    currencyToBeAddedTo.forEach(function(item, idx){
                        $scope.addCurrencyToAccountDefinitions(item.account_definition, item.group, newCurrency, idx === arrLen - 1);
                    });
                } else {
                    $scope.getCompanyCurrencies();
                }
                $scope.$apply();
            }, function (error) {
                $scope.loadingCurrencies = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.addCurrencyToAccountDefinitions = function(accDefName, groupName, newCurrency, isLast){            
            if(vm.token){
                accountDefinitionService.createAccountDefinitionGroupCurrency(accDefName, groupName, {currency: newCurrency.code})
                .then(function (res) {
                    if(isLast){
                        $scope.getCompanyCurrencies();
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleCustomCurrencyView = function () {
            $scope.showCustomCurrency = !$scope.showCustomCurrency;
        };

        $scope.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.loadingCurrencies = false;
                    $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                    toastr.success(($scope.showCustomCurrency ? 'Custom currency ' : 'Currency ') + 'has been added successfully');
                    $uibModalInstance.close(true);
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
    }
})();
