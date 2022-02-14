(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings')
        .directive('productSettingsMenu', productSettingsMenu);

    /** @ngInject */
    function productSettingsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productService/productSettings/productSettingsMenu/productSettingsMenu.html'
        };
    }
})();
