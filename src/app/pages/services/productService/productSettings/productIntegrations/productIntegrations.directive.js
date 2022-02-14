(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings')
        .directive('productIntegrations', productIntegrations);

    /** @ngInject */
    function productIntegrations() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/productSettings/productIntegrations/productIntegrations.html'
        };
    }
})();
