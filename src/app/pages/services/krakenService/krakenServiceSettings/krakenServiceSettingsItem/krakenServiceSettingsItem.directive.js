(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.krakenService.krakenServiceSettings')
        .directive('krakenServiceSettingsItem', krakenServiceSettingsItem);

    /** @ngInject */
    function krakenServiceSettingsItem() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/krakenService/krakenServiceSettings/krakenServiceSettingsItem/krakenServiceSettingsItem.html'
        };
    }
})();
