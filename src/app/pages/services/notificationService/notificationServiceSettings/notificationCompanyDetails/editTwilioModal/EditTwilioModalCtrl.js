(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('EditTwilioModalCtrl', EditTwilioModalCtrl);

    /** @ngInject */
    function EditTwilioModalCtrl($scope,$http,errorHandler,twilioCreds,$location,extensionsHelper,
                                $uibModalInstance,toastr,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        $scope.editingTwilioCreds =  true;
        $scope.editTwilioCredsObj = twilioCreds.credentials;
        vm.updatedTwilioCreds = {};

        $scope.updateTwilioCredentials = function () {
            $scope.editingTwilioCreds =  true;
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/credentials/' + twilioCreds.id + '/',{ credentials : $scope.editTwilioCredsObj}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.editingTwilioCreds =  false;
                        toastr.success('Twilio credentials have been successfully updated');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.editingTwilioCreds =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.editingTwilioCreds = false;
            })
            .catch(function(err){
                $scope.editingTwilioCreds = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
