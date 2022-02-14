(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings')
        .directive('stellarTestnetToml', stellarTestnetToml);

    /** @ngInject */
    function stellarTestnetToml() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetSettings/stellarTestnetTOML/stellarTestnetTOML.html'
        };
    }
})();
