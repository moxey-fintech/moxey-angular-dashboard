(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted')
        .directive('systemConfigurations', systemConfigurations);

    /** @ngInject */
    function systemConfigurations() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/getStarted/systemConfigurations/systemConfigurations.html'
        };
    }
})();