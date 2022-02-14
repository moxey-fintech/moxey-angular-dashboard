(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.sellerList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService.sellersList', {
                url: '/sellers',
                views: {
                    'productServiceViews' : {
                        templateUrl:'app/pages/services/productService/sellers/sellers.html',
                        controller: "SellersCtrl"
                    }
                },
                title: 'Sellers'
            });
    }

})();