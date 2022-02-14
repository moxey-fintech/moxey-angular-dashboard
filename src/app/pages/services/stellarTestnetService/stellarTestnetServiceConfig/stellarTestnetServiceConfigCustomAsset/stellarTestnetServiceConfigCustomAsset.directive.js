(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .directive('stellarTestnetServiceSetupCustomAsset', stellarTestnetServiceSetupCustomAsset);

    /** @ngInject */
    function stellarTestnetServiceSetupCustomAsset() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceConfig/stellarTestnetServiceConfigCustomAsset/stellarTestnetServiceConfigCustomAsset.html'
        };
    }
})();
