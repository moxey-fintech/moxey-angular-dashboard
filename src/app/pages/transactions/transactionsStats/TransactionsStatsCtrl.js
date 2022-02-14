(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.stats')
        .controller('TransactionsStatsCtrl', TransactionsStatsCtrl);

    /** @ngInject */
    function TransactionsStatsCtrl($scope,Rehive,serializeFiltersService,currencyModifiers,sharedResources,
                                   localStorageManagement,typeaheadService,toastr,_,errorHandler,multiOptionsFilterService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.loadingStats = true;
        $scope.currencyObj = {};
        $scope.currencyOptions = [];
        $scope.transactionTotalObj = {};
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.referenceFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.groupFilterOptions = ['Group name','In a group'];
        $scope.reconFilterOptions = ['Include', 'Show only'];
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
            userFilter: false,
            accountNameFilter: false,
            accountReferenceFilter: false,
            groupFilter: false,
            currencyFilter: false,
            pageSizeFilter: false,
            reconFilter: false,
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
            userFilter: {
                selectedUserOption: null
            },
            accountNameFilter: {
                selectedAccountName: null
            },
            accountReferenceFilter: {
                selectedAccountReference: null
            },
            groupFilter: {
                selectedGroupOption: 'Group name',
                existsInGroup: false,
                selectedGroup: {}
            },
            currencyFilter:{
                selectedCurrencyOption: {}
            },
            reconFilter: {
                selectedReconOption: $scope.reconFilterOptions[0]
            },
            orderByFilter: {
                selectedOrderByOption: 'Latest'
            }
        };
        $scope.typeOptions = ['Credit','Debit']; //Transfer
        $scope.statusOptions = ['Pending','Complete','Failed','Deleted'];

        vm.getAllCompanyCurrencies = function () {
            Rehive.admin.currencies.get({filters: {
                page_size: 250,
                archived: false
            }}).then(function (res) {
                if(res.results.length > 0){
                    $scope.currencyOptions = res.results;
                    $scope.getTransactionTotals();
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingStats = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getAllCompanyCurrencies();

        sharedResources.getSubtypes().then(function (res) {
            $scope.subtypeOptions = _.map(res,'name');
            $scope.subtypeOptions.unshift('');
        });

        $scope.getGroups = function () {
            if(vm.token) {
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.groupOptions = res.results;
                        $scope.applyFiltersObj.groupFilter.selectedGroup = $scope.groupOptions[0];
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

        //end angular datepicker

        $scope.clearFilters = function () {
            for(var key in $scope.filtersObj){
                $scope.filtersObj[key] = false;
            }
            $scope.showFilters();
            $scope.getTransactionTotals();
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.dayIntervalChanged = function () {
            if($scope.applyFiltersObj.dateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        vm.getDateFilters = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersObj.dateFilter);

            return {
                created__lt: evaluatedDateObj.date__lt,
                created__gt: evaluatedDateObj.date__gt
            };
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

        $scope.handleReconFilter = function(searchObj){
            if($scope.filtersObj.reconFilter){
                if($scope.applyFiltersObj.reconFilter.selectedReconOption === 'Include' && searchObj['account__recon'] !== undefined){
                    delete searchObj['account__recon'];
                } else if ($scope.applyFiltersObj.reconFilter.selectedReconOption === 'Show only'){
                    searchObj['account__recon'] = true;
                }
            } else {
                searchObj['account__recon'] = false;
            }

            return searchObj;
        };

        vm.getTransactionsStatsFiltersObj = function(){
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
                // amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                amount__lt: vm.amountObj.amount__lt ? currencyModifiers.convertToCents(vm.amountObj.amount__lt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                amount__gt: vm.amountObj.amount__gt ? currencyModifiers.convertToCents(vm.amountObj.amount__gt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                reference: vm.referenceObj.reference ? vm.referenceObj.reference : null,
                reference__lt: vm.referenceObj.reference__lt ? vm.referenceObj.reference__lt : null,
                reference__gt: vm.referenceObj.reference__gt ? vm.referenceObj.reference__gt : null,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                currency: $scope.filtersObj.currencyFilter || $scope.filtersObj.amountFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? $scope.applyFiltersObj.userFilter.selectedUserOption : null): null,
                account__name: $scope.filtersObj.accountNameFilter ? $scope.applyFiltersObj.accountNameFilter.selectedAccountName: null,
                account: $scope.filtersObj.accountReferenceFilter ? $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference: null,
                group: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'Group name'? $scope.applyFiltersObj.groupFilter.selectedGroup.name: null : null,
                group__isnull: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'In a group'? (!$scope.applyFiltersObj.groupFilter.existsInGroup).toString(): null : null,
                id: $scope.filtersObj.transactionIdFilter ? ($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption ? $scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption : null): null,
                destination_transaction : $scope.filtersObj.destinationIdFilter ? 'true' : null,
                source_transaction : $scope.filtersObj.sourceIdFilter ? 'true' : null,
                tx_type: $scope.filtersObj.transactionTypeFilter ? $scope.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatusOption: null,
                subtype: $scope.filtersObj.transactionSubtypeFilter ? ($scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null
            };

            $scope.handleReconFilter(searchObj);
            $scope.filtersObjForExport = searchObj;

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getTransactionTotals = function () {
            $scope.loadingStats = true;
            $scope.showingFilters = false;

            var transactionsStatsFiltersObj = vm.getTransactionsStatsFiltersObj();

            Rehive.admin.transactions.totals.get({filters: transactionsStatsFiltersObj}).then(function (res) {
                $scope.transactionTotalObj = res;
                if($scope.transactionTotalObj.currency){
                    vm.getCurrencyObject($scope.transactionTotalObj);
                    $scope.$apply();
                } else {
                    $scope.currencyObj = {
                        symbol: 'N/A'
                    };
                    $scope.loadingStats = false;
                    $scope.$apply();
                }
                $scope.$apply();
            }, function (error) {
                $scope.loadingStats = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getCurrencyObject = function (transactionTotalObj) {
            $scope.loadingStats = true;
            if($scope.currencyOptions && $scope.currencyOptions.length > 0){
                $scope.currencyOptions.forEach(function (currency) {
                    if(currency.code == transactionTotalObj.currency){
                        $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = currency;
                        $scope.currencyObj = currency;
                        $scope.loadingStats = false;
                        $scope.$apply();
                    }
                });
            } else {
                $scope.loadingStats = false;
                $scope.$apply();
            }
        };

    }
})();
