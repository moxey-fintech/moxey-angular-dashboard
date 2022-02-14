(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarSettings')
        .directive('stellarSettingsMenu', stellarSettingsMenu);

    /** @ngInject */
    function stellarSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarSettings/stellarSettingsMenu/stellarSettingsMenu.html'
        };
    }
})();
