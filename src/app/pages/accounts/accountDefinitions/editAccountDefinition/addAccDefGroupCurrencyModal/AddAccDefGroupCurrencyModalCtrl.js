(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.definitions')
        .controller('AddAccDefGroupCurrencyModalCtrl', AddAccDefGroupCurrencyModalCtrl);

    /** @ngInject */
    function AddAccDefGroupCurrencyModalCtrl($scope,localStorageManagement,accDefName,groupName,currenciesOptions,existingCurrencies,_,errorHandler
                                            ,$uibModalInstance,toastr,accountDefinitionService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.existingCurrencies = existingCurrencies;
        vm.accDefName = accDefName;
        vm.groupName = groupName;
        $scope.addingAccDefGroupCurrency = false;
        $scope.currenciesOptions = currenciesOptions;
        $scope.currenciesList = [];

        $scope.filterCurrencies = function(){
            vm.existingCurrencies.forEach(function(element){
                $scope.currenciesOptions = $scope.currenciesOptions.filter(function(currency){
                    return currency.code !== element.currency.code;
                });
            });
        };
        $scope.filterCurrencies();

        $scope.addNewAccountDefGroupCurrencies = function(){
            accountDefinitionService.handleMultipleGroupCurrencyCreate(vm.accDefName, vm.groupName, $scope.currenciesList)
            .then(function(res){
                $scope.addingAccDefGroupCurrency = false;
                toastr.success('Group definition currencies successfully added');
                $uibModalInstance.close(true);
                $scope.$apply();                
            }, function(error){ 
                $scope.addingAccDefGroupCurrency = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();               
            });
        };
    }
})();