(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services')
        .directive('servicesFilter', servicesFilter);

    /** @ngInject */
    function servicesFilter() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/servicesFilter/servicesFilter.html'
        };
    }
})();