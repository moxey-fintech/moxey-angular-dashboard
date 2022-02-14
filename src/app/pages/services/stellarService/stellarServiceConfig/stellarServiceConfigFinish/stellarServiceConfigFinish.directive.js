(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceConfig')
        .directive('stellarServiceConfigFinish', stellarServiceConfigFinish);

    /** @ngInject */
    function stellarServiceConfigFinish() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceConfig/stellarServiceConfigFinish/stellarServiceConfigFinish.html'
        };
    }
})();
