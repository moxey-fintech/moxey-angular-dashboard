(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceCards')
        .controller('EditChiplessCardServiceCardModalCtrl', EditChiplessCardServiceCardModalCtrl);

    function EditChiplessCardServiceCardModalCtrl($scope,environmentConfig,serializeFiltersService,$uibModalInstance,_,toastr,card,extensionsHelper,$http,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "chipless_card_service";
        vm.exisitingCards = [];
        vm.editCardParams = card;
        $scope.editingCard = true;
        $scope.editCardParams = {}; 

        vm.getCard = function(){
            if(vm.token) {
                $scope.editingCard = true;
                $http.get(vm.baseUrl + 'admin/cards/' + vm.editCardParams.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                        $scope.editCardParams= res.data.data;
                        vm.findUser();
                }).catch(function (error) {
                    $scope.editingCard =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };   

        vm.findUser = function () {
            $http.get(environmentConfig.API + 'admin/users/' + $scope.editCardParams.user + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                    $scope.cardUserObj= res.data.data;
                    $scope.editingCard =  false;
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        
        $scope.editCardFunction = function () {            

            var editedCard = {
                enabled: $scope.editCardParams.enabled,
                pin: $scope.editCardParams.pin !== "" ? $scope.editCardParams.pin : null
            };

            editedCard = serializeFiltersService.objectFilters(editedCard);

            if(vm.token){
                $scope.editingCard = true;
                $http.patch(vm.baseUrl + 'admin/cards/' + $scope.editCardParams.id + '/', editedCard, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingCard = false;
                    toastr.success('Card successfully updated');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.editingCard = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };

        
        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                vm.getCard();
            })
            .catch(function(err){
                $scope.editingCard = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();