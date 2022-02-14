(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceTransactions')
        .controller('StellarServiceTransactionsCtrl', StellarServiceTransactionsCtrl);

    /** @ngInject */
    function StellarServiceTransactionsCtrl($scope,$http,localStorageManagement,$uibModal,toastr,$filter,multiOptionsFilterService,$location,currenciesList,
                                            errorHandler,$state,$window,typeaheadService,serializeFiltersService,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "stellar_service";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedStellarTransactionTableColumns = vm.companyIdentifier + 'stellarTransactionsTable';
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.visibleColumnsSelectionChanged = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.filtersCount = 0;

        $scope.headerColumns = localStorageManagement.getValue(vm.savedStellarTransactionTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedStellarTransactionTableColumns)) : [
            {colName: 'Email',fieldName: 'email',visible: true},
            {colName: 'Amount',fieldName: 'amount',visible: true},
            {colName: 'Type',fieldName: 'tx_type',visible: true},
            {colName: 'Transaction hash',fieldName: 'transaction_hash',visible: true},
            {colName: 'Confirmations',fieldName: 'confirmations',visible: true},
            {colName: 'Rehive code',fieldName: 'rehive_code',visible: true},
            {colName: 'Status',fieldName: 'status',visible: true},
            {colName: 'Created',fieldName: 'created',visible: true},
            {colName: 'Updated',fieldName: 'updated',visible: false},
            {colName: 'Completed',fieldName: 'completed',visible: false}
        ];

        $scope.filtersObj = {
            dateFilter: false,
            statusFilter: false,
            transactionTypeFilter: false,
            transactionHashFilter: false,
            transactionIdFilter: false,
            userFilter: false,
            pageSizeFilter: false
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
            updatedFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            completedFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            statusFilter: {
                selectedStatusOption: 'Pending'
            },
            transactionTypeFilter: {
                selectedTransactionTypeOption: 'Deposit'
            },
            transactionHashFilter: {
                selectedTransactionHashOption: null
            },
            transactionIdFilter: {
                selectedTransactionIdOption: null
            },
            userFilter: {
                selectedUserOption: $state.params.id || null
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
        $scope.loadingTransactions = true;
        $scope.typeOptions = ['Deposit','Send','Withdraw'];
        $scope.statusOptions = ['Pending','Confirmed','Complete','Failed'];

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

        $scope.popup3 = {};
        $scope.open3 = function() {
            $scope.popup3.opened = true;
        };

        $scope.popup4 = {};
        $scope.open4 = function() {
            $scope.popup4.opened = true;
        };

        $scope.popup5 = {};
        $scope.open5 = function() {
            $scope.popup5.opened = true;
        };

        $scope.popup6 = {};
        $scope.open6 = function() {
            $scope.popup6.opened = true;
        };

        // end angular datepicker

        //Column filters
        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.selectAllColumns = function () {
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedStellarTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.toggleColumnVisibility = function () {
            $scope.visibleColumnsSelectionChanged = true;
            localStorageManagement.setValue(vm.savedStellarTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.restoreColDefaults = function () {
            $scope.visibleColumnsSelectionChanged = true;
            var defaultVisibleHeader = ['Email','Amount','Type','Transaction hash',
                'Confirmations','Rehive code','Status','Created'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedStellarTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.closeColumnFiltersBox = function () {
            if($scope.visibleColumnsSelectionChanged){
                $scope.getLatestTransactions();
            }
            $scope.showingColumnFilters = false;
        };
        //Column filters end

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 250){
                $scope.pagination.itemsPerPage = 250;
            }
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                dateFilter: false,
                statusFilter: false,
                transactionTypeFilter: false,
                transactionHashFilter: false,
                transactionIdFilter: false,
                userFilter: false,
                pageSizeFilter: false
            };
            $scope.showFilters();
            $scope.getLatestTransactions('applyfiter');
        };

        $scope.dayIntervalChanged = function (dayInterval) {
            if(dayInterval <= 0){
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

        vm.getUpdatedFilters = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersObj.updatedFilter);

            var updatedDateObj = {
                updated__lt: evaluatedDateObj.date__lt,
                updated__gt: evaluatedDateObj.date__gt
            };

            return updatedDateObj;
        };

        vm.getCompletedDateFilters = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersObj.completedFilter);

            var completedDateObj = {
                completed__lt: evaluatedDateObj.date__lt,
                completed__gt: evaluatedDateObj.date__gt
            };

            return completedDateObj;
        };

        vm.getTransactionUrl = function(){
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

            if($scope.filtersObj.updatedFilter){
                vm.updatedDateObj = vm.getUpdatedFilters();
            } else{
                vm.updatedDateObj = {
                    updated__lt: null,
                    updated__gt: null
                };
            }

            if($scope.filtersObj.completedFilter){
                vm.completedDateObj = vm.getCompletedDateFilters();
            } else{
                vm.completedDateObj = {
                    completed__lt: null,
                    completed__gt: null
                };
            }

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.pagination.itemsPerPage : 26,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                updated__gt: vm.updatedDateObj.updated__gt ? Date.parse(vm.updatedDateObj.updated__gt +'T00:00:00') : null,
                updated__lt: vm.updatedDateObj.updated__lt ? Date.parse(vm.updatedDateObj.updated__lt +'T00:00:00') : null,
                completed__gt: vm.completedDateObj.completed__gt ? Date.parse(vm.completedDateObj.completed__gt +'T00:00:00') : null,
                completed__lt: vm.completedDateObj.completed__lt ? Date.parse(vm.completedDateObj.completed__lt +'T00:00:00') : null,
                email: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? encodeURIComponent($scope.applyFiltersObj.userFilter.selectedUserOption) : null): null,
                transaction_hash: $scope.filtersObj.transactionHashFilter ? ($scope.applyFiltersObj.transactionHashFilter.selectedTransactionHashOption ? encodeURIComponent($scope.applyFiltersObj.transactionHashFilter.selectedTransactionHashOption) : null): null,
                rehive_code: $scope.filtersObj.transactionIdFilter ? ($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                tx_type: $scope.filtersObj.transactionTypeFilter ? $scope.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatusOption: null,
                orderby: '-created'
            };

            return vm.serviceUrl + 'admin/transactions/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getLatestTransactions = function(applyFilter){
            if(vm.token) {

                $scope.showingFilters = false;
                $scope.showingColumnFilters = false;
                $scope.visibleColumnsSelectionChanged = false;

                $scope.transactionsStateMessage = '';
                $scope.loadingTransactions = true;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }

                if ($scope.transactions.length > 0) {
                    $scope.transactions.length = 0;
                }

                var transactionsUrl = vm.getTransactionUrl();

                $http.get(transactionsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTransactions = false;
                    if (res.status === 200 || res.status === 201) {
                        $scope.transactionsData = res.data.data;
                        vm.formatTransactionsArray($scope.transactionsData.results);
                        if ($scope.transactions == 0) {
                            $scope.transactionsStateMessage = 'No transactions have been found';
                            return;
                        }

                        $scope.transactionsStateMessage = '';
                    }
                }).catch(function (error) {
                    $scope.loadingTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        vm.formatTransactionsArray = function (transactionsArray) {
            transactionsArray.forEach(function (transactionObj) {
                $scope.transactions.push({
                    email: transactionObj.user ? transactionObj.user.email : '',
                    amount: transactionObj.amount ? $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(transactionObj.amount,transactionObj.currency ? transactionObj.currency.divisibility : 7)) : '',
                    tx_type: transactionObj.tx_type ? $filter("capitalizeWord")(transactionObj.tx_type) : '',
                    transaction_hash: transactionObj.transaction_hash ? transactionObj.transaction_hash : '',
                    confirmations: transactionObj.confirmations ? transactionObj.confirmations : '',
                    rehive_code: transactionObj.rehive_code ? transactionObj.rehive_code : '',
                    status: transactionObj.status ? transactionObj.status : '',
                    created: transactionObj.created ? $filter("date")(transactionObj.created,'mediumDate') + ' ' + $filter("date")(transactionObj.created,'shortTime') : '',
                    updated: transactionObj.updated ? $filter("date")(transactionObj.updated,'mediumDate') + ' ' + $filter("date")(transactionObj.updated,'shortTime') : '',
                    completed: transactionObj.completed ? $filter("date")(transactionObj.completed,'mediumDate') + ' ' + $filter("date")(transactionObj.completed,'shortTime') : ''
                });
            });

            $scope.loadingTransactions = false;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.openModal = function (page, size,transaction) {
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'StellarServiceTransactionsModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getLatestTransactions();
            })
            .catch(function(err){
                $scope.loadingTransactions = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
