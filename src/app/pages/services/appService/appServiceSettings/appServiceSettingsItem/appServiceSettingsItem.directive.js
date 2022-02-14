(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceSettings')
        .directive('appServiceSettingsItem', appServiceSettingsItem);

    /** @ngInject */
    function appServiceSettingsItem() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/appService/appServiceSettings/appServiceSettingsItem/appServiceSettingsItem.html'
        };
    }
})();
