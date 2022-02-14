(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.massSendService.massSendServiceSettings')
        .directive('massSendServiceSettingsMenu', massSendServiceSettingsMenu);

    /** @ngInject */
    function massSendServiceSettingsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/massSendService/massSendServiceSettings/massSendServiceSettingsMenu/massSendServiceSettingsMenu.html'
        };
    }
})();
