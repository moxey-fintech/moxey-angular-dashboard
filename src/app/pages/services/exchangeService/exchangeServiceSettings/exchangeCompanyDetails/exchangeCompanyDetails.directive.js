(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.exchangeServiceSettings')
        .directive('exchangeCompanyDetails', exchangeCompanyDetails);

    /** @ngInject */
    function exchangeCompanyDetails() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/exchangeService/exchangeServiceSettings/exchangeCompanyDetails/exchangeCompanyDetails.html'
        };
    }
})();
