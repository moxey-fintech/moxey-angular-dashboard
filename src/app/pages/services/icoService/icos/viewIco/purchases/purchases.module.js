(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.purchases', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('icoService.viewIco.purchases', {
                url: '/purchases',
                views: {
                    'icoViews': {
                        templateUrl: 'app/pages/services/icoService/icos/viewIco/purchases/purchases.html',
                        controller: "PurchasesCtrl"
                    }
                }
            });
    }

})();
