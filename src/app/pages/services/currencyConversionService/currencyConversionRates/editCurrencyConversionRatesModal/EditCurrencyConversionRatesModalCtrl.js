(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('EditCurrencyConversionRatesModalCtrl', EditCurrencyConversionRatesModalCtrl);

    /** @ngInject */
    function EditCurrencyConversionRatesModalCtrl($scope,$uibModalInstance,currenciesList,toastr,cleanObject,$http,localStorageManagement,errorHandler, 
                                                  $location, extensionsHelper, rate, $state) {

        var vm = this;
        $scope.ratePair = rate;
        $scope.ratePair.fromCurrency = $scope.ratePair.key.split(':')[0];
        $scope.ratePair.toCurrency = $scope.ratePair.key.split(':')[1];
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "conversion_service";
        vm.exisitingRatePairs = [];
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.updatingRatePair = true;
        $scope.editRatePairParams = {
            option: $scope.ratePair.rate == 0 ? "path": "rate",
            rate: null,
            path: null
        };
        
        if($scope.editRatePairParams.option === 'rate'){
            $scope.editRatePairParams.rate = $scope.ratePair.rate;
        } else {
            $scope.editRatePairParams.path = $scope.ratePair.path;
        }

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

        $scope.updateRatePair = function () {            
            var pathExists = false;
            var updatedRatePair= {};
            
            if($scope.editRatePairParams.option === "rate" && $scope.editRatePairParams.rate == 0){
                toastr.error("Rate pair rate is invalid.");
                return false;
            }
            
            updatedRatePair = {
                rate: ($scope.editRatePairParams.option === "rate") ? $scope.editRatePairParams.rate : null,
                path: ($scope.editRatePairParams.option === "path") ? $scope.editRatePairParams.path : null
            };

            if(vm.token){
                $scope.updatingRatePair = true;
                $http.patch(vm.baseUrl + 'admin/rate-pairs/' + $scope.ratePair.id + '/', updatedRatePair, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingRatePair = false;
                    toastr.success('Rate successfully updated');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.updatingRatePair = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.updatingRatePair = false;
                vm.baseUrl = serviceUrl;
                vm.getRatePairs();
            })
            .catch(function(err){
                $scope.updatingRatePair = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();