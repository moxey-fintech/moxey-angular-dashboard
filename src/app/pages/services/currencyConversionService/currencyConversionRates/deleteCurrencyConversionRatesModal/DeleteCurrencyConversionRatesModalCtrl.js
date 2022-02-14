(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('DeleteCurrencyConversionRatesModalCtrl', DeleteCurrencyConversionRatesModalCtrl);

    function DeleteCurrencyConversionRatesModalCtrl($scope,$uibModalInstance,rate,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;

        $scope.rate = rate;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "conversion_service";
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.deletingRate = true;

        if(!$scope.rate.path){
            $scope.rate.path = "N/A";
        }

        $scope.deleteRate = function () {
            $scope.deletingRate = true;
            $http.delete(vm.baseUrl + 'admin/rate-pairs/' + $scope.rate.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingRate = false;
                toastr.success('Rate successfully deleted');
                $uibModalInstance.close($scope.rate);
            }).catch(function (error) {
                $scope.deletingRate = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.loadExtensionUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.deletingRate = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.deletingRate = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.loadExtensionUrl(serviceName);
        
    }
})();
