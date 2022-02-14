(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.currencies')
        .controller('AccountCurrenciesCtrl', AccountCurrenciesCtrl);

    /** @ngInject */
    function AccountCurrenciesCtrl($rootScope,$scope,localStorageManagement,typeaheadService,compareArrayOfObjects,
                          _,errorHandler,serializeFiltersService,$uibModal,Rehive,$filter, $intercom, $state,
                          multiOptionsFilterService, currencyModifiers) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Accounts | Moxey';
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedAccountCurrenciesTableFilters = vm.companyIdentifier + 'accountCurrenciesTableFilters';
        vm.savedGroupColors = [];
        vm.companyColors = vm.companyIdentifier + "_group_colors";
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.filtersObjForExport = {};
        $scope.initialLoad = true;
        $scope.accountsCurrenciesStateMessage = '';
        $scope.balanceFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.accountFilterOptions = ['Name', 'Name contains', 'Reference'];
        $scope.accountCurrenciesList = [];
        $scope.accountCurrenciesListData = {};
        $scope.showingAccountCurrencyFilters = false;
        $scope.loadingAccountCurrencies = false;
        $scope.filtersCount = 0;
        $scope.groupOptions = [];
        $scope.showingHistoricalBalance = false;
        $scope.dateObj = {};
        $scope.dateObj.format = $scope.companyDateFormatString;
        $scope.popup1 = {};
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.accountsPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            userFilter: false,
            currencyFilter: false,
            activeFilter: false,
            balanceFilter: false,
            accountFilter: false,
            historicalFilter: false
        };

        $scope.applyFiltersObj = {
            userFilter: {
                selectedUserFilter: ''
            },
            currencyFilter: {
                selectedCurrencyOption: ''
            },
            balanceFilter: {
                selectedFilterOption: 'Is equal to',
                value: null,
                gt__value: null,
                lt__value: null
            },
            accountFilter: {
                selectedAccountFilterOption: 'Name',
                selectedAccountFilter: ''
            },
            historicalFilter: {
                selectedDateOption: 'Is equal to',
                dateEqualTo: ''
            }
        };

        $scope.showAccountCurrencyFilters = function () {
            $scope.showingAccountCurrencyFilters = !$scope.showingAccountCurrencyFilters;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                userFilter: false,
                currencyFilter: false,
                activeFilter: false,
                balanceFilter: false,
                accountFilter: false,
                historicalFilter: false
            };
            $scope.showingHistoricalBalance = false;
            $scope.showAccountCurrencyFilters();
            $scope.getAllAccountCurrencies();
        };

        vm.getBalanceFilters = function () {
            var evaluatedBalanceObj = multiOptionsFilterService.evaluateGreaterLessEqualFilter(
                $scope.applyFiltersObj.balanceFilter, 'balance'
            );
            return evaluatedBalanceObj;
        };

        vm.getDateFilters = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersObj.historicalFilter);

            return {
                created__lt: evaluatedDateObj.date__lt,
                created__gt: evaluatedDateObj.date__gt
            };
        };

        vm.getHistoricTimestamp = function() {
            var dateObj = vm.getDateFilters();
            
            return Date.parse(dateObj.created__gt +'T00:00:00');
        };

        vm.getAccountsFiltersObj = function(){
           $scope.filtersCount = 0;
            var searchObj = {};
            var filterObjects = {};

            if($scope.initialLoad) {
                $scope.initialLoad = false;
                if (localStorageManagement.getValue(vm.savedAccountCurrenciesTableFilters)) {
                    filterObjects = JSON.parse(localStorageManagement.getValue(vm.savedAccountCurrenciesTableFilters));

                    $scope.filtersObj = filterObjects.filtersObj;

                    $scope.applyFiltersObj = {
                        userFilter: {
                            selectedUserFilter: filterObjects.applyFiltersObj.userFilter ? filterObjects.applyFiltersObj.userFilter.selectedUserFilter : null
                        },
                        currencyFilter: {
                            selectedCurrencyOption: filterObjects.applyFiltersObj.currencyFilter ? filterObjects.applyFiltersObj.currencyFilter.selectedCurrencyOption : null
                        },
                        accountFilter: {
                            selectedAccountFilterOption: filterObjects.applyFiltersObj.accountFilter ? filterObjects.applyFiltersObj.accountFilter.selectedAccountFilterOption : 'Name',
                            selectedAccountFilter: filterObjects.applyFiltersObj.accountFilter ? filterObjects.applyFiltersObj.accountFilter.selectedAccountFilter : null
                        },
                        historicalFilter: {
                            selectedDateOption: 'Is equal to',
                            dateEqualTo: filterObjects.applyFiltersObj.historicalFilter ? moment(filterObjects.applyFiltersObj.historicalFilter.dateEqualTo).toDate() : ''
                        }
                    };
                    searchObj = filterObjects.searchObj;
                    $scope.filtersObjForExport = searchObj;

                } else {
                    searchObj = {
                        page: 1,
                        page_size: $scope.filtersObj.pageSizeFilter? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25
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
                    user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserFilter ?  $scope.applyFiltersObj.userFilter.selectedUserFilter : null): null,
                    account: $scope.filtersObj.accountFilter ?($scope.applyFiltersObj.accountFilter.selectedAccountFilterOption === 'Reference' ? $scope.applyFiltersObj.accountFilter.selectedAccountFilter : null): null,
                    account__name: $scope.filtersObj.accountFilter ? ($scope.applyFiltersObj.accountFilter.selectedAccountFilterOption === 'Name' ? $scope.applyFiltersObj.accountFilter.selectedAccountFilter : null): null,
                    account__name__contains: $scope.filtersObj.accountFilter ? ($scope.applyFiltersObj.accountFilter.selectedAccountFilterOption === 'Name contains' ? $scope.applyFiltersObj.accountFilter.selectedAccountFilter : null): null,
                    active: $scope.filtersObj.activeFilter ? $scope.filtersObj.activeFilter : null,
                    currency: (($scope.filtersObj.currencyFilter || $scope.filtersObj.balanceFilter) && $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption) ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                    historic: $scope.filtersObj.historicalFilter ? vm.getHistoricTimestamp() : null
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

            if($scope.filtersObj.historicalFilter){
                $scope.showingHistoricalBalance = true;
            }
            return serializeFiltersService.objectFilters(searchObj);
        };

        vm.saveAccountsTableFiltersToLocalStorage = function (filterObjects) {
            localStorageManagement.setValue(vm.savedAccountCurrenciesTableFilters,JSON.stringify(filterObjects));
        };

        $scope.getAllAccountCurrencies = function(applyFilter){
            $scope.accountsCurrenciesStateMessage = '';
            $scope.loadingAccountCurrencies = true;
            $scope.showingAccountCurrencyFilters = false;

            if(applyFilter){
                $scope.accountsPagination.pageNo = 1;                
            }

            if($scope.accountCurrenciesList.length > 0 ){
                $scope.accountCurrenciesList.length = 0;
            }

            var accountsFiltersObj = vm.getAccountsFiltersObj();

            Rehive.admin.account.currencies.get({filters: accountsFiltersObj}).then(function (res) {
                $scope.accountCurrenciesListData = res;
                if(res.results.length > 0){
                    vm.formatAccountsArray(res.results);
                } else {
                    $scope.accountCurrenciesList = [];
                    $scope.loadingAccountCurrencies = false;
                    $scope.$apply();
                }

                if($scope.accountCurrenciesList.length == 0){
                    $scope.accountsCurrenciesStateMessage = 'No accounts currencies have been found';
                    $scope.loadingAccountCurrencies = false;
                    $scope.$apply();
                    return;
                }
                $scope.accountsCurrenciesStateMessage = '';
                $scope.$apply();
            }, function (error) {
                $scope.loadingAccountCurrencies = false;
                $scope.accountsCurrenciesStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        $scope.getAllAccountCurrencies(null);
        
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
                // $scope.applyFiltersObj.unitFilter.selectedCurrencyOption = $scope.filterCurrencyOptions[0];
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

        vm.initializeGroupColor = function(userGroupName){
            if(userGroupName === null || userGroupName === ''){return "#022b36";}
            var idx = -1;
            vm.savedGroupColors = localStorageManagement.getValue(vm.companyColors) ? JSON.parse(localStorageManagement.getValue(vm.companyColors)) : [];
            vm.savedGroupColors.forEach(function(color){
                if(color.group == userGroupName){
                    idx = vm.savedGroupColors.indexOf(color);
                    return;
                }
            });
            return (idx === -1) ? "#022b36" : vm.savedGroupColors[idx].color;
        };

        vm.formatAccountsArray = function (accountsArray) {

            if(accountsArray.length === 0){
                $scope.loadingAccountCurrencies = false;
                return false;
            }

            accountsArray.forEach(function (accountCurrencyObj) {
                var userGroup = null;
                var group_highlight_color = null;
                if(accountCurrencyObj.user){
                    userGroup = accountCurrencyObj.user.groups.length > 0 ? ((accountCurrencyObj.user.groups[0].name === "service") ? "extension" : accountCurrencyObj.user.groups[0].name) : '';

                    if(userGroup != "admin" && userGroup != "extension"){
                        group_highlight_color = vm.initializeGroupColor(userGroup);
                    }
                }

                $scope.accountCurrenciesList.push({
                    user: accountCurrencyObj.user ? (
                        accountCurrencyObj.user.email ? accountCurrencyObj.user.email : accountCurrencyObj.user.mobile ? 
                        accountCurrencyObj.user.mobile : accountCurrencyObj.user.id
                        ) : null,
                    group: userGroup,
                    account: accountCurrencyObj.account,
                    currency: accountCurrencyObj.currency,
                    balance: currencyModifiers.convertFromCents(accountCurrencyObj.balance, accountCurrencyObj.currency.divisibility),
                    available_balance: currencyModifiers.convertFromCents(accountCurrencyObj.available_balance, accountCurrencyObj.currency.divisibility),
                    updated: accountCurrencyObj.updated ? $filter("date")(accountCurrencyObj.updated,'mediumDate') + ' ' + $filter("date")(accountCurrencyObj.updated,'shortTime') : '',
                    group_highlight_color: group_highlight_color
                });
                $scope.$apply();
            });

            $scope.loadingAccountCurrencies = false;
        };

        vm.getVisibleColumnsArray = function(){
            return [
                "account",
                "active",
                "available_balance",
                "balance",
                "created",
                "currency",
                "group",
                "updated",
                "user"
            ];
        };

        $scope.openExportAccountCurrenciesModal = function (page, size) {
            vm.theExportModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ExportAccountCurrenciesModalCtrl',
                resolve: {
                    filtersObjForExport: function () {
                        return $scope.filtersObjForExport;
                    },
                    visibleColumnsArray: function () {
                        return vm.getVisibleColumnsArray();
                    }
                }
            });

            vm.theExportModal.result.then(function(accountCurrency){
                if(accountCurrency){
                    $scope.getAllAccountCurrencies();
                }
            }, function(){
            });

        };
    }
})();
