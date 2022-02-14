(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.krakenService.krakenServiceSettings')
        .directive('krakenServiceSettingsMenu', krakenServiceSettingsMenu);

    /** @ngInject */
    function krakenServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/krakenService/krakenServiceSettings/krakenServiceSettingsMenu/krakenServiceSettingsMenu.html'
        };
    }
})();
