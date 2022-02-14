(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings')
        .directive('stellarTestnetServiceSettingsUserDefaults', stellarTestnetServiceSettingsUserDefaults);

    /** @ngInject */
    function stellarTestnetServiceSettingsUserDefaults() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetSettings/stellarTestnetServiceSettingsUserDefaults/stellarTestnetServiceSettingsUserDefaults.html'
        };
    }
})();
