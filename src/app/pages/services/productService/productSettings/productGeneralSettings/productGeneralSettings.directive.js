(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings')
        .directive('productGeneralSettings', productGeneralSettings);

    /** @ngInject */
    function productGeneralSettings() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/productSettings/productGeneralSettings/productGeneralSettings.html'
        };
    }
})();
