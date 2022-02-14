(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('HistoryCtrl', HistoryCtrl);

    /** @ngInject */
    function HistoryCtrl($rootScope,Rehive,$scope,localStorageManagement,$uibModal,sharedResources,currenciesList,
                         toastr,currencyModifiers,errorHandler,$state,$window,typeaheadService,$filter,
                         serializeFiltersService,$location,_,multiOptionsFilterService,$intercom,urlHandlerService) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.savedTransactionTableColumns = vm.companyIdentifier + 'transactionsTable';
        vm.savedTransactionMetadataColumns = vm.companyIdentifier + 'transactionsMetadataColumns';
        vm.savedTransactionTableFilters = vm.companyIdentifier + 'transactionTableFilters';
        $scope.initialLoad = true;
        $scope.transactionsMetadataColumns = localStorageManagement.getValue(vm.savedTransactionMetadataColumns) ?
            JSON.parse(localStorageManagement.getValue(vm.savedTransactionMetadataColumns)) : [];
        vm.newTransactionParams = $location.search();
        $rootScope.dashboardTitle = 'Transactions history | Moxey';
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.referenceFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.groupFilterOptions = ['Group name','In a group'];
        // $scope.accountFilterOptions = ['Name','Reference'];
        $scope.accountFilterOptions = ['Reference'];
        $scope.userTypeOptions = ['Permanent', 'Temporary'];
        $scope.reconFilterOptions = ['Include', 'Show only'];
        $scope.visibleColumnsArray = [];
        $scope.visibleColumnsSelectionChanged = false;
        $scope.filtersCount = 0;

        if(localStorageManagement.getValue(vm.savedTransactionTableColumns)){
            var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns));
            var recipientFieldExists = false;
            headerColumns.forEach(function (col) {
                if(col.colName == 'Metadata'){
                    recipientFieldExists = true;
                }
            });

            if(!recipientFieldExists){
                headerColumns.splice(22,0,{colName: 'Metadata',fieldName: 'metadata',visible: false});
            }

            localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify(headerColumns));
        }

        // if(localStorageManagement.getValue(vm.savedTransactionTableColumns)){
        //          var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns));
        //          headerColumns.forEach(function (col) {
        //              if(col.colName == 'Identifier'){
        //                  col.colName = 'User id';
        //                  col.fieldName = 'userId';
        //              }
        //          });
        //
        //         localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify(headerColumns));
        //     }

        $scope.initializeHeaderCol = function () {
            var headerCols = localStorageManagement.getValue(vm.savedTransactionTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns)) : [
                    {colName: 'User',fieldName: 'user',visible: true},
                    {colName: 'Recipient',fieldName: 'partner',visible: true},
                    {colName: 'Type',fieldName: 'tx_type',visible: true},
                    {colName: 'Subtype',fieldName: 'subtype',visible: true},
                    {colName: 'Currency',fieldName: 'currencyCode',visible: true},
                    {colName: 'Amount',fieldName: 'amount',visible: true},
                    {colName: 'Fee',fieldName: 'fee',visible: true},
                    {colName: 'Status',fieldName: 'status',visible: true},
                    {colName: 'Note',fieldName: 'note',visible: true},
                    {colName: 'Date',fieldName: 'createdDate',visible: true},
                    {colName: 'Id',fieldName: 'id',visible: false},
                    {colName: 'Total amount',fieldName: 'totalAmount',visible: false},
                    {colName: 'Balance',fieldName: 'balance',visible: false},
                    {colName: 'Collection id',fieldName: 'collectionId',visible: false},
                    {colName: 'Account',fieldName: 'account',visible: false},
                    {colName: 'Username',fieldName: 'username',visible: false},
                    {colName: 'User id',fieldName: 'userId',visible: false},
                    {colName: 'Updated',fieldName: 'updatedDate',visible: false},
                    {colName: 'Mobile',fieldName: 'mobile',visible: false},
                    {colName: 'Partner txn id',fieldName: 'partner_tx',visible: false},
                    {colName: 'Label',fieldName: 'label',visible: false},
                    {colName: 'Reference',fieldName: 'reference',visible: false},
                    {colName: 'Metadata',fieldName: 'metadata',visible: false}
                ];

            localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify(headerCols));

            return headerCols;

        };

        $scope.headerColumns = localStorageManagement.getValue(vm.savedTransactionTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns)) : $scope.initializeHeaderCol();
        
        vm.initializeFilterObjects = function(){
            $scope.filtersObj = {
                dateFilter: false,
                amountFilter: false,
                statusFilter: false,
                transactionTypeFilter: false,
                transactionSubtypeFilter: false,
                transactionIdFilter: false,
                metadataFilter: false,
                partnerIdFilter: false,
                referenceFilter: false,
                userFilter: false,
                accountFilter: false,
                accountNameFilter: false,
                groupFilter: false,
                currencyFilter: false,
                pageSizeFilter: false,
                orderByFilter: false,
                collectionFilter: false,
                reconFilter: false,
                userTypeFilter: false
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
                partnerIdFilter: {
                    selectedPartnerOption: 'false'
                },
                metadataFilter: {
                    selectedMetadataKey: '',
                    selectedMetadataValue: ''
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
                accountFilter: {
                    selectedAccountReference: null
                },
                accountNameFilter: {
                    selectedAccountName: null
                },
                groupFilter: {
                    selectedGroupOption: 'Group name',
                    existsInGroup: false,
                    selectedGroup: {}
                },
                currencyFilter:{
                    selectedCurrencyOption: {}
                },
                orderByFilter: {
                    selectedOrderByOption: {},
                    selectedOrderByDirection: 'Desc'
                },
                collectionFilter: {
                    selectedCollectionId: ''
                },
                reconFilter: {
                    selectedReconOption: $scope.reconFilterOptions[0]
                },
                userTypeFilter: {
                    selectedUserTypeOption: 'Permanent'
                }
            };
        };
        vm.initializeFilterObjects();
               
        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5,
            currentCursor: null,
            prevCursor: null,
            nextCursor: null
        };
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.transactions = [];
        $scope.transactionsStateMessage = '';
        $scope.transactionsData = {};
        $scope.loadingTransactions = false;
        $scope.typeOptions = ['Credit','Debit']; //Transfer
        $scope.statusOptions = ['Pending','Complete','Failed','Deleted'];
        $scope.orderByOptions = [
            {name:'Amount',fieldName: 'amount',tableFieldName: 'amount'},
            {name:'Balance',fieldName: 'balance',tableFieldName: 'balance'},
            {name:'Created',fieldName: 'created',tableFieldName: 'createdDate'},
            {name:'Fee',fieldName: 'fee',tableFieldName: 'fee'},
            {name:'Reference',fieldName: 'reference',tableFieldName: 'reference'},
            {name:'Total amount',fieldName: 'total_amount',tableFieldName: 'totalAmount'},
            {name:'Updated',fieldName: 'updated',tableFieldName: 'updatedDate'}
        ];
        $scope.orderByDirection = ['Desc','Asc'];
        $scope.currencyOptions = [];
        $scope.groupOptions = [];

        //Column filters
        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.selectAllColumns = function () {
            $scope.visibleColumnsSelectionChanged = true;
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.toggleColumnVisibility = function () {
            $scope.visibleColumnsSelectionChanged = true;
            localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.restoreColDefaults = function () {
            $scope.visibleColumnsSelectionChanged = true;
            var defaultVisibleHeader = ['User','Type','Subtype','Currency',
                'Amount','Status','Date','Note'];
                // 'Amount','Fee','Status','Date','Id'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };
        //Column filters end

        vm.sortSubtypesAlphabetically = function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name === b.name) { return 0; }
            return 1;
        };

        sharedResources.getSubtypes().then(function (res) {
            var allSubtypes = res.sort(vm.sortSubtypesAlphabetically);
            $scope.subtypeOptions = _.map(allSubtypes,'name');
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

        $scope.orderByFunction = function (header) {
            if($scope.applyFiltersObj.orderByFilter.selectedOrderByDirection === 'Desc'){
                $scope.filtersObj.orderByFilter = true;
                if(header.fieldName == $scope.applyFiltersObj.orderByFilter.selectedOrderByOption.tableFieldName){
                    $scope.applyFiltersObj.orderByFilter.selectedOrderByDirection = 'Asc';
                }
                $scope.orderByOptions.forEach(function (element) {
                    if(element.tableFieldName == header.fieldName){
                        $scope.applyFiltersObj.orderByFilter.selectedOrderByOption = element;
                        $scope.getLatestTransactions();
                    }
                });
            } else if($scope.applyFiltersObj.orderByFilter.selectedOrderByDirection === 'Asc'){
                $scope.filtersObj.orderByFilter = true;
                $scope.applyFiltersObj.orderByFilter.selectedOrderByDirection = 'Desc';
                $scope.orderByOptions.forEach(function (element) {
                    if(element.tableFieldName == header.fieldName){
                        $scope.applyFiltersObj.orderByFilter.selectedOrderByOption = element;
                        $scope.getLatestTransactions();
                    }
                });
            }
        };

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 10000){
                $scope.pagination.itemsPerPage = 10000;
            }
        };

        vm.getOrderByInitialValue = function () {
            $scope.orderByOptions.forEach(function (orderByElement,index) {
                if(orderByElement.name === 'Created'){
                    $scope.applyFiltersObj.orderByFilter.selectedOrderByOption = $scope.orderByOptions[index];
                }
            });
        };
        vm.getOrderByInitialValue();

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = vm.currenciesList[0];
            $scope.currencyOptions = vm.currenciesList;
        };
        vm.getCompanyCurrencies();

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
            $scope.showingColumnFilters = false;
        };

        vm.resetFilters = function(){
            for(var key in $scope.filtersObj){
                $scope.filtersObj[key] = false;
            }
        };

        $scope.clearFilters = function () {
            vm.resetFilters();
            $scope.showFilters();
            $scope.getLatestTransactions('applyfilter', null);
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

        vm.getVisibleColumnsArray = function () {
            var visibleColumnsArray = [];

            $scope.headerColumns.forEach(function (col) {
                if(col.visible){
                    if(col.fieldName === 'user' || col.fieldName === 'username' || col.fieldName === 'userId' || col.fieldName === 'mobile'){
                        visibleColumnsArray.push('user');
                    } else if(col.fieldName === 'partner'){
                        visibleColumnsArray.push('partner');
                    } else if(col.fieldName === 'partner_tx'){
                        visibleColumnsArray.push('partner_tx');
                    } else if(col.fieldName === 'currencyCode'){
                        visibleColumnsArray.push('currency');
                    } else if(col.fieldName === 'createdDate'){
                        visibleColumnsArray.push('created');
                    } else if(col.fieldName === 'updatedDate'){
                        visibleColumnsArray.push('updated');
                    } else if(col.fieldName === 'collectionId'){
                        visibleColumnsArray.push('collection');
                    } else if(col.fieldName === 'totalAmount'){
                        visibleColumnsArray.push('total_amount');
                        visibleColumnsArray.push('currency');
                    } else {
                        visibleColumnsArray.push(col.fieldName);
                        if(col.fieldName === 'amount' || col.fieldName === 'fee' || col.fieldName === 'balance'){
                            visibleColumnsArray.push('currency');
                        }
                    }
                }
            });

            visibleColumnsArray.push('id');
            visibleColumnsArray.push('metadata');

            return _.uniq(visibleColumnsArray);
        };

        $scope.handleSearchObjFilterChange = function(searchObj){
            // Handle cursor pagination:
            if($scope.pagination.currentCursor){ 
                searchObj.cursor = $scope.pagination.currentCursor; 
            } else if(searchObj.cursor !== undefined) {
                delete searchObj['cursor'];
            }
            if(searchObj.page){ delete searchObj['page']; }
            searchObj.pagination = "cursor";
            
            // Handle Recon filter changes:
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

        vm.getTransactionsFiltersObj = function(){
            $scope.filtersCount = 0;
            $scope.filtersObjForExport = {};
            var searchObj = {};
            var filterObjects = {};
            if($scope.initialLoad) {
                $scope.initialLoad = false;
                if (localStorageManagement.getValue(vm.savedTransactionTableFilters)) {
                    filterObjects = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableFilters));
                    $scope.visibleColumnsArray = vm.getVisibleColumnsArray();

                    $scope.filtersObj = filterObjects.filtersObj;
                    $scope.applyFiltersObj = {
                        dateFilter: {
                            selectedDateOption: filterObjects.applyFiltersObj.dateFilter.selectedDateOption,
                            selectedDayIntervalOption: filterObjects.applyFiltersObj.dateFilter.selectedDayIntervalOption,
                            dayInterval: filterObjects.applyFiltersObj.dateFilter.dayInterval,
                            dateFrom: moment(filterObjects.applyFiltersObj.dateFilter.dateFrom).toDate(),
                            dateTo: moment(filterObjects.applyFiltersObj.dateFilter.dateTo).toDate(),
                            dateEqualTo: moment(filterObjects.applyFiltersObj.dateFilter.dateEqualTo).toDate()
                        },
                        amountFilter: {
                            selectedAmountOption: filterObjects.applyFiltersObj.amountFilter.selectedAmountOption,
                            amount: filterObjects.applyFiltersObj.amountFilter.amount,
                            amount__lt: filterObjects.applyFiltersObj.amountFilter.amount__lt,
                            amount__gt: filterObjects.applyFiltersObj.amountFilter.amount__gt
                        },
                        statusFilter: {
                            selectedStatusOption: filterObjects.applyFiltersObj.statusFilter.selectedStatusOption
                        },
                        transactionTypeFilter: {
                            selectedTransactionTypeOption: filterObjects.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption
                        },
                        transactionSubtypeFilter: {
                            selectedTransactionSubtypeOption: filterObjects.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption
                        },
                        transactionIdFilter: {
                            selectedTransactionIdOption: filterObjects.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption
                        },
                        metadataFilter: {
                            selectedMetadataKey: filterObjects.applyFiltersObj.metadataFilter.selectedMetadataKey,
                            selectedMetadataValue: filterObjects.applyFiltersObj.metadataFilter.selectedMetadataValue
                        },
                        referenceFilter: {
                            selectedReferenceOption: filterObjects.applyFiltersObj.referenceFilter.selectedReferenceOption,
                            reference: filterObjects.applyFiltersObj.referenceFilter.reference,
                            reference__lt: filterObjects.applyFiltersObj.referenceFilter.reference__lt,
                            reference__gt: filterObjects.applyFiltersObj.referenceFilter.reference__gt
                        },
                        userFilter: {
                            selectedUserOption: filterObjects.applyFiltersObj.userFilter.selectedUserOption
                        },
                        partnerIdFilter: {
                            selectedPartnerOption: filterObjects.applyFiltersObj.partnerIdFilter ? filterObjects.applyFiltersObj.partnerIdFilter.selectedPartnerOption : null
                        },
                        accountFilter: {
                            selectedAccountReference: filterObjects.applyFiltersObj.accountFilter ? filterObjects.applyFiltersObj.accountFilter.selectedAccountReference : null
                        },
                        accountNameFilter: {
                            selectedAccountName: filterObjects.applyFiltersObj.accountNameFilter ? filterObjects.applyFiltersObj.accountNameFilter.selectedAccountReference : null
                        },
                        groupFilter: {
                            selectedGroupOption: filterObjects.applyFiltersObj.groupFilter.selectedGroupOption,
                            existsInGroup: filterObjects.applyFiltersObj.groupFilter.existsInGroup,
                            selectedGroup: filterObjects.applyFiltersObj.groupFilter && filterObjects.applyFiltersObj.groupFilter.selectedGroup
                                && filterObjects.applyFiltersObj.groupFilter.selectedGroup.name ?
                                $scope.groupOptions.find(function (group) {
                                    if(group.name == filterObjects.applyFiltersObj.groupFilter.selectedGroup.name){
                                        return group;
                                    }
                                }) : $scope.groupOptions[0]
                        },
                        currencyFilter:{
                            selectedCurrencyOption: filterObjects.applyFiltersObj.currencyFilter.selectedCurrencyOption
                        },
                        orderByFilter: {
                            selectedOrderByOption: filterObjects.applyFiltersObj.orderByFilter.selectedOrderByOption,
                            selectedOrderByDirection: filterObjects.applyFiltersObj.orderByFilter.selectedOrderByDirection
                        },
                        collectionFilter: {
                            selectedCollectionId: filterObjects.applyFiltersObj.collectionFilter ? filterObjects.applyFiltersObj.collectionFilter.selectedCollectionId : null
                        },
                        reconFilter: {
                            selectedReconOption: filterObjects.applyFiltersObj.reconFilter ? filterObjects.applyFiltersObj.reconFilter.selectedReconOption : $scope.reconFilterOptions[0]
                        },
                        userTypeFilter: {
                            selectedUserTypeOption: filterObjects.applyFiltersObj.userTypeFilter ? filterObjects.applyFiltersObj.userTypeFilter.selectedUserTypeOption : 'Permanent'
                        }
                    };
                    searchObj = filterObjects.searchObj;
                    searchObj.fields = $scope.visibleColumnsArray.join(',');

                } else {
                    searchObj = {
                        page: 1,
                        page_size: $scope.filtersObj.pageSizeFilter? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25
                    };
                }
                $scope.handleSearchObjFilterChange(searchObj);
            } else {
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

                $scope.visibleColumnsArray = vm.getVisibleColumnsArray();
                
                searchObj = {
                    page: $scope.pagination.pageNo,
                    page_size: $scope.filtersObj.pageSizeFilter? $scope.pagination.itemsPerPage : 25,
                    amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                    amount__abs__lte: vm.amountObj.amount__lt ? currencyModifiers.convertToCents(vm.amountObj.amount__lt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                    amount__abs__gte: vm.amountObj.amount__gt ? currencyModifiers.convertToCents(vm.amountObj.amount__gt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                    reference: vm.referenceObj.reference ? vm.referenceObj.reference : null,
                    reference__lt: vm.referenceObj.reference__lt ? vm.referenceObj.reference__lt : null,
                    reference__gt: vm.referenceObj.reference__gt ? vm.referenceObj.reference__gt : null,
                    created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                    created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                    currency: $scope.filtersObj.currencyFilter || $scope.filtersObj.amountFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                    user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? $scope.applyFiltersObj.userFilter.selectedUserOption : null): null,
                    account: $scope.filtersObj.accountFilter ? $scope.applyFiltersObj.accountFilter.selectedAccountReference : null,
                    account__name: $scope.filtersObj.accountNameFilter ? $scope.applyFiltersObj.accountNameFilter.selectedAccountName : null,
                    group: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'Group name'? $scope.applyFiltersObj.groupFilter.selectedGroup.name: null : null,
                    group__isnull: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'In a group'? (!$scope.applyFiltersObj.groupFilter.existsInGroup).toString(): null : null,
                    id: $scope.filtersObj.transactionIdFilter ? ($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption ? $scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption : null): null,
                    partner__isnull : $scope.filtersObj.partnerIdFilter ? ($scope.applyFiltersObj.partnerIdFilter.selectedPartnerOption ? ($scope.applyFiltersObj.partnerIdFilter.selectedPartnerOption === 'false') : false) : null,
                    tx_type: $scope.filtersObj.transactionTypeFilter ? $scope.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                    status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatusOption: null,
                    subtype: $scope.filtersObj.transactionSubtypeFilter ? ($scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null,
                    fields: $scope.visibleColumnsArray.join(','),
                    collection: $scope.filtersObj.collectionFilter ? $scope.applyFiltersObj.collectionFilter.selectedCollectionId : null,
                    user__temporary: $scope.filtersObj.userTypeFilter ? ($scope.applyFiltersObj.userTypeFilter.selectedUserTypeOption === 'Temporary') : null,
                    orderby: $scope.filtersObj.orderByFilter ? $scope.applyFiltersObj.orderByFilter.selectedOrderByDirection == 'Desc' ? '-' + $scope.applyFiltersObj.orderByFilter.selectedOrderByOption.fieldName : $scope.applyFiltersObj.orderByFilter.selectedOrderByOption.fieldName : null
                };

                $scope.handleSearchObjFilterChange(searchObj);
                vm.saveTransactionsTableFiltersToLocalStorage({
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

            if($scope.filtersObj.metadataFilter){
                searchObj['metadata__' + $scope.applyFiltersObj.metadataFilter.selectedMetadataKey] = $scope.applyFiltersObj.metadataFilter.selectedMetadataValue;
            } else {
                searchObj['metadata__' + $scope.applyFiltersObj.metadataFilter.selectedMetadataKey] = null;
            }
            $scope.filtersObjForExport = searchObj;

            if(searchObj.fields && searchObj.fields.indexOf('account') < 0){
                var suffix = searchObj.fields.length > 0 ? ',account' : 'account';
                searchObj.fields += suffix;
            }
            return serializeFiltersService.objectFilters(searchObj);
        };

        vm.saveTransactionsTableFiltersToLocalStorage = function (filterObjects) {
            localStorageManagement.setValue(vm.savedTransactionTableFilters,JSON.stringify(filterObjects));
        };

        $scope.paginationChanged = function(pageCursor){
            if($scope.pagination[pageCursor] === null) return;

            $scope.pagination.currentCursor = $scope.pagination[pageCursor];
            $scope.getLatestTransactions();
        };

        $scope.getLatestTransactions = function(applyFilter, transactionId){
            if(vm.token) {

                $scope.showingFilters = false;
                $scope.showingColumnFilters = false;
                $scope.visibleColumnsSelectionChanged = false;

                $scope.transactionsStateMessage = '';
                $scope.loadingTransactions = true;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                    $scope.pagination.currentCursor = null;
                }

                if ($scope.transactions.length > 0) {
                    $scope.transactions.length = 0;
                }

                var transactionsFiltersObj = vm.getTransactionsFiltersObj();
                Rehive.admin.transactions.get({filters: transactionsFiltersObj}).then(function (res) {
                    $scope.transactionsData = res;
                    var prevParams = urlHandlerService.getUrlParams(res.previous);
                    var nextParams = urlHandlerService.getUrlParams(res.next);
                    $scope.pagination.prevCursor = prevParams['cursor'] !== undefined ? prevParams['cursor'] : null; 
                    $scope.pagination.nextCursor = nextParams['cursor'] !== undefined ? nextParams['cursor'] : null; 
                    if(transactionId){
                        vm.formatTransactionsArray($scope.transactionsData.results, transactionId);
                    }
                    else{
                        vm.formatTransactionsArray($scope.transactionsData.results, null);
                    }
                    if ($scope.transactions.length == 0) {
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

        if($state.params.id) {
            vm.initializeFilterObjects();
            $scope.initialLoad = false;
            $scope.filtersObj.userFilter = true;
            $scope.applyFiltersObj.userFilter.selectedUserOption = $state.params.id;

            var filtersObj = null;
            if(localStorageManagement.getValue(vm.savedTransactionTableFilters)){
                filtersObj = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableFilters));
            }
            else {
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }

            filtersObj.searchObj.user = $state.params.id;
            filtersObj.applyFiltersObj.userFilter.selectedUserOption = $state.params.id;

            vm.saveTransactionsTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });
            $scope.getLatestTransactions('applyFilter', null);
        }
        else if($state.params.accountRef) {
            vm.initializeFilterObjects();
            $scope.initialLoad = false;
            $scope.filtersObj.accountFilter = true;
            $scope.applyFiltersObj.accountFilter.selectedAccountReference = $state.params.accountRef;

            var filtersObj = null;
            if(localStorageManagement.getValue(vm.savedTransactionTableFilters)){
                filtersObj = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableFilters));
            }
            else {
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }
            
            filtersObj.searchObj.account = $state.params.accountRef;
            filtersObj.applyFiltersObj.accountFilter.selectedAccountReference = $state.params.accountRef;

            vm.saveTransactionsTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });
            // if(transactionId === 0){
                $scope.getLatestTransactions('applyFilter', null);
            // } else {
            //     $scope.getLatestTransactions('applyFilter', transactionId);
            // }
        }
        else if($state.params.transactionId) {
            vm.initializeFilterObjects();
            $scope.initialLoad = false;
            $scope.filtersObj.transactionIdFilter = true;
            $scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption = $state.params.transactionId;

            var filtersObj = null;
            if(localStorageManagement.getValue(vm.savedTransactionTableFilters)){
                filtersObj = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableFilters));
            }
            else {
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }
            
            filtersObj.searchObj.id = $state.params.transactionId;
            filtersObj.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption = $state.params.transactionId;

            vm.saveTransactionsTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });
            // if(transactionId === 0){
                $scope.getLatestTransactions('applyFilter', null);
            // } else {
            //     $scope.getLatestTransactions('applyFilter', transactionId);
            // }
        }   
        else if($state.params.withdrawalFor){
            vm.initializeFilterObjects();
            $scope.initialLoad = false;
            $scope.filtersObj.userFilter = true;
            $scope.filtersObj.transactionSubtypeFilter = true;
            $scope.filtersObj.statusFilter = true;

            $scope.applyFiltersObj.userFilter.selectedUserOption = $state.params.withdrawalFor;
            $scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption = "withdraw";
            $scope.applyFiltersObj.statusFilter.selectedStatusOption = "Pending";

            var filtersObj = localStorageManagement.getValue(vm.savedTransactionTableFilters) ? JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableFilters)) : null;

            if(!filtersObj){
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }
            filtersObj.searchObj.user = $state.params.withdrawalFor;
            filtersObj.searchObj.subtype = "withdraw";
            filtersObj.searchObj.status = "Pending";
            
            filtersObj.applyFiltersObj.userFilter.selectedUserOption = $state.params.withdrawalFor;
            filtersObj.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption = "withdraw";
            filtersObj.applyFiltersObj.statusFilter.selectedStatusOption = "Pending";

            vm.saveTransactionsTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });
            // if(transactionId === 0){
                $scope.getLatestTransactions('applyFilter', null);
            // } else {
            //     $scope.getLatestTransactions('applyFilter', transactionId);
            // }
        }   
        else if($state.params.withdrawalForAccount){
            vm.initializeFilterObjects();
            $scope.initialLoad = false;
            $scope.filtersObj.accountFilter = true;
            $scope.filtersObj.transactionSubtypeFilter = true;
            $scope.filtersObj.statusFilter = true;

            $scope.applyFiltersObj.accountFilter.selectedAccountReference = $state.params.withdrawalForAccount;
            $scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption = "withdraw";
            $scope.applyFiltersObj.statusFilter.selectedStatusOption = "Pending";

            var filtersObj = localStorageManagement.getValue(vm.savedTransactionTableFilters) ? JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableFilters)) : null;

            if(!filtersObj){
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }
            filtersObj.searchObj.account = $state.params.withdrawalForAccount;
            filtersObj.searchObj.subtype = "withdraw";
            filtersObj.searchObj.status = "Pending";
            
            filtersObj.applyFiltersObj.accountFilter.selectedAccountReference = $state.params.withdrawalForAccount;
            filtersObj.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption = "withdraw";
            filtersObj.applyFiltersObj.statusFilter.selectedStatusOption = "Pending";

            vm.saveTransactionsTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });
            $scope.getLatestTransactions('applyFilter', null);
        }
        else if($state.params.currencyCode) {
            vm.initializeFilterObjects();
            $scope.initialLoad = false;
            $scope.filtersObj.currencyFilter = true;
            $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = null;
            $scope.currencyOptions.forEach(function(currency){
                if(currency.code === $state.params.currencyCode){
                    $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = currency;                    
                    return;
                }
            });

            if($scope.applyFiltersObj.currencyFilter.selectedCurrencyOption){
                $scope.getLatestTransactions('applyfilter', null);
            }
        }
        else if($state.params.searchHotwalletFees) {
            vm.initializeFilterObjects();
            $scope.initialLoad = false;
            $scope.filtersObj.currencyFilter = true;
            $scope.filtersObj.transactionSubtypeFilter = true;
            $scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption = $state.params.searchHotwalletFees.subtype;
            $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = null;
            $scope.currencyOptions.forEach(function(currency){
                if(currency.code === $state.params.searchHotwalletFees.code){
                    $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = currency;                    
                    return;
                }
            });
            if($scope.applyFiltersObj.currencyFilter.selectedCurrencyOption){
                if($state.params.searchHotwalletFees.status){
                    $scope.filtersObj.statusFilter = true;
                    $scope.applyFiltersObj.statusFilter.selectedStatusOption = $state.params.searchHotwalletFees.status;
                }
                $scope.getLatestTransactions('applyfilter', null);
            }
        }
        else if($state.params.searchHotwalletTransactions){
            vm.initializeFilterObjects();
            $scope.initialLoad = false;
            $scope.filtersObj.currencyFilter = true;
            $scope.filtersObj.accountFilter = true;
            $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = null;
            $scope.applyFiltersObj.accountFilter.selectedAccountReference = $state.params.searchHotwalletTransactions.reference;
            $scope.currencyOptions.forEach(function(currency){
                if(currency.code === $state.params.searchHotwalletTransactions.currencyCode){
                    $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = currency;                    
                    return;
                }
            });

            if($scope.applyFiltersObj.currencyFilter.selectedCurrencyOption){
                $scope.getLatestTransactions('applyfilter', null);
            }
        }
        else {
            $scope.getLatestTransactions(null, null);
        }
        
        vm.formatTransactionsArray = function (transactionsArray, transactionId) {
            //save unique metadata keys from 1st transactions
            if((transactionsArray[0] && transactionsArray[0].metadata) && (Object.keys(transactionsArray[0].metadata).length > 0)){
                for(var key in transactionsArray[0].metadata){
                    var metadataKeyExists = false;
                    if(transactionsArray[0].metadata.hasOwnProperty(key)){
                        $scope.transactionsMetadataColumns.forEach(function (element) {
                            if(element == key){
                                metadataKeyExists = true;
                            }
                        });
                        if(!metadataKeyExists){
                            $scope.transactionsMetadataColumns.push(key);
                        }
                    }
                }
            }

            localStorageManagement.setValue(vm.savedTransactionMetadataColumns,JSON.stringify($scope.transactionsMetadataColumns));
            transactionsArray.forEach(function (transactionObj) {
                var metadataObject = {};

                if((transactionObj.metadata) && (Object.keys(transactionObj.metadata).length > 0)){
                    for(var key in transactionObj.metadata){
                        if(transactionObj.metadata.hasOwnProperty(key)){
                            metadataObject[key] = transactionObj.metadata[key];
                        }
                    }
                }
                var transactionObject = {
                    user: transactionObj.user ? (
                        transactionObj.user.email || transactionObj.user.mobile || transactionObj.user.id || '(new user)'
                        ) : transactionObj.account,
                    partner: transactionObj.partner ? (
                        transactionObj.partner.user && transactionObj.partner.user.identifier ? (
                            transactionObj.partner.user.email || transactionObj.partner.user.mobile || transactionObj.partner.user.id || '(new user)'
                        ) : transactionObj.partner.account
                    ) : '',
                    tempUser: (transactionObj.user && transactionObj.user.temporary) ? true : false,
                    tempPartner: (transactionObj.partner && transactionObj.partner.user && transactionObj.partner.user.temporary) ? true : false,
                    tx_type: transactionObj.tx_type ? $filter("capitalizeWord")(transactionObj.tx_type) : '',
                    subtype: transactionObj.subtype ? transactionObj.subtype : '',
                    currencyCode: transactionObj.currency ? transactionObj.currency.display_code : '',
                    amount: transactionObj.amount ? $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(transactionObj.amount,transactionObj.currency.divisibility)) : "0.00",
                    fee: transactionObj.fee ? $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(transactionObj.fee,transactionObj.currency.divisibility)) : '',
                    status: transactionObj.status ? transactionObj.status : '',
                    id: transactionObj.id ? transactionObj.id : '',
                    createdDate: transactionObj.created ? $filter("date")(transactionObj.created,'mediumDate') + ' ' + $filter("date")(transactionObj.created,'shortTime') : '',
                    totalAmount: transactionObj.total_amount ? $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(transactionObj.total_amount,transactionObj.currency.divisibility)) : '',
                    balance: transactionObj.balance ? $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")(transactionObj.balance,transactionObj.currency.divisibility)) : '',
                    account: transactionObj.account ? transactionObj.account : '',
                    username: transactionObj.user ? transactionObj.user.username : '',
                    userId: transactionObj.user ? transactionObj.user.id : '',
                    updatedDate: transactionObj.updated ? $filter("date")(transactionObj.updated,'mediumDate') + ' ' + $filter("date")(transactionObj.updated,'shortTime') : '',
                    mobile: transactionObj.user ? transactionObj.user.mobile : '',
                    partner_tx: transactionObj.partner ? (transactionObj.partner.id ? transactionObj.partner.id : 'ID pending creation') : "",
                    label: transactionObj.label ? transactionObj.label : '',
                    reference: transactionObj.reference ? transactionObj.reference : '',
                    note: transactionObj.note ? transactionObj.note : '',
                    collectionId: transactionObj.collection ? transactionObj.collection : '',
                    metadata: transactionObj.metadata ? JSON.stringify(transactionObj.metadata) : '',
                };
                transactionObject = _.extend(transactionObject,metadataObject);
                transactionObject.id = transactionObj.id ? transactionObj.id : '';
                $scope.transactions.push(transactionObject);
            });
            if($state.params.currencyCode){
                $scope.transactions = $scope.transactions.filter(function(transaction){
                    return transaction.currencyCode === $state.params.currencyCode;
                });
                $state.params.currencyCode = null;
            };

            $scope.loadingTransactions = false;
            if(transactionId && transactionId !== 0){
                var searchedTransaction = null;
                $scope.transactions.forEach(function(transactionObj){
                    if(transactionObj.id === transactionId){
                        searchedTransaction = transactionObj;
                    }
                });
                if(searchedTransaction){$scope.openModal('app/pages/transactions/history/historyModal/historyModal.html', 'md',searchedTransaction);}
            }
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.openModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'historyModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });

        };

        $scope.openExportTransactionsModal = function (page, size) {
            vm.theExportModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ExportConfirmModalCtrl',
                resolve: {
                    filtersObjForExport: function () {
                        return $scope.filtersObjForExport;
                    },
                    visibleColumnsArray: function () {
                        return $scope.visibleColumnsArray;
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

        $scope.openMakeTransactionModal = function (page, size,newTransactionParams) {
            vm.theCreateModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                backdrop: 'static',
                keyboard: false,
                controller: 'MakeTransactionModalCtrl',
                resolve: {
                    newTransactionParams: function () {
                        return newTransactionParams;
                    }
                }
            });

            vm.theCreateModal.result.then(function(transaction){
                
                if(transaction){
                    transaction.id ? $scope.openModal('app/pages/transactions/history/historyModal/historyModal.html','md',transaction) : $scope.getLatestTransactions();
                }
            }, function(){
            });

        };

        $scope.openCustomMetadataModal = function (page, size) {
            vm.theCustomMetadata = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCustomMetadataModalCtrl',
                resolve: {
                    transactionsMetadataColumns: function () {
                        return $scope.transactionsMetadataColumns;
                    }
                }
            });

            vm.theCustomMetadata.result.then(function(metadataAdded){
                if(metadataAdded){
                    $scope.headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns));
                }
            }, function(){
            });

        };

        $scope.$on("modalClosing",function(event,transactionHasBeenUpdated){
            if(transactionHasBeenUpdated){
                // $scope.clearFilters();
                $scope.getLatestTransactions();
            }
        });

        $scope.closeColumnFiltersBox = function (callLatestTransactions) {
            if($scope.visibleColumnsSelectionChanged || callLatestTransactions){
                $scope.getLatestTransactions();
            }

            //removing deleted metadata columns from $scope.headerColumns
            var indexArray = [];
            $scope.headerColumns.forEach(function (elem,index) {
                if(elem.hide){
                    indexArray.push(index);
                }
            });
            if(indexArray.length > 0){
                indexArray = indexArray.sort(function(a, b){return b-a;});
                indexArray.forEach(function (ind) {
                    $scope.headerColumns.splice(ind,1);
                });

                localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify($scope.headerColumns));
            }

            $scope.showingColumnFilters = false;
        };

        $scope.deleteMetadataColumn = function (column) {
            column.hide = true;
        };

        $scope.styleHeaders = function (header) {
            var sortableHeaderExists = false;

            $scope.orderByOptions.forEach(function (element) {
                if(element.tableFieldName == header.fieldName){
                    sortableHeaderExists = true;
                }
            });

            if(sortableHeaderExists){
                return 'pointer sortable-header';
            }

        };

        // shortcuts from other places

        if(vm.newTransactionParams.userEmail && !vm.newTransactionParams.txType){
            $scope.openMakeTransactionModal('app/pages/transactions/history/makeTransactionModal/makeTransactionModal.html', 'md',vm.newTransactionParams);
        } 
        else if(vm.newTransactionParams.txType) {
            var config = {
                optionSelected: vm.newTransactionParams.txType === 'transfer' ? 'Transfer' : (vm.newTransactionParams.txType === 'credit' ? "Credit" : "Debit"), 
                turnedOn: false,
                tx_type: vm.newTransactionParams.txType
            };

            $scope.clearFilters();
            localStorageManagement.setValue(vm.companyIdentifier + "TxnHelper", JSON.stringify(config));
            $scope.openMakeTransactionModal('app/pages/transactions/history/makeTransactionModal/makeTransactionModal.html', 'md',vm.newTransactionParams);
        } 
        else if($state.params.openNewTransaction){
            var config = $state.params.openNewTransaction.indexOf(':') > -1 ? {
                optionSelected: "Credit", 
                turnedOn: false,
                tx_type: "credit"
            } : {
                optionSelected: "Credit deposit", 
                turnedOn: true,
                tx_type: "credit"
            };
            $scope.clearFilters();
            localStorageManagement.setValue(vm.companyIdentifier + "TxnHelper", JSON.stringify(config));

            if(config.optionSelected === "Credit"){
                vm.newTransactionParams.userEmail = $state.params.openNewTransaction.split(':')[1];
                $scope.openMakeTransactionModal('app/pages/transactions/history/makeTransactionModal/makeTransactionModal.html', 'md',vm.newTransactionParams);
            }
            else{
                $scope.openMakeTransactionModal('app/pages/transactions/history/makeTransactionModal/makeTransactionModal.html', 'md');
            }
        } 
        else if($state.params.openNewAccountTransaction){
            var config = ($state.params.openNewAccountTransaction.type === 'credit') ? {
                optionSelected: "Credit", 
                turnedOn: false,
                tx_type: "credit"
            } : {
                optionSelected: "Credit deposit", 
                turnedOn: true,
                tx_type: "credit"
            };
            $scope.clearFilters();
            localStorageManagement.setValue(vm.companyIdentifier + "TxnHelper", JSON.stringify(config));

            if(config.optionSelected === "Credit"){
                vm.newTransactionParams.userEmail = $state.params.openNewAccountTransaction.user 
                && $state.params.openNewAccountTransaction.user.email ? $state.params.openNewAccountTransaction.user.email : null;
                vm.newTransactionParams.userObj = $state.params.openNewAccountTransaction.user;
                vm.newTransactionParams.accountUser = $state.params.openNewAccountTransaction.account;
                vm.newTransactionParams.accountCurrencies = $state.params.openNewAccountTransaction.currencies;
                $scope.openMakeTransactionModal('app/pages/transactions/history/makeTransactionModal/makeTransactionModal.html', 'md', vm.newTransactionParams);
            }
            else{
                vm.newTransactionParams.userEmail = null;
                vm.newTransactionParams.accountUser = $state.params.openNewAccountTransaction.account;
                vm.newTransactionParams.accountCurrencies = $state.params.openNewAccountTransaction.currencies;
                $scope.openMakeTransactionModal('app/pages/transactions/history/makeTransactionModal/makeTransactionModal.html', 'md', vm.newTransactionParams);
            }
        }  
    }
})();
