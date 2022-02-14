(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .directive('stellarTestnetServiceConfigFinish', stellarTestnetServiceConfigFinish);

    /** @ngInject */
    function stellarTestnetServiceConfigFinish() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceConfig/stellarTestnetServiceConfigFinish/stellarTestnetServiceConfigFinish.html'
        };
    }
})();
