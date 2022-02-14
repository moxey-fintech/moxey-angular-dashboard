(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .directive('notificationDeactivation', notificationDeactivation);

    /** @ngInject */
    function notificationDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/notificationService/notificationServiceSettings/notificationDeactivation/notificationDeactivation.html'
        };
    }
})();
