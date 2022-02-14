(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreService.wyreServiceSettings')
        .directive('wyreServiceSettingsMenu', wyreServiceSettingsMenu);

    /** @ngInject */
    function wyreServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/wyreService/wyreServiceSettings/wyreServiceSettingsMenu/wyreServiceSettingsMenu.html'
        };
    }
})();
