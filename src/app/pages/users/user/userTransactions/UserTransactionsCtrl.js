(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.transactions')
        .controller('UserTransactionsCtrl', UserTransactionsCtrl);

    /** @ngInject */
    function UserTransactionsCtrl($scope,Rehive,localStorageManagement,$uibModal,sharedResources,toastr,currencyModifiers,_,multiOptionsFilterService,currenciesList,
                                  errorHandler,$state,$location,$window,typeaheadService,$filter,serializeFiltersService,$rootScope,$stateParams) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.shouldBeBlue = 'Users';
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');;
        vm.uuid = $stateParams.uuid;
        vm.userTransactionsFilterParams = $location.search();
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.savedUserTransactionTableColumns = vm.companyIdentifier + 'userTransactionsTable';
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.accountFilterOptions = [];
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.referenceFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.groupFilterOptions = ['Group name','In a group'];
        $scope.filtersCount = 0;
        $scope.filtersObj = {
            dateFilter: false,
            amountFilter: false,
            statusFilter: false,
            transactionTypeFilter: false,
            transactionSubtypeFilter: false,
            transactionIdFilter: false,
            destinationIdFilter: false,
            sourceIdFilter: false,
            referenceFilter: false,
            accountFilter: false,
            currencyFilter: false,
            pageSizeFilter: false,
            orderByFilter: false
        };
        $scope.applyFiltersObj = {
            dateFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            amountFilter: {
                selectedAmountOption: 'Is equal to',
                amount: null,
                amount__lt: null,
                amount__gt: null
            },
            statusFilter: {
                selectedStatusOption: 'Pending'
            },
            transactionTypeFilter: {
                selectedTransactionTypeOption: 'Credit'
            },
            transactionSubtypeFilter: {
                selectedTransactionSubtypeOption: ''
            },
            transactionIdFilter: {
                selectedTransactionIdOption: null
            },
            referenceFilter: {
                selectedReferenceOption: 'Is equal to',
                reference: null,
                reference__lt: null,
                reference__gt: null
            },
            accountFilter: {
                selectedAccount: {
                    reference: null
                }
            },
            currencyFilter:{
                selectedCurrencyOption: {}
            },
            orderByFilter: {
                selectedOrderByOption: 'Latest'
            }
        };
        $scope.pagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };
        $scope.transactions = [];
        $scope.transactionsStateMessage = '';
        $scope.transactionsData = {};
        $scope.loadingTransactions = false;
        $scope.typeOptions = ['Credit','Debit']; //Transfer
        $scope.statusOptions = ['Pending','Complete','Failed','Deleted'];
        $scope.currencyOptions = [];
        $scope.orderByOptions = ['Latest','Largest','Smallest'];

        if(localStorageManagement.getValue(vm.savedUserTransactionTableColumns)){
            var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedUserTransactionTableColumns));
            headerColumns.forEach(function (col) {
                if(col.colName == 'Identifier'){
                    col.colName = 'User id';
                    col.fieldName = 'userId';
                }
            });

            localStorageManagement.setValue(vm.savedUserTransactionTableColumns,JSON.stringify(headerColumns));
        }

        $scope.headerColumns = localStorageManagement.getValue(vm.savedUserTransactionTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedUserTransactionTableColumns)) : [
            {colName: 'User',fieldName: 'user',visible: true},
            {colName: 'Recipient',fieldName: 'recipient',visible: true},
            {colName: 'Type',fieldName: 'tx_type',visible: true},
            {colName: 'Subtype',fieldName: 'subtype',visible: true},
            {colName: 'Currency',fieldName: 'currencyCode',visible: true},
            {colName: 'Amount',fieldName: 'amount',visible: true},
            {colName: 'Fee',fieldName: 'fee',visible: true},
            {colName: 'Status',fieldName: 'status',visible: true},
            {colName: 'Account',fieldName: 'account',visible: true},
            {colName: 'Id',fieldName: 'id',visible: true},
            {colName: 'Date',fieldName: 'createdDate',visible: true},
            {colName: 'Total amount',fieldName: 'totalAmount',visible: false},
            {colName: 'Balance',fieldName: 'balance',visible: false},
            {colName: 'Username',fieldName: 'username',visible: false},
            {colName: 'User id',fieldName: 'userId',visible: false},
            {colName: 'Updated',fieldName: 'updatedDate',visible: false},
            {colName: 'Mobile',fieldName: 'mobile',visible: false},
            {colName: 'Destination tx id',fieldName: 'destination_tx_id',visible: false},
            {colName: 'Source tx id',fieldName: 'source_tx_id',visible: false},
            {colName: 'Label',fieldName: 'label',visible: false},
            {colName: 'Reference',fieldName: 'reference',visible: false},
            {colName: 'Note',fieldName: 'note',visible: false}
        ];

        $scope.selectAllColumns = function () {
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedUserTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.toggleColumnVisibility = function () {
            localStorageManagement.setValue(vm.savedUserTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.restoreColDefaults = function () {
            var defaultVisibleHeader = ['User','Type','Subtype','Currency',
                'Amount','Fee','Account','Status','Date','Id'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedUserTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        vm.getUserAccounts = function(){
            if(vm.token) {
                Rehive.admin.accounts.get({filters: {user: vm.uuid}}).then(function (res) {
                    if(res.results.length > 0 ){
                        $scope.accountFilterOptions = res.results;
                        vm.checkWhetherAccountsFilterIsApplied($scope.accountFilterOptions);
                        $scope.$apply();
                    } else {
                        $scope.accountFilterOptions = [];
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserAccounts();

        vm.checkWhetherAccountsFilterIsApplied = function (accountsListsOptions) {
            if(vm.userTransactionsFilterParams.filterByAccount){
                $scope.filtersObj.accountFilter = true;
                accountsListsOptions.forEach(function (account) {
                    if(account.reference == vm.userTransactionsFilterParams.filterByAccount){
                        $scope.applyFiltersObj.accountFilter.selectedAccount = account;
                    }
                });
                if(vm.userTransactionsFilterParams.filterByCurrency){
                    $scope.filtersObj.currencyFilter = true;
                    vm.currenciesList.forEach(function (element) {
                        if(element.code && element.code == vm.userTransactionsFilterParams.filterByCurrency){
                            $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = element;
                        }
                    });
                    $scope.getLatestTransactions('applyFilter');
                }
                else {
                    $scope.getLatestTransactions();
                    $location.search('filterByAccount',null);
                    $location.replace();
                }
            } else {
                $scope.applyFiltersObj.accountFilter.selectedAccount = accountsListsOptions[0];
            }
        };

        sharedResources.getSubtypes().then(function (res) {
            $scope.subtypeOptions = _.map(res,'name');
            $scope.subtypeOptions.unshift('');
        });

        //for angular datepicker
        $scope.dateObj = {};
        $scope.dateObj.format = $scope.companyDateFormatString;
        $scope.popup1 = {};
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.popup2 = {};
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.orderByFunction = function () {
            return ($scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' :
                $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' :
                    $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : '');
        };

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 250){
                $scope.pagination.itemsPerPage = 250;
            }
        };

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = vm.currenciesList[0];
            $scope.currencyOptions = vm.currenciesList;
        };
        vm.getCompanyCurrencies();

        if($state.params.currencyCode){
            $scope.filtersObj.currencyFilter = true;
            vm.currenciesList.forEach(function (element) {
                if(element.code && element.code == $state.params.currencyCode){
                    $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = element;
                }
            });
        }

        if($state.params.transactionId){
            $scope.filtersObj.transactionIdFilter = true;
        }

        if($state.params.id){
            $scope.filtersObj.userFilter = true;
        }

        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
            $scope.showingColumnFilters = false;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                dateFilter: false,
                amountFilter: false,
                statusFilter: false,
                transactionTypeFilter: false,
                transactionSubtypeFilter: false,
                transactionIdFilter: false,
                destinationIdFilter: false,
                sourceIdFilter: false,
                currencyFilter: false,
                pageSizeFilter: false,
                orderByFilter: false
            };
            $scope.showFilters();
            $scope.getLatestTransactions('applyfilter');
        };

        $scope.dayIntervalChanged = function () {
            if($scope.applyFiltersObj.dateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        vm.getDateFilters = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersObj.dateFilter);

            var dateObj = {
                created__lt: evaluatedDateObj.date__lt,
                created__gt: evaluatedDateObj.date__gt
            };

            return dateObj;
        };

        vm.getAmountFilters = function () {
            var evaluatedAmountObj = multiOptionsFilterService.evaluatedAmounts($scope.applyFiltersObj.amountFilter);

            return {
                amount: evaluatedAmountObj.amount,
                amount__lt: evaluatedAmountObj.amount__lt,
                amount__gt: evaluatedAmountObj.amount__gt
            };
        };

        vm.getReferenceFilters = function () {
            var evaluatedAmountObj = multiOptionsFilterService.evaluateReference($scope.applyFiltersObj.referenceFilter);

            return {
                reference: evaluatedAmountObj.reference,
                reference__lt: evaluatedAmountObj.reference__lt,
                reference__gt: evaluatedAmountObj.reference__gt
            };
        };

        vm.getTransactionsFiltersObj = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            if($scope.filtersObj.dateFilter){
                vm.dateObj = vm.getDateFilters();
            } else{
                vm.dateObj = {
                    created__lt: null,
                    created__gt: null
                };
            }

            if($scope.filtersObj.amountFilter){
                vm.amountObj = vm.getAmountFilters();
            } else{
                vm.amountObj = {
                    amount: null,
                    amount__lt: null,
                    amount__gt: null
                };
            }

            if($scope.filtersObj.referenceFilter){
                vm.referenceObj = vm.getReferenceFilters();
            } else{
                vm.referenceObj = {
                    reference: null,
                    reference__lt: null,
                    reference__gt: null
                };
            }

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.pagination.itemsPerPage : 25,
                amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                amount__lt: vm.amountObj.amount__lt ? currencyModifiers.convertToCents(vm.amountObj.amount__lt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                amount__gt: vm.amountObj.amount__gt ? currencyModifiers.convertToCents(vm.amountObj.amount__gt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                reference: vm.referenceObj.reference ? vm.referenceObj.reference : null,
                reference__lt: vm.referenceObj.reference__lt ? vm.referenceObj.reference__lt : null,
                reference__gt: vm.referenceObj.reference__gt ? vm.referenceObj.reference__gt : null,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                currency: ($scope.filtersObj.currencyFilter || $scope.filtersObj.amountFilter) && $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                user: vm.uuid,
                account: $scope.filtersObj.accountFilter ? $scope.applyFiltersObj.accountFilter.selectedAccount.reference: null,
                group: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'Group name'? $scope.applyFiltersObj.groupFilter.selectedGroup.name: null : null,
                group__isnull: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'In a group'? ((!$scope.applyFiltersObj.groupFilter.existsInGroup) ? 'true' : 'false') : null : null,
                orderby: $scope.filtersObj.orderByFilter ? ($scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' : $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' : $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : null): null,
                id: $scope.filtersObj.transactionIdFilter ? ($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                destination_transaction : $scope.filtersObj.destinationIdFilter ? 'true' : null,
                source_transaction : $scope.filtersObj.sourceIdFilter ? 'true' : null,
                tx_type: $scope.filtersObj.transactionTypeFilter ? $scope.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatusOption: null,
                subtype: $scope.filtersObj.transactionSubtypeFilter ? ($scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null
            };

            $scope.filtersObjForExport = searchObj;

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getLatestTransactions = function(applyFilter){
            if(vm.token) {

                $scope.showingFilters = false;

                $scope.transactionsStateMessage = '';
                $scope.loadingTransactions = true;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }

                if ($scope.transactions.length > 0) {
                    $scope.transactions.length = 0;
                }

                var transactionsFiltersObj = vm.getTransactionsFiltersObj();

                Rehive.admin.transactions.get({filters: transactionsFiltersObj}).then(function (res) {
                    $scope.loadingTransactions = false;
                    $scope.transactionsData = res;
                    vm.formatTransactionsArray($scope.transactionsData.results);
                    if($scope.transactions.length == 0) {
                        $scope.transactionsStateMessage = 'No transactions have been found';
                        $scope.$apply();
                        return;
                    }
                    $scope.transactionsStateMessage = '';
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        if(Object.keys(vm.userTransactionsFilterParams).length == 0){
            $scope.getLatestTransactions();
        }

        vm.formatTransactionsArray = function (transactionsArray) {
            transactionsArray.forEach(function (transactionObj) {
                $scope.transactions.push({
                    user: transactionObj.user ? transactionObj.user.email || transactionObj.user.mobile || transactionObj.user.id : '',
                    recipient: transactionObj.destination_transaction && transactionObj.destination_transaction.user ? (
                        transactionObj.destination_transaction.user.email ? transactionObj.destination_transaction.user.email : (
                            transactionObj.destination_transaction.user.mobile ? transactionObj.destination_transaction.user.mobile : (
                                transactionObj.destination_transaction.user.id ? transactionObj.destination_transactionuser.id : transactionObj.destination_transaction.user.email + " (new user)"
                            )
                        )
                    ) : '',
                    tx_type: $filter("capitalizeWord")(transactionObj.tx_type),
                    subtype: transactionObj.subtype,
                    currencyCode: transactionObj.currency ? transactionObj.currency.code : null,
                    amount: $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(transactionObj.amount,transactionObj.currency.divisibility)),
                    fee: $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(transactionObj.fee,transactionObj.currency.divisibility)),
                    status: transactionObj.status,
                    id: transactionObj.id,
                    createdDate: $filter("date")(transactionObj.created,'mediumDate') + ' ' + $filter("date")(transactionObj.created,'shortTime'),
                    totalAmount: $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(transactionObj.total_amount,transactionObj.currency.divisibility)),
                    balance: $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(transactionObj.balance,transactionObj.currency.divisibility)),
                    account: transactionObj.account,
                    username: transactionObj.user.username,
                    userId: transactionObj.user.id,
                    updatedDate: transactionObj.updated ? $filter("date")(transactionObj.updated,'mediumDate') + ' ' + $filter("date")(transactionObj.updated,'shortTime'): null,
                    mobile: transactionObj.user.mobile,
                    destination_tx_id: transactionObj.destination_transaction ? transactionObj.destination_transaction.id ? transactionObj.destination_transaction.id : 'ID pending creation' : "",
                    source_tx_id: transactionObj.source_transaction ? transactionObj.source_transaction.id : "",
                    label: transactionObj.label,
                    reference: transactionObj.reference,
                    note: transactionObj.note,
                    metadata: transactionObj.metadata
                });
            });



            $scope.loadingTransactions = false;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.openModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserTransactionsModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });
        };

        $scope.openExportUserTransactionsModal = function (page, size) {
            vm.theExportModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserTransactionsExportModalCtrl',
                resolve: {
                    filtersObjForExport: function () {
                        return $scope.filtersObjForExport;
                    }
                }
            });

            vm.theExportModal.result.then(function(transaction){
                if(transaction){
                    //$scope.getLatestTransactions();
                }
            }, function(){
            });

        };

        $scope.$on("modalClosing",function(event,transactionHasBeenUpdated){
            if(transactionHasBeenUpdated){
                $scope.clearFilters();
                $scope.getLatestTransactions();
            }
        });

        $scope.goToNewTransactionModal = function () {
            if($scope.user && $scope.user.email){
                $location.path('/transactions/history').search({userEmail: $scope.user.email});
            }
        };

    }
})();


