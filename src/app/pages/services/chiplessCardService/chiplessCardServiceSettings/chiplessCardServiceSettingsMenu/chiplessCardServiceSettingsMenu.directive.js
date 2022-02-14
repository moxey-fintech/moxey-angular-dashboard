(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceSettings')
        .directive('chiplessCardServiceSettingsMenu', chiplessCardServiceSettingsMenu);

    /** @ngInject */
    function chiplessCardServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/chiplessCardService/chiplessCardServiceSettings/chiplessCardServiceSettingsMenu/chiplessCardServiceSettingsMenu.html'
        };
    }
})();
