(function () {
    'use strict';

    angular.module('BlurAdmin.pages.demoSetup')
        .directive('demoCompanySetup', demoCompanySetup);

    /** @ngInject */
    function demoCompanySetup() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/demoSetup/demoCompanySetup/demoCompanySetup.html'
        };
    }
})();
