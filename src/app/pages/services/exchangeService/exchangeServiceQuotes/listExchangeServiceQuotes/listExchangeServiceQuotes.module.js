(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.listExchangeServiceQuotes', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('exchangeService.listExchangeServiceQuotes', {
                url: '/quotes',
                views: {
                    'exchangeServiceViews' : {
                        templateUrl:'app/pages/services/exchangeService/exchangeServiceQuotes/listExchangeServiceQuotes/listExchangeServiceQuotes.html',
                        controller: "ListExchangeServiceQuotesCtrl"
                    }
                },
                title: 'Quotes'
            });
    }

})();
