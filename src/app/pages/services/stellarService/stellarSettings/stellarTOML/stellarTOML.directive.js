(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarSettings')
        .directive('stellarToml', stellarToml);

    /** @ngInject */
    function stellarToml() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarSettings/stellarTOML/stellarTOML.html'
        };
    }
})();
