(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.reconAccList')
        .controller('ReconAccountsListCtrl', ReconAccountsListCtrl);

    /** @ngInject */
    function ReconAccountsListCtrl($rootScope,$scope,localStorageManagement,typeaheadService,compareArrayOfObjects,
                          _,errorHandler,serializeFiltersService,$uibModal,Rehive,$filter, $intercom, $state, $location,
                          multiOptionsFilterService, currencyModifiers) {
 
        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Accounts | Moxey';
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedAccountsTableFilters = vm.companyIdentifier + 'reconAccountsTableFilters';
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
            primaryFilter: false,
            referenceFilter: false,
            userFilter: false,
            groupFilter: false,
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
            primaryFilter: {
                selectedPrimaryFilter: false
            },
            referenceFilter: {
                selectedReferenceFilter: ''
            },
            userFilter: {
                selectedUserFilter: ''
            },
            groupFilter: {
                selectedUserGroup: {}
            },
            currencyFilter: {
                selectedCurrencyOption: {}
            }
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
                        primaryFilter: {
                            selectedPrimaryFilter: filterObjects.applyFiltersObj.primaryFilter.selectedPrimaryFilter
                        },
                        referenceFilter: {
                            selectedReferenceFilter: filterObjects.applyFiltersObj.referenceFilter.selectedReferenceFilter
                        },
                        userFilter: {
                            selectedUserFilter: filterObjects.applyFiltersObj.userFilter.selectedUserFilter
                        },
                        groupFilter: {
                            selectedUserGroup:
                                filterObjects.applyFiltersObj.groupFilter.selectedUserGroup ?
                                    $scope.groupOptions.find(function(group){
                                        if(group.name === filterObjects.applyFiltersObj.groupFilter.selectedUserGroup.name){
                                            return group;
                                        }
                                    }) : $scope.groupOptions[0]
                        },
                        currencyFilter : {
                            selectedCurrencyOption: filterObjects.applyFiltersObj.currencyFilter ? filterObjects.applyFiltersObj.currencyFilter.selectedCurrencyOption : null
                        }
                    };
                    searchObj = filterObjects.searchObj;
                    searchObj.recon = true;
                } else {
                    searchObj = {
                        page: 1,
                        page_size: 250,
                        recon: true
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
                    reference: $scope.filtersObj.referenceFilter ?($scope.applyFiltersObj.referenceFilter.selectedReferenceFilter ? $scope.applyFiltersObj.referenceFilter.selectedReferenceFilter : null): null,
                    name: $scope.filtersObj.nameFilter ? ($scope.applyFiltersObj.nameFilter.selectedNameFilter ? $scope.applyFiltersObj.nameFilter.selectedNameFilter : null): null,
                    primary: $scope.filtersObj.primaryFilter ? $scope.filtersObj.primaryFilter : null,
                    group: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedUserGroup.name: null,
                    currency: (($scope.filtersObj.currencyFilter || $scope.filtersObj.balanceFilter) && $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption) ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                    recon: true
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

        } else if($state.params && $state.params.email) {
            $scope.clearFilters();
            $scope.filtersObj.userFilter = true;
            $scope.applyFiltersObj.userFilter.selectedUserFilter = $state.params.email;

            var filtersObj = null;
            if(localStorageManagement.getValue(vm.savedAccountsTableFilters)){
                filtersObj = JSON.parse(localStorageManagement.getValue(vm.savedAccountsTableFilters));
            }
            else {
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }

            filtersObj.searchObj.user = $state.params.email;
            filtersObj.applyFiltersObj.userFilter.selectedUserFilter = $state.params.email;

            vm.saveAccountsTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });
            $scope.getAllAccounts('applyFilter');

        } else {
            $scope.getAllAccounts(null);
        }

        $scope.getGroups = function () {
            if(vm.token) {
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.groupOptions = res.results;
                        $scope.applyFiltersObj.groupFilter.selectedUserGroup = $scope.groupOptions[0];
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroups();
        
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
                $scope.loadingAccounts = false;
                return false;
            }

            accountsArray.forEach(function (accountObj) {
                var userGroup = '';
                var group_highlight_color = null;
                if(accountObj.user){
                    userGroup = accountObj.user.groups.length > 0 ? ((accountObj.user.groups[0].name === "service") ? "extension" : accountObj.user.groups[0].name) : '';
                    if(userGroup != "admin" && userGroup != "extension"){
                        group_highlight_color = vm.initializeGroupColor(userGroup);
                    }
                }


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
                    userObj: accountObj.user,
                    user: accountObj.user ? (
                        accountObj.user.email ? accountObj.user.email : accountObj.user.mobile ? accountObj.user.mobile : accountObj.user.id
                        ) : null,
                    group: userGroup,
                    name: accountObj.name,
                    reference: accountObj.reference,
                    primary: accountObj.primary ? 'primary': '',
                    recon: accountObj.recon,
                    currencies: accountCurrencies.length > 0 ? accountCurrencies.sort() : [],
                    group_highlight_color: group_highlight_color,
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
                controller: 'NewReconAccountModalCtrl',
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

        $scope.goToReconAccount = function(currencyCode, account) {
            if(account.user){
                $location.path('user/' + account.userObj.id + '/account/' + account.reference + '/settings/' + currencyCode + '/limits');
            } else {
                $location.path('account/' + account.reference + '/account-settings/' + currencyCode + '/account-limits').search({type: 'recon'});
            }
        };

        $scope.goToUserDetails = function(account){
            $location.path('/user/' + account.userObj.id + '/details');
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

            // if(user){
            //     var userFieldName = txType === 'transfer' ? 'userEmail' : 'userIdentity';
            //     locationSearchObj[userFieldName] = user.email || user.mobile || user.id;
            // }       
            
            $location.path('/transactions/history').search(locationSearchObj);
        };
    }
})();