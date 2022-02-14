(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('TwilioModalCtrl', TwilioModalCtrl);

    /** @ngInject */
    function TwilioModalCtrl($scope,$http,errorHandler,toastr,$location,extensionsHelper,
                             $uibModalInstance,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        $scope.loadingTwilioCreds =  true;
        $scope.twilioCredsParams = {};

        $scope.addTwilioCredentials = function (twilioCredsParams) {
            $scope.loadingTwilioCreds =  true;
            if(vm.token) {
                var twilioCredsObj = {
                    credential_type: "twilio",
                    credentials: {
                        twilio_sid: twilioCredsParams.twilio_sid,
                        twilio_token: twilioCredsParams.twilio_token,
                        twilio_from_number: twilioCredsParams.twilio_from_number
                    }
                };

                $http.post(vm.baseUrl + 'admin/credentials/',twilioCredsObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.loadingTwilioCreds =  false;
                        toastr.success('Twilio credentials have been successfully added');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.loadingTwilioCreds =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.loadingTwilioCreds = false;
            })
            .catch(function(err){
                $scope.loadingTwilioCreds = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
