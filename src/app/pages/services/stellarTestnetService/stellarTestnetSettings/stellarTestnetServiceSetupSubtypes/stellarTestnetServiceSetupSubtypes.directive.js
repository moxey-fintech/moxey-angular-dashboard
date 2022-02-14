(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings')
        .directive('stellarTestnetServiceSetupSubtypes', stellarTestnetServiceSetupSubtypes);

    /** @ngInject */
    function stellarTestnetServiceSetupSubtypes() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetSettings/stellarTestnetServiceSetupSubtypes/stellarTestnetServiceSetupSubtypes.html'
        };
    }
})();
