(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.standaloneAccList')
        .controller('StandaloneAccountsListCtrl', StandaloneAccountsListCtrl);

    /** @ngInject */
    function StandaloneAccountsListCtrl($rootScope,$scope,localStorageManagement,typeaheadService,compareArrayOfObjects,
                          _,errorHandler,serializeFiltersService,$uibModal,Rehive,$filter, $intercom, $state, $location,
                          multiOptionsFilterService, currencyModifiers) {
 
        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Accounts | Moxey';
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedAccountsTableFilters = vm.companyIdentifier + 'standaloneAccountsTableFilters';
        vm.savedGroupColors = [];
        vm.companyColors = localStorageManagement.getValue('companyIdentifier') + "_group_colors";
        $scope.filtersObjForExport = {};
        $scope.initialLoad = true;
        $scope.accountsStateMessage = '';
        $scope.balanceFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.accountsList = [];
        $scope.accountsListData = {};
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.loadingAccounts = false;
        $scope.filtersCount = 0;
        $scope.groupOptions = [];
        $scope.insertingBalanceCurrencyFromHeader = false;
        $scope.insertingAvailableBalanceCurrencyFromHeader = false;
        $scope.availableBalanceColumn = true;
        $scope.balanceColumn = true;

        $scope.accountsPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            nameFilter: false,
            balanceFilter: false,
            referenceFilter: false,
            currencyFilter: false
        };
        $scope.applyFiltersObj = {
            nameFilter: {
                selectedNameFilter: ''
            },
            balanceFilter: {
                selectedFilterOption: 'Is equal to',
                value: null,
                gt__value: null,
                lt__value: null
            },
            referenceFilter: {
                selectedReferenceFilter: ''
            },
            currencyFilter: {
                selectedCurrencyOption: {}
            }
        };
        $scope.columnFiltersObj = {
            balanceArray: [],
            availableBalanceArray: []
        };

        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
            $scope.showingColumnFilters = false;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.clearFilters = function () {
            for(var key in $scope.filtersObj){
                $scope.filtersObj[key] = false;
            }            
            $scope.showFilters();
            $scope.getAllAccounts('applyfilter');
        };

        vm.getBalanceFilters = function () {
            var evaluatedBalanceObj = multiOptionsFilterService.evaluateGreaterLessEqualFilter(
                $scope.applyFiltersObj.balanceFilter, 'balance'
            );
            return evaluatedBalanceObj
        };

        vm.getAccountsFiltersObj = function(){
           $scope.filtersCount = 0;
            var searchObj = {};
            var filterObjects = {};

            if($scope.initialLoad) {
                $scope.initialLoad = false;
                if (localStorageManagement.getValue(vm.savedAccountsTableFilters)) {
                    filterObjects = JSON.parse(localStorageManagement.getValue(vm.savedAccountsTableFilters));

                    $scope.filtersObj = filterObjects.filtersObj;

                    $scope.applyFiltersObj = {
                        nameFilter: {
                            selectedNameFilter: filterObjects.applyFiltersObj.nameFilter.selectedNameFilter
                        },
                        referenceFilter: {
                            selectedReferenceFilter: filterObjects.applyFiltersObj.referenceFilter.selectedReferenceFilter
                        },
                        currencyFilter : {
                            selectedCurrencyOption: filterObjects.applyFiltersObj.currencyFilter ? filterObjects.applyFiltersObj.currencyFilter.selectedCurrencyOption : null
                        }
                    };
                    searchObj = filterObjects.searchObj;
                    searchObj.recon = false;

                } else {
                    searchObj = {
                        page: 1,
                        page_size: 250,
                        user__isnull: true,
                        recon: false
                    };
                }
            } else {

                if($scope.filtersObj.balanceFilter){
                    vm.balanceObj = vm.getBalanceFilters();
                } else{
                    vm.balanceObj = {
                        balance: null,
                        balance__lt: null,
                        balance__gt: null
                    };
                }

                searchObj = {
                    balance: (vm.balanceObj.balance && $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption) ? currencyModifiers.convertToCents(vm.balanceObj.balance,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                    balance__lt: (vm.balanceObj.balance__lt && $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption) ? currencyModifiers.convertToCents(vm.balanceObj.balance__lt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                    balance__gt: (vm.balanceObj.balance__gt && $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption) ? currencyModifiers.convertToCents(vm.balanceObj.balance__gt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                    page: $scope.accountsPagination.pageNo,
                    page_size: $scope.filtersObj.pageSizeFilter? $scope.accountsPagination.itemsPerPage : 25,
                    reference: $scope.filtersObj.referenceFilter ?($scope.applyFiltersObj.referenceFilter.selectedReferenceFilter ? $scope.applyFiltersObj.referenceFilter.selectedReferenceFilter : null): null,
                    name: $scope.filtersObj.nameFilter ? ($scope.applyFiltersObj.nameFilter.selectedNameFilter ? $scope.applyFiltersObj.nameFilter.selectedNameFilter : null): null,
                    currency: (($scope.filtersObj.currencyFilter || $scope.filtersObj.balanceFilter) && $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption) ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                    recon: false,
                    user__isnull: true
                };
                $scope.filtersObjForExport = searchObj;
                vm.saveAccountsTableFiltersToLocalStorage({
                    searchObj: serializeFiltersService.objectFilters(searchObj),
                    filtersObj: $scope.filtersObj,
                    applyFiltersObj: $scope.applyFiltersObj
                });

            }

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }
            return serializeFiltersService.objectFilters(searchObj);
        };

        vm.saveAccountsTableFiltersToLocalStorage = function (filterObjects) {
            localStorageManagement.setValue(vm.savedAccountsTableFilters,JSON.stringify(filterObjects));
        };

        $scope.getAllAccounts = function(applyFilter){
            $scope.accountsStateMessage = '';
            $scope.loadingAccounts = true;
            $scope.showingFilters = false;

            if(applyFilter){
                $scope.accountsPagination.pageNo = 1;
            }

            if($scope.accountsList.length > 0 ){
                $scope.accountsList.length = 0;
            }

            var accountsFiltersObj = vm.getAccountsFiltersObj();

            Rehive.admin.accounts.get({filters: accountsFiltersObj}).then(function (res) {
                $scope.accountsListData = res;
                if(res.results.length > 0){
                    vm.formatAccountsArray(res.results);
                } else {
                    $scope.accountsList = [];
                    $scope.loadingAccounts = false;
                    $scope.$apply();
                }

                if($scope.accountsList.length == 0){
                    $scope.accountsStateMessage = 'No accounts have been found';
                    $scope.loadingAccounts = false;
                    $scope.$apply();
                    return;
                }
                $scope.accountsStateMessage = '';
                $scope.$apply();
            }, function (error) {
                $scope.loadingAccounts = false;
                $scope.accountsStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        if($state.params && $state.params.accountRef){
            $scope.clearFilters();
            $scope.filtersObj.referenceFilter = true;
            $scope.applyFiltersObj.referenceFilter.selectedReferenceFilter = $state.params.accountRef;

            var filtersObj = null;
            if(localStorageManagement.getValue(vm.savedAccountsTableFilters)){
                filtersObj = JSON.parse(localStorageManagement.getValue(vm.savedAccountsTableFilters));
            }
            else {
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }

            filtersObj.searchObj.reference = $state.params.accountRef;
            filtersObj.applyFiltersObj.referenceFilter.selectedReferenceFilter = $state.params.accountRef;

            vm.saveAccountsTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });

            $scope.getAllAccounts('applyFilter');

        } else {
            $scope.getAllAccounts(null);
        }
        
        $scope.filterCurrencyOptions = [];

        vm.getFilterCurrencyOptions = function(){
            Rehive.admin.currencies.get({filters: {
                page:1,
                page_size: 250,
                archived: false
            }}).then(function (res) {
                if($scope.filterCurrencyOptions.length > 0){
                    $scope.filterCurrencyOptions.length = 0;
                }

                $scope.filterCurrencyOptions = res.results.slice();
                $scope.filterCurrencyOptions.sort(function(a, b){
                    return a.code.localeCompare(b.code);
                });
                $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = $scope.filterCurrencyOptions[0];
                $scope.filterCurrencyOptions.sort(function(a, b){
                    return a.unit.localeCompare(b.unit);
                });
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getFilterCurrencyOptions();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                        archived: false,
                        page_size: 250
                    }}).then(function (res) {
                    $scope.currenciesOptions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        vm.formatAccountsArray = function (accountsArray) {
            if(accountsArray.length === 0){
                $scope.loadingAccounts = false;
                return false;
            }

            accountsArray.forEach(function (accountObj) {
                var accountCurrencies = [];
                var currencyBalanceAndAvailableBalanceObject = {};
                if(accountObj.currencies.length > 0){
                    accountObj.currencies.forEach(function (currencyObj,index,array) {
                        currencyBalanceAndAvailableBalanceObject[currencyObj.currency.display_code + 'balance'] = $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(currencyObj.balance,currencyObj.currency.divisibility));
                        currencyBalanceAndAvailableBalanceObject[currencyObj.currency.display_code + 'availableBalance'] = $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(currencyObj.available_balance,currencyObj.currency.divisibility));
                        accountCurrencies.push(currencyObj);
                    });
                }
                                            
                var accountObject = {
                    name: accountObj.name,
                    reference: accountObj.reference,
                    primary: accountObj.primary ? 'primary': '',
                    currencies: accountCurrencies.length > 0 ? accountCurrencies.sort() : [],
                    definition: accountObj.definition
                };

                accountObject = _.extend(accountObject,currencyBalanceAndAvailableBalanceObject);
                $scope.accountsList.push(accountObject);
                $scope.$apply();
            });

            $scope.loadingAccounts = false;
        };

        $scope.goToAddAccount = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NewStandaloneAccountCtrl',
                scope: $scope,
                resolve: {
                    userEmail: function() {
                        return null;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.getAllAccounts('applyFilter');
                }
            }, function(){
            });
        };

        $scope.openEditAccountModal = function (page,size,account,currencies) {
            vm.theEditAccountModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditAccountModalCtrl',
                scope: $scope,
                resolve: {
                    account: function () {
                        return account;
                    },
                    currenciesList: function () {
                        return currencies;
                    }
                }
            });

            vm.theEditAccountModal.result.then(function(account){
                if(account){
                    $scope.getAllAccounts('applyFilter');
                }
            }, function(){
            });
        };

        $scope.goToStandaloneAccount = function(currencyCode, accountRef) {
            $location.path('/account/' + accountRef + '/account-settings/' + currencyCode + '/account-limits').search({type: 'standalone'});
        };

        $scope.goToAccountTransactions = function (accountRef){
            $state.go('transactions.history', {"accountRef": accountRef});
        };
        
        $scope.createNewTransaction = function(txType, currency, account){
            var locationSearchObj = {
                txType: txType,
                currencyCode: currency.code,
                accountUser: account
            };     
            
            $location.path('/transactions/history').search(locationSearchObj);
        };
    }
})();
