(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.categoriesList')
        .directive('categoryFilters', categoryFilters);

    /** @ngInject */
    function categoryFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/categories/productCategoryFilters/productCategoryFilters.directive.js'
        };
    }
})();