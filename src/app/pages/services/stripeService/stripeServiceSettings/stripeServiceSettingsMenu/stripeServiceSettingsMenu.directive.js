(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stripeService.stripeServiceSettings')
        .directive('stripeServiceSettingsMenu', stripeServiceSettingsMenu);

    /** @ngInject */
    function stripeServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stripeService/stripeServiceSettings/stripeServiceSettingsMenu/stripeServiceSettingsMenu.html'
        };
    }
})();
