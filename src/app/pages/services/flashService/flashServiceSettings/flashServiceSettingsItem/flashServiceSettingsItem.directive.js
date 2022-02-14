(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.flashService.flashServiceSettings')
        .directive('flashServiceSettingsItem', flashServiceSettingsItem);

    /** @ngInject */
    function flashServiceSettingsItem() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/flashService/flashServiceSettings/flashServiceSettingsItem/flashServiceSettingsItem.html'
        };
    }
})();
