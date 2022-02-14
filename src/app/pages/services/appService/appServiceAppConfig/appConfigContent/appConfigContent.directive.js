(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .directive('appConfigContent', appConfigContent);

    /** @ngInject */
    function appConfigContent() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigContent/appConfigContent.html'
        };
    }
})();
