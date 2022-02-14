(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .directive('appConfigAuth', appConfigAuth);

    /** @ngInject */
    function appConfigAuth() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigAuth/appConfigAuth.html'
        };
    }
})();
