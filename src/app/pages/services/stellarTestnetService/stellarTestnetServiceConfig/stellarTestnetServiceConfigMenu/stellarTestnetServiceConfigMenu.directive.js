(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .directive('stellarTestnetServiceConfigMenu', stellarTestnetServiceConfigMenu);

    /** @ngInject */
    function stellarTestnetServiceConfigMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceConfig/stellarTestnetServiceConfigMenu/stellarTestnetServiceConfigMenu.html'
        };
    }
})();
