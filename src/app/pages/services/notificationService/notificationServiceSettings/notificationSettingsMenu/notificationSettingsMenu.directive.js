(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .directive('notificationSettingsMenu', notificationSettingsMenu);

    /** @ngInject */
    function notificationSettingsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/notificationService/notificationServiceSettings/notificationSettingsMenu/notificationSettingsMenu.html'
        };
    }
})();
