(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionCurrencies')
        .controller('CurrencyConversionCurrenciesCtrl', CurrencyConversionCurrenciesCtrl);

    /** @ngInject */
    function CurrencyConversionCurrenciesCtrl($rootScope,$scope,$http,$location,extensionsHelper,localStorageManagement,errorHandler,$uibModal,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null;
        var serviceName = "conversion_service";
        $rootScope.dashboardTitle = 'Conversion extension | Moxey';
        $scope.loadingCurrencies = true;

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };

        vm.getCurrencies = function () {
            if(vm.token){
                $scope.loadingCurrencies = true;
                $http.get(vm.baseUrl + 'admin/currencies/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.currenciesList = res.data.data.results;
                    $scope.currenciesListData = res.data.data;
                    $scope.loadingCurrencies = false;
                }).catch(function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };
        

        $scope.goToAddCurrenciesView = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCurrencyConversionCurrencyModalCtrl',
                scope: $scope,
                resolve: {
                    currenciesList: function () {
                        return $scope.currenciesList;
                    }
                }
            });

            vm.theAddModal.result.then(function(currencies){
                if(currencies){
                    vm.getCurrencies();
                }

            }, function(){
            });
        };

        $scope.openDeleteCurrenciesModal = function (page, size,currency) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteCurrencyConversionCurrencyModalCtrl',
                scope: $scope,
                resolve: {
                    currency: function () {
                        return currency;
                    }
                }
            });

            vm.theModal.result.then(function(currency){
                if(currency){
                    vm.getCurrencies();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.loadingCurrencies = false;
                vm.baseUrl = serviceUrl;
                vm.getCurrencies();
            })
            .catch(function(err){
                $scope.loadingCurrencies = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
   }

})();
