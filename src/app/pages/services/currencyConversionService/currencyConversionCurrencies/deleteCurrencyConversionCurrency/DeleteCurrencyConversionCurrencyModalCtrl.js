(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('DeleteCurrencyConversionCurrencyModalCtrl', DeleteCurrencyConversionCurrencyModalCtrl);

    function DeleteCurrencyConversionCurrencyModalCtrl($scope,$uibModalInstance,currency,toastr,$http,localStorageManagement,
                                                        $location,extensionsHelper,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null;
        var serviceName = "conversion_service";
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.deletingCurrency = true;
        $scope.currency = currency;

        $scope.deleteCurrency = function () {
            $scope.deletingCurrency = true;
            $http.delete(vm.baseUrl + 'admin/currencies/' + $scope.currency.code + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingRate = false;
                toastr.success('Rate successfully deleted');
                $uibModalInstance.close($scope.currency);
            }).catch(function (error) {
                $scope.deletingRate = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.deletingCurrency = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.deletingCurrency = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
