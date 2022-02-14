(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .directive('appConfigColors', appConfigColors);

    /** @ngInject */
    function appConfigColors() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigColors/appConfigColors.html'
        };
    }
})();
