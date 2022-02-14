(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .directive('appConfigAccounts', appConfigAccounts);

    /** @ngInject */
    function appConfigAccounts() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigAccounts/appConfigAccounts.html'
        };
    }
})();
