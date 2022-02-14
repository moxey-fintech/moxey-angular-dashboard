(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .directive('productFilters', productFilters);

    /** @ngInject */
    function productFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/product/productFilters/productFilters.html'
        };
    }
})();