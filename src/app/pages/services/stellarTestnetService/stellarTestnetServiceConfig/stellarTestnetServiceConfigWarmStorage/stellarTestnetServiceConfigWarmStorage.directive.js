(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .directive('stellarTestnetServiceConfigWarmStorage', stellarTestnetServiceConfigWarmStorage);

    /** @ngInject */
    function stellarTestnetServiceConfigWarmStorage() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceConfig/stellarTestnetServiceConfigWarmStorage/stellarTestnetServiceConfigWarmStorage.html'
        };
    }
})();
