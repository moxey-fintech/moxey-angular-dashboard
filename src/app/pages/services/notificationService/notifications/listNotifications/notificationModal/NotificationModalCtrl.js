(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotifications')
        .controller('NotificationModalCtrl', NotificationModalCtrl);

    function NotificationModalCtrl($scope,$uibModalInstance,notification,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;

        $scope.notification = notification;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        $scope.deletingNotification = true;

        $scope.deleteNotification = function () {
            $scope.deletingNotification = true;
            $http.delete(vm.baseUrl + 'admin/notifications/' + $scope.notification.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingNotification = false;
                if (res.status === 200 || res.status === 201) {
                    toastr.success('Notification successfully deleted');
                    $uibModalInstance.close($scope.notification);
                }
            }).catch(function (error) {
                $scope.deletingNotification = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.deletingNotification = false;
            })
            .catch(function(err){
                $scope.deletingNotification = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
