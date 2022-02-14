(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceConfig')
        .directive('stellarServiceConfigMenu', stellarServiceConfigMenu);

    /** @ngInject */
    function stellarServiceConfigMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarService/stellarServiceConfig/stellarServiceConfigMenu/stellarServiceConfigMenu.html'
        };
    }
})();
