(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.krakenService.krakenServiceSettings')
        .controller('AddKrakenServiceExchangePairModalCtrl', AddKrakenServiceExchangePairModalCtrl);

    function AddKrakenServiceExchangePairModalCtrl($scope,environmentConfig,Rehive,serializeFiltersService,$uibModalInstance,toastr,extensionsHelper,$http,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "kraken_service";
        vm.exisitingExchangePair = [];
        $scope.addingExchangePair = true;
        $scope.exchangePairParams = {
            symbol: "",
            base_currency: "",
            quote_currency: "",
            enabled: true
        };   

        $scope.addExchangePair = function () {            

            var pairObj = {
                symbol: $scope.exchangePairParams.symbol,
                base_currency: $scope.exchangePairParams.base_currency.code,
                quote_currency: $scope.exchangePairParams.quote_currency.code,
                enabled: $scope.exchangePairParams.enabled 
            };

            pairObj = serializeFiltersService.objectFilters(pairObj);

            if(vm.token){
                $scope.addingExchangePair = true;
                $http.post(vm.baseUrl + 'admin/exchange-pairs/', pairObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingExchangePair = false;
                    toastr.success('Exchange pair successfully added');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.addingExchangePair = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.addingExchangePair = false;
            })
            .catch(function(err){
                $scope.addingExchangePair = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();