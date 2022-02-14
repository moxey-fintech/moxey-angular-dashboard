(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.icoServiceSettings')
        .directive('icoSecret', icoSecret);

    /** @ngInject */
    function icoSecret() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/icoService/icoServiceSettings/icoSecret/icoSecret.html'
        };
    }
})();
