(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarSettings')
        .directive('stellarServiceSetupSubtypes', stellarServiceSetupSubtypes);

    /** @ngInject */
    function stellarServiceSetupSubtypes() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarSettings/stellarServiceSetupSubtypes/stellarServiceSetupSubtypes.html'
        };
    }
})();
