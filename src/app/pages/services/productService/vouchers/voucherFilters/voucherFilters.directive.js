(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.vouchersList')
        .directive('vouchersFilters', vouchersFilters);

    /** @ngInject */
    function vouchersFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/vouchers/voucherFilters/voucherFilters.html'
        };
    }
})();