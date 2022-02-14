(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .directive('notificationPushNotifications', notificationPushNotifications);

    /** @ngInject */
    function notificationPushNotifications() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/notificationService/notificationServiceSettings/notificationPushNotifications/notificationPushNotifications.html'
        };
    }
})();
