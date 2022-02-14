(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.icoServiceSettings')
        .directive('icoWebhooks', icoWebhooks);

    /** @ngInject */
    function icoWebhooks() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/icoService/icoServiceSettings/icoWebhooks/icoWebhooks.html'
        };
    }
})();
