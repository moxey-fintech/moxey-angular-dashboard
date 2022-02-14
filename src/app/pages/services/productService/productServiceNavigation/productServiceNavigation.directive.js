(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService')
        .directive('productServiceNavigation', productServiceNavigation);

    /** @ngInject */
    function productServiceNavigation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/productServiceNavigation/productServiceNavigation.html'
        };
    }
})();
