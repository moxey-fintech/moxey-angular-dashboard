(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.purchases')
        .directive('purchasesListFilters', purchasesListFilters);

    /** @ngInject */
    function purchasesListFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/icoService/icos/viewIco/purchases/purchasesFilters/purchasesFilters.html'
        };
    }
})();