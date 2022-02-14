(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreTestnetService.wyreTestnetServiceSettings')
        .directive('wyreTestnetServiceSettingsMenu', wyreTestnetServiceSettingsMenu);

    /** @ngInject */
    function wyreTestnetServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/wyreTestnetService/wyreTestnetServiceSettings/wyreTestnetServiceSettingsMenu/wyreTestnetServiceSettingsMenu.html'
        };
    }
})();
