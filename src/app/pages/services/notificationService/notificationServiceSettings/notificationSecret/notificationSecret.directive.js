(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .directive('notificationSecret', notificationSecret);

    /** @ngInject */
    function notificationSecret() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/notificationService/notificationServiceSettings/notificationSecret/notificationSecret.html'
        };
    }
})();
