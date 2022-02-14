(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.rates', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('icoService.viewIco.rates', {
                url: '/phase/:phaseId/rates',
                views: {
                    'icoViews': {
                        templateUrl: 'app/pages/services/icoService/icos/viewIco/rates/rates.html',
                        controller: "RatesCtrl"
                    }
                }
            });
    }

})();
