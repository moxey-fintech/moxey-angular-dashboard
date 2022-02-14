(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceCards')
        .controller('DeleteChiplessCardServiceCardModalCtrl', DeleteChiplessCardServiceCardModalCtrl);

    function DeleteChiplessCardServiceCardModalCtrl($scope,$uibModalInstance,card,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;

        $scope.card = card;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "chipless_card_service";
        $scope.deletingCard = true;

        $scope.deleteCard = function () {
            $scope.deletingCard = true;
            $http.delete(vm.baseUrl + 'admin/cards/' + $scope.card.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingCard = false;
                toastr.success('Card successfully deleted');
                $uibModalInstance.close($scope.card);
            }).catch(function (error) {
                $scope.deletingCard = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.loadExtensionUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.deletingCard = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.deletingCard = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.loadExtensionUrl(serviceName);
        
    }
})();
