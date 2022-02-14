(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .directive('notificationWebhooks', notificationWebhooks);

    /** @ngInject */
    function notificationWebhooks() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/notificationService/notificationServiceSettings/notificationWebhooks/notificationWebhooks.html'
        };
    }
})();
