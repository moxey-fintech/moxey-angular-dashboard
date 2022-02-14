(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted')
        .directive('operationalConfigurations', operationalConfigurations);

    /** @ngInject */
    function operationalConfigurations() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/getStarted/operationalConfigurations/operationalConfigurations.html'
        };
    }
})();