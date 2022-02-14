(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceLogs')
        .controller('NotificationServiceLogsResendModalCtrl', NotificationServiceLogsResendModalCtrl);

    /** @ngInject */
    function NotificationServiceLogsResendModalCtrl($scope,log,$http,$uibModalInstance,localStorageManagement,errorHandler,toastr,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        $scope.log = log;
        $scope.recipient = {};
        $scope.recipient.email = log.recipient
        $scope.loadingLogs = true;

        $scope.resendNotification = function () {
            $scope.loadingLogs =  true;
            if(vm.token) {
                $http.post(vm.baseUrl + 'admin/logs/' + log.id + /send/,{recipient: $scope.recipient.email}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingLogs =  false;
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Notification successfully resent');
                        $uibModalInstance.close($scope.log);
                    }
                }).catch(function (error) {
                    $scope.loadingLogs =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.loadingLogs = false;
            })
            .catch(function(err){
                $scope.loadingLogs = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
