(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('AddCurrencyConversionRatesModalCtrl', AddCurrencyConversionRatesModalCtrl);

    function AddCurrencyConversionRatesModalCtrl($scope,$uibModalInstance,currenciesList,toastr,cleanObject,extensionsHelper,
                                                 currencyModifiers,$http,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "conversion_service";
        vm.exisitingRatePairs = [];
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.addingRate = true;
        $scope.invalidAmount = false;
        $scope.newRatePairParams = {
            fromCurrency: "USD",
            toCurrency: "",
            option: "rate",
            rate: null,
            path: null
        };
        $scope.currenciesList = currenciesList;

        vm.getRatePairs = function(){
            if(vm.token){
                $http.get(vm.baseUrl + 'admin/rate-pairs/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    vm.exisitingRatePairs = res.data.data.results;
                }).catch(function (error) {
                    $scope.addingRate = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.addRate = function () {            
            
            if($scope.newRatePairParams.option === "rate" && $scope.newRatePairParams.rate == 0){
                toastr.error("Rate pair rate provided is invalid.");
                return false;
            }

            var newRatePair = {
                key: $scope.newRatePairParams.fromCurrency + ":" + $scope.newRatePairParams.toCurrency,
                rate: ($scope.newRatePairParams.option === "rate") ? $scope.newRatePairParams.rate : null,
                path: ($scope.newRatePairParams.option === "path") ? $scope.newRatePairParams.path : null
            };

            newRatePair = cleanObject.cleanObj(newRatePair);
            if(vm.token){
                $scope.addingRate = true;
                $http.post(vm.baseUrl + 'admin/rate-pairs/', newRatePair, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingRate = false;
                    toastr.success('Rate successfully added');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.addingRate = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.addingRate = false;
                vm.baseUrl = serviceUrl;
                vm.getRatePairs();
            })
            .catch(function(err){
                $scope.addingRate = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();