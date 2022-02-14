(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceSettings')
        .directive('businessServiceSettingsMenu', businessServiceSettingsMenu);

    /** @ngInject */
    function businessServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/businessService/businessServiceSettings/businessServiceSettingsMenu/businessServiceSettingsMenu.html'
        };
    }
})();
