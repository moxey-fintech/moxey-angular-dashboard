(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.listIcos')
        .directive('icoListFilters', icoListFilters);

    /** @ngInject */
    function icoListFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/icoService/icos/listIcos/icoListFilters/icoListFilters.html'
        };
    }
})();