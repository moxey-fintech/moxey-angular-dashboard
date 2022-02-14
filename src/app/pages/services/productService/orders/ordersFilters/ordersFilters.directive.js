(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.ordersList')
        .directive('ordersFilters', ordersFilters);

    /** @ngInject */
    function ordersFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/orders/ordersFilters/ordersFilters.html'
        };
    }
})();