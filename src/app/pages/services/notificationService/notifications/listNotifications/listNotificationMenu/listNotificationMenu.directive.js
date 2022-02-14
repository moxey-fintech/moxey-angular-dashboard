(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotifications')
        .directive('listNotificationMenu', listNotificationMenu);

    /** @ngInject */
    function listNotificationMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/notificationService/notifications/' +
            'listNotifications/listNotificationMenu/listNotificationMenu.html'
        };
    }
})();