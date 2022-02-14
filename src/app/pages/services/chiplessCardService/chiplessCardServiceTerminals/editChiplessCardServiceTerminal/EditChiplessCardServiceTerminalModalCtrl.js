(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceTerminals')
        .controller('EditChiplessCardServiceTerminalModalCtrl', EditChiplessCardServiceTerminalModalCtrl);

    function EditChiplessCardServiceTerminalModalCtrl($scope,$uibModalInstance,_,toastr,terminal,extensionsHelper,$http,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "chipless_card_service";
        vm.exisitingTerminals = [];
        vm.editTerminalParams = terminal;
        $scope.editingTerminal = true;
        $scope.editTerminalParams = {}; 
        $scope.currencyOptions = [];
        vm.terminalCurrencies = {};

        vm.preSortCurrencies = function(currency1, currency2){
            if(currency1.code < currency2.code){return -1;}
            if(currency1.code > currency2.code){return 1;}
            return 0;
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingTerminal = true;
                $http.get(vm.baseUrl + 'admin/currencies/?page_size=250&archived=false', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.currencyOptions = res.data.data.results.slice();
                    $scope.currencyOptions.sort(vm.preSortCurrencies);
                    $scope.editingTerminal = false;
                }).catch(function (error) {
                    $scope.editingTerminal = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };    

        vm.getTerminal = function(){
            if(vm.token) {
                $scope.editingTerminal = true;
                $http.get(vm.baseUrl + 'admin/terminals/' + vm.editTerminalParams.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                        $scope.editingTerminal =  false;
                        $scope.editTerminalParams= res.data.data;
                }).catch(function (error) {
                    $scope.editingTerminal =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };   
        
        $scope.editTerminalFunction = function () {            

            var editedTerminal = {
                name: $scope.editTerminalParams.name,
                enabled: $scope.editTerminalParams.enabled,
                currencies: _.map($scope.editTerminalParams.currencies, 'code'),
                public_key: $scope.editTerminalParams.public_key
            };

            if(vm.token){
                $scope.editingTerminal = true;
                $http.patch(vm.baseUrl + 'admin/terminals/' + $scope.editTerminalParams.id + '/', editedTerminal, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingTerminal = false;
                    toastr.success('Terminal successfully updated');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.editingTerminal = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };

        
        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.editingTerminal = false;
                vm.baseUrl = serviceUrl;
                vm.getCompanyCurrencies();
                vm.getTerminal();
            })
            .catch(function(err){
                $scope.editingTerminal = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();