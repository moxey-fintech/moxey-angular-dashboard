(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings')
        .directive('stellarTestnetSettingsMenu', stellarTestnetSettingsMenu);

    /** @ngInject */
    function stellarTestnetSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetSettings/stellarTestnetSettingsMenu/stellarTestnetSettingsMenu.html'
        };
    }
})();
