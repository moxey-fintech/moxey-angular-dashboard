(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionCurrencies')
        .controller('AddCurrencyConversionCurrencyModalCtrl', AddCurrencyConversionCurrencyModalCtrl);

    function AddCurrencyConversionCurrencyModalCtrl($scope,$uibModalInstance,currenciesList,toastr,cleanObject,extensionsHelper, $location,
                                                 currencyModifiers,$http,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null;
        var serviceName = "conversion_service";
        $scope.addingCurrency = true;

        vm.exisitingRatePairs = [];
        $scope.invalidAmount = false;
        $scope.newCurrencyObj = {
            code: "",
            display_code: "",
            description: "",
            symbol: "",
            unit: null,
            divisibility: null
        };
        
        $scope.currenciesList = currenciesList;

        vm.validateCurrency = function(field){
            $scope.currenciesList.forEach(function(currency){
                if(field !== 'description' && currency[field] === $scope.newCurrencyObj[field]){                    
                    return false;
                }
            });
            return true;
        };

        $scope.addCurrency = function () {            
            
            for(var property in $scope.newCurrencyObj){
                if($scope.newCurrencyObj.hasOwnProperty(property) && !vm.validateCurrency(property)){
                    toastr.error("Currency with same " + property + " value exists.");
                    return false;
                }
            }
            $scope.newCurrencyObj = cleanObject.cleanObj($scope.newCurrencyObj);

            if(vm.token){
                $scope.addingCurrency = true;
                $http.post(vm.baseUrl + 'admin/currencies/', $scope.newCurrencyObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingCurrency = false;
                    toastr.success('Currency successfully added');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.addingCurrency = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };        
    
    
        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.addingCurrency = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.addingCurrency = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();