(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes')
        .controller('CurrencyConversionQuotesCtrl', CurrencyConversionQuotesCtrl);

    /** @ngInject */
    function CurrencyConversionQuotesCtrl($scope,$http,localStorageManagement,errorHandler,$uibModal,cleanObject,
                                            extensionsHelper,$location, serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "conversion_service";
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.loadingQuotes =  true;
        $scope.quotesList = [];
        $scope.showingQuotesFilters = false;
        $scope.currencyOptions = [];
        $scope.filtersObj = {
            quoteIdFilter: false,
            fromCurrencyCodeFilter: false,
            toCurrencyCodeFilter: false,
            pageSizeFilter: false
        };
        $scope.applyFiltersObj = {
            quoteIdFilter: {
                selectedQuoteId: ''
            },
            fromCurrencyCodeFilter: {
                selectedFromCurrencyCode: ''
            },
            toCurrencyCodeFilter: {
                selectedToCurrencyCode: ''
            }
        };

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };

        $scope.getCurrencies = function () {
            $http.get(vm.baseUrl + 'admin/currencies/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $scope.currencyOptions = res.data.data.results;
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };        

        $scope.showQuotesFilters = function () {
            $scope.showingQuotesFilters = !$scope.showingQuotesFilters;
        };

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 250){
                $scope.pagination.itemsPerPage = 250;
            }
        };

        $scope.clearQuotesFilters = function () {
            $scope.filtersObj = {
                quoteIdFilter: false,
                fromCurrencyCodeFilter: false,
                toCurrencyCodeFilter: false,
                pageSizeFilter: false
            };
        };

        vm.getQuotesListUrl = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            vm.filterParams = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage,
                id: $scope.filtersObj.quoteIdFilter ? $scope.applyFiltersObj.quoteIdFilter.selectedQuoteId : null,
                from_currency__code: $scope.filtersObj.fromCurrencyCodeFilter ? $scope.applyFiltersObj.fromCurrencyCodeFilter.selectedFromCurrencyCode.code : null,
                to_currency__code: $scope.filtersObj.toCurrencyCodeFilter ? $scope.applyFiltersObj.toCurrencyCodeFilter.selectedToCurrencyCode.code : null
            };

            return vm.baseUrl + 'admin/quotes/?' + serializeFiltersService.serializeFilters(cleanObject.cleanObj(vm.filterParams));
        };

        $scope.getQuotesList = function (applyFilter) {
            $scope.loadingQuotes =  true;

            $scope.showingQuotesFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.quotesList.length > 0) {
                $scope.quotesList.length = 0;
            }

            var quotesListUrl = vm.getQuotesListUrl();

            if(vm.token) {
                $http.get(quotesListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingQuotes =  false;
                    if (res.status === 200 || res.status === 201) {
                        $scope.quotesListData = res.data.data;
                        $scope.quotesList = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingQuotes =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.goToQuotesView = function (page, size, quote) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'CurrencyConversionQuotesModalCtrl',
                scope: $scope,
                resolve: {
                    quote: function () {
                        return quote;
                    }
                }
            });

            vm.theAddModal.result.then(function(quote){
                if(quote){
                    $scope.getQuotesList();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.getCurrencies();
                $scope.getQuotesList();
            })
            .catch(function(err){
                $scope.loadingQuotes = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }

})();
