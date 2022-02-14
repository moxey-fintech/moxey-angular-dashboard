(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .directive('stellarTestnetServiceSetupUserDefaults', stellarTestnetServiceSetupUserDefaults);

    /** @ngInject */
    function stellarTestnetServiceSetupUserDefaults() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceConfig/stellarTestnetServiceConfigUserDefaults/stellarTestnetServiceConfigUserDefaults.html'
        };
    }
})();
