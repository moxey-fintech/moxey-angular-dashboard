(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceSettings')
        .directive('ethereumServiceSettingsMenu', ethereumServiceSettingsMenu);

    /** @ngInject */
    function ethereumServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceSettings/ethereumServiceSettingsMenu/ethereumServiceSettingsMenu.html'
        };
    }
})();
