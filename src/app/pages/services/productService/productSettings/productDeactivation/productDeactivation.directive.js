(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings')
        .directive('productDeactivation', productDeactivation);

    /** @ngInject */
    function productDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/productSettings/productDeactivation/productDeactivation.html'
        };
    }
})();
