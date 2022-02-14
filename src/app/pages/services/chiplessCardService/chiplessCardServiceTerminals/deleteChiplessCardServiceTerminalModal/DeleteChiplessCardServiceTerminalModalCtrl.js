(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceTerminals')
        .controller('DeleteChiplessCardServiceTerminalModalCtrl', DeleteChiplessCardServiceTerminalModalCtrl);

    function DeleteChiplessCardServiceTerminalModalCtrl($scope,$uibModalInstance,terminal,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;

        $scope.terminal = terminal;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "chipless_card_service";
        $scope.deletingTerminal = true;

        $scope.deleteTerminal = function () {
            $scope.deletingTerminal = true;
            $http.delete(vm.baseUrl + 'admin/terminals/' + $scope.terminal.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingTerminal = false;
                toastr.success('Terminal successfully deleted');
                $uibModalInstance.close($scope.terminal);
            }).catch(function (error) {
                $scope.deletingTerminal = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.loadExtensionUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.deletingTerminal = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.deletingTerminal = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.loadExtensionUrl(serviceName);
        
    }
})();
