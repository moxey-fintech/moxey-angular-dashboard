(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes')
        .controller('ConvertCurrencyConversionQuoteModalCtrl', ConvertCurrencyConversionQuoteModalCtrl);

    function ConvertCurrencyConversionQuoteModalCtrl($scope,$uibModalInstance,quote,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "conversion_service";
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.convertingQuote = true;
        
        $scope.convertQuoteParams = {
            quoteId: quote.id
        };

        $scope.convertQuote = function (convertQuoteParams) {
            $scope.convertingQuote = true;

            $http.post(vm.baseUrl + 'admin/conversions/', {quote: convertQuoteParams.quoteId,recipient: convertQuoteParams.recipient}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.convertingQuote = false;
                if (res.status === 201) {
                    toastr.success('Quote converted successfully');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.convertingQuote = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.convertingQuote = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.convertingQuote = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);


    }
})();
