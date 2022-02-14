(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.flashService.flashServiceSettings')
        .directive('flashServiceSettingsMenu', flashServiceSettingsMenu);

    /** @ngInject */
    function flashServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/flashService/flashServiceSettings/flashServiceSettingsMenu/flashServiceSettingsMenu.html'
        };
    }
})();
