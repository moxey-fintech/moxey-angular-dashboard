(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService', [
        'BlurAdmin.pages.services.exchangeService.exchangeServiceSettings',
        'BlurAdmin.pages.services.exchangeService.listExchangeServiceQuotes'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('exchangeService', {
                // url: '/services/exchanges',
                url: '/extensions/exchanges',
                abstract: true,
                template:'<div ui-view="exchangeServiceViews"></div>'
            });
            // $urlRouterProvider.when("/services/exchanges", "/services/exchanges/settings");
            $urlRouterProvider.when("/extensions/exchanges", "/extensions/exchanges/settings");
    }

})();
