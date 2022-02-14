(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotifications')
        .directive('actionsBox', actionsBox);

    /** @ngInject */
    function actionsBox() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/notificationService/notifications/' +
            'listNotifications/actionsBox/actionsBox.html'
        };
    }
})();