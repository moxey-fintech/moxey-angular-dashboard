(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .directive('appConfigSectionMenu', appConfigSectionMenu);

    /** @ngInject */
    function appConfigSectionMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigSectionMenu/appConfigSectionMenu.html'
        };
    }
})();
