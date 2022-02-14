(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.quotes', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('icoService.viewIco.quotes', {
                url: '/quotes',
                views: {
                    'icoViews': {
                        templateUrl: 'app/pages/services/icoService/icos/viewIco/quotes/quotes.html',
                        controller: "QuotesCtrl"
                    }
                }
            });
    }

})();
