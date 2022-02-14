(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('CurrencyConversionRatesCtrl', CurrencyConversionRatesCtrl);

    /** @ngInject */
    function CurrencyConversionRatesCtrl($rootScope,$scope,$http,localStorageManagement,errorHandler,$uibModal,$filter,
                                        $location,extensionsHelper,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "conversion_service";
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        // $rootScope.dashboardTitle = 'Conversion service | Moxey';
        $rootScope.dashboardTitle = 'Conversion extension | Moxey';
        $scope.loadingRates =  true;

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };

        vm.getRatesListUrl = function(){

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage; // all the params of the filtering

            return vm.baseUrl + 'admin/rate-pairs/' + vm.filterParams;
        };

        $scope.getCurrencies = function () {
            $http.get(vm.baseUrl + 'admin/currencies/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $scope.currenciesList = res.data.data.results;
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        // $scope.getCurrencies();

        $scope.getRatePairsList = function () {
            $scope.loadingRates =  true;
            $scope.ratePairsList = [];

            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/rate-pairs/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingRates =  false;
                    $scope.ratePairsListData = res.data.data;
                    $scope.ratePairsList = res.data.data.results;
                    $scope.ratePairsList.forEach(function(ratePair){
                        if(!ratePair.path){
                            ratePair.path = "--";
                        } 
                        ratePair.rate = $filter('roundDecimalPartFilter')(currencyModifiers.convertToCents(ratePair.rate, 18), 18);
                        ratePair.created = $filter("date")(ratePair.created,'mediumDate') + ' ' + $filter("date")(ratePair.created,'shortTime');
                        ratePair.updated = $filter("date")(ratePair.updated,'mediumDate') + ' ' + $filter("date")(ratePair.updated,'shortTime');
                    });

                }).catch(function (error) {
                    $scope.loadingRates =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.goToAddRatesView = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCurrencyConversionRatesModalCtrl',
                scope: $scope,
                resolve: {
                    currenciesList: function () {
                        return $scope.currenciesList;
                    }
                }
            });

            vm.theAddModal.result.then(function(rates){
                if(rates){
                    $scope.getRatePairsList();
                }

            }, function(){
            });
        };

        $scope.openDeleteRatesModal = function (page, size,rate) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteCurrencyConversionRatesModalCtrl',
                scope: $scope,
                resolve: {
                    rate: function () {
                        return rate;
                    }
                }
            });

            vm.theModal.result.then(function(rate){
                if(rate){
                    $scope.getRatePairsList();
                }
            }, function(){
            });
        };

        $scope.openEditRatesModal = function (page, size,rate) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditCurrencyConversionRatesModalCtrl',
                scope: $scope,
                resolve: {
                    rate: function () {
                        return rate;
                    }
                }
            });

            vm.theModal.result.then(function(rate){
                if(rate){
                    $scope.getRatePairsList();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.getRatePairsList();
            })
            .catch(function(err){
                $scope.loadingRates = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }

})();
