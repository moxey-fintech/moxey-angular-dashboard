(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .directive('appConfigSettings', appConfigSettings);

    /** @ngInject */
    function appConfigSettings() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigSettings/appConfigSettings.html'
        };
    }
})();
