(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotifications')
        .directive('listNotificationFilters', listNotificationFilters);

    /** @ngInject */
    function listNotificationFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/notificationService/notifications/' +
            'listNotifications/listNotificationFilters/listNotificationFilters.html'
        };
    }
})();