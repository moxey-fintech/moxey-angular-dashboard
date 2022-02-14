(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceSettings')
        .directive('appServiceDeactivation', appServiceDeactivation);

    /** @ngInject */
    function appServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/appService/appServiceSettings/appServiceDeactivation/appServiceDeactivation.html'
        };
    }
})();
