(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('EthereumHotwalletCtrl', EthereumHotwalletCtrl);

    /** @ngInject */

    function EthereumHotwalletCtrl($scope,localStorageManagement,currenciesList,_,$http,errorHandler,toastr,sharedResources,$location,extensionsHelper,
                                   $uibModal,currencyModifiers,serializeFiltersService,environmentConfig,multiOptionsFilterService,$state) {

        var vm = this;
        vm.serviceUrl = null; 
        var serviceName = "ethereum_service";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.ethereumCurrency = currenciesList.find(function (element) {
            return element.code == 'ETH';
        });
        $scope.loadingHotwalletTransactions = true;
        $scope.hotwalletObjLength = 0;
        $scope.showOptionsAccountRef = false;

        $scope.toggleCurrenciesOptions = function(){
            $scope.showOptionsAccountRef = !$scope.showOptionsAccountRef;
        };

        $scope.closeOptionsBox = function(){
            $scope.showOptionsAccountRef = false;
        };

        $scope.goToHotwalletTransactions = function(){
            $state.go('transactions.history', {accountRef: $scope.hotwalletObj.rehive_account_reference});
        };

        vm.getHotwalletActive = function (applyFilter) {
            $scope.loadingHotwalletTransactions =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/hotwallet/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingHotwalletTransactions =  false;
                    if (res.status === 200 || res.status === 201) {
                        $scope.hotwalletObj = res.data.data;
                        $scope.hotwalletObjLength = Object.keys($scope.hotwalletObj).length;
                        $scope.loadingHotwalletTransactions =  false;
                    }
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions =  false;
                    if(error.status == 404){
                        $scope.transactionsHotwalletStateMessage = 'No active hotwallet created.';
                    } else {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };        

        $scope.openAddHotwalletModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddEthereumHotwalletModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(hotwallet){
                if(hotwallet){
                    vm.getHotwalletActive();
                }
            }, function(){
            });
        };

        $scope.openFundHotwalletModal = function (page, size) {
            vm.theFundModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'FundEthereumHotwalletModalCtrl',
                scope: $scope
            });
        };

        //transactions logic

        $scope.showingHotwalletFilters = false;
        $scope.dateFilterHotwalletOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterHotwalletOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalHotwalletOptions = ['days','months'];
        $scope.filtersHotwalletCount = 0;
        $scope.filtersHotwalletObj = {
            dateFilter: false,
            amountFilter: false,
            statusFilter: false,
            transactionTypeFilter: false,
            transactionIdFilter: false,
            pageSizeFilter: false,
            orderByFilter: false
        };
        $scope.applyFiltersHotwalletObj = {
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
            orderByFilter: {
                selectedOrderByOption: 'Latest'
            }
        };
        $scope.hotwalletPagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };
        $scope.transactionsHotwallet = [];
        $scope.transactionsHotwalletStateMessage = '';
        $scope.transactionsHotwalletData = {};
        $scope.typeOptionsHotwallet = ['Credit','Debit']; //Transfer
        $scope.statusOptionsHotwallet = ['Pending','Complete','Failed','Deleted'];
        $scope.orderByOptionsHotwallet = ['Latest','Largest','Smallest'];

        sharedResources.getSubtypes().then(function (res) {
            $scope.subtypeOptionsHotwallet = _.map(res,'name');
            $scope.subtypeOptionsHotwallet.unshift('');
        });

        //for angular datepicker
        $scope.dateObjHotwallet = {};
        $scope.dateObjHotwallet.format = $scope.companyDateFormatString;
        $scope.popup1Hotwallet = {};
        $scope.open1Hotwallet = function() {
            $scope.popup1Hotwallet.opened = true;
        };

        $scope.popup2Hotwallet = {};
        $scope.open2Hotwallet = function() {
            $scope.popup2Hotwallet.opened = true;
        };
        //for angular datepicker end

        $scope.orderByFunctionHotwallet = function () {
            return ($scope.applyFiltersHotwalletObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' :
                $scope.applyFiltersHotwalletObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' :
                    $scope.applyFiltersHotwalletObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : '');
        };

        $scope.pageSizeChangedHotwallet =  function () {
            if($scope.hotwalletPagination.itemsPerPage > 250){
                $scope.hotwalletPagination.itemsPerPage = 250;
            }
        };

        $scope.showHotwalletFilters = function () {
            $scope.showingHotwalletFilters = !$scope.showingHotwalletFilters;
        };

        $scope.clearHotwalletFilters = function () {
            $scope.filtersHotwalletObj = {
                dateFilter: false,
                amountFilter: false,
                statusFilter: false,
                transactionTypeFilter: false,
                transactionIdFilter: false,
                userFilter: false,
                pageSizeFilter: false,
                orderByFilter: false
            };
        };

        $scope.dayIntervalChangedHotwallet = function () {
            if($scope.applyFiltersHotwalletObj.dateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        vm.getDateFiltersHotwalletObj = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersHotwalletObj.dateFilter);

            return {
                created__lt: evaluatedDateObj.date__lt,
                created__gt: evaluatedDateObj.date__gt
            };
        };

        vm.getAmountFiltersHotwallet = function () {
            var evaluatedAmountObj = multiOptionsFilterService.evaluatedAmounts($scope.applyFiltersHotwalletObj.amountFilter);

            return {
                amount: evaluatedAmountObj.amount,
                amount__lt: evaluatedAmountObj.amount__lt,
                amount__gt: evaluatedAmountObj.amount__gt
            };
        };

        vm.getTransactionHotwalletUrl = function(){
            $scope.filtersHotwalletCount = 0;

            for(var x in $scope.filtersHotwalletObj){
                if($scope.filtersHotwalletObj.hasOwnProperty(x)){
                    if($scope.filtersHotwalletObj[x]){
                        $scope.filtersHotwalletCount = $scope.filtersHotwalletCount + 1;
                    }
                }
            }

            if($scope.filtersHotwalletObj.dateFilter){
                vm.dateObjHotwallet = vm.getDateFiltersHotwalletObj();
            } else{
                vm.dateObjHotwallet = {
                    created__lt: null,
                    created__gt: null
                };
            }

            if($scope.filtersHotwalletObj.amountFilter){
                vm.amountObj = vm.getAmountFiltersHotwallet();
            } else{
                vm.amountObj = {
                    amount: null,
                    amount__lt: null,
                    amount__gt: null
                };
            }

            var searchObj = {
                page: $scope.hotwalletPagination.pageNo,
                page_size: $scope.filtersHotwalletObj.pageSizeFilter? $scope.hotwalletPagination.itemsPerPage : 26,
                amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,8) : null,
                amount__lt: vm.amountObj.amount__lt ? currencyModifiers.convertToCents(vm.amountObj.amount__lt,8) : null,
                amount__gt: vm.amountObj.amount__gt ? currencyModifiers.convertToCents(vm.amountObj.amount__gt,8) : null,
                created__gt: vm.dateObjHotwallet.created__gt ? Date.parse(vm.dateObjHotwallet.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObjHotwallet.created__lt ? Date.parse(vm.dateObjHotwallet.created__lt +'T00:00:00') : null,
                account: $scope.hotwalletObj.rehive_account_reference,
                orderby: $scope.filtersHotwalletObj.orderByFilter ? ($scope.applyFiltersHotwalletObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' : $scope.applyFiltersHotwalletObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' : $scope.applyFiltersHotwalletObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : null): null,
                id: $scope.filtersHotwalletObj.transactionIdFilter ? ($scope.applyFiltersHotwalletObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersHotwalletObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                tx_type: $scope.filtersHotwalletObj.transactionTypeFilter ? $scope.applyFiltersHotwalletObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersHotwalletObj.statusFilter ? $scope.applyFiltersHotwalletObj.statusFilter.selectedStatusOption: null,
                subtype: $scope.filtersHotwalletObj.transactionTypeFilter ? ($scope.applyFiltersHotwalletObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersHotwalletObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null
            };

            return environmentConfig.API + 'admin/transactions/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getLatestHotwalletTransactions = function(applyFilter){
            if(vm.token) {
                $scope.loadingHotwalletTransactions =  true;
                $scope.showingHotwalletFilters = false;

                $scope.transactionsHotwalletStateMessage = '';

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.hotwalletPagination.pageNo = 1;
                }

                if ($scope.transactionsHotwallet.length > 0) {
                    $scope.transactionsHotwallet.length = 0;
                }

                var transactionsUrl = vm.getTransactionHotwalletUrl();

                $http.get(transactionsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingHotwalletTransactions =  false;
                    if (res.status === 200 || res.status === 201) {
                        $scope.transactionsHotwalletData = res.data.data;
                        $scope.transactionsHotwallet = $scope.transactionsHotwalletData.results;
                        if ($scope.transactionsHotwallet.length == 0) {
                            $scope.transactionsHotwalletStateMessage = 'No transactions have been found';
                            return;
                        }

                        $scope.transactionsHotwalletStateMessage = '';
                    }
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions =  false;
                    $scope.transactionsHotwalletStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.refreshHotwalletPage = function () {
            vm.getHotwalletActive('applyFilter');
        };

        $scope.openHotwalletModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'HotwalletTransactionsModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    },
                    uuid: function () {
                        return $scope.hotwalletObj.user_account_identifier;
                    }
                }
            });

            vm.theModal.result.then(function(transaction){
                if(transaction){
                    $scope.clearHotwalletFilters();
                    $scope.getLatestHotwalletTransactions();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getHotwalletActive();
            })
            .catch(function(err){
                $scope.loadingHotwalletTransactions = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
