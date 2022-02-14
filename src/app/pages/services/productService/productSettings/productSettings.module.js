(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.productSettings', {
                url: '/settings',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/productSettings/productSettings.html',
                        controller: "ProductSettingsCtrl"
                    }
                },
                title: 'Settings'
            });
    }

})();
