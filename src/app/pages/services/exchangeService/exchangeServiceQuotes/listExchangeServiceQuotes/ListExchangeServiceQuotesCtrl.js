(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.listExchangeServiceQuotes')
        .controller('ListExchangeServiceQuotesCtrl', ListExchangeServiceQuotesCtrl);

    /** @ngInject */
    function ListExchangeServiceQuotesCtrl($scope,$http,localStorageManagement,$uibModal,errorHandler,serializeFiltersService,
                                           typeaheadService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.showingFilters = false;
        $scope.loadingQuotes =  false;
        $scope.filtersCount = 0;
        $scope.quotesList =  [];
        $scope.quotesListData = {};
        $scope.quotesListStateMessage = '';
        $scope.filtersObj = {
            emailFilter: false
        };
        $scope.applyFiltersObj = {
            emailFilter: {
                selectedEmailFilter: ''
            }
        };

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };
        
        vm.currencies = [
          {
            "code": "USD",
            "description": "United States Dollar",
            "symbol": "$",
            "unit": "dollar",
            "divisibility": 2,
            "archived": false
          },
          {
            "code": "NGN",
            "description": "Nigerian Naira",
            "symbol": "\u20a6",
            "unit": "naira",
            "divisibility": 2,
            "archived": false
          }
        ];      

        vm.getCurrency = function(code) {
          var result = $.grep(vm.currencies, function(e){ return e.code == code; });
          return result.length == 0 ? {} : result[0];
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                emailFilter: false
            };
        };

        vm.getQuoteListUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage,
                email: $scope.filtersObj.emailFilter ? ($scope.applyFiltersObj.emailFilter.selectedEmailFilter ? encodeURIComponent($scope.applyFiltersObj.emailFilter.selectedEmailFilter) : null): null
              };

            return 'http://45.55.183.106:8000/api/admin/quotes/?' + serializeFiltersService.serializeFilters(searchObj);

            //return vm.baseUrl + 'admin/quotes/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getQuotesList = function (applyFilter) {

            $scope.showingFilters = false;

            $scope.quotesListStateMessage = '';
            $scope.loadingQuotes =  true;

            if(applyFilter) {
                // if function is called from exchange-filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.quotesList.length > 0) {
                $scope.quotesList.length = 0;
            }

            $scope.quotesList = [];

            var quoteListUrl = vm.getQuoteListUrl();

            if(vm.token) {
                $http.get(quoteListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingQuotes =  false;
                    if (res.status === 200 || res.status === 201) {
                        if(res.data.data.results.length > 0){
                            $scope.quotesListData = res.data.data;
                            var quotes = res.data.data.results;
                            for(var i=0;i<quotes.length;i++) {
                                var quote = quotes[i];
                                quote.from_currency = vm.getCurrency(quote.from_currency);
                                quote.to_currency = vm.getCurrency(quote.to_currency);
                            }

                            $scope.quotesList = quotes;
                        } else {
                            $scope.quotesListStateMessage = 'No quotes are available';
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingQuotes =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getQuotesList();

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.openTransactionsModal = function (page, size,quote ) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ExchangeServiceQuoteModalCtrl',
                scope: $scope,
                resolve: {
                    quote: function () {
                        return quote;
                    }
                }
            });
        };


    }

})();
