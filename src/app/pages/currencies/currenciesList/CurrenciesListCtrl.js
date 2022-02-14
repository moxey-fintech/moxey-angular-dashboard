(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies.currenciesList')
        .controller('CurrenciesListCtrl', CurrenciesListCtrl);

    /** @ngInject */
    function CurrenciesListCtrl($rootScope,$scope,$location,localStorageManagement,$window,
                            errorHandler,$state,_,serializeFiltersService,$uibModal,Rehive, $intercom) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Currencies | Moxey';
        vm.createNewCurrencyRequest = $location.search();
        $scope.showingFilters = false;
        $scope.loadingCurrencies = true;
        $scope.optionsCode = '';
        $scope.showingRowsCurrencyCode = '';
        $scope.codeArray = [];
        $scope.currencyOptions = [];
        $scope.filtersCount = 0;
        $scope.filtersObj = {
            currencyFilter: false,
            unitFilter: false
        };
        $scope.applyFiltersObj = {
            currencyFilter:{
                selectedCurrencyOption: {}
            },
            unitFilter: {
                selectedCurrencyOption: {}
            }
        };
        $scope.pagination = {
            itemsPerPage: 15,
            pageNo: 1,
            maxSize: 5
        };

        $scope.findIndexOfCode = function (currency) {
            return $scope.codeArray.findIndex(function (element) {
                return element == currency.code;
            });
        };

        $scope.toggleRowsVisibility = function (currency) {
            if($scope.findIndexOfCode(currency) >= 0){
                var index = $scope.findIndexOfCode(currency);
                $scope.codeArray.splice(index,1);
            } else {
                $scope.codeArray.push(currency.code);
            }
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.hideFilters = function () {
            $scope.showingFilters = false;
        };

        $scope.closeOptionsBox = function () {
            $scope.optionsCode = '';
        };

        $scope.showCurrenciesOptions = function (code) {
            $scope.optionsCode = code;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                currencyFilter: false,
                unitFilter: false
            };
            $scope.filtersCount = 0;
            $scope.hideFilters();
            $scope.getCompanyCurrencies('applyfilter');
        };

        vm.getAllCompanyCurrencies = function () {
            Rehive.admin.currencies.get({filters: {
                page:1,
                page_size: 250,
                // archived: false
            }}).then(function (res) {
                if($scope.currencyOptions.length > 0){
                    $scope.currencyOptions.length = 0;
                }
                $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                $scope.currencyOptions = res.results.slice();
                $scope.currencyOptions.sort(function(a, b){
                    return a.code.localeCompare(b.code);
                });
                $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = $scope.currencyOptions[0];
                $scope.currencyOptions.sort(function(a, b){
                    return a.unit.localeCompare(b.unit);
                });
                $scope.applyFiltersObj.unitFilter.selectedCurrencyOption = $scope.currencyOptions[0];
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getAllCompanyCurrencies();

        vm.getCurrenciesFiltersObj = function(){
            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage,
                archived: false,
                code: $scope.filtersObj.currencyFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                unit: $scope.filtersObj.unitFilter ? $scope.applyFiltersObj.unitFilter.selectedCurrencyOption.unit: null
            };

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        ++$scope.filtersCount;
                    }
                }
            }

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getCompanyCurrencies = function(applyFilter){
            if($scope.showingFilters) {
                $scope.showFilters();
            }

            if(applyFilter){
                $scope.pagination.pageNo = 1;
            }

            var currenciesFiltersObj = vm.getCurrenciesFiltersObj();

            if(vm.token) {
                $scope.loadingCurrencies = true;

                Rehive.admin.currencies.get({filters: currenciesFiltersObj}).then(function (res) {
                    $scope.currencies = [];
                    $scope.currenciesData = res;
                    $scope.currencies = res.results;

                    if($scope.currencies.length > 0){  
                        $scope.currencies.forEach(function(element,idx,array){
                            if(idx === array.length - 1){
                                vm.getCurrencyOverview(element,'last');
                                return false;
                            }
                            vm.getCurrencyOverview(element);
                        });
                    } else {
                        $scope.loadingCurrencies = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getCompanyCurrencies();

        vm.getCurrencyOverview = function (currency,last) {
            if(vm.token) {
                $scope.loadingCurrencies = true;
                Rehive.admin.currencies.overview.get(currency.code).then(function (res) {
                    $scope.currencies.forEach(function (element,index) {
                        if(element.code == currency.code){
                            // _.extendOwn(element,res); // UnderscoreJS version
                            /* Lodash version */
                            var elementKeys = _.keysIn(res);
                            _.assign(element, _.pick(res, elementKeys));
                        }
                    });
                    if(last){
                        $scope.loadingCurrencies = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.goToView = function(path){
            $location.path(path);
        };

        $scope.goToHistoryState = function (code) {
            $state.go('transactions.history',{"currencyCode": code});
        };

        $scope.goToUsersState = function (code) {
            // $state.go('users',{"currencyCode": code});
            $state.go('users.list',{"currencyCode": code});
        };

        $scope.goToPendingTransactions = function (currency,state) {
            $state.go(state);
        };

        $scope.goToTransactionsModalView = function (txType) {
            $location.path('/transactions/history').search({txType: txType});
        };

        $scope.openAddCurrenciesModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCurrencyModalCtrl',
                windowClass: 'custom-stellar-asset-window',
                scope: $scope
            });

            vm.theModal.result.then(function(currency){
                if(currency){
                    vm.getAllCompanyCurrencies();
                    $scope.getCompanyCurrencies();
                }
            }, function(){
            });
        };

        if(vm.createNewCurrencyRequest.currencyAction == 'newCurrency'){
            $scope.openAddCurrenciesModal('app/pages/currencies/currenciesList/addCurrencyModal/addCurrencyModal.html','md');
            $location.search('currencyAction',null);
        }

        $scope.openDeleteCurrencyModal = function (page, size, currency) {
            vm.theDeleteModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteCurrencyModalCtrl',
                scope: $scope,
                resolve: {
                    currency: function () {
                        return currency;
                    }
                }
            });

            vm.theDeleteModal.result.then(function(currency){
                if(currency){
                    $scope.getCompanyCurrencies();
                }
            }, function(){
            });
        };
    }
})();
