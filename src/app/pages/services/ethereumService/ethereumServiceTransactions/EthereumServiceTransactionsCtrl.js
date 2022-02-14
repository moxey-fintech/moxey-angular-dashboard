(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceTransactions')
        .controller('EthereumServiceTransactionsCtrl', EthereumServiceTransactionsCtrl);

    /** @ngInject */
    function EthereumServiceTransactionsCtrl($rootScope, $scope,$http,localStorageManagement,$uibModal,toastr,multiOptionsFilterService,currenciesList,
                                             errorHandler,$state,$window,typeaheadService,serializeFiltersService,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "ethereum_service";
        $rootScope.dashboardTitle = 'Ethereum extension | Moxey';
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.showingFilters = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.filtersCount = 0;
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

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.pagination.itemsPerPage : 26,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                email: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? encodeURIComponent($scope.applyFiltersObj.userFilter.selectedUserOption) : null): null,
                transaction_hash: $scope.filtersObj.transactionHashFilter ? ($scope.applyFiltersObj.transactionHashFilter.selectedTransactionHashOption ? encodeURIComponent($scope.applyFiltersObj.transactionHashFilter.selectedTransactionHashOption) : null): null,
                rehive_code: $scope.filtersObj.transactionIdFilter ? ($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                tx_type: $scope.filtersObj.transactionTypeFilter ? $scope.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatusOption: null
            };

            return vm.serviceUrl + 'admin/transactions/?' + serializeFiltersService.serializeFilters(searchObj);
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
                        $scope.transactions = $scope.transactionsData.results;
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

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.openModal = function (page, size,transaction) {
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EthereumServiceTransactionsModalCtrl',
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
                $scope.loadingTransactions = false;
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
