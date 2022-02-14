(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceSettings')
        .directive('appServiceSettingsMenu', appServiceSettingsMenu);

    /** @ngInject */
    function appServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/appService/appServiceSettings/appServiceSettingsMenu/appServiceSettingsMenu.html'
        };
    }
})();
