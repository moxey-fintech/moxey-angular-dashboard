(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification')
        .controller('CreateNotificationsCtrl', CreateNotificationsCtrl);

    /** @ngInject */
    function CreateNotificationsCtrl($scope,localStorageManagement,$location,extensionsHelper,toastr,$http) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = null; 
        $scope.pushEnabled = false;
        var serviceName = "notifications_service";
        var location = $location.path();
        var locationArray = location.split('/');
        $scope.locationIndicator = locationArray[(locationArray.length -1)];
        $scope.createNotificationView = $scope.locationIndicator;

        $scope.goToCreateNotificationView = function (path) {
            $scope.createNotificationView = path;
            // $location.path('/services/notifications/create/' + $scope.createNotificationView);
            $location.path('/extensions/notifications/create/' + $scope.createNotificationView);
        };
        $scope.goToCreateNotificationView($scope.locationIndicator);

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
