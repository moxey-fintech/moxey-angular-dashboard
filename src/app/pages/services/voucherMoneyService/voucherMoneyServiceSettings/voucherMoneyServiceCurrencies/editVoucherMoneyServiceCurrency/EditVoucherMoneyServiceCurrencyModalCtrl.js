(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.voucherMoneyService.voucherMoneyServiceSettings')
        .controller('EditVoucherMoneyServiceCurrencyModalCtrl', EditVoucherMoneyServiceCurrencyModalCtrl);

    function EditVoucherMoneyServiceCurrencyModalCtrl($scope,environmentConfig,serializeFiltersService,$uibModalInstance,_,toastr,currency,extensionsHelper,$http,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "vouchermoney_service";
        vm.exisitingCurrencies = [];
        vm.editCurrencyParams = currency;
        $scope.editingCurrency = true;
        $scope.loadingCurrencies = true;
        $scope.editCurrencyParams = {}; 

        vm.getCurrency = function(){
            if(vm.token) {
                $scope.editingCurrency = true;
                $http.get(vm.baseUrl + 'admin/currencies/' + vm.editCurrencyParams.code + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                        $scope.editCurrencyParams= res.data.data;
                        $scope.editingCurrency =  false;
                }).catch(function (error) {
                    $scope.editingCurrency =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };   
        
        $scope.editCurrencyFunction = function () {            

            var editedCurrency = {
                vouchermoney_code: $scope.editCurrencyParams.vouchermoney_code
            };

            editedCurrency = serializeFiltersService.objectFilters(editedCurrency);

            if(vm.token){
                $scope.editingCurrency = true;
                $http.patch(vm.baseUrl + 'admin/currencies/' + $scope.editCurrencyParams.code + '/', editedCurrency, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingCurrency = false;
                    $scope.loadingCurrencies = false;
                    toastr.success('Currency successfully updated');
                    $uibModalInstance.close(res.data);
                    
                }).catch(function (error) {
                    $scope.editingCurrency = false;
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };
        
        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                vm.getCurrency();
            })
            .catch(function(err){
                $scope.editingCurrency = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();