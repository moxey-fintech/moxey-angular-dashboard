(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceTerminals')
        .controller('ViewChiplessCardTerminalModalCtrl', ViewChiplessCardTerminalModalCtrl);

    function ViewChiplessCardTerminalModalCtrl($scope,$http,terminalObj,localStorageManagement,errorHandler,toastr,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "chipless_card_service";
        $scope.loadingTerminal = true;

        vm.getTerminal = function(){
            if(vm.token) {
                $scope.loadingTerminal = true;
                $http.get(vm.serviceUrl + 'admin/terminals/' + terminalObj.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.loadingTerminal =  false;
                        $scope.terminalObj = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingTerminal =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };    
            

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getTerminal();
            })
            .catch(function(err){
                $scope.loadingTerminal = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
