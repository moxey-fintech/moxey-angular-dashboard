(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .directive('stellarTestnetServiceSetupHotwalletAndWarmstorage', stellarTestnetServiceSetupHotwalletAndWarmstorage);

    /** @ngInject */
    function stellarTestnetServiceSetupHotwalletAndWarmstorage() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceConfig/stellarTestnetServiceConfigHotwalletAndWarmstorage/stellarTestnetServiceConfigHotwalletAndWarmstorage.html'
        };
    }
})();
