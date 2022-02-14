(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .controller('UserAccountsOnlyCtrl', UserAccountsOnlyCtrl);

    /** @ngInject */
    function UserAccountsOnlyCtrl($scope,Rehive,$stateParams,$rootScope,$uibModal,accountService,toastr,
                                  localStorageManagement,errorHandler,$location,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.shouldBeBlue = 'Users';
        vm.uuid = $stateParams.uuid;
        vm.reference = '';
        $scope.newAccountCurrencies = {list: []};
        vm.accountUrlParams = $location.search();
        $scope.loadingUserAccounts = true;
        $scope.optionsCode = '';
        $scope.optionsReference = '';
        $scope.accountsFiltersCount = 0;
        $scope.showingAccountsFilters = false;
        $scope.accounts = [];
        $scope.activeUserAccounts = [];
        $scope.archivedUserAccounts = [];
        $scope.userAccountView = 'active';

        $scope.toggleUserAccountView = function(view) {
            $scope.userAccountView = view;
        };
        
        $scope.filtersObj = {
            accountNameFilter: false,
            accountReferenceFilter: false
        };
        $scope.applyFiltersObj = {
            accountNameFilter: {
                selectedAccountName: ''
            },
            accountReferenceFilter: {
                selectedAccountReference: ''
            }
        };

        $scope.showAccountsFilters = function () {
            $scope.showingAccountsFilters = !$scope.showingAccountsFilters;
        };

        $scope.closeOptionsBox = function () {
            $scope.optionsCode = '';
            $scope.optionsReference = '';
        };

        $scope.showCurrenciesOptions = function (code,reference) {
            $scope.optionsCode = code;
            $scope.optionsReference = reference;
        };

        vm.getUsersAccountsFiltersObj = function(){
            $scope.accountsFiltersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.accountsFiltersCount = $scope.accountsFiltersCount + 1;
                    }
                }
            }

            var searchObj = {
                page_size: 250,
                user: vm.uuid,
                reference: $scope.filtersObj.accountReferenceFilter ? ($scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference ?  $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference : null): null,
                name: $scope.filtersObj.accountNameFilter ?($scope.applyFiltersObj.accountNameFilter.selectedAccountName ?  $scope.applyFiltersObj.accountNameFilter.selectedAccountName : null): null
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getUserAccounts = function(){
            if(vm.token) {
                $scope.loadingUserAccounts = true;
                $scope.showingAccountsFilters = false;

                if($scope.accounts.length > 0 ){
                    $scope.accounts.length = 0;
                }

                var usersAccountsFiltersObj = vm.getUsersAccountsFiltersObj();
                $scope.accounts = [];
                $scope.activeUserAccounts = [];
                $scope.archivedUserAccounts = [];

                Rehive.admin.accounts.get({filters: usersAccountsFiltersObj}).then(function (res) {
                    $scope.loadingUserAccounts = false;
                    if(res.results.length > 0 ){
                        $scope.accounts = res.results;
                        $scope.accounts.forEach(function(account){
                            var activeCurrencies = [];
                            var archivedCurrencies = [];
                            account.currencies.forEach(function(accCurrency){
                                accCurrency.archived ? archivedCurrencies.push(accCurrency) : activeCurrencies.push(accCurrency);
                            });
                            account.activeCurrencies = activeCurrencies.sort(function(item1, item2){return item1.currency.code.localeCompare(item2.currency.code)});
                            account.archivedCurrencies = archivedCurrencies.sort(function(item1, item2){return item1.currency.code.localeCompare(item2.currency.code)});

                            account.archived ? $scope.archivedUserAccounts.push(account): $scope.activeUserAccounts.push(account);
                        });

                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        if(Object.keys(vm.accountUrlParams).length == 0){
            $scope.getUserAccounts();
        }

        $scope.goToView = function(txType,currency,user,account){
            $location.path('/transactions/history').search({txType: txType,currencyCode: currency.code,userIdentity: user.email || user.mobile || user.id,accountUser: account});
        };

        $scope.goToSettings = function(currencyCode, account){
            $location.path('user/' + vm.uuid + '/account/'+account+'/settings/'+ currencyCode);
        };

        $scope.clearAccountsFilters = function () {
            $scope.filtersObj = {
                accountNameFilter: false,
                accountReferenceFilter: false
            };
            $scope.showAccountsFilters();
            $scope.getUserAccounts('applyfilter');
        };

        $scope.openAddAccountModal = function () {
            vm.theAccountModal = accountService.openAddUserAccountModal($scope);

            vm.theAccountModal.result.then(function(account){
                if(account){
                    $scope.getUserAccounts();
                }
            }, function(){
            });
        };

        if(vm.accountUrlParams.accountAction == 'newAccount'){
            $scope.openAddAccountModal();
            $location.search('accountAction',null);
        }

        if(vm.accountUrlParams.searchAccount){
            $scope.filtersObj.accountReferenceFilter = true;
            $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference = vm.accountUrlParams.searchAccount;
            $scope.getUserAccounts();
            $location.search('searchAccount',null);
        }

        $scope.openEditAccountModal = function (account,currencies) {
            vm.theEditAccountModal = accountService.openEditUserAccountModal($scope, account, currencies);

            vm.theEditAccountModal.result.then(function(account){
                if(account){
                    $scope.getUserAccounts();
                }
            }, function(){
            });
        };

        $scope.showArchiveAccountPrompt = function(accountObj){
            accountService.showArchiveAccountPrompt($scope, accountObj, $scope.handleUserAccountArchive);
        };

        $scope.showRestoreAccountPrompt = function(accountObj){
            accountService.showRestoreAccountPrompt($scope, accountObj, $scope.handleUserAccountArchive);
        };

        $scope.handleUserAccountArchive = function(accountObj, shouldBeDeleted){
            if(vm.token){
                var shouldArchive = !accountObj.archived;
                var toastrMessage = "Account has been " + (shouldArchive ? "archived" : "restored") + " successfully";
                $scope.loadingUserAccounts = true;
                accountService.updateAccount(accountObj, {archived: shouldArchive}, shouldArchive, shouldBeDeleted)
                .then(function(res){
                    if(shouldBeDeleted){
                        toastr.success("Account has been deleted successfully");
                    }  else {
                        toastr.success(toastrMessage);
                    }
                    $scope.getUserAccounts();                  
                }, function(error){
                    $scope.loadingUserAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();                    
                });
            }
        };

        $scope.showArchiveAccountCurrencyPrompt = function(accountObj, accCurrencyObj){
            accountService.showArchiveAccountCurrencyPrompt($scope, accountObj, accCurrencyObj, $scope.handleUserAccountCurrencyArchive);
        };

        $scope.showRestoreAccountCurrencyPrompt = function(accountObj, accCurrencyObj){
            accountService.showRestoreAccountCurrencyPrompt($scope, accountObj, accCurrencyObj, $scope.handleUserAccountCurrencyArchive);
        };

        $scope.handleUserAccountCurrencyArchive = function(accountObj, accCurrencyObj, shouldBeDeleted){
            if(vm.token){
                var shouldArchive = !accCurrencyObj.archived;
                var toastrMessage = "Account currency has been " + (shouldArchive ? "archived" : "restored") + " successfully";
                $scope.loadingUserAccounts = true;
                accountService.updateAccountCurrency(accountObj, accCurrencyObj, {archived: shouldArchive}, shouldArchive, shouldBeDeleted)
                .then(function(res){
                    if(shouldBeDeleted){
                        toastr.success("Account currency has been deleted successfully");
                    }  else {
                        toastr.success(toastrMessage);
                    }
                    $scope.getUserAccounts();                  
                }, function(error){
                    $scope.loadingUserAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();                    
                });
            }
        };

        $scope.goToUserTransactions = function (account) {
            $location.path('user/' + vm.uuid + '/transactions').search({filterByAccount: account.reference});
        };

        $scope.goToFilteredUserTransactions = function(currency, account){
            $location.path('user/' + vm.uuid + '/transactions').search({filterByAccount: account, filterByCurrency: currency});
        };
    }
})();