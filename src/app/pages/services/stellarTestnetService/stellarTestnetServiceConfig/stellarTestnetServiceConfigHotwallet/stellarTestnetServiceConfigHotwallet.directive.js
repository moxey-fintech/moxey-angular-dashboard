(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .directive('stellarTestnetServiceConfigHotwallet', stellarTestnetServiceConfigHotwallet);

    /** @ngInject */
    function stellarTestnetServiceConfigHotwallet() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceConfig/stellarTestnetServiceConfigHotwallet/stellarTestnetServiceConfigHotwallet.html'
        };
    }
})();
