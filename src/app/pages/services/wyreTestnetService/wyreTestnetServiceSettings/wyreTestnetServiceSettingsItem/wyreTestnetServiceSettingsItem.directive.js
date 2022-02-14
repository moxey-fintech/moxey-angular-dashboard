(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreTestnetService.wyreTestnetServiceSettings')
        .directive('wyreTestnetServiceSettingsItem', wyreTestnetServiceSettingsItem);

    /** @ngInject */
    function wyreTestnetServiceSettingsItem() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/wyreTestnetService/wyreTestnetServiceSettings/wyreTestnetServiceSettingsItem/wyreTestnetServiceSettingsItem.html'
        };
    }
})();
