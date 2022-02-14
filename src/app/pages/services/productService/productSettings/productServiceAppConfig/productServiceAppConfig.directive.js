(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings')
        .directive('productServiceAppConfig', productServiceAppConfig);

    /** @ngInject */
    function productServiceAppConfig() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/productSettings/productServiceAppConfig/productServiceAppConfig.html'
        };
    }
})();