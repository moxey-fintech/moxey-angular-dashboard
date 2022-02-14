(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionSettings')
        .directive('currencyConversionSettingsMenu', currencyConversionSettingsMenu);

    /** @ngInject */
    function currencyConversionSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/currencyConversionService/currencyConversionSettings/' +
            'currencyConversionSettingsMenu/currencyConversionSettingsMenu.html'
        };
    }
})();
