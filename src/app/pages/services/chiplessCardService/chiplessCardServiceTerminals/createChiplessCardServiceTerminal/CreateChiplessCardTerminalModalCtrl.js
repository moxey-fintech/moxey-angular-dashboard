(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceTerminals')
        .controller('CreateChiplessCardTerminalModalCtrl', CreateChiplessCardTerminalModalCtrl);

    function CreateChiplessCardTerminalModalCtrl($scope,$uibModalInstance,_,toastr,cleanObject,extensionsHelper,$http,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "chipless_card_service";
        vm.exisitingTerminals = [];
        $scope.addingTerminal = true;
        $scope.newTerminalParams = {
            name: "",
            currencies: [],
            enabled: true,
            public_key: ""
        };

        vm.preSortCurrencies = function(currency1, currency2){
            if(currency1.code < currency2.code){return -1;}
            if(currency1.code > currency2.code){return 1;}
            return 0;
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(vm.baseUrl + 'admin/currencies/?page_size=250&archived=false', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.currencyOptions = res.data.data.results.slice();
                    $scope.currencyOptions.sort(vm.preSortCurrencies);
                    $scope.addingTerminal = false;
                }).catch(function (error) {
                    $scope.addingTerminal = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };    

        $scope.addTerminal = function () {            

            var newTerminal = {
                name: $scope.newTerminalParams.name,
                enabled: $scope.newTerminalParams.enabled,
                currencies: _.map($scope.newTerminalParams.currencies, 'code'),
                public_key: $scope.newTerminalParams.public_key
            };

           // newTerminal = cleanObject.cleanObj(newTerminal);  What does this do?

            if(vm.token){
                $scope.addingTerminal = true;
                $http.post(vm.baseUrl + 'admin/terminals/', newTerminal, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingTerminal = false;
                    toastr.success('Terminal successfully added');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.addingTerminal = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };
        

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.addingTerminal = false;
                vm.baseUrl = serviceUrl;
                vm.getCompanyCurrencies();
            })
            .catch(function(err){
                $scope.addingTerminal = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();