(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.exchangeServiceSettings')
        .directive('exchangeSettingsMenu', exchangeSettingsMenu);

    /** @ngInject */
    function exchangeSettingsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/exchangeService/exchangeServiceSettings/exchangeSettingsMenu/exchangeSettingsMenu.html'
        };
    }
})();
