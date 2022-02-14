(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .directive('appConfigActions', appConfigActions);

    /** @ngInject */
    function appConfigActions() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigActions/appConfigActions.html'
        };
    }
})();
