(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.exchangeServiceSettings')
        .directive('exchangeSecret', exchangeSecret);

    /** @ngInject */
    function exchangeSecret() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/exchangeService/exchangeServiceSettings/exchangeSecret/exchangeSecret.html'
        };
    }
})();
