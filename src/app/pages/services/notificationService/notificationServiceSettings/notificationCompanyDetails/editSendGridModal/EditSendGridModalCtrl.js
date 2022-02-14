(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('EditSendGridModalCtrl', EditSendGridModalCtrl);

    /** @ngInject */
    function EditSendGridModalCtrl($scope,$http,errorHandler,sendGridCreds,extensionsHelper,$location,
                                   $uibModalInstance,toastr,localStorageManagement) {


        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        $scope.editingSendGridCreds =  true;
        $scope.editSendGridCredsObj = sendGridCreds.credentials;
        vm.updatedSendGridCreds = {};

        $scope.updateSendGridCredentials = function () {
            $scope.editingSendGridCreds =  true;
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/credentials/' + sendGridCreds.id + '/',{ credentials: $scope.editSendGridCredsObj}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.editingSendGridCreds =  false;
                        toastr.success('Sendgrid credentials have been successfully updated');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.editingSendGridCreds =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.editingSendGridCreds = false;
            })
            .catch(function(err){
                $scope.editingSendGridCreds = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
