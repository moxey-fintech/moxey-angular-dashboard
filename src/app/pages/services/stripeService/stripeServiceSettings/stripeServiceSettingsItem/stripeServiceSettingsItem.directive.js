(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stripeService.stripeServiceSettings')
        .directive('stripeServiceSettingsItem', stripeServiceSettingsItem);

    /** @ngInject */
    function stripeServiceSettingsItem() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stripeService/stripeServiceSettings/stripeServiceSettingsItem/stripeServiceSettingsItem.html'
        };
    }
})();
