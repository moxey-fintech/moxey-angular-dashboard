(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.quotes')
        .directive('quotesListFilters', quotesListFilters);

    /** @ngInject */
    function quotesListFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/icoService/icos/viewIco/quotes/quotesFilters/quotesFilters.html'
        };
    }
})();