(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.icoServiceSettings')
        .directive('icoServiceSettingsMenu', icoServiceSettingsMenu);

    /** @ngInject */
    function icoServiceSettingsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/icoService/icoServiceSettings/icoServiceSettingsMenu/icoServiceSettingsMenu.html'
        };
    }
})();
