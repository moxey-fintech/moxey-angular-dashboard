(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceConfig')
        .directive('stellarServiceConfigHotwallet', stellarServiceConfigHotwallet);

    /** @ngInject */
    function stellarServiceConfigHotwallet() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceConfig/stellarServiceConfigHotwallet/stellarServiceConfigHotwallet.html'
        };
    }
})();
