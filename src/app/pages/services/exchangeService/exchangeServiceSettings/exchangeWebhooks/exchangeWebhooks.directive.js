(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.exchangeServiceSettings')
        .directive('exchangeWebhooks', exchangeWebhooks);

    /** @ngInject */
    function exchangeWebhooks() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/exchangeService/exchangeServiceSettings/exchangeWebhooks/exchangeWebhooks.html'
        };
    }
})();
