(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceConfig')
        .directive('stellarServiceConfigWarmStorage', stellarServiceConfigWarmStorage);

    /** @ngInject */
    function stellarServiceConfigWarmStorage() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceConfig/stellarServiceConfigWarmStorage/stellarServiceConfigWarmStorage.html'
        };
    }
})();
