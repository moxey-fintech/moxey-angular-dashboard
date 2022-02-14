(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .directive('productColumnFilters', productColumnFilters);

    /** @ngInject */
    function productColumnFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/product/productColumnFilters/productColumnFilters.html'
        };
    }
})();