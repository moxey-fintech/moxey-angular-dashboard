(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.notifications')
        .controller('NotificationsCtrl', NotificationsCtrl);

    /** @ngInject */
    function NotificationsCtrl($scope,Rehive,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingCompanyNotifications = true;

        vm.getCompanyNotifications = function () {
            if(vm.token) {
                $scope.loadingCompanyNotifications = true;
                Rehive.admin.notifications.get().then(function (res) {
                    $scope.loadingCompanyNotifications = false;
                    $scope.notifications = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCompanyNotifications = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyNotifications();

        $scope.toggleNotificationEnabled = function(notification){
            notification.enabled = !notification.enabled;
            $scope.saveNotifications(notification);
        };

        $scope.saveNotifications = function(notification){
          $scope.loadingCompanyNotifications = true;
            Rehive.admin.notifications.update(notification.id, {enabled: notification.enabled}).then(function (res) {
                $scope.loadingCompanyNotifications = false;
                toastr.success('You have successfully updated the notification');
                $scope.$apply();
            }, function (error) {
                $scope.loadingCompanyNotifications = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
